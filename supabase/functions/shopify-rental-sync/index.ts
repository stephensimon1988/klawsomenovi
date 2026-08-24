// Pushes Command Center machine-rental prices/labels onto their Shopify variants
// so the wizard's quoted total always equals what Shopify charges.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const SHOP = 'u2riqy-et.myshopify.com';
const API_VERSION = '2025-07';

function listTokens(): { token: string; name: string }[] {
  const names = [
    ...Object.keys(Deno.env.toObject()).filter((k) => k.startsWith('SHOPIFY_ONLINE_ACCESS_TOKEN')),
    'SHOPIFY_RENTAL_SYNC_ADMIN_TOKEN',
    'SHOPIFY_ADMIN_API_TOKEN',
    'SHOPIFY_ACCESS_TOKEN',
  ];
  const out: { token: string; name: string }[] = [];
  const seen = new Set<string>();
  for (const name of names) {
    const v = Deno.env.get(name);
    if (v && v.length > 10 && !seen.has(v)) { seen.add(v); out.push({ token: v, name }); }
  }
  return out;
}

async function pickWorkingToken(): Promise<string> {
  const attempts: { name: string; status: number }[] = [];
  for (const t of listTokens()) {
    const r = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/shop.json`, {
      headers: { 'X-Shopify-Access-Token': t.token },
    });
    attempts.push({ name: t.name, status: r.status });
    await r.body?.cancel();
    if (r.ok) return t.token;
  }
  throw new Error(
    'Shopify rejected every stored admin token (they expire). Ask Lovable to store a fresh Shopify Admin API token, then run the sync again. ' +
      `Attempts: ${JSON.stringify(attempts)}`,
  );
}

async function admin(token: string, query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Shopify ${res.status}: ${text.slice(0, 300)}`);
  const json = JSON.parse(text);
  if (json.errors) throw new Error(`Shopify GraphQL: ${JSON.stringify(json.errors).slice(0, 300)}`);
  return json.data;
}

const VARIANT_QUERY = `query($ids:[ID!]!){
  nodes(ids:$ids){
    ... on ProductVariant {
      id title price
      product { id title options { id name } }
    }
  }
}`;

const VARIANT_UPDATE = `mutation($productId:ID!,$variants:[ProductVariantsBulkInput!]!){
  productVariantsBulkUpdate(productId:$productId, variants:$variants){
    productVariants { id price }
    userErrors { field message }
  }
}`;

const OPTION_RENAME = `mutation($productId:ID!,$option:OptionUpdatePositionInput!){
  productOptionUpdate(productId:$productId, option:$option){
    userErrors { field message }
  }
}`;

interface Row {
  machine: string;
  label: string;
  price_cents: number;
  variant_id: string;
  is_active: boolean;
  option_key?: string;
  unit?: string;
  day_type?: string;
}

// Option groups on the rental products should read nicely in Shopify admin.
const OPTION_NAMES: Record<string, string> = {
  'Klaw Mini Machine Rental': 'Rental Option',
  'Klaw Classic Machine Rental': 'Rental Option',
  'Klawsome Mobile': 'Package',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    // Staff-only action, invoked from the Command Center. Password gate is
    // currently disabled site-wide (see cms-admin) so we accept the call.
    const body = await req.json().catch(() => ({}));
    const dryRun = Boolean((body as { dry_run?: boolean }).dry_run);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const [pricing, options] = await Promise.all([
      supabase.from('booking_rental_pricing').select('*'),
      supabase.from('booking_rental_options').select('*'),
    ]);
    if (pricing.error) return json({ error: pricing.error.message }, 500);
    if (options.error) return json({ error: options.error.message }, 500);

    // Only rows that actually charge money through a Shopify variant.
    const priceRows: Row[] = (pricing.data ?? []) as Row[];
    const optionRows: Row[] = ((options.data ?? []) as Row[]).filter((r) =>
      ['delivery_base', 'per_mile', 'plush_pack'].includes(String(r.option_key))
    );
    const rows = [...priceRows, ...optionRows].filter((r) => r.is_active !== false);

    const results: Array<{ row: string; variant: string; status: string; detail?: string }> = [];
    const withVariant = rows.filter((r) => r.variant_id);
    for (const r of rows) {
      if (!r.variant_id) {
        results.push({
          row: `${r.machine} · ${r.label}`,
          variant: '—',
          status: 'skipped',
          detail: 'No Shopify item linked (nothing is charged for this row).',
        });
      }
    }

    if (withVariant.length === 0) return json({ results, synced: 0 });

    const token = await pickWorkingToken();
    const nodes = (await admin(token, VARIANT_QUERY, {
      ids: withVariant.map((r) => r.variant_id),
    })).nodes as Array<null | {
      id: string; title: string; price: string;
      product: { id: string; title: string; options: Array<{ id: string; name: string }> };
    }>;

    // Group updates per product (bulk mutation is product-scoped).
    const byProduct = new Map<string, { variants: Array<Record<string, unknown>>; rows: Row[]; title: string; options: Array<{ id: string; name: string }> }>();
    let synced = 0;

    withVariant.forEach((r, i) => {
      const node = nodes[i];
      const label = `${r.machine} · ${r.label}`;
      if (!node) {
        results.push({ row: label, variant: r.variant_id, status: 'missing', detail: 'This Shopify item no longer exists — relink it.' });
        return;
      }
      const wantPrice = (Number(r.price_cents) / 100).toFixed(2);
      const samePrice = Number(node.price) === Number(wantPrice);
      const sameTitle = node.title === r.label;
      if (samePrice && sameTitle) {
        results.push({ row: label, variant: node.id, status: 'up-to-date', detail: `$${wantPrice}` });
        return;
      }
      if (dryRun) {
        results.push({ row: label, variant: node.id, status: 'would-update', detail: `$${node.price} → $${wantPrice}` });
        return;
      }
      const entry = byProduct.get(node.product.id) ?? {
        variants: [], rows: [], title: node.product.title, options: node.product.options,
      };
      entry.variants.push({ id: node.id, price: wantPrice });
      entry.rows.push(r);
      byProduct.set(node.product.id, entry);
      results.push({ row: label, variant: node.id, status: 'updated', detail: `$${node.price} → $${wantPrice}` });
      synced++;
    });

    for (const [productId, entry] of byProduct) {
      const res = await admin(token, VARIANT_UPDATE, { productId, variants: entry.variants });
      const errs = res?.productVariantsBulkUpdate?.userErrors ?? [];
      if (errs.length) {
        for (const r of entry.rows) {
          const idx = results.findIndex((x) => x.row === `${r.machine} · ${r.label}` && x.status === 'updated');
          if (idx >= 0) {
            results[idx] = { ...results[idx], status: 'failed', detail: errs.map((e: { message: string }) => e.message).join(', ') };
            synced--;
          }
        }
        continue;
      }

      // Rename the generic "Option" group once per product.
      const wanted = OPTION_NAMES[entry.title];
      const opt = entry.options?.[0];
      if (wanted && opt && opt.name !== wanted) {
        try {
          const r2 = await admin(token, OPTION_RENAME, {
            productId,
            option: { id: opt.id, name: wanted },
          });
          const oerrs = r2?.productOptionUpdate?.userErrors ?? [];
          results.push({
            row: `${entry.title} · option group`,
            variant: opt.id,
            status: oerrs.length ? 'failed' : 'updated',
            detail: oerrs.length ? oerrs.map((e: { message: string }) => e.message).join(', ') : `"${opt.name}" → "${wanted}"`,
          });
        } catch (e) {
          results.push({ row: `${entry.title} · option group`, variant: opt.id, status: 'failed', detail: String(e) });
        }
      }
    }

    return json({ synced, results });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const SHOP = 'u2riqy-et.myshopify.com';
const API_VERSION = '2025-07';

function pickToken(): { token: string; name: string } | null {
  const candidates = [
    'SHOPIFY_ADMIN_API_TOKEN',
    'SHOPIFY_ACCESS_TOKEN',
    // Lovable Shopify integration online access token (user-scoped)
    ...Object.keys(Deno.env.toObject()).filter((k) => k.startsWith('SHOPIFY_ONLINE_ACCESS_TOKEN')),
  ];
  for (const name of candidates) {
    const v = Deno.env.get(name);
    if (v && v.length > 10) return { token: v, name };
  }
  return null;
}

async function shopifyAdmin(token: string, query: string, variables: Record<string, unknown> = {}) {
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

const ORDERS_QUERY = `
  query RecentOrders($first: Int!) {
    orders(first: $first, sortKey: CREATED_AT, reverse: true, query: "financial_status:paid OR financial_status:partially_paid") {
      edges {
        node {
          id
          name
          createdAt
          displayFinancialStatus
          totalPriceSet { shopMoney { amount currencyCode } }
          customer { firstName lastName email phone }
          email
          phone
          note
          customAttributes { key value }
          lineItems(first: 20) { edges { node { title quantity customAttributes { key value } } } }
        }
      }
    }
  }
`;

function attr(list: { key: string; value: string }[] | undefined, key: string): string | null {
  return list?.find((a) => a.key.toLowerCase() === key.toLowerCase())?.value ?? null;
}

function inferEventType(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('semi')) return 'semi_private';
  if (t.includes('private')) return 'private';
  if (t.includes('mobile')) return 'mobile';
  if (t.includes('rental')) return 'rental';
  return 'private';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const picked = pickToken();
    if (!picked) {
      return new Response(JSON.stringify({ error: 'No Shopify Admin token configured' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await shopifyAdmin(picked.token, ORDERS_QUERY, { first: 50 });
    const orders = (data?.orders?.edges ?? []).map((e: any) => e.node);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    let upserted = 0;
    let skipped = 0;

    for (const o of orders) {
      const orderNumber = String(o.name || '').replace(/^#/, '');
      const lineItems = (o.lineItems?.edges ?? []).map((e: any) => e.node);
      // Only booking-like line items
      const bookingItem = lineItems.find((li: any) => {
        const t = (li.title || '').toLowerCase();
        return t.includes('party') || t.includes('rental') || t.includes('mobile') || t.includes('booking') || t.includes('event');
      });
      if (!bookingItem) { skipped++; continue; }

      const noteAttrs = o.customAttributes || [];
      const itemAttrs = bookingItem.customAttributes || [];
      const bookingRef = attr(noteAttrs, 'booking_ref') || attr(itemAttrs, 'booking_ref');
      const eventDate = attr(noteAttrs, 'event_date') || attr(itemAttrs, 'event_date') || attr(itemAttrs, 'date');
      const eventTime = attr(noteAttrs, 'event_time') || attr(itemAttrs, 'event_time') || attr(itemAttrs, 'time');
      const partySizeStr = attr(noteAttrs, 'party_size') || attr(itemAttrs, 'party_size') || attr(itemAttrs, 'guests');
      const celebrantName = attr(noteAttrs, 'celebrant_name') || attr(itemAttrs, 'celebrant_name');
      const celebrantAge = attr(noteAttrs, 'celebrant_age') || attr(itemAttrs, 'celebrant_age');
      const favorites = attr(noteAttrs, 'favorites') || attr(itemAttrs, 'favorites');

      let startAt: string | null = null;
      if (eventDate) {
        const iso = eventTime ? `${eventDate}T${eventTime}` : `${eventDate}T16:00:00`;
        const d = new Date(iso);
        if (!isNaN(d.getTime())) startAt = d.toISOString();
      }
      if (!startAt) startAt = o.createdAt;

      const contactName = [o.customer?.firstName, o.customer?.lastName].filter(Boolean).join(' ') || 'Shopify Customer';
      const contactEmail = o.email || o.customer?.email || '';
      const contactPhone = o.phone || o.customer?.phone || '';
      const partySize = partySizeStr ? parseInt(partySizeStr, 10) : (bookingItem.quantity || 1);
      const totalCents = Math.round(parseFloat(o.totalPriceSet?.shopMoney?.amount || '0') * 100);
      const eventType = inferEventType(bookingItem.title || '');

      // Prefer matching by booking_ref, else by shopify_order_id
      let existingId: string | null = null;
      if (bookingRef) {
        const { data: byRef } = await supabase.from('event_bookings').select('id').eq('booking_ref', bookingRef).maybeSingle();
        existingId = byRef?.id ?? null;
      }
      if (!existingId) {
        const { data: byOrder } = await supabase.from('event_bookings').select('id').eq('shopify_order_id', orderNumber).maybeSingle();
        existingId = byOrder?.id ?? null;
      }

      const patch: Record<string, unknown> = {
        event_type: eventType,
        pathway: eventType,
        start_at: startAt,
        duration_minutes: 60,
        status: 'confirmed',
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        party_size: isNaN(partySize) ? 1 : partySize,
        celebrant_name: celebrantName,
        celebrant_age: celebrantAge ? parseInt(celebrantAge, 10) : null,
        favorites,
        shopify_order_id: orderNumber,
        total_cents: totalCents,
      };

      if (existingId) {
        await supabase.from('event_bookings').update(patch).eq('id', existingId);
      } else {
        const newRef = bookingRef || `SHOPIFY-${orderNumber}`;
        await supabase.from('event_bookings').insert({ ...patch, booking_ref: newRef });
      }
      upserted++;
    }

    return new Response(JSON.stringify({ upserted, skipped, total: orders.length, token_used: picked.name }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const SHOP_DOMAIN = 'u2riqy-et.myshopify.com';
const API_VERSION = '2025-07';

interface NoteAttr { name: string; value: string }

function attr(attrs: NoteAttr[], key: string): string | null {
  const a = attrs.find((x) => x.name === key);
  return a ? a.value : null;
}

function intOrNull(v: string | null): number | null {
  if (!v) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

function numOrNull(v: string | null): number | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function partySizeFromAttrs(attrs: NoteAttr[]): number | null {
  const adults = intOrNull(attr(attrs, 'adults'));
  const children = intOrNull(attr(attrs, 'children'));
  if (adults !== null || children !== null) return (adults || 0) + (children || 0);
  const raw = attr(attrs, 'party_size');
  if (!raw) return null;
  const m = raw.match(/\d+/g);
  if (!m) return null;
  return m.map(Number).reduce((a, b) => a + b, 0);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const shopifyToken = Deno.env.get('SHOPIFY_ACCESS_TOKEN');
    if (!shopifyToken) {
      return new Response(JSON.stringify({ error: 'SHOPIFY_ACCESS_TOKEN not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Pull last 90 days of orders (any status) so we don't miss pending ones.
    const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const url = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/orders.json?status=any&limit=250&created_at_min=${encodeURIComponent(since)}`;

    const resp = await fetch(url, {
      headers: { 'X-Shopify-Access-Token': shopifyToken, 'Content-Type': 'application/json' },
    });
    if (!resp.ok) {
      const body = await resp.text();
      console.error(`Shopify orders fetch failed [${resp.status}]: ${body}`);
      return new Response(JSON.stringify({ error: 'Shopify request failed', status: resp.status, details: body }), {
        status: resp.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const data = await resp.json();
    const orders: any[] = data.orders || [];

    let upserted = 0;
    let skipped = 0;
    for (const o of orders) {
      const attrs: NoteAttr[] = o.note_attributes || [];
      const bookingRef = attr(attrs, 'booking_ref');
      const eventType = attr(attrs, 'event_type');
      const startAt = attr(attrs, 'start_at');
      if (!bookingRef || !eventType || !startAt) { skipped++; continue; }

      const paid = o.financial_status === 'paid' || o.financial_status === 'partially_paid';
      const cancelled = !!o.cancelled_at;
      const status = cancelled ? 'cancelled' : paid ? 'confirmed' : 'pending';

      const row = {
        booking_ref: bookingRef,
        event_type: eventType,
        pathway: eventType,
        start_at: startAt,
        status,
        contact_name: attr(attrs, 'contact_name') || o.customer?.first_name && o.customer?.last_name
          ? `${o.customer.first_name} ${o.customer.last_name}`.trim()
          : (o.customer?.email || 'Unknown'),
        contact_email: attr(attrs, 'contact_email') || o.email || o.customer?.email || '',
        contact_phone: attr(attrs, 'contact_phone') || o.phone || o.customer?.phone || null,
        party_size: partySizeFromAttrs(attrs),
        celebrant_name: attr(attrs, 'celebrant_name'),
        celebrant_age: intOrNull(attr(attrs, 'celebrant_age')),
        favorites: attr(attrs, 'favorites'),
        special_requests: attr(attrs, 'notes'),
        zip: attr(attrs, 'zip'),
        miles: numOrNull(attr(attrs, 'miles')),
        shopify_order_id: String(o.id),
        total_cents: o.total_price ? Math.round(parseFloat(o.total_price) * 100) : null,
      };

      const { error } = await supabase
        .from('event_bookings')
        .upsert(row, { onConflict: 'booking_ref' });
      if (error) {
        console.error('Upsert failed', bookingRef, error);
        skipped++;
      } else {
        upserted++;
      }
    }

    return new Response(JSON.stringify({ ok: true, fetched: orders.length, upserted, skipped }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('shopify-booking-sync error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
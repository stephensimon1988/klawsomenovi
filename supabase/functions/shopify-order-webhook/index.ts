// Shopify order webhook -> updates event_bookings when payment completes.
// No Admin API token needed. Configure in Shopify:
//   Settings -> Notifications -> Webhooks -> Create webhook
//   Event: "Order payment"  Format: JSON
//   URL:  https://nrxfzjysodxqmwsstcim.supabase.co/functions/v1/shopify-order-webhook
// Shopify displays a signing secret once; paste it as SHOPIFY_WEBHOOK_SECRET.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

function b64(bytes: Uint8Array) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

async function verifyHmac(rawBody: Uint8Array, headerHmac: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, rawBody));
  const expected = b64(sig);
  if (expected.length !== headerHmac.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ headerHmac.charCodeAt(i);
  return diff === 0;
}

function pickBookingRef(order: any): string | null {
  const attrs: any[] = order?.note_attributes ?? [];
  for (const a of attrs) {
    const name = String(a?.name ?? '').toLowerCase();
    if (name === 'booking_ref' || name === 'booking ref' || name === 'bookingref') {
      if (a?.value) return String(a.value);
    }
  }
  for (const li of order?.line_items ?? []) {
    for (const p of li?.properties ?? []) {
      const name = String(p?.name ?? '').toLowerCase();
      if (name === 'booking_ref' || name === 'booking ref') {
        if (p?.value) return String(p.value);
      }
    }
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') {
    return new Response('method not allowed', { status: 405, headers: corsHeaders });
  }

  const secret = Deno.env.get('SHOPIFY_WEBHOOK_SECRET');
  if (!secret) {
    return new Response(JSON.stringify({ error: 'SHOPIFY_WEBHOOK_SECRET not set' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const raw = new Uint8Array(await req.arrayBuffer());
  const hmac = req.headers.get('x-shopify-hmac-sha256') ?? '';
  const ok = hmac && (await verifyHmac(raw, hmac, secret));
  if (!ok) return new Response('invalid hmac', { status: 401, headers: corsHeaders });

  let order: any;
  try {
    order = JSON.parse(new TextDecoder().decode(raw));
  } catch {
    return new Response('bad json', { status: 400, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const bookingRef = pickBookingRef(order);
  const topic = req.headers.get('x-shopify-topic') ?? '';
  const financial = String(order?.financial_status ?? '').toLowerCase();
  const paid = financial === 'paid' || financial === 'partially_paid' || topic === 'orders/paid';

  const patch: Record<string, unknown> = {
    shopify_order_id: String(order?.id ?? ''),
    shopify_order_number: order?.order_number ?? order?.name ?? null,
    total_cents: order?.total_price ? Math.round(Number(order.total_price) * 100) : null,
    contact_email: order?.email ?? order?.contact_email ?? null,
    contact_name:
      [order?.customer?.first_name, order?.customer?.last_name].filter(Boolean).join(' ') || null,
    contact_phone: order?.phone ?? order?.customer?.phone ?? null,
    status: paid ? 'confirmed' : 'pending_payment',
    paid_at: paid ? new Date().toISOString() : null,
  };
  for (const k of Object.keys(patch)) if (patch[k] == null || patch[k] === '') delete patch[k];

  if (bookingRef) {
    const { data: existing } = await supabase
      .from('event_bookings')
      .select('id')
      .eq('booking_ref', bookingRef)
      .maybeSingle();
    if (existing) {
      const { error } = await supabase
        .from('event_bookings')
        .update(patch)
        .eq('booking_ref', bookingRef);
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ ok: true, updated: bookingRef }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  // Fallback: unknown booking_ref -> log a stub so ops can reconcile.
  const stub = {
    booking_ref: bookingRef ?? `shopify-${order?.id ?? Date.now()}`,
    event_type: 'unknown',
    pathway: 'unknown',
    start_at: new Date().toISOString(),
    ...patch,
  };
  const { error } = await supabase
    .from('event_bookings')
    .upsert(stub, { onConflict: 'booking_ref' });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({ ok: true, stub: stub.booking_ref }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
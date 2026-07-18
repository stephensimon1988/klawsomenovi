import { assertEquals } from 'https://deno.land/std@0.220.0/assert/mod.ts';

const SHOPIFY_WEBHOOK_SECRET = Deno.env.get('SHOPIFY_WEBHOOK_SECRET')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

async function b64Hmac(rawBody: Uint8Array, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, rawBody as BufferSource));
  let s = '';
  for (const b of sig) s += String.fromCharCode(b);
  return btoa(s);
}

Deno.test('webhook updates pending booking to confirmed', async () => {
  const bookingRef = `TEST-${Date.now()}`;

  // Insert a pending booking directly via service role
  const supabase = (await import('https://esm.sh/@supabase/supabase-js@2')).createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
  );
  const { error: insertError } = await supabase.from('event_bookings').upsert({
    booking_ref: bookingRef,
    event_type: 'private',
    pathway: 'private',
    start_at: new Date().toISOString(),
    status: 'pending_payment',
    contact_name: 'Test Guest',
    contact_email: 'test@example.com',
  });
  if (insertError) throw insertError;

  // Build a fake Shopify order payload with the booking ref
  const order = {
    id: 1234567890,
    financial_status: 'paid',
    email: 'test@example.com',
    total_price: '299.00',
    note_attributes: [{ name: 'booking_ref', value: bookingRef }],
    line_items: [],
  };
  const rawBody = new TextEncoder().encode(JSON.stringify(order));
  const hmac = await b64Hmac(rawBody, SHOPIFY_WEBHOOK_SECRET);

  const res = await fetch(`${SUPABASE_URL}/functions/v1/shopify-order-webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Hmac-SHA256': hmac,
      'X-Shopify-Topic': 'orders/paid',
    },
    body: rawBody,
  });
  assertEquals(res.status, 200);
  const json = await res.json();
  assertEquals(json.ok, true);
  assertEquals(json.updated, bookingRef);

  // Verify DB status
  const { data, error } = await supabase
    .from('event_bookings')
    .select('status')
    .eq('booking_ref', bookingRef)
    .single();
  if (error) throw error;
  assertEquals(data.status, 'confirmed');

  // Cleanup
  await supabase.from('event_bookings').delete().eq('booking_ref', bookingRef);
});

Deno.test('webhook rejects unsigned payload', async () => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/shopify-order-webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 1 }),
  });
  assertEquals(res.status, 401);
});

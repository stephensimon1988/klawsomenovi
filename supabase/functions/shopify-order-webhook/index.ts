// Shopify order webhook -> updates event_bookings when payment completes.
// No Admin API token needed. Configure in Shopify:
//   Settings -> Notifications -> Webhooks -> Create webhook
//   Event: "Order payment"  Format: JSON
//   URL:  https://nrxfzjysodxqmwsstcim.supabase.co/functions/v1/shopify-order-webhook
// Shopify displays a signing secret once; paste it as SHOPIFY_WEBHOOK_SECRET.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { buildGoogleCalendarUrl, icsBookingRow } from '../_shared/ics.ts';

const ADMIN_RECIPIENTS = ['team@klawsomenovi.com', 'events@klawsomenovi.com'];

function prettyDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Detroit',
      timeZoneName: 'short',
    });
  } catch {
    return iso;
  }
}

function eventTypeLabel(t: string): string {
  const v = (t || '').toLowerCase();
  if (v === 'private') return 'Private Party';
  if (v === 'semi-private' || v === 'semi_private') return 'Semi-Private Party';
  if (v === 'rental') return 'Full Venue Rental';
  if (v === 'mobile') return 'Klawsome Mobile';
  return 'Klawsome Booking';
}

function locationLine(t: string): string {
  const v = (t || '').toLowerCase();
  if (v === 'mobile') return "Klawsome Mobile — we'll come to you";
  return '42768 Grand River Ave Suite C-140, Novi, MI 48375';
}

async function sendBookingEmails(
  supabase: ReturnType<typeof createClient>,
  bookingRef: string,
) {
  const { data: row, error } = await supabase
    .from('event_bookings')
    .select('*')
    .eq('booking_ref', bookingRef)
    .maybeSingle();
  if (error || !row) {
    console.error('sendBookingEmails: booking lookup failed', { bookingRef, error });
    return;
  }

  const ev = icsBookingRow(row);
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const icsUrl = `${supabaseUrl}/functions/v1/booking-ics?ref=${encodeURIComponent(bookingRef)}`;
  const googleCalendarUrl = buildGoogleCalendarUrl(ev);
  const startPretty = prettyDate(row.start_at);
  const typeLabel = eventTypeLabel(row.event_type);
  const loc = locationLine(row.event_type);
  const totalDollars = row.total_cents
    ? `$${(Number(row.total_cents) / 100).toFixed(2)}`
    : undefined;

  const recipients: Array<{ email: string; template: string; extra: Record<string, unknown> }> = [];
  if (row.contact_email) {
    recipients.push({
      email: row.contact_email,
      template: 'booking-confirmation-customer',
      extra: {
        contactName: row.contact_name,
        eventTypeLabel: typeLabel,
        startPretty,
        partySize: row.party_size,
        celebrantName: row.celebrant_name
          ? `${row.celebrant_name}${row.celebrant_age ? ` (age ${row.celebrant_age})` : ''}`
          : undefined,
        locationLine: loc,
        bookingRef: row.booking_ref,
        googleCalendarUrl,
        icsUrl,
      },
    });
  }
  for (const adminEmail of ADMIN_RECIPIENTS) {
    recipients.push({
      email: adminEmail,
      template: 'booking-confirmation-admin',
      extra: {
        contactName: row.contact_name,
        contactEmail: row.contact_email,
        contactPhone: row.contact_phone,
        eventTypeLabel: typeLabel,
        startPretty,
        partySize: row.party_size,
        celebrantName: row.celebrant_name,
        celebrantAge: row.celebrant_age,
        locationLine: loc,
        zip: row.zip,
        bookingRef: row.booking_ref,
        shopifyOrderId: row.shopify_order_id ? String(row.shopify_order_id) : undefined,
        totalDollars,
        specialRequests: row.special_requests || row.favorites || undefined,
        googleCalendarUrl,
        icsUrl,
        adminUrl: 'https://klawsomearcade.com/klawsome-admin',
      },
    });
  }

  await Promise.all(
    recipients.map((r) =>
      supabase.functions
        .invoke('send-transactional-email', {
          body: {
            templateName: r.template,
            recipientEmail: r.email,
            idempotencyKey: `booking-confirm-${bookingRef}-${r.email}`,
            templateData: r.extra,
          },
        })
        .catch((e) => console.error('booking email invoke failed', { to: r.email, e })),
    ),
  );
}

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
    total_cents: order?.total_price ? Math.round(Number(order.total_price) * 100) : null,
    contact_email: order?.email ?? order?.contact_email ?? null,
    contact_name:
      [order?.customer?.first_name, order?.customer?.last_name].filter(Boolean).join(' ') || null,
    contact_phone: order?.phone ?? order?.customer?.phone ?? null,
    status: paid ? 'confirmed' : 'pending_payment',
  };
  for (const k of Object.keys(patch)) if (patch[k] == null || patch[k] === '') delete patch[k];

  if (bookingRef) {
    const { data: existing } = await supabase
      .from('event_bookings')
      .select('id')
      .eq('booking_ref', bookingRef)
      .maybeSingle();
    if (existing) {
      const { data: prev } = await supabase
        .from('event_bookings')
        .select('status')
        .eq('booking_ref', bookingRef)
        .maybeSingle();
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
      // Send confirmation emails only when this webhook transitioned the booking
      // into `confirmed`, so retries/duplicate deliveries don't re-notify.
      if (paid && prev?.status !== 'confirmed') {
        await sendBookingEmails(supabase, bookingRef);
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
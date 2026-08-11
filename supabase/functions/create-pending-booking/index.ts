import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const body = await req.json();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const row = {
      booking_ref: body.booking_ref,
      event_type: body.event_type,
      pathway: body.event_type,
      start_at: body.start_at,
      status: 'pending_payment',
      contact_name: body.contact_name ?? null,
      contact_email: body.contact_email ?? null,
      contact_phone: body.contact_phone ?? null,
      party_size: body.party_size ? Number(body.party_size) : null,
      celebrant_name: body.celebrant_name ?? null,
      celebrant_age: body.celebrant_age ? Number(body.celebrant_age) : null,
      favorites: body.favorites ?? null,
      special_requests: body.notes ?? null,
      zip: body.zip ?? null,
      miles: body.miles ? Number(body.miles) : null,
      addons: body.addons ?? {},
      shopify_cart_id: body.shopify_cart_id ?? null,
      total_cents: body.total_cents ? Number(body.total_cents) : null,
      safety_policy_accepted_at: body.safety_policy_accepted_at ?? null,
    };
    const { data, error } = await supabase
      .from('event_bookings')
      .upsert(row, { onConflict: 'booking_ref' })
      .select()
      .single();
    if (error) throw error;
    return new Response(JSON.stringify({ booking: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
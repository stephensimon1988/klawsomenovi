import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function makeCode(): string {
  let out = '';
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  for (const b of bytes) out += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return out;
}

const str = (v: unknown, max = 500) => String(v ?? '').trim().slice(0, max);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));

    const zip = str(body.zip, 5);
    const contact_name = str(body.contact_name, 120);
    const contact_phone = str(body.contact_phone, 40);
    const contact_email = str(body.contact_email, 160);
    if (!/^\d{5}$/.test(zip)) return json({ error: 'A valid 5-digit ZIP is required.' }, 400);
    if (contact_name.length < 2) return json({ error: 'Please enter your name.' }, 400);
    if (contact_phone.replace(/\D/g, '').length < 10) return json({ error: 'Please enter a valid phone number.' }, 400);
    if (contact_email && !/.+@.+\..+/.test(contact_email)) return json({ error: 'Please enter a valid email.' }, 400);

    const requested_date = /^\d{4}-\d{2}-\d{2}$/.test(str(body.requested_date, 10))
      ? str(body.requested_date, 10)
      : null;
    const party_size = Number(body.party_size);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Basic rate limit: max 3 requests per phone+zip per hour.
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('booking_approval_requests')
      .select('id', { count: 'exact', head: true })
      .eq('zip', zip)
      .eq('contact_phone', contact_phone)
      .gte('created_at', since);
    if ((count ?? 0) >= 3) {
      return json({ error: 'You already have a request in progress — please give us a call.' }, 429);
    }

    const row = {
      request_code: makeCode(),
      event_type: str(body.event_type, 30) || 'mobile',
      contact_name,
      contact_phone,
      contact_email,
      requested_date,
      zip,
      city: str(body.city, 120),
      zip_level: str(body.zip_level, 20) || 'review',
      is_indoors: !!body.is_indoors,
      over_200: !!body.over_200,
      party_size: Number.isFinite(party_size) && party_size > 0 ? Math.round(party_size) : null,
      customer_notes: str(body.customer_notes, 1000),
      status: 'pending',
    };

    const { data, error } = await supabase
      .from('booking_approval_requests')
      .insert(row)
      .select('request_code, status')
      .single();
    if (error) throw error;

    return json({ request_code: data.request_code, status: data.status });
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});

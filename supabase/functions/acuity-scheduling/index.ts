import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ACUITY_USER_ID = Deno.env.get('ACUITY_USER_ID');
    const ACUITY_API_KEY = Deno.env.get('ACUITY_API_KEY');

    if (!ACUITY_USER_ID || !ACUITY_API_KEY) {
      return new Response(JSON.stringify({ error: 'Acuity credentials not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authHeader = 'Basic ' + btoa(`${ACUITY_USER_ID}:${ACUITY_API_KEY}`);
    const baseUrl = 'https://acuityscheduling.com/api/v1';

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'appointment-types';

    if (action === 'appointment-types') {
      const res = await fetch(`${baseUrl}/appointment-types`, {
        headers: { 'Authorization': authHeader },
      });
      if (!res.ok) {
        const errText = await res.text();
        return new Response(JSON.stringify({ error: 'Acuity API error', details: errText }), {
          status: res.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const types = await res.json();
      return new Response(JSON.stringify({ appointmentTypes: types }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'availability') {
      const appointmentTypeID = url.searchParams.get('appointmentTypeID');
      const month = url.searchParams.get('month'); // YYYY-MM format

      if (!appointmentTypeID || !month) {
        return new Response(JSON.stringify({ error: 'appointmentTypeID and month are required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Fetch available dates for the month
      const datesRes = await fetch(
        `${baseUrl}/availability/dates?appointmentTypeID=${appointmentTypeID}&month=${month}`,
        { headers: { 'Authorization': authHeader } }
      );
      if (!datesRes.ok) {
        const errText = await datesRes.text();
        return new Response(JSON.stringify({ error: 'Acuity dates error', details: errText }), {
          status: datesRes.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const dates = await datesRes.json();

      return new Response(JSON.stringify({ dates }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'times') {
      const appointmentTypeID = url.searchParams.get('appointmentTypeID');
      const date = url.searchParams.get('date'); // YYYY-MM-DD

      if (!appointmentTypeID || !date) {
        return new Response(JSON.stringify({ error: 'appointmentTypeID and date are required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const timesRes = await fetch(
        `${baseUrl}/availability/times?appointmentTypeID=${appointmentTypeID}&date=${date}`,
        { headers: { 'Authorization': authHeader } }
      );
      if (!timesRes.ok) {
        const errText = await timesRes.text();
        return new Response(JSON.stringify({ error: 'Acuity times error', details: errText }), {
          status: timesRes.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const times = await timesRes.json();

      return new Response(JSON.stringify({ times }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

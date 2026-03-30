import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ACUITY_BASE = 'https://acuityscheduling.com/api/v1';

async function acuityFetch(path: string, userId: string, apiKey: string) {
  const auth = btoa(`${userId}:${apiKey}`);
  const res = await fetch(`${ACUITY_BASE}${path}`, {
    headers: { 'Authorization': `Basic ${auth}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Acuity API error [${res.status}]: ${text}`);
  }
  return res.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ACUITY_USER_ID = Deno.env.get('ACUITY_USER_ID');
    const ACUITY_API_KEY = Deno.env.get('ACUITY_API_KEY');
    if (!ACUITY_USER_ID || !ACUITY_API_KEY) {
      throw new Error('Acuity credentials not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Fetch appointment types from Acuity
    const acuityTypes = await acuityFetch('/appointment-types', ACUITY_USER_ID, ACUITY_API_KEY);

    const synced: string[] = [];

    for (const at of acuityTypes) {
      if (!at.name) continue;

      // Upsert into appointment_types (match by name)
      const { data: existing } = await supabase
        .from('appointment_types')
        .select('id')
        .eq('name', at.name)
        .maybeSingle();

      const record = {
        name: at.name,
        description: at.description || '',
        duration_minutes: at.duration || 60,
        price: at.price ? parseFloat(at.price) : 0,
        is_active: true,
      };

      let typeId: string;

      if (existing) {
        await supabase
          .from('appointment_types')
          .update(record)
          .eq('id', existing.id);
        typeId = existing.id;
      } else {
        const { data: inserted, error } = await supabase
          .from('appointment_types')
          .insert(record)
          .select('id')
          .single();
        if (error) throw error;
        typeId = inserted.id;
      }

      // 2. Try to fetch availability for this type from Acuity
      // Acuity availability endpoint: /availability/classes or /availability/dates
      // We'll create default Mon-Fri 9-5 slots if none exist yet
      const { data: existingSlots } = await supabase
        .from('availability_slots')
        .select('id')
        .eq('appointment_type_id', typeId)
        .limit(1);

      if (!existingSlots || existingSlots.length === 0) {
        // Create default Mon-Fri 9am-5pm slots
        const defaultSlots = [];
        for (let day = 1; day <= 5; day++) {
          defaultSlots.push({
            appointment_type_id: typeId,
            day_of_week: day,
            start_time: '09:00:00',
            end_time: '17:00:00',
            is_active: true,
          });
        }
        await supabase.from('availability_slots').insert(defaultSlots);
      }

      synced.push(at.name);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      synced,
      message: `Synced ${synced.length} appointment types from Acuity` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Sync error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

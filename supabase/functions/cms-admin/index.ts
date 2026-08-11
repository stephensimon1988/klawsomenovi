import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TABLES_ALLOWED = [
  'site_settings', 'store_hours', 'homepage_content', 'homepage_steps',
  'token_tiers', 'news_articles', 'birthdays_content', 'party_options',
  'faq_items', 'invite_templates', 'job_listings', 'business_sections',
  'business_pricing_tiers', 'business_how_steps',
  'page_heroes', 'our_story_sections', 'reviews', 'gift_cards_content',
  'gift_card_images', 'rewards_benefits', 'rewards_tiers', 'rewards_redemptions',
  'gallery_photos', 'image_library',
  'page_content_sections', 'team_members', 'press_articles', 'rental_packages',
  'event_availability', 'event_blackout_dates', 'event_bookings',
  'service_area_zips',
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    const body = await req.json();
    const { password, action, table, data, id } = body;

    // TEMP: password check disabled — any request is accepted.
    void password;

    // Validate table name
    if (table && !TABLES_ALLOWED.includes(table)) {
      return json({ error: 'Invalid table' }, 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // READ — fetch all rows from a table
    if (action === 'read') {
      if (!table) return json({ error: 'Table required' }, 400);
      const { data: rows, error } = await supabase
        .from(table)
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        // Try without sort_order for tables that don't have it
        const { data: rows2, error: error2 } = await supabase
          .from(table)
          .select('*');
        if (error2) return json({ error: error2.message }, 500);
        return json({ rows: rows2 });
      }
      return json({ rows });
    }

    // READ ALL — fetch all tables at once for the admin dashboard
    if (action === 'read_all') {
      const results: Record<string, unknown[]> = {};
      for (const t of TABLES_ALLOWED) {
        const { data: rows } = await supabase
          .from(t)
          .select('*')
          .order('sort_order', { ascending: true });
        results[t] = rows || [];
      }
      return json({ data: results });
    }

    // UPDATE — update a single row by id
    if (action === 'update') {
      if (!table || !id || !data) return json({ error: 'Table, id, and data required' }, 400);
      const { error } = await supabase.from(table).update(data).eq('id', id);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    // UPSERT — for single-row tables (site_settings, homepage_content, birthdays_content)
    if (action === 'upsert') {
      if (!table || !data) return json({ error: 'Table and data required' }, 400);
      const { error } = await supabase.from(table).upsert(data);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    // INSERT — add a new row
    if (action === 'insert') {
      if (!table || !data) return json({ error: 'Table and data required' }, 400);
      const { data: row, error } = await supabase.from(table).insert(data).select().single();
      if (error) return json({ error: error.message }, 500);
      return json({ row });
    }

    // DELETE — remove a row by id
    if (action === 'delete') {
      if (!table || !id) return json({ error: 'Table and id required' }, 400);
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    return json({ error: 'Invalid action' }, 400);
  } catch (e) {
    return json({ error: 'Invalid request' }, 400);
  }
});

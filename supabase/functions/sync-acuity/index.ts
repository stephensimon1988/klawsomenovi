import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const DAY_MAP: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

// Parse "2:30pm-6:00pm" or "10:00am-11:00am" into { start: "14:30:00", end: "18:00:00" }
function parseTimeRange(text: string): { start: string; end: string } | null {
  const cleaned = text.toLowerCase().trim();
  if (cleaned === "no availability" || cleaned === "closed" || cleaned === "none" || !cleaned) {
    return null;
  }

  const match = cleaned.match(/^(\d{1,2}):(\d{2})\s*(am|pm)\s*[-–]\s*(\d{1,2}):(\d{2})\s*(am|pm)$/);
  if (!match) return null;

  const [, h1, m1, p1, h2, m2, p2] = match;
  const to24 = (h: string, m: string, p: string) => {
    let hour = parseInt(h);
    if (p === "pm" && hour !== 12) hour += 12;
    if (p === "am" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${m}:00`;
  };

  return { start: to24(h1, m1, p1), end: to24(h2, m2, p2) };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get("PRISMIC_ACCESS_TOKEN");
    const repoName = Deno.env.get("PRISMIC_REPOSITORY_NAME");
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!repoName) throw new Error("Prismic repository name not configured");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Fetch scheduling documents from Prismic
    const apiUrl = `https://${repoName}.cdn.prismic.io/api/v2`;
    const apiRes = await fetch(apiUrl, {
      headers: accessToken ? { Authorization: `Token ${accessToken}` } : {},
    });
    if (!apiRes.ok) throw new Error(`Prismic API init failed: ${apiRes.status}`);
    const apiData = await apiRes.json();
    const ref = apiData.refs?.[0]?.ref;
    if (!ref) throw new Error("No master ref found");

    const query = '[[at(document.type,"scheduling")]]';
    let searchUrl = `${apiUrl}/documents/search?ref=${ref}&q=${encodeURIComponent(query)}&pageSize=100`;
    if (accessToken) searchUrl += `&access_token=${accessToken}`;

    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) throw new Error(`Prismic search failed: ${searchRes.status}`);
    const searchData = await searchRes.json();
    const docs = searchData.results || [];

    const synced: string[] = [];

    for (const doc of docs) {
      const d = doc.data;
      const title = d.event_title?.[0]?.text || "";
      const description = d.event_description?.[0]?.text || "";
      const priceText = d.event_price?.[0]?.text || "0";
      const price = parseFloat(priceText) || 0;
      const lengthText = d.event_length?.[0]?.text || "";
      const durationMinutes = parseInt(lengthText) || 60;

      if (!title) continue;

      // 2. Match appointment_type - try exact match first, then fuzzy
      const { data: allTypes } = await supabase
        .from('appointment_types')
        .select('id, name');

      const titleLower = title.toLowerCase().trim();
      const existing = (allTypes || []).find((t: any) => {
        const n = t.name.toLowerCase().trim();
        return n === titleLower || titleLower.includes(n) || n.includes(titleLower);
      });

      // When syncing, keep the original DB name if matched, otherwise use Prismic title
      const record = {
        name: existing ? existing.name : title,
        description,
        duration_minutes: durationMinutes,
        price,
        is_active: true,
      };

      let typeId: string;
      if (existing) {
        await supabase.from('appointment_types').update(record).eq('id', existing.id);
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

      // 3. Delete old availability_slots for this type
      await supabase.from('availability_slots').delete().eq('appointment_type_id', typeId);

      // 4. Parse per-day availability from Prismic and create new slots
      const newSlots: any[] = [];
      for (const [dayName, dayNum] of Object.entries(DAY_MAP)) {
        const fieldName = `${dayName}_event_availability`;
        const availText = d[fieldName]?.[0]?.text || "";
        const parsed = parseTimeRange(availText);
        if (parsed) {
          newSlots.push({
            appointment_type_id: typeId,
            day_of_week: dayNum,
            start_time: parsed.start,
            end_time: parsed.end,
            is_active: true,
          });
        }
      }

      if (newSlots.length > 0) {
        const { error: slotError } = await supabase.from('availability_slots').insert(newSlots);
        if (slotError) console.error(`Slot insert error for ${title}:`, slotError);
      }

      synced.push(`${title} (${newSlots.length} day slots)`);
    }

    return new Response(JSON.stringify({
      success: true,
      synced,
      message: `Synced ${synced.length} scheduling items from Prismic`,
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

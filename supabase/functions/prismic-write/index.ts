import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get("PRISMIC_ACCESS_TOKEN");
    const repoName = Deno.env.get("PRISMIC_REPOSITORY_NAME");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!accessToken || !repoName) {
      return new Response(
        JSON.stringify({ error: "Prismic credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch appointment types from database
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: appointments, error: dbError } = await supabase
      .from("appointment_types")
      .select("*")
      .eq("is_active", true);

    if (dbError) throw new Error(`DB error: ${dbError.message}`);
    if (!appointments || appointments.length === 0) {
      return new Response(
        JSON.stringify({ error: "No active appointment types found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Also fetch availability slots
    const { data: slots } = await supabase
      .from("availability_slots")
      .select("*")
      .eq("is_active", true);

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const results: any[] = [];

    for (const appt of appointments) {
      // Find matching slots for this appointment type
      const apptSlots = (slots || []).filter(
        (s: any) => s.appointment_type_id === appt.id
      );

      // Build schedule text from slots
      let scheduleText = "";
      if (apptSlots.length > 0) {
        scheduleText = apptSlots
          .map((s: any) => `${dayNames[s.day_of_week]}: ${s.start_time} - ${s.end_time}`)
          .join(", ");
      }

      // Create Prismic document via Migration API
      const prismicDoc = {
        title: appt.name,
        type: "scheduling",
        uid: appt.id.replace(/[^a-z0-9-]/g, "-").toLowerCase(),
        lang: "en-us",
        data: {
          event_title: [
            {
              type: "heading1",
              text: appt.name,
              spans: [],
            },
          ],
          event_description: [
            {
              type: "paragraph",
              text: appt.description || "",
              spans: [],
            },
          ],
          event_day: scheduleText || "Contact for availability",
          event_time: `${appt.duration_minutes} minutes`,
        },
      };

      console.log(`Creating Prismic doc for: ${appt.name}`);

      const res = await fetch("https://migration.prismic.io/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          repository: repoName,
        },
        body: JSON.stringify(prismicDoc),
      });

      const responseText = await res.text();
      console.log(`Prismic response for ${appt.name}: ${res.status} - ${responseText}`);

      if (res.ok) {
        results.push({ name: appt.name, status: "created", response: JSON.parse(responseText) });
      } else {
        results.push({ name: appt.name, status: "error", code: res.status, response: responseText });
      }
    }

    return new Response(
      JSON.stringify({ message: "Migration complete", results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", (error instanceof Error ? error.message : String(error)));
    return new Response(
      JSON.stringify({ error: (error instanceof Error ? error.message : String(error)) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

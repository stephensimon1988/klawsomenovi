import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get("PRISMIC_ACCESS_TOKEN");
    const repoName = Deno.env.get("PRISMIC_REPOSITORY_NAME");

    if (!repoName) {
      return new Response(
        JSON.stringify({ error: "Prismic repository name not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const type = url.searchParams.get("type");

    if (!type) {
      return new Response(
        JSON.stringify({ error: "Missing 'type' query parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiUrl = `https://${repoName}.cdn.prismic.io/api/v2`;
    const apiRes = await fetch(apiUrl, {
      headers: accessToken ? { Authorization: `Token ${accessToken}` } : {},
    });
    if (!apiRes.ok) throw new Error(`Prismic API init failed: ${apiRes.status}`);
    const apiData = await apiRes.json();
    const ref = apiData.refs?.[0]?.ref;
    if (!ref) throw new Error("No master ref found");

    const query = `[[at(document.type,"${type}")]]`;
    let searchUrl = `${apiUrl}/documents/search?ref=${ref}&q=${encodeURIComponent(query)}&pageSize=100`;
    if (accessToken) searchUrl += `&access_token=${accessToken}`;

    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) throw new Error(`Prismic search failed: ${searchRes.status}`);
    const searchData = await searchRes.json();

    let results: any[] = [];

    if (type === "product_pages") {
      results = (searchData.results || []).map((doc: any) => ({
        id: doc.id,
        uid: doc.uid,
        product_title: doc.data.product_title?.[0]?.text || "",
        product_description: doc.data.product_description?.[0]?.text || "",
        main_image: doc.data.main_image?.url || null,
        main_image_alt: doc.data.main_image?.alt || "",
      }));
    } else if (type === "scheduling") {
      const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      results = (searchData.results || []).map((doc: any) => {
        const availability: Record<string, string> = {};
        for (const day of dayNames) {
          availability[day] = doc.data[`${day}_event_availability`]?.[0]?.text || "";
        }
        return {
          id: doc.id,
          event_title: doc.data.event_title?.[0]?.text || "",
          event_description: doc.data.event_description?.[0]?.text || "",
          event_price: doc.data.event_price?.[0]?.text || "",
          event_length: doc.data.event_length?.[0]?.text || "",
          event_image: doc.data.event_image?.url || null,
          event_image_alt: doc.data.event_image?.alt || "",
          availability,
        };
      });
    } else {
      results = searchData.results || [];
    }

    return new Response(
      JSON.stringify({ results, total: searchData.total_results_size || 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error instanceof Error ? error.message : String(error)) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

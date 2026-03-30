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
    const type = url.searchParams.get("type"); // "product_pages" or "scheduling"

    if (!type) {
      return new Response(
        JSON.stringify({ error: "Missing 'type' query parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch from Prismic REST API v2
    const apiUrl = `https://${repoName}.cdn.prismic.io/api/v2`;
    
    // First get the API ref
    const apiRes = await fetch(apiUrl, {
      headers: accessToken ? { Authorization: `Token ${accessToken}` } : {},
    });
    if (!apiRes.ok) {
      throw new Error(`Prismic API init failed: ${apiRes.status}`);
    }
    const apiData = await apiRes.json();
    const ref = apiData.refs?.[0]?.ref;
    if (!ref) throw new Error("No master ref found");

    // Query documents by type
    const query = `[[at(document.type,"${type}")]]`;
    const searchUrl = `${apiUrl}/documents/search?ref=${ref}&q=${encodeURIComponent(query)}&pageSize=100`;
    
    const searchRes = await fetch(searchUrl, {
      headers: accessToken ? { Authorization: `Token ${accessToken}` } : {},
    });
    if (!searchRes.ok) {
      throw new Error(`Prismic search failed: ${searchRes.status}`);
    }
    const searchData = await searchRes.json();

    // Transform based on type
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
      results = (searchData.results || []).map((doc: any) => ({
        id: doc.id,
        event_title: doc.data.event_title?.[0]?.text || "",
        event_description: doc.data.event_description?.[0]?.text || "",
        event_day: doc.data.event_day || null,
        event_time: doc.data.event_time || null,
        event_image: doc.data.event_image?.url || null,
        event_image_alt: doc.data.event_image?.alt || "",
      }));
    } else {
      results = searchData.results || [];
    }

    return new Response(
      JSON.stringify({ results, total: searchData.total_results_size || 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

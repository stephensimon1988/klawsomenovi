import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Cache for 6 hours at the CDN/browser layer so the rating refreshes ~4x/day
  const CACHE_HEADER = "public, max-age=21600, s-maxage=21600";

  try {
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!apiKey) {
      console.warn("GOOGLE_MAPS_API_KEY not set, returning fallback");
      return new Response(
        JSON.stringify({ rating: 4.9, reviewCount: null, source: "fallback" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use Places API (New) text search to find Klawsome
    const searchRes = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "places.rating,places.userRatingCount,places.reviews",
        },
        body: JSON.stringify({
          textQuery: "Klawsome! Novi Michigan",
        }),
      }
    );

    if (!searchRes.ok) {
      const errText = await searchRes.text();
      console.error("Google Places API error:", searchRes.status, errText);
      return new Response(
        JSON.stringify({ rating: 4.9, reviewCount: null, source: "fallback" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await searchRes.json();
    console.log("Places API response:", JSON.stringify(data));
    const place = data.places?.[0];

    const reviews = (place?.reviews || []).map((r: any) => ({
      author: r.authorAttribution?.displayName || "Google user",
      authorPhoto: r.authorAttribution?.photoUri || null,
      rating: r.rating || 5,
      text: r.text?.text || r.originalText?.text || "",
      relativeTime: r.relativePublishTimeDescription || "",
    })).filter((r: any) => r.text);

    return new Response(
      JSON.stringify({
        rating: place?.rating || 4.9,
        reviewCount: place?.userRatingCount || null,
        reviews,
        source: place ? "google" : "fallback",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": CACHE_HEADER,
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ rating: 4.9, reviewCount: null, source: "fallback" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

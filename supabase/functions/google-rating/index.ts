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
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!apiKey) {
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
          "X-Goog-FieldMask": "places.rating,places.userRatingCount",
        },
        body: JSON.stringify({
          textQuery: "Klawsome 42768 Grand River Ave Novi MI",
        }),
      }
    );

    if (!searchRes.ok) {
      console.error("Google Places API error:", await searchRes.text());
      return new Response(
        JSON.stringify({ rating: 4.9, reviewCount: null, source: "fallback" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await searchRes.json();
    const place = data.places?.[0];

    return new Response(
      JSON.stringify({
        rating: place?.rating || 4.9,
        reviewCount: place?.userRatingCount || null,
        source: place ? "google" : "fallback",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=86400",
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

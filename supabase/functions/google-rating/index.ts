import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Klawsome's Google Place ID
const PLACE_ID = "ChIJH2diAOqvJIgRrC5PMBUy8Pk";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!apiKey) {
      // Return fallback when no API key configured
      return new Response(
        JSON.stringify({ rating: 4.9, reviewCount: null, source: "fallback" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use Places API (New) to get rating
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=rating,userRatingCount&key=${apiKey}`;
    const res = await fetch(url, {
      headers: { "X-Goog-FieldMask": "rating,userRatingCount" },
    });

    if (!res.ok) {
      console.error("Google Places API error:", await res.text());
      return new Response(
        JSON.stringify({ rating: 4.9, reviewCount: null, source: "fallback" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    return new Response(
      JSON.stringify({
        rating: data.rating || 4.9,
        reviewCount: data.userRatingCount || null,
        source: "google",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=86400", // Cache for 24h
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

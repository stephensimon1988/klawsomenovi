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
    const SQUARE_ACCESS_TOKEN = Deno.env.get('SQUARE_ACCESS_TOKEN');
    if (!SQUARE_ACCESS_TOKEN) {
      return new Response(JSON.stringify({ error: 'Square access token not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const baseUrl = 'https://connect.squareupsandbox.com/v2';

    // Fetch catalog items
    const catalogRes = await fetch(`${baseUrl}/catalog/list?types=ITEM`, {
      headers: {
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json',
      },
    });

    if (!catalogRes.ok) {
      const errText = await catalogRes.text();
      return new Response(JSON.stringify({ error: 'Square API error', details: errText }), {
        status: catalogRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const catalogData = await catalogRes.json();
    const items = catalogData.objects || [];

    // Collect image IDs to fetch
    const imageIds: string[] = [];
    items.forEach((item: any) => {
      const imageId = item.item_data?.image_ids?.[0];
      if (imageId) imageIds.push(imageId);
    });

    // Batch retrieve images if any
    let imageMap: Record<string, string> = {};
    if (imageIds.length > 0) {
      const imageRes = await fetch(`${baseUrl}/catalog/batch-retrieve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
          'Square-Version': '2024-01-18',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ object_ids: imageIds }),
      });
      if (imageRes.ok) {
        const imageData = await imageRes.json();
        (imageData.objects || []).forEach((img: any) => {
          if (img.image_data?.url) {
            imageMap[img.id] = img.image_data.url;
          }
        });
      } else {
        await imageRes.text(); // consume body
      }
    }

    // Transform to frontend-friendly format
    const products = items.map((item: any) => {
      const itemData = item.item_data || {};
      const variation = itemData.variations?.[0];
      const priceMoney = variation?.item_variation_data?.price_money;
      const price = priceMoney
        ? (Number(priceMoney.amount) / 100).toFixed(2)
        : '0.00';
      const currency = priceMoney?.currency || 'USD';
      const imageId = itemData.image_ids?.[0];

      return {
        id: item.id,
        name: itemData.name || 'Unnamed Product',
        description: itemData.description || '',
        price: `$${price}`,
        currency,
        imageUrl: imageId ? imageMap[imageId] || null : null,
        variationId: variation?.id || null,
      };
    });

    return new Response(JSON.stringify({ products }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

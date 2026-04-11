import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * AI Layout Engine — receives section content blocks and returns a layout_json
 * that tells the frontend how to arrange items responsively.
 */
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
    const { password, section_id } = body;

    // Auth
    const adminPassword = Deno.env.get('ADMIN_PASSWORD');
    if (!adminPassword || password !== adminPassword) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Fetch blocks for this section
    const { data: blocks, error: blocksErr } = await supabase
      .from('section_content_blocks')
      .select('*')
      .eq('section_id', section_id)
      .order('row_order', { ascending: true });

    if (blocksErr) return json({ error: blocksErr.message }, 500);
    if (!blocks || blocks.length === 0) {
      return json({ layout: { template: 'empty', grid: [] } });
    }

    // Fetch section config for context
    const { data: section } = await supabase
      .from('page_sections')
      .select('*')
      .eq('id', section_id)
      .single();

    // Build a summary for the AI
    const blockSummary = blocks.map((b: any, i: number) => ({
      index: i,
      type: b.block_type,
      hasContent: b.block_type === 'image' || b.block_type === 'video'
        ? !!(b.content?.url)
        : !!(b.content?.text || b.content?.html || b.content?.url),
      contentPreview: b.block_type === 'heading' ? b.content?.text?.substring(0, 60) :
        b.block_type === 'richtext' ? '(rich text)' :
        b.block_type === 'image' ? '(image)' :
        b.block_type === 'video' ? '(video)' :
        b.block_type === 'iframe' ? '(embed)' :
        b.block_type === 'code' ? '(code block)' :
        b.block_type === 'button' ? b.content?.text :
        b.block_type === 'list' ? `(${b.content?.items?.length || 0} items)` :
        b.block_type === 'divider' ? '(divider)' :
        b.block_type === 'spacer' ? '(spacer)' :
        b.content?.text?.substring(0, 60) || '(empty)',
    }));

    // Call AI via Lovable AI Gateway
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) return json({ error: 'AI key not configured' }, 500);

    const prompt = `You are a web layout engine. Given a list of content blocks for a website section, output a JSON layout configuration.

The blocks in this section:
${JSON.stringify(blockSummary, null, 2)}

Section container max-width: ${section?.wrapper_max_width || '1200px'}

Rules:
1. Choose the best template from: hero-split, centered, gallery, banner, cta-strip, cards, feature-grid, two-column, zigzag, sidebar-content
2. Assign each block to a grid area. Output a "grid" array where each item has: { blockIndex, area, span, alignment }
3. "area" is one of: "left", "right", "full", "header", "footer", "card-N" (for card grids)
4. "span" is the column span (1-12 on a 12-col grid) for desktop. Mobile always stacks to full-width.
5. "alignment" is "left", "center", or "right"
6. Pick a template that looks professional and modern. If there's 1 image + text, use hero-split. Multiple images = gallery. Only text = centered or cards. Mix of media = feature-grid.

Output ONLY valid JSON with this shape:
{
  "template": "template-name",
  "grid": [
    { "blockIndex": 0, "area": "left", "span": 6, "alignment": "left" },
    ...
  ],
  "gap": "2rem",
  "verticalAlign": "center"
}`;

    const aiRes = await fetch('https://ai.lovable.dev/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a web layout engine. Output only valid JSON, no markdown.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error('AI error:', errText);
      // Fallback to rule-based layout
      const layout = generateFallbackLayout(blocks);
      await supabase.from('page_sections').update({ layout_json: layout }).eq('id', section_id);
      return json({ layout, source: 'fallback' });
    }

    const aiData = await aiRes.json();
    const layoutText = aiData.choices?.[0]?.message?.content || '{}';
    
    let layout: any;
    try {
      layout = JSON.parse(layoutText);
    } catch {
      layout = generateFallbackLayout(blocks);
    }

    // Save to DB
    await supabase.from('page_sections').update({ layout_json: layout }).eq('id', section_id);

    return json({ layout, source: 'ai' });
  } catch (e: any) {
    console.error('Error:', e);
    return json({ error: e.message || 'Unknown error' }, 500);
  }
});

function generateFallbackLayout(blocks: any[]) {
  const types = blocks.map(b => b.block_type);
  const imageCount = types.filter(t => t === 'image').length;
  const hasHeading = types.includes('heading');
  const hasText = types.includes('richtext') || types.includes('text');
  const hasVideo = types.includes('video');
  const hasIframe = types.includes('iframe');

  let template = 'centered';
  if (imageCount === 1 && (hasHeading || hasText)) template = 'hero-split';
  else if (imageCount > 1) template = 'gallery';
  else if (hasVideo || hasIframe) template = 'centered';
  else if (types.filter(t => t === 'richtext' || t === 'text').length > 2) template = 'cards';

  const grid = blocks.map((b: any, i: number) => {
    if (template === 'hero-split') {
      const isMedia = b.block_type === 'image' || b.block_type === 'video';
      return { blockIndex: i, area: isMedia ? 'right' : 'left', span: 6, alignment: isMedia ? 'center' : 'left' };
    }
    return { blockIndex: i, area: 'full', span: 12, alignment: 'center' };
  });

  return { template, grid, gap: '2rem', verticalAlign: 'center' };
}

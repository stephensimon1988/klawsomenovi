import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TEMPLATES = ['stacked', 'split-left', 'split-right', 'card-grid', 'hero-cover', 'cta-banner', 'feature-list', 'pricing-grid'];

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const body = await req.json();
    const { password, section_id } = body;

    const adminPassword = Deno.env.get('ADMIN_PASSWORD');
    if (!adminPassword || password !== adminPassword) return json({ error: 'Unauthorized' }, 401);

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const { data: blocks, error: blocksErr } = await supabase
      .from('section_content_blocks')
      .select('*')
      .eq('section_id', section_id)
      .order('row_order', { ascending: true });

    if (blocksErr) return json({ error: blocksErr.message }, 500);

    const { data: section } = await supabase
      .from('page_sections')
      .select('*')
      .eq('id', section_id)
      .single();

    const blockSummary = (blocks || []).map((b: any, i: number) => ({
      index: i,
      type: b.block_type,
      preview: b.block_type === 'heading' ? b.content?.text?.substring(0, 60) :
        b.block_type === 'button' ? b.content?.text :
        b.block_type === 'image' ? '(image)' :
        b.block_type === 'video' ? '(video)' :
        b.block_type === 'list' ? `(${b.content?.items?.length || 0} items)` :
        b.block_type === 'cards' ? `(${b.content?.items?.length || 0} cards)` :
        `(${b.block_type})`,
    }));

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) return json({ error: 'AI key not configured' }, 500);

    const currentTemplate = section?.layout_template || 'stacked';
    const sectionType = section?.section_type || 'section';

    const prompt = `You are a web design advisor. Given content blocks for a website section, pick the BEST layout template.

Current template: "${currentTemplate}"
Section type: "${sectionType}" (hero = full-width banner, section = standard, small = compact)
Has background image: ${!!section?.bg_image_url}

Content blocks:
${JSON.stringify(blockSummary, null, 2)}

Available templates (pick ONE):
- stacked: Centered heading + body + CTA, everything stacked vertically. Best for simple sections with just text and buttons.
- split-left: Text on left, image/media on right (50/50). Best when there's one image + text.
- split-right: Image/media on left, text on right (50/50). Same as split-left but reversed.
- card-grid: Heading above, content in equal card grid below. Best for multiple cards or list items.
- hero-cover: Full-bleed background image with centered text overlay. Best for hero banners WITH a background image.
- cta-banner: Heading + buttons in a compact horizontal strip. Best for call-to-action sections with minimal content.
- feature-list: Icon + title + description rows, left-aligned. Best for feature lists or steps.
- pricing-grid: Equal pricing/tier cards in a row. Best for pricing blocks.

Pick the BEST template that is DIFFERENT from the current one "${currentTemplate}" (unless it's already optimal).
Consider: content types, number of blocks, section type, and whether there's a background image.

Respond with ONLY a JSON object: { "template": "template-name", "reason": "one sentence why" }`;

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: 'You are a web layout advisor. Output only valid JSON, no markdown fences.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!aiRes.ok) {
      const status = aiRes.status;
      if (status === 429) return json({ error: 'Rate limit exceeded, try again shortly.' }, 429);
      if (status === 402) return json({ error: 'AI credits exhausted. Add funds in Settings.' }, 402);
      console.error('AI error:', await aiRes.text());
      // Fallback: pick a different template randomly
      const other = TEMPLATES.filter(t => t !== currentTemplate);
      return json({ template: other[Math.floor(Math.random() * other.length)], reason: 'AI unavailable, random suggestion', source: 'fallback' });
    }

    const aiData = await aiRes.json();
    const raw = aiData.choices?.[0]?.message?.content || '{}';
    let result: any;
    try {
      const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      result = JSON.parse(cleaned);
    } catch {
      const other = TEMPLATES.filter(t => t !== currentTemplate);
      result = { template: other[0], reason: 'Could not parse AI response' };
    }

    // Validate template name
    if (!TEMPLATES.includes(result.template)) {
      result.template = 'stacked';
    }

    return json({ template: result.template, reason: result.reason, source: 'ai' });
  } catch (e: any) {
    console.error('Error:', e);
    return json({ error: e.message || 'Unknown error' }, 500);
  }
});

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
    const { password, mode } = body;

    const adminPassword = Deno.env.get('ADMIN_PASSWORD');
    if (!adminPassword || password !== adminPassword) return json({ error: 'Unauthorized' }, 401);

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) return json({ error: 'AI key not configured' }, 500);

    // ─── BUILD MODE: create a new section from raw content ───
    if (mode === 'build') {
      const { page, label, columns = 1, textBlocks = [], images = [], links = [] } = body;
      if (!page || !label) return json({ error: 'page and label required' }, 400);

      const contentSummary = {
        textBlocks: textBlocks.map((t: string, i: number) => ({ index: i, preview: t.replace(/<[^>]*>/g, '').substring(0, 100) })),
        images: images.map((url: string, i: number) => ({ index: i, url })),
        links: links.map((l: { label: string; url: string }, i: number) => ({ index: i, ...l })),
      };

      const prompt = `You are a web layout architect. Arrange the following raw content into a responsive page section.

Columns available: ${columns} (0-indexed: 0 to ${columns - 1})
Content pieces:
${JSON.stringify(contentSummary, null, 2)}

Available layout templates: ${TEMPLATES.join(', ')}

Rules:
- Each text block becomes a "richtext" block with content: { html: "<the html>" }
- Each image becomes an "image" block with content: { url: "<image url>" }
- Each link becomes a "button" block with content: { text: "<label>", url: "<url>" }
- Assign each block a column_index (0 to ${columns - 1}) and row_order (starting at 0)
- Pick the best layout_template for this content
- If there's only text, use "stacked" or "feature-list"
- If there's text + 1 image, use "split-left" or "split-right"
- If there are multiple images or cards, use "card-grid"
- If it looks like a CTA, use "cta-banner"
- Distribute content evenly across columns when possible

Return ONLY valid JSON:
{
  "template": "template-name",
  "blocks": [
    { "block_type": "richtext|image|button", "content": {...}, "column_index": 0, "row_order": 0 }
  ]
}`;

      const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'google/gemini-3-flash-preview',
          messages: [
            { role: 'system', content: 'You are a web layout architect. Output only valid JSON, no markdown fences.' },
            { role: 'user', content: prompt },
          ],
        }),
      });

      if (!aiRes.ok) {
        const status = aiRes.status;
        if (status === 429) return json({ error: 'Rate limit exceeded, try again shortly.' }, 429);
        if (status === 402) return json({ error: 'AI credits exhausted.' }, 402);
        console.error('AI error:', await aiRes.text());
        return json({ error: 'AI service unavailable' }, 500);
      }

      const aiData = await aiRes.json();
      const raw = aiData.choices?.[0]?.message?.content || '{}';
      let result: any;
      try {
        const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        result = JSON.parse(cleaned);
      } catch {
        return json({ error: 'Could not parse AI response' }, 500);
      }

      if (!TEMPLATES.includes(result.template)) result.template = 'stacked';

      // Build the actual blocks from AI mapping + original content
      const finalBlocks: any[] = [];
      for (const b of (result.blocks || [])) {
        let content = b.content || {};
        // For richtext, inject original HTML
        if (b.block_type === 'richtext' && typeof content.index === 'number' && textBlocks[content.index]) {
          content = { html: textBlocks[content.index] };
        } else if (b.block_type === 'richtext' && !content.html) {
          // AI might have put html directly
          const idx = contentSummary.textBlocks.findIndex((t: any) => content.preview?.includes(t.preview?.substring(0, 30)));
          if (idx >= 0 && textBlocks[idx]) content = { html: textBlocks[idx] };
        }
        finalBlocks.push({
          block_type: b.block_type || 'richtext',
          content,
          column_index: Math.min(b.column_index || 0, columns - 1),
          row_order: b.row_order || 0,
        });
      }

      // If AI missed some content, add them
      const usedTextIdxs = new Set(finalBlocks.filter(b => b.block_type === 'richtext').map((_, i) => i));
      const usedImgUrls = new Set(finalBlocks.filter(b => b.block_type === 'image').map(b => b.content?.url));
      const usedLinkUrls = new Set(finalBlocks.filter(b => b.block_type === 'button').map(b => b.content?.url));

      let nextRow = Math.max(0, ...finalBlocks.map(b => b.row_order)) + 1;
      textBlocks.forEach((html: string, i: number) => {
        if (html.trim() && !usedTextIdxs.has(i) && finalBlocks.filter(b => b.block_type === 'richtext').length <= i) {
          finalBlocks.push({ block_type: 'richtext', content: { html }, column_index: i % columns, row_order: nextRow++ });
        }
      });
      images.forEach((url: string) => {
        if (!usedImgUrls.has(url)) {
          finalBlocks.push({ block_type: 'image', content: { url }, column_index: 0, row_order: nextRow++ });
        }
      });
      links.forEach((l: { label: string; url: string }) => {
        if (l.url.trim() && !usedLinkUrls.has(l.url)) {
          finalBlocks.push({ block_type: 'button', content: { text: l.label || 'Link', url: l.url }, column_index: 0, row_order: nextRow++ });
        }
      });

      const { existingSectionId } = body;
      let sectionId: string;

      if (existingSectionId) {
        // Add blocks to existing section — find max row_order first
        const { data: existingBlocks } = await supabase
          .from('section_content_blocks')
          .select('row_order')
          .eq('section_id', existingSectionId)
          .order('row_order', { ascending: false })
          .limit(1);

        const maxExisting = existingBlocks?.[0]?.row_order ?? -1;
        // Offset new block row_orders so they come after existing ones
        for (const b of finalBlocks) {
          b.row_order = b.row_order + maxExisting + 1;
        }

        // Update the section's layout template and columns
        await supabase.from('page_sections').update({
          layout_template: result.template,
          columns,
        }).eq('id', existingSectionId);

        sectionId = existingSectionId;
      } else {
        // Create new section
        const { data: sectionData, error: secErr } = await supabase.from('page_sections').insert({
          page,
          section_key: `ai:${label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          label,
          layout_template: result.template,
          columns,
          sort_order: 999,
          is_visible: true,
          section_type: 'section',
        }).select('id').single();

        if (secErr) return json({ error: secErr.message }, 500);
        sectionId = sectionData.id;
      }

      // Insert blocks
      if (finalBlocks.length > 0) {
        const rows = finalBlocks.map(b => ({
          section_id: sectionId,
          block_type: b.block_type,
          content: b.content,
          column_index: b.column_index,
          row_order: b.row_order,
        }));
        const { error: blkErr } = await supabase.from('section_content_blocks').insert(rows);
        if (blkErr) console.error('Block insert error:', blkErr);
      }

      return json({ section_id: sectionId, template: result.template, blocks_count: finalBlocks.length, source: 'ai' });
    }

    // ─── REMIX MODE: re-arrange existing blocks ───
    if (mode === 'remix') {
      const { section_id, columns: remixCols } = body;
      if (!section_id) return json({ error: 'section_id required' }, 400);

      const cols = remixCols || 1;

      const { data: blocks, error: blocksErr } = await supabase
        .from('section_content_blocks')
        .select('*')
        .eq('section_id', section_id)
        .order('row_order', { ascending: true });

      if (blocksErr) return json({ error: blocksErr.message }, 500);

      const { data: section } = await supabase
        .from('page_sections')
        .select('layout_template')
        .eq('id', section_id)
        .single();

      const currentTemplate = section?.layout_template || 'stacked';

      const blockSummary = (blocks || []).map((b: any, i: number) => ({
        index: i,
        type: b.block_type,
        column_index: b.column_index,
        row_order: b.row_order,
      }));

      const prompt = `You are a web layout remixer. Rearrange these content blocks into a DIFFERENT layout.

Current template: "${currentTemplate}" — pick something DIFFERENT.
Columns available: ${cols} (0-indexed: 0 to ${cols - 1})

Current blocks:
${JSON.stringify(blockSummary, null, 2)}

Available templates: ${TEMPLATES.join(', ')}

Rules:
- Keep the same blocks (same count), just change their column_index and row_order
- Pick a DIFFERENT template than "${currentTemplate}"
- Distribute blocks across columns creatively

Return ONLY valid JSON:
{
  "template": "new-template-name",
  "assignments": [
    { "index": 0, "column_index": 1, "row_order": 0 },
    { "index": 1, "column_index": 0, "row_order": 0 }
  ]
}`;

      const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'google/gemini-3-flash-preview',
          messages: [
            { role: 'system', content: 'You are a web layout remixer. Output only valid JSON, no markdown fences.' },
            { role: 'user', content: prompt },
          ],
        }),
      });

      if (!aiRes.ok) {
        const status = aiRes.status;
        if (status === 429) return json({ error: 'Rate limit exceeded, try again shortly.' }, 429);
        if (status === 402) return json({ error: 'AI credits exhausted.' }, 402);
        // Fallback: random shuffle
        const other = TEMPLATES.filter(t => t !== currentTemplate);
        const fallbackTemplate = other[Math.floor(Math.random() * other.length)];
        // Random shuffle column/row
        const shuffled = (blocks || []).map((b: any, i: number) => ({
          id: b.id,
          column_index: i % cols,
          row_order: Math.floor(i / cols),
        }));
        for (const s of shuffled) {
          await supabase.from('section_content_blocks').update({ column_index: s.column_index, row_order: s.row_order }).eq('id', s.id);
        }
        await supabase.from('page_sections').update({ layout_template: fallbackTemplate, columns: cols }).eq('id', section_id);
        return json({ template: fallbackTemplate, source: 'fallback' });
      }

      const aiData = await aiRes.json();
      const raw = aiData.choices?.[0]?.message?.content || '{}';
      let result: any;
      try {
        const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        result = JSON.parse(cleaned);
      } catch {
        const other = TEMPLATES.filter(t => t !== currentTemplate);
        result = { template: other[0], assignments: [] };
      }

      if (!TEMPLATES.includes(result.template) || result.template === currentTemplate) {
        const other = TEMPLATES.filter(t => t !== currentTemplate);
        result.template = other[Math.floor(Math.random() * other.length)];
      }

      // Apply assignments
      for (const a of (result.assignments || [])) {
        const block = (blocks || [])[a.index];
        if (block) {
          await supabase.from('section_content_blocks').update({
            column_index: Math.min(a.column_index || 0, cols - 1),
            row_order: a.row_order || 0,
          }).eq('id', block.id);
        }
      }

      await supabase.from('page_sections').update({ layout_template: result.template, columns: cols }).eq('id', section_id);

      return json({ template: result.template, source: 'ai' });
    }

    // ─── ORIGINAL MODE: suggest layout for existing section ───
    const { section_id } = body;

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

    const currentTemplate = section?.layout_template || 'stacked';
    const sectionType = section?.section_type || 'section';

    const prompt = `You are a web design advisor. Given content blocks for a website section, pick the BEST layout template.

Current template: "${currentTemplate}"
Section type: "${sectionType}" (hero = full-width banner, section = standard, small = compact)
Has background image: ${!!section?.bg_image_url}

Content blocks:
${JSON.stringify(blockSummary, null, 2)}

Available templates (pick ONE):
- stacked: Centered heading + body + CTA, everything stacked vertically.
- split-left: Text on left, image/media on right (50/50).
- split-right: Image/media on left, text on right (50/50).
- card-grid: Heading above, content in equal card grid below.
- hero-cover: Full-bleed background image with centered text overlay.
- cta-banner: Heading + buttons in a compact horizontal strip.
- feature-list: Icon + title + description rows, left-aligned.
- pricing-grid: Equal pricing/tier cards in a row.

Pick the BEST template that is DIFFERENT from the current one "${currentTemplate}" (unless it's already optimal).

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
      if (status === 402) return json({ error: 'AI credits exhausted.' }, 402);
      console.error('AI error:', await aiRes.text());
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

    if (!TEMPLATES.includes(result.template)) result.template = 'stacked';

    return json({ template: result.template, reason: result.reason, source: 'ai' });
  } catch (e: any) {
    console.error('Error:', e);
    return json({ error: e.message || 'Unknown error' }, 500);
  }
});



## Plan: AI Section Builder Tab

### Overview
Add an "AI Builder" tab inside each page's PageBuilder that lets users input raw content (text blocks, images, links), pick a column count, and have AI organize it into a fully responsive section. Includes a "Remix" button to re-shuffle the layout.

### New File: `src/components/AIBuilderTab.tsx`

A self-contained form component with:

- **Section Label** — text input
- **Column Picker** — 1–4 toggle buttons
- **Text Blocks** — accordion of WYSIWYG editors (using existing `RichTextEditor`). Adding a new block collapses the previous one. Each has a delete button.
- **Images** — `MultiImageUpload` for direct uploads + "Browse Library" button opening `MediaLibraryPicker`
- **Links** — repeatable Label + URL rows with add/remove
- **Create Section** button — sends all content to the `ai-layout` edge function with `mode: 'build'`, creates a `page_section` + `section_content_blocks` rows from the AI response
- **Remix** button (appears after creation) — re-calls AI with same content requesting a different layout, updates existing blocks

### Modified: `src/pages/KlawsomeAdmin.tsx`

Wrap the existing `PageBuilder` section list and new `AIBuilderTab` in a sub-tabs component:

```text
[Sections]  [✨ AI Builder]
```

The AI Builder tab receives `page` and `password` props, same as the section list.

### Modified: `supabase/functions/ai-layout/index.ts`

Add a `mode: 'build'` code path alongside the existing "clean up" flow:

**Input:**
```json
{
  "password": "...",
  "mode": "build",
  "page": "home",
  "label": "About Us",
  "columns": 2,
  "textBlocks": ["<p>Rich text HTML...</p>", "<p>Second block...</p>"],
  "images": ["https://...jpg", "https://...png"],
  "links": [{"label": "Learn More", "url": "/about"}]
}
```

**AI prompt:** Asks the model to arrange the provided content pieces into blocks with `block_type`, `content`, `column_index` (0-based, max = columns-1), and `row_order`. Also picks a `layout_template`.

**Output:**
```json
{
  "template": "split-left",
  "blocks": [
    {"block_type": "richtext", "content": {...}, "column_index": 0, "row_order": 0},
    {"block_type": "image", "content": {"url": "..."}, "column_index": 1, "row_order": 0},
    {"block_type": "button", "content": {"text": "Learn More", "url": "/about"}, "column_index": 0, "row_order": 1}
  ]
}
```

The edge function then:
1. Inserts a `page_section` row
2. Bulk-inserts all `section_content_blocks` rows
3. Returns the section ID + template

For **Remix** (`mode: 'remix'`), it takes an existing `section_id`, reads current blocks, re-calls AI requesting a different arrangement, then updates blocks' `column_index`/`row_order` and the section's `layout_template`.

### Files Summary

| File | Action |
|------|--------|
| `src/components/AIBuilderTab.tsx` | **Create** — full AI builder form |
| `src/pages/KlawsomeAdmin.tsx` | **Modify** — add sub-tabs in PageBuilder |
| `supabase/functions/ai-layout/index.ts` | **Modify** — add `build` and `remix` modes |


---
name: Page section layout system
description: Dynamic page_sections table with 3 section types (hero/section/small), priority-based rule engine for auto-layout, no AI costs
type: feature
---
- `page_sections` table: each row = one section on one page
- 3 section types: Hero Banner (50vh/100vh, full-width, 0 padding), Section (60px padding, 1200px), Small Section (30px padding, 1000px)
- `section_type` and `hero_height` columns control layout — replaces manual height/padding/max-width/columns fields
- Priority-based layout: block `row_order` = priority. Priority 1-2 get largest sizing, 3-4 medium, 5+ tertiary
- Rule engine in `DynamicSection.tsx` picks template from block types + priority (hero split, gallery, CTA strip, cards, stacked, etc.)
- No AI API calls — all layout is deterministic client-side logic
- `SectionWrapper` reads `section_type` to apply fixed styles per type
- Admin UI: section type toggle + hero height toggle + bg color/image + content blocks with priority numbers
- `custom_blocks` table: freeform content blocks referenced via `custom:block_key`
- `site-images` storage bucket: public uploads for admin image management
- All pages use `usePageSections(page)` hook to dynamically render sections

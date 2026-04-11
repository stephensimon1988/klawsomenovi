---
name: Page section layout system
description: Dynamic page_sections table controls section order, visibility, height, wrapper width, padding, and background for every page
type: feature
---
- `page_sections` table: each row = one section on one page, with layout controls (section_height, wrapper_max_width, padding_y, bg_color, bg_image_url, custom_css_class)
- `custom_blocks` table: freeform content blocks referenced via `custom:block_key` in page_sections
- `site-images` storage bucket: public uploads for admin image management
- `SectionWrapper` component wraps each section applying layout from DB; `fullControl` prop skips inner container for heroes
- `CustomBlock` component renders generic content from custom_blocks table
- `ImageUploadField` component for Command Center image uploads
- All pages (Index, Birthdays, Careers, Business, News) use `usePageSections(page)` hook to dynamically render sections
- Fallback sections hardcoded in each page file for when DB is empty
- Page Layout and Custom Blocks tabs in Command Center for editing

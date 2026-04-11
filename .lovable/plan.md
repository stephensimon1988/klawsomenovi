

# Simplified CMS with Priority-Based Layout Engine

## Summary
Replace complex layout inputs with 3 section types (Hero Banner, Section, Small Section), add priority ordering to content blocks, and use a rule-based template engine that determines visual prominence based on user-defined block order. Zero AI cost.

## Section Types

| Type | Height | Padding | Container |
|------|--------|---------|-----------|
| **Hero Banner** | 50vh or 100vh (toggle) | 0 | Full-width |
| **Section** | auto | 60px top/bottom | 1200px centered |
| **Small Section** | auto | 30px top/bottom | 1000px centered |

## Priority Ordering

Each content block within a section gets a `priority` value (its position in the list). Users drag/reorder blocks in the admin to set importance. The template engine uses this to determine:

- **Priority 1-2**: Largest/most prominent — bigger font sizes, more space, featured placement (e.g. left side of hero split, full-width heading)
- **Priority 3-4**: Secondary — medium sizing, supporting content
- **Priority 5+**: Tertiary — smaller, grid items, tucked below

Example: A section with Heading (priority 1), Image (priority 2), Text (priority 3), Button (priority 4) → Hero Split layout where Heading + Text stack on the left, Image fills the right, Button below text.

If the user reorders Image to priority 1 and Heading to priority 2 → Image takes the hero position (left/top), heading overlays or sits beside it.

## Rule-Based Template Engine (No AI)

Client-side function in `DynamicSection.tsx`. Uses block types + their priority order:

```text
Rules (checked in order):
1. Has image at priority 1        → Image-led hero (image dominant, text overlay or beside)
2. Has heading + text + 1 image   → Hero Split (highest-priority item gets more space)
3. Has heading + text + 2+ images → Text top, image grid below (priority sets grid order)
4. Has video/iframe               → Full-width embed, text above if present
5. Has heading + button only      → CTA strip centered
6. Has 3+ text blocks             → Card grid (priority = card order, first card bigger)
7. Everything else                → Centered stack in priority order
```

Priority 1 block always gets ~60% of the space in split layouts. Lower priority items share the remaining 40%.

## Database Changes

**Migration:**
```sql
ALTER TABLE page_sections 
  ADD COLUMN section_type text NOT NULL DEFAULT 'section',
  ADD COLUMN hero_height text NOT NULL DEFAULT '100vh';

-- priority is just row_order on section_content_blocks (already exists)
-- No new column needed — reordering updates row_order
```

## Admin UI Changes

**Per section — simplified to:**
1. **Section type** — 3-button toggle (Hero Banner / Section / Small Section)
2. **Hero height** — Half/Full toggle (only visible for Hero Banner)
3. **Background color** — brand palette picker (auto-contrast text color)
4. **Background image** — upload field
5. **Content blocks** — drag-to-reorder list with ↑↓ buttons (order = priority)
6. **Label** — text field for admin reference

**Removed:** height, padding, max-width, columns, CSS class, photos multi-upload, AI Layout button.

**Priority indicator:** Each block shows its priority number (1, 2, 3...) beside it. A small note: "Items at the top are most prominent on the page."

## Files Changed

| File | Change |
|------|--------|
| `page_sections` migration | Add `section_type`, `hero_height` columns |
| `SectionWrapper.tsx` | Apply fixed styles per section type instead of reading individual fields |
| `DynamicSection.tsx` | Rewrite template engine to use priority-aware rules, remove AI layout dependency |
| `KlawsomeAdmin.tsx` | Replace layout fields with type toggle + priority reordering UI |
| `useCmsContent.ts` | Update `PageSection` type with new fields |

## Cost Impact
- **Before**: AI API call on every save
- **After**: Zero API calls — all layout decisions are instant client-side rules


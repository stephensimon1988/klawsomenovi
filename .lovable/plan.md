

## Plan: AI-First Page Builder Overhaul

### What changes

The admin page builder becomes AI-first. No more "Sections" vs "AI Builder" tabs — everything lives in one unified view. Blocks auto-save, the AI builder inputs persist to localStorage, and all block types are supported.

### 1. Unify PageBuilder — remove Sections/AI Builder tabs

**File: `src/pages/KlawsomeAdmin.tsx`**

- Remove the `<Tabs>` wrapper in `PageBuilder` that splits "Sections" and "AI Builder"
- The default view becomes: AI Content Builder panel at top (always visible) + section list below
- Move the `AIBuilderTab` content inline into `PageBuilder` (or keep it as a component but always render it, not behind a tab)
- The section list (accordion-style `SectionCard` components) stays below with reorder, visibility, delete

### 2. Remove "Save" buttons from BlockItem — auto-save on blur/change

**File: `src/pages/KlawsomeAdmin.tsx` (BlockItem component)**

- Remove the explicit "Save" button from each block's header bar
- Add `onBlur` handler to text inputs and `onChange` debounce (500ms) for WYSIWYG/complex fields that auto-calls `onUpdate`
- Use a `useEffect` with a debounce timer on `localContent` changes to auto-persist

### 3. localStorage persistence for AI Builder inputs

**File: `src/pages/KlawsomeAdmin.tsx` (SectionCard AI builder state)**

- On mount, load `aiTextBlocks`, `aiImages`, `aiLinks`, `aiColumns` from `localStorage` keyed by section ID
- On every state change, write back to localStorage
- Clear localStorage entry after successful AI Create
- Same pattern for the top-level AI Builder in PageBuilder

### 4. Support all block types in AI builder's "Add Block Directly"

**File: `src/pages/KlawsomeAdmin.tsx` (SectionCard)**

- The `BLOCK_TYPES` array in the AI builder section currently only has a subset. Replace it with the full `BLOCK_TYPES` array (18 types: heading, richtext, image, video, iframe, code, list, button, divider, tabs, table, gallery, map, icon_box, countdown, carousel, reviews, data_cards)
- Each block type already has default content defined in `ContentBlockEditor.addBlock` — reuse those defaults

### 5. AI Create adds blocks into the section's existing block list

This already works — `aiAddContent` calls the edge function with `existingSectionId: section.id`, which appends blocks to the section. The blocks then appear in the `ContentBlockEditor` accordion below. No change needed here, just verify the flow.

### 6. Remove the standalone `AIBuilderTab` component and tab

**Files:**
- Remove `src/components/AIBuilderTab.tsx` (no longer needed — its functionality is merged into the unified PageBuilder)
- Remove the import in `KlawsomeAdmin.tsx`

### 7. Auto-save for SectionCard settings

The section settings (label, bg_color, layout_template, etc.) already auto-save via `onUpdateLayout` on every change. No additional work needed.

### Files changed

| File | Action |
|------|--------|
| `src/pages/KlawsomeAdmin.tsx` | Major refactor — unify tabs, auto-save blocks, localStorage, full block types |
| `src/components/AIBuilderTab.tsx` | Delete (merged into PageBuilder) |

### Technical details

- **Debounce auto-save**: Use a `useRef` timer in `BlockItem`. On any `localContent` change, clear previous timer and set a new 800ms timeout to call `onUpdate`. Also fire on blur for immediate save when leaving a field.
- **localStorage keys**: `ai-builder-${sectionId}` storing `{ textBlocks, images, links, columns }` as JSON.
- **Block type defaults**: Consolidate the default content map from `ContentBlockEditor.addBlock` (lines 298-322) and reuse it in the AI builder's "Add Block Directly" section, so code, tabs, table, gallery, map, icon_box, countdown, carousel, reviews all work.


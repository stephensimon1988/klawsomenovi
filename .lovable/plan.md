

# Generic Data Cards System + Live Preview

## Problem
Widget blocks (Party Options, Token Prices, Jobs, etc.) are each hardcoded to a specific DB table. The admin can't reuse these card layouts with different content.

## Solution
Add a `data_cards` block type that can pull from any allowed DB table with column mappings, or use inline card data. Existing widget types stay as-is for backward compatibility. The live preview already uses `SectionWrapper` + `DynamicSection` in a virtual 1920x1080 viewport, so new block types render automatically with no extra preview work.

## Changes

### 1. `src/components/DynamicSection.tsx`

**New `DataCardsWidget` component** that accepts config from the block's `content` JSONB:
- `source`: table name (e.g. `party_options`) or `"inline"`
- `mappings`: maps DB columns to uniform fields (`title`, `description`, `price`, `image`, `features`, `link`, `highlight`)
- `display`: rendering style — `card-grid`, `pricing-grid`, `list`, or `accordion`
- `columns`: 2, 3, or 4
- `items`: array of card objects (when source is `"inline"`)

Uses `useCmsTable(source)` to fetch, then maps columns to a uniform shape and renders using the chosen display style — reusing the same visual patterns already in PartyOptionsWidget, PricingWidget, JobsWidget, and FaqWidget.

| Display Style | Renders Like |
|---------------|-------------|
| `card-grid` | Equal cards in N columns (Party Options style) |
| `pricing-grid` | Pricing cards with highlight (Token Tiers style) |
| `list` | Vertical list with optional images (Jobs style) |
| `accordion` | Expandable Q&A rows (FAQ style) |

Add `'data_cards'` to the `WIDGET_TYPES` set and a new case in `BlockRenderer`.

### 2. `src/pages/KlawsomeAdmin.tsx`

**Add to `BLOCK_TYPES`**: `{ type: 'data_cards', icon: '📊', label: 'Data Cards' }`

**Add editor UI in `BlockItem`** when `block_type === 'data_cards'`:
- **Source** dropdown: `Inline` | `party_options` | `token_tiers` | `job_listings` | `news_articles` | `faq_items` | `invite_templates` | `business_pricing_tiers`
- **Display style** dropdown: Card Grid | Pricing Grid | List | Accordion
- **Columns** dropdown: 2, 3, 4
- **Preset buttons** that auto-fill source + mappings + display:
  - "Party Options" → source `party_options`, mappings `{title:'name', description:'description', price:'price', features:'features'}`, display `card-grid`
  - "Token Pricing" → source `token_tiers`, mappings `{title:'tokens', price:'price', description:'bonus', highlight:'is_highlight'}`, display `pricing-grid`
  - "FAQ" → source `faq_items`, mappings `{title:'question', description:'answer'}`, display `accordion`
  - "Jobs" → source `job_listings`, mappings `{title:'title', description:'description', image:'image_url', link:'apply_url'}`, display `list`
- **Column mapping fields**: Editable inputs for title, description, price, image, features, link
- **Inline mode**: When source is "inline", show add/remove card editor

### 3. Live Preview — No Additional Work

The preview already renders `DynamicSection` inside `SectionWrapper` in the 1920x1080 virtual viewport. Since `DataCardsWidget` goes through the same `BlockRenderer` pipeline, it appears in the live preview automatically with correct styling, scaling, and centering.

### Files Changed

| File | Change |
|------|--------|
| `src/components/DynamicSection.tsx` | Add `DataCardsWidget`, update `WIDGET_TYPES`, add `BlockRenderer` case |
| `src/pages/KlawsomeAdmin.tsx` | Add `data_cards` to `BLOCK_TYPES`, add editor UI with source/mapping/display/preset controls |

### No Database Migration Needed
Config is stored in the existing `content` JSONB column of `section_content_blocks`. All existing widget blocks continue working unchanged.


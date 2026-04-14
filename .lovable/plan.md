

## Plan: Consolidate Widget Blocks into Data Cards + Custom Table Creator

### The Problem

Right now there are **two systems** for showing database content in sections:

1. **Dedicated widget blocks** (`jobs`, `faq`, `news`, `pricing`, `hours`, `reviews`, `party_options`, `templates`) — each hardcoded to one table with a fixed layout. In the admin they just say "This block pulls from the database" with no configuration.

2. **Data Cards block** — already supports mapping *any* DB table to cards/pricing/list/accordion displays, with column mappings and presets.

These overlap. The user wants to eliminate the dedicated widgets and make Data Cards the universal approach, plus add the ability to create new data tables from the admin.

### What Changes

**Phase 1: Remove dedicated widget blocks, unify into Data Cards**

- **DynamicSection.tsx**: Remove the individual widget functions (`PricingWidget`, `HoursWidget`, `NewsWidget`, `FaqWidget`, `JobsWidget`, `PartyOptionsWidget`, `TemplatesWidget`). Keep `ReviewsWidget` (it calls an edge function, not a table). Keep `DataCardsWidget` as the single renderer.
- Remove `pricing`, `hours`, `news`, `faq`, `jobs`, `party_options`, `templates` from `WIDGET_TYPES` and the block type menu.
- Add new display styles to `DataCardsWidget`: `hours` (day/time pairs), `faq-accordion` (Q&A with expand/collapse) so the existing visual styles aren't lost.
- Existing sections using old block types will need a one-time data migration to convert them to `data_cards` blocks with the correct preset mappings.

**Phase 2: Custom Data Table Creator in Admin**

- Add a new section in the Settings tab: **"Custom Data Tables"**
- UI lets the admin:
  1. Enter a table name (e.g. `menu_items`, `team_members`)
  2. Define columns: name, type (text, number, bool, array, textarea, image URL), required/optional
  3. Click "Create Table" — calls a new edge function
- **New edge function `cms-create-table`**: Accepts table name + column definitions, runs `CREATE TABLE` with RLS (public read), adds it to the `TABLES_ALLOWED` list dynamically
- Store table definitions in a new `cms_custom_tables` metadata table so the admin knows which custom tables exist and their column schemas
- Auto-generate `MiniTableEditor` instances for each custom table in the Settings tab
- Auto-populate the Data Cards "Source" dropdown with custom tables

**Phase 3: Migration for existing content**

- SQL migration to convert all existing `section_content_blocks` rows with `block_type` in (`pricing`, `hours`, `news`, `faq`, `jobs`, `party_options`, `templates`) to `block_type = 'data_cards'` with the correct preset content JSON.

### Technical Details

**New DB table: `cms_custom_tables`**
```
id           uuid PK
table_name   text UNIQUE NOT NULL
label        text NOT NULL
columns      jsonb NOT NULL  -- [{key, label, type, required}]
created_at   timestamptz
```

**New edge function: `cms-create-table`**
- Accepts: password, table_name, label, columns definition
- Validates name (alphanumeric + underscores only)
- Runs: `CREATE TABLE public.<name> (id uuid PK, sort_order int, <dynamic columns>)`
- Enables RLS with public SELECT
- Inserts metadata into `cms_custom_tables`
- Adds table to `cms-admin` allowed list (by reading `cms_custom_tables` dynamically instead of a hardcoded array)

**cms-admin update**: Change `TABLES_ALLOWED` from hardcoded to: hardcoded base list + dynamic lookup from `cms_custom_tables`.

**Files changed:**
- `src/components/DynamicSection.tsx` — remove 7 widget functions, add display styles to DataCardsWidget
- `src/pages/KlawsomeAdmin.tsx` — remove old block types from menu, add Custom Table Creator UI, dynamic MiniTableEditor for custom tables
- `supabase/functions/cms-admin/index.ts` — dynamic TABLES_ALLOWED
- New: `supabase/functions/cms-create-table/index.ts`
- Migration: `cms_custom_tables` table + convert existing widget blocks to data_cards


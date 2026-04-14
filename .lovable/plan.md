

## Plan: Spreadsheet-Style Table Creator

Replace the current developer-oriented table creation form (snake_case names, type dropdowns) with an intuitive spreadsheet-style WYSIWYG builder.

### How It Works Now
Users must manually type column names in snake_case, pick types from a dropdown, then create the table. It feels like a database tool, not a content tool.

### What Changes

**Replace the creator UI with a visual spreadsheet builder:**

1. **Step 1 — Name it**: Just two fields: "What do you want to call this table?" (e.g. "Team Members") and auto-generate the snake_case name from it.

2. **Step 2 — Design columns visually**: A live spreadsheet-style grid where:
   - Click "+" to add a column — a popover asks for column name and type via friendly labels ("Short Text", "Long Text", "Number", "Yes/No", "Image", "List")
   - Column headers are editable inline
   - Type is shown as a small icon/badge in the header (camera icon for image, toggle for yes/no, etc.)
   - Users can drag to reorder columns (optional, can skip for simplicity)
   - A sample empty row is shown so they can visualize what data entry will look like

3. **Step 3 — Click "Create"**: Same edge function call, just friendlier packaging.

**Auto-generate snake_case**: When user types "Team Members" as label, auto-fill table name as `team_members`. User never sees snake_case unless they want to.

**Friendly type labels**: Map user-friendly names to internal types:
- "Short Text" → `text`
- "Long Text" → `textarea`  
- "Number" → `number`
- "Yes/No" → `bool`
- "Image" → `image_url`
- "List" → `array`

### Files Changed

- **`src/pages/KlawsomeAdmin.tsx`** — Replace `CustomTableCreator` with the new spreadsheet-style UI. Same edge function, same data flow, just a much friendlier interface.

### What Stays the Same
- Edge function `cms-create-table` — no changes needed
- `MiniTableEditor` for editing rows after creation — no changes
- `cms-admin` dynamic table lookup — no changes




## Plan: Desktop-Only Inline Edit Mode

### UI Concept

Here's what the editor looks like on desktop. On mobile, the existing /klawsome-admin block editor is used instead.

```text
┌──────────────────────────────────────────────────────────────────┐
│  HOME   BIRTHDAYS   GIFT CARDS   CAREERS   NEWS   ...   BOOK   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │ Section: Gallery Hero          [🎨 BG] [📐 Type]│◄───┼── Section toolbar  │
│  │  └──────────────────────────────────────────────────┘    │   │
│  │                                                          │   │
│  │   ┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐     │   │
│  │   ┊  GALLERY                          [Heading ✏️]┊◄────┼── Hover = dashed   │
│  │   └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘     │   │   blue outline    │
│  │                                                          │   │
│  │   ┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐     │   │
│  │   ┊  Check out our space!             [Text ✏️]   ┊     │   │
│  │   └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘     │   │
│  │                                        [+ Add Block]     │   │
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   │
│                         [+ Add Section]                          │
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │ Section: In the Beginning      [🎨 BG] [📐 Type]│    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  │                                                          │   │
│  │   ┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐     │   │
│  │   ┊  [📷] [📷] [📷] [📷]           [Gallery ✏️]  ┊◄────┼── Click opens      │
│  │   ┊  [📷] [📷] [📷] [📷]                         ┊     │   │   table editor    │
│  │   └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘     │   │   in a drawer     │
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   │
│                                                                  │
│                                          ┌─────────────────┐     │
│                                          │  ✏️ Edit Mode   │◄── Floating toggle │
│                                          └─────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
```

**Clicking a block opens an inline popover:**
```text
  ┌──────────────────────────────────┐
  │  GALLERY              ← live text, contentEditable
  ├──────────────────────────────────┤
  │  Type: [Heading ▾]              │
  │  ────────────────────────────── │
  │  [Save]  [Cancel]  [🗑 Delete]  │
  └──────────────────────────────────┘
```

**For images/data_cards, clicking opens a side drawer with the table editor:**
```text
  ┌─────────────────────────────────────┐
  │  ✕  Editing: gallery_photos         │
  │─────────────────────────────────────│
  │  [MiniTableEditor rows here]        │
  │  image_url | section | caption      │
  │  ───────── ──────── ─────────       │
  │  url1.jpg  | begin  | Fun day       │
  │  url2.jpg  | begin  | More fun      │
  │  ...                                │
  │  [+ Add Row]                        │
  └─────────────────────────────────────┘
```

### Key Rules

1. **Desktop only (>768px)**: The floating "Edit Mode" button only renders on desktop. On mobile, admins use /klawsome-admin as-is.
2. **Mobile layout is automatic**: The responsive CSS already handles mobile — no need to edit layout at phone size.
3. **Same /klawsome-admin for both**: The block-style editor at /klawsome-admin remains unchanged and works on all devices.

### Interaction Flow

1. Admin visits any page on desktop, clicks floating "✏️ Edit" button
2. Password prompt (same ADMIN_PASSWORD, stored in sessionStorage)
3. Every section gets a toolbar overlay (bg color, section type, animation)
4. Every content block gets a dashed hover outline with type badge
5. Click a text block → contentEditable inline + save/cancel popover
6. Click an image block → upload/URL popover
7. Click a data_cards block → side drawer with MiniTableEditor
8. "Add Section" buttons between sections, "Add Block" at bottom of each section
9. All saves go through the existing `cms-admin` edge function

### Files

| File | Change |
|------|--------|
| `src/contexts/EditModeContext.tsx` | **New** — Context with `isEditMode`, auth state, `useIsMobile()` gate |
| `src/components/EditModeToggle.tsx` | **New** — Floating button, hidden on mobile via `useIsMobile()` |
| `src/components/EditableWrapper.tsx` | **New** — Hover outline + click popover per block type |
| `src/components/SectionToolbar.tsx` | **New** — Section controls (bg, type, layout, add/delete) |
| `src/components/DynamicSection.tsx` | **Edit** — Wrap `BlockRenderer` in `EditableWrapper` when edit mode on |
| `src/components/SectionWrapper.tsx` | **Edit** — Show `SectionToolbar` when edit mode on |
| `src/App.tsx` | **Edit** — Wrap in `EditModeProvider` |

### What Stays the Same
- /klawsome-admin works on all devices, unchanged
- All rendering logic unchanged — edit mode is purely an overlay
- No new database tables needed
- No drag-and-drop (use arrow buttons for reordering)


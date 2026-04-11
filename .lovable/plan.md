

# Webpage Builder: Section Layout Controls via CMS

## What This Adds

Every section on every page gets a unique ID in the database. The admin can control **order, visibility, height, wrapper width, padding, and background** for each section — all from the Command Center using the same text-based editor pattern you already know.

Plus: a **storage bucket** for image uploads and a **custom blocks** system so the admin can add new content sections without code.

## Database Changes

### 1. New table: `page_sections`

One row per section per page. Controls layout.

| Column | Type | Default | What it does |
|---|---|---|---|
| `id` | uuid | auto | Unique ID for each section |
| `page` | text | — | `home`, `birthdays`, `careers`, `business`, `news` |
| `section_key` | text | — | Maps to a React component (e.g. `hero`, `about`, `tokens`) |
| `label` | text | — | Friendly name shown in admin (e.g. "Hero Banner") |
| `sort_order` | int | 0 | Controls section order on page |
| `is_visible` | bool | true | Show/hide toggle |
| `section_height` | text | `auto` | CSS min-height (`auto`, `100vh`, `600px`) |
| `wrapper_max_width` | text | `1200px` | Inner container max-width (`full`, `900px`, `1400px`) |
| `padding_y` | text | `7rem` | Vertical padding |
| `bg_color` | text | empty | Background color override |
| `bg_image_url` | text | empty | Background image URL |
| `custom_css_class` | text | empty | Extra Tailwind classes |

RLS: public SELECT, no insert/update/delete (managed via edge function).

**Seed data**: Pre-populate rows for all existing sections across all 5 pages (~25 rows).

### 2. New table: `custom_blocks`

For adding new freeform content sections without code changes.

| Column | Type | Purpose |
|---|---|---|
| `id` | uuid | — |
| `block_key` | text | Unique key, referenced by `page_sections.section_key` as `custom:key` |
| `headline` | text | Section headline |
| `body` | text | Body text |
| `image_url` | text | Image |
| `image_position` | text | `left`, `right`, `top`, `full-bg` |
| `cta_text` | text | Optional button label |
| `cta_url` | text | Optional button link |

### 3. Storage bucket: `site-images`

Public bucket for uploading images from the Command Center.

## Frontend Changes

### New component: `SectionWrapper`

Wraps each section, applying layout values from `page_sections`:

```text
<SectionWrapper config={sectionConfig}>
  <KawaiiAbout />
</SectionWrapper>
```

Applies `minHeight`, `paddingTop/Bottom`, `maxWidth` on the inner container, `backgroundColor`, and `backgroundImage`. Empty values = use component defaults.

### New component: `CustomBlock`

Generic renderer for `custom_blocks` data — renders headline, body, image, and optional CTA button. Used when `section_key` starts with `custom:`.

### New component: `ImageUploadField`

Upload button in the Command Center that uploads to the `site-images` bucket and fills the URL text field. Used alongside existing URL text inputs.

### Page refactors (Index, Birthdays, Careers, Business, News)

Each page will:
1. Fetch `page_sections` filtered by `page`, sorted by `sort_order`, filtered to `is_visible = true`
2. Map `section_key` to React component via a lookup object
3. Render each component inside `<SectionWrapper>` in order

```text
// Conceptual flow in Index.tsx:
const SECTION_MAP = {
  hero: KawaiiHero,
  about: KawaiiAbout,
  visit: KawaiiVisit,
  tokens: KawaiiTokenPrices,
  reviews: KawaiiReviews,
  news: KawaiiNews,
  giftcards: KawaiiGiftCards,
  scheduling: SchedulingPlaceholder,
  story: KawaiiStory,
};

sections.map(s => {
  const Component = SECTION_MAP[s.section_key] || CustomBlock;
  return <SectionWrapper key={s.id} config={s}><Component /></SectionWrapper>;
})
```

### Command Center updates

1. Add `page_sections` and `custom_blocks` to `cms-admin` edge function's `TABLES_ALLOWED`
2. New **"Page Layout"** tab with a `MultiRowEditor` per page showing: Section, Order, Visible, Height, Max Width, Padding, BG Color, BG Image URL
3. New **"Custom Blocks"** sub-tab for adding freeform content blocks
4. Add `ImageUploadField` to any image URL field in the admin

## Implementation Order

1. DB migration: create `page_sections`, `custom_blocks`, storage bucket, seed all existing sections
2. Update `cms-admin` edge function with new tables
3. Build `SectionWrapper`, `CustomBlock`, `ImageUploadField` components
4. Refactor all 5 page files to use the dynamic `page_sections` loop
5. Add "Page Layout" and "Custom Blocks" tabs to Command Center
6. Update project memory

## What the Admin Experiences

Same text-based fields. To reorder sections: change the number. To hide: uncheck visible. To make wider: type `1400px`. To add a background image: paste a URL or click upload. To add a new content section: create a custom block, then add a `custom:key` row to the page layout.


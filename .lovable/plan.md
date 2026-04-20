
# Prismic Content Architecture for Klawsome

## Already in Prismic
- **product_pages** — Square catalog items (name, description, image, price)
- **scheduling** — Appointment types with per-day availability

---

## New Prismic Custom Types Needed

### 1. `homepage` (Single type)
One document controlling the entire homepage. Fields:
- **hero_headline** (rich text) — "Michigan's first stand-alone claw arcade"
- **hero_description** (rich text) — paragraph below headline
- **hero_background_image** (image) — the big hero photo
- **hero_logo** (image) — circular logo
- **hours_card** (group) — repeatable rows with `label` (text) + `value` (text) for hours display
- **story_title** (rich text) — "The Klawsome Story"
- **story_body** (rich text) — story paragraph
- **about_steps** (group) — repeatable: `image` (image), `title` (text), `description` (text)

### 2. `token_tier` (Repeatable type)
One document per pricing tier:
- **price** (text) — "$5"
- **tokens** (text) — "25 Tokens"
- **bonus** (text) — "" or "Best Value!"
- **is_highlight** (boolean)
- **sort_order** (number)

### 3. `news_article` (Repeatable type)
One document per press mention / media hit:
- **title** (rich text)
- **source** (text) — "Hour Detroit"
- **date** (date)
- **url** (text / link) — external article URL
- **thumbnail** (image)

### 4. `birthday_page` (Single type)
One document for the entire birthdays page:
- **hero_image** (image) — background photo
- **hero_badge** (image) — "klawsome birthday" badge
- **hero_headline** (rich text)
- **celebration_title** (rich text) — "Klawsome Wants To Celebrate You!"
- **celebration_body** (rich text)
- **celebration_gif** (image)
- **hosting_rules** (rich text) — "Looking to Host" section
- **contact_email** (text)
- **party_options** (group) — repeatable: `title`, `image`, `features` (rich text)
- **photography_note** (text) — "Photography Rental also available..."
- **invite_templates** (group) — repeatable: `image` (image), `download_url` (text)

### 5. `faq_item` (Repeatable type)
One document per FAQ (used on birthdays page, could be reused):
- **question** (rich text)
- **answer** (rich text)
- **page** (text) — "birthdays" / "general" for filtering
- **sort_order** (number)

### 6. `job_listing` (Repeatable type)
One document per job/internship:
- **title** (text) — "Store Associate"
- **category** (select: "in_store" | "hybrid_paid" | "hybrid_unpaid")
- **description** (rich text)
- **image** (image) — optional
- **job_description_url** (text / link)
- **apply_url** (text / link)
- **is_active** (boolean)

### 7. `business_page` (Single type)
One document for the Business / Rentals page:
- **hero_headline** (rich text) — "Grow With Klawsome!"
- **hero_description** (rich text)
- **hosted_machine_section** (group of fields):
  - `headline`, `description`, `revenue_share` (text), `klawsome_handles` (rich text), `business_provides` (rich text), `venues` (group: `label` text)
- **partner_section** (group of fields):
  - `headline`, `description`, `includes` (group: `icon`, `title`, `desc`)
- **plushie_section** (group of fields):
  - `headline`, `description`, `pricing_tiers` (group: `label`, `title`, `price`, `per`, `desc`), `steps` (group: `icon`, `title`, `desc`)
- **how_it_works** (group) — repeatable: `step_number`, `title`, `description`

### 8. `site_settings` (Single type)
Global settings used across all pages:
- **address** (text) — "42768 Grand River Ave, Suite C-140, Novi, MI 48375"
- **phone** (text) — "(248) 938-4093"
- **general_email** (text) — "team@klawsomenovi.com"
- **events_email** (text) — "events@klawsomenovi.com"
- **instagram_url** (text)
- **facebook_url** (text)
- **tiktok_url** (text)
- **google_maps_url** (text)
- **tagline** (text) — "Michigan's first stand-alone claw machine arcade"
- **regular_hours** (rich text) — "Tue–Sun 11am–9pm, Closed Mondays"
- **special_hours** (group) — repeatable: `label` (text), `value` (text)
- **as_seen_on_image** (image) — the "As Seen On" banner
- **storefront_image** (image) — used in Visit section
- **gift_card_url** (text) — Square gift card purchase link
- **gift_card_images** (group) — repeatable image fields
- **newsletter_signup_url** (text)

---

## Implementation Approach
1. Create these custom types in Prismic via the existing `prismic-write` edge function pattern (or manually in Prismic dashboard)
2. Extend the `prismic` edge function to handle each new type with field mapping
3. Update each component to fetch from the edge function instead of hardcoded data
4. Add React Query caching so content loads fast

## What stays hardcoded
- Navigation links (structural, not content)
- UI labels like "Read Here →", button text patterns
- Animation/layout configuration
- Design tokens and styling

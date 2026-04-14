

## Plan: Transfer All Content from klawsomenovi.com into CMS

### Summary

Transfer all content and images from the 8 Squarespace pages into our CMS system. Create 4 new page routes (/gallery, /ourstory, /rewards, /faq), populate all database tables with real content, and create page_sections + content blocks for every page.

### What Already Exists (skip or update)

| Page | Route | Status |
|------|-------|--------|
| Home | `/` | Exists — update data in tables |
| Birthdays | `/birthdays` | Exists — update data in tables |
| Careers | `/careers` | Exists — update job_listings data |
| News | `/news` | Exists — update news_articles data |

### What Needs to Be Created

| Page | Route | Content |
|------|-------|---------|
| Gallery | `/gallery` | Hero + 3 photo gallery sections (In the Beginning, Private Party, Semi-Private) |
| Our Story | `/ourstory` | Our Story intro, Where It All Began, Bringing Our Culture sections with images |
| Rewards | `/rewards` | Loyalty hero, membership benefits, lifetime tiers table, points redeemable table |
| FAQ | `/faq` | Hero + 3 FAQ sections (General, Plushies/Upgrades/Trade-Ins, Miscellaneous) |

### Work Breakdown

**1. Create 4 new page components**
- `src/pages/Gallery.tsx`, `src/pages/OurStory.tsx`, `src/pages/Rewards.tsx`, `src/pages/Faq.tsx`
- All follow the same pattern as `News.tsx` / `Careers.tsx` (KawaiiNav + usePageSections loop + KawaiiFooter)

**2. Add routes in App.tsx**
- `/gallery`, `/ourstory`, `/rewards`, `/faq`

**3. Update navigation**
- Update `KawaiiNav.tsx` navLinks to match klawsomenovi.com nav: Home, Birthdays, Gift Cards, Careers, + More dropdown with Gallery, Our Story, Rewards, News, FAQ

**4. Create new data table: `rewards_tiers`**
- Columns: `tier_name` (text), `min_points` (text), `benefit` (text), `sort_order` (int)
- Data: Base (0, x1), Collector (500, x1.2), Master Of The Claw (1500, x1.4), Legendary (4000, x1.7)

**5. Create new data table: `rewards_redemptions`**
- Columns: `points` (text), `reward` (text), `sort_order` (int)
- Data: 250/Free mini plushie, 500/Free Regular Plushie, 1000/Any XL plushie

**6. Create new data table: `gallery_photos`**
- Columns: `section` (text), `image_url` (text), `caption` (text), `sort_order` (int)
- Data: ~40+ photos from the gallery page organized by section (beginning, private_party, semi_private)

**7. Insert/update data in existing tables**

- **`faq_items`**: Insert all ~25 FAQ Q&As from the FAQ page with `page` categories: "general", "plushies", "miscellaneous" — plus the ~15 birthday-specific FAQs from the events page with page "birthdays"
- **`news_articles`**: Insert/update 6 articles (Little Guide Detroit, Hour Detroit, Michigan Mama News, Hometown Life, @clawcraziness TikTok, @Zcaders YouTube) with correct titles, dates, URLs, and Squarespace image URLs
- **`job_listings`**: Insert/update all positions: Assistant Store Manager, Store Associate, Internship, Corporate Development Fellow, General Manager, Purchasing Specialist, Events Assistant Manager — with descriptions, job_desc_urls, apply_urls, is_paid flags
- **`party_options`**: Update with Private ($250, features list) and Reserved Semi-Private ($250, features list)
- **`token_tiers`**: Update with $10/10, $30/35 (16%), $50/60 (20%), $100/125 (25%), $250/325 (30% TOP PICK)
- **`homepage_content`**: Update hero headline, subheadline, story text with actual klawsomenovi.com content
- **`birthdays_content`**: Update with party rules text, promo text, booking contact info

**8. Create page_sections + section_content_blocks for all pages**

For each new page, insert `page_sections` rows with section_type/layout_template, then `section_content_blocks` rows with the actual content (headings, text, images, data_cards blocks pointing to the right tables).

For existing pages (home, birthdays, careers, news), verify sections exist and add any missing ones.

### Technical Details

- **New files**: `src/pages/Gallery.tsx`, `src/pages/OurStory.tsx`, `src/pages/Rewards.tsx`, `src/pages/Faq.tsx`
- **Edited files**: `src/App.tsx` (add routes), `src/components/KawaiiNav.tsx` (update nav links)
- **DB migration**: Create `rewards_tiers`, `rewards_redemptions`, `gallery_photos` tables with RLS
- **Data inserts**: Bulk insert into faq_items, news_articles, job_listings, party_options, token_tiers, homepage_content, birthdays_content, gallery_photos, rewards_tiers, rewards_redemptions, page_sections, section_content_blocks
- All images will reference the Squarespace CDN URLs directly (they're publicly accessible)
- All content blocks use the existing `data_cards` system for database-driven content
- No AI calls needed — all deterministic content transfer


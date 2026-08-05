# Full Content Editing in /klawsome-admin

Turn the admin panel into a real content editor: each content area gets its own tab so you can jump straight to what you want to change.

## New tabs

Existing tabs stay (Vital Info, Hours, Booking Schedule, Bookings). These get added, each as its own tab:

1. **💰 Token Prices** — price, tokens, bonus %, which row gets the yellow "TOP PICK" highlight, order. Add/delete tiers.
2. **📰 News / Press** — title, source, date, link, image, show/hide, order (9 articles today).
3. **❓ FAQ** — question, answer, which page it appears on, order (60 items today).
4. **💼 Careers** — role title, category, description, image, job-description link, apply link, paid flag, show/hide (9 listings today).
5. **🎉 Party Packages** — name, description, price copy, feature bullets for private/semi-private parties.
6. **🎪 Rental Packages** — name, price copy, description, features, button text/link, highlight flag (5 packages today).
7. **🏠 Homepage Copy** — hero headline, subheadline, button text, story title/body, about title/subtitle, plus the 3 "how it works" steps.
8. **🖼 Gallery** — album name, caption, image, order; add/delete photos (92 photos today).
9. **⭐ Reviews** — author, role, quote, rating, show/hide (6 today).
10. **🏷 Page Banners** — eyebrow, title, subtitle, image, button for each page banner (/our-story, /news, /careers, etc. — 14 today).
11. **📣 Announcement Banner** — one editable notice (headline + body + on/off) for things like "Special Summer Hours", so seasonal messages no longer need a code change.

Important note on party/rental pricing: the amounts customers are actually charged come from the Shopify products used at checkout. These tabs edit the **displayed marketing copy and prices**, so if a price changes it must be updated in Shopify too — I'll add a short warning line in those two tabs.

## Why a backend step is needed first

Today only Vital Info and Store Hours read live from the database. Everything else is baked into a static content file, so admin edits wouldn't stick. Each area above becomes a real database table, seeded with exactly the content that's on the site right now — nothing visible changes on launch, it just becomes editable.

## Steps

1. **Migration**: create the tables (token_tiers, news_articles, faq_items, job_listings, party_options, rental_packages, homepage_content, homepage_steps, gallery_photos, reviews, page_heroes) plus announcement fields on site_settings. Public read, writes only through the existing admin function.
2. **Seed**: copy the current content from the static file into those tables verbatim, keeping the same IDs and ordering.
3. **Wire up reads**: add the new tables to the live-data list so pages read from the database, with the current static content as automatic fallback if a fetch fails.
4. **Admin tabs**: add the tabs above, grouped into two rows so the tab bar stays readable, each using the existing editor components. FAQ and Gallery get a search/filter box and page/album filter since they have 60 and 92 rows.
5. **Verify**: check each page still renders identically (homepage, /news, /faq, /careers, /gallery, /birthdays, /rental, /our-story) and that an edit in the admin shows up on the site.

## Technical notes

- All new tables in `public` with `sort_order int`, `created_at`/`updated_at`, `set_updated_at` trigger, `GRANT SELECT` to `anon`/`authenticated`, `GRANT ALL` to `service_role`, RLS on with a public-read policy and no client write policy (writes go through the `cms-admin` service role).
- Column sets match the existing TypeScript interfaces in `src/hooks/useCmsContent.ts`, so no component changes are needed — pages already call `useCmsTable`/`useCmsSingle`/`usePageHero`.
- `usePageHero` currently reads the static file only; it will switch to the live `page_heroes` query with static fallback.
- `LIVE_TABLES` in `src/hooks/useCmsContent.ts` gains all new table names.
- Array columns (`features`, `bullet_points`) as `text[]`, edited via the existing `type: 'array'` one-per-line textarea.
- Announcement banner: add `announcement_enabled bool`, `announcement_title text`, `announcement_body text` to `site_settings`, rendered where the current hardcoded "Special Summer Hours" callout lives in `KawaiiVisit.tsx`.
- All new tables are already in the `cms-admin` allow-list except the announcement fields (part of `site_settings`), so no edge function change is required.
- `src/pages/KlawsomeAdmin.tsx` grows; the new tab bodies will be split into `src/components/admin/` editor components to keep files small.
- `src/content/cmsData.ts` stays as the fallback snapshot.

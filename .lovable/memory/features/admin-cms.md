---
name: Admin CMS tabs
description: /klawsome-admin edits live DB content for tokens, news, FAQ, careers, packages, homepage, gallery, reviews, banners, announcement
type: feature
---
Content is hybrid: tables in `LIVE_TABLES` (src/hooks/useCmsContent.ts) read from the database, with src/content/cmsData.ts as fallback when the table is empty.

Live tables: site_settings, store_hours, token_tiers, news_articles, faq_items, job_listings, party_options, rental_packages, homepage_content, homepage_steps, gallery_photos, reviews, page_heroes.

Admin tabs are defined once in src/components/admin/ContentTabs.tsx using shared SingleRowEditor / MultiRowEditor from src/components/admin/CmsEditors.tsx — add new sections there, and to cms-admin's TABLES_ALLOWED.

Party/rental prices in admin are display copy only; actual charges come from Shopify variants.

Homepage announcement banner (site_settings.announcement_enabled/title/body) renders under the Hours block in KawaiiVisit; currently holds the special summer hours notice.

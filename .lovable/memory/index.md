# Project Memory

## Core
Kawaii Sanrio theme. Pastel palette with pink/lavender/sky/mint/peach tokens.
Quicksand headings, Nunito body. Prismic CMS + Square payments (sandbox).
Square App ID: sandbox-sq0idb-odBIf_MpySp0OxgocdsyEw

## Memories
- [Square integration](mem://features/square) — Sandbox env, catalog edge function, access token stored as secret
- [Acuity integration](mem://features/acuity) — Scheduling API, availability edge function, calendar UI
- [Design tokens](mem://design/kawaii-tokens) — Pastel color system, kawaii animations, rounded borders
- [CMS system](mem://features/cms) — Custom CMS replacing Prismic, all content in DB, edited via /klawsome-admin
- [CMS content sync](mem://constraint/cms-content-sync) — When changing site content, always update DB record too
- [New sections constraint](mem://constraint/new-sections-cms) — New content sections must have DB table + cms-admin + Command Center tab
- [Page builder](mem://features/page-builder) — Dynamic page_sections table controls layout, custom_blocks for freeform sections, site-images bucket

# Project Memory

## Core
Kawaii Sanrio theme. Pastel palette with pink/lavender/sky/mint/peach tokens.
Quicksand headings, Nunito body. Square payments (sandbox).
Square App ID: sandbox-sq0idb-odBIf_MpySp0OxgocdsyEw
DB is single source of truth for all site content. Never change content only in code — update DB too.
New sections must always get a CMS table + Command Center tab + frontend hook connection.

## Memories
- [Square integration](mem://features/square) — Sandbox env, catalog edge function, access token stored as secret
- [Acuity integration](mem://features/acuity) — Scheduling API, availability edge function, calendar UI
- [Design tokens](mem://design/kawaii-tokens) — Pastel color system, kawaii animations, rounded borders
- [CMS Command Center](mem://features/cms) — Self-hosted CMS at /klawsome-admin, 14 content tables, all components connected
- [CMS content sync](mem://constraint/cms-content-sync) — Never change site content only in code; always update DB record too
- [New sections → CMS](mem://constraint/new-sections-cms) — New content sections must get DB table + admin tab + frontend hook
- [Card grid alignment](mem://design/card-grid-alignment) — Grid alignment rules for card layouts
- [Admin CMS tabs](mem://features/admin-cms) — Live DB-backed content tabs in /klawsome-admin, hybrid fallback to cmsData.ts

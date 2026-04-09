# Project Memory

## Core
Kawaii Sanrio theme. Pastel palette with pink/lavender/sky/mint/peach tokens.
Quicksand headings, Nunito body. Square payments (sandbox).
Square App ID: sandbox-sq0idb-odBIf_MpySp0OxgocdsyEw
DB is single source of truth for all site content. Never change content only in code — update DB too.

## Memories
- [Square integration](mem://features/square) — Sandbox env, catalog edge function, access token stored as secret
- [Acuity integration](mem://features/acuity) — Scheduling API, availability edge function, calendar UI
- [Design tokens](mem://design/kawaii-tokens) — Pastel color system, kawaii animations, rounded borders
- [CMS Command Center](mem://features/cms) — Self-hosted CMS at /klawsome-admin, 14 content tables, useCmsTable/useCmsSingle hooks
- [CMS content sync](mem://constraint/cms-content-sync) — Never change site content only in code; always update DB record too

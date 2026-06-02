## Changes

### 1. Delete Info Hub
- Remove `/info-hub` route and the `InfoHub` lazy import from `src/App.tsx`.
- Delete `src/pages/InfoHub.tsx`.
- Remove the `info-hub` entries from CMS data in `src/content/cmsData.ts` (page hero + any `page_sections` rows keyed to `info-hub`).
- Remove the Info Hub link from the More menu in `src/components/KawaiiNav.tsx`.
- Remove `/info-hub` from `public/sitemap.xml` if present.

### 2. Hero headline text
- In `src/content/cmsData.ts`, change `hero_headline` from `"Welcome to Novi's Own Klaw Arcade"` to `"Welcome to Michigan's First Klawcade!"`.

### 3. Reorganize "More" menu into grouped sub-categories
Restructure the More dropdown in `src/components/KawaiiNav.tsx` from a flat list into 4 grouped columns, each with a non-clickable group label and the links beneath:

- **Connect** — Partner with Klawsome (`/partner-with-klawsome`), Community Partners (`/community-partners`)
- **Purchase** — Store (`/store`), Gift Cards (Square link), Rewards (`/rewards`)
- **Remember** — Our Story (`/our-story`), News (`/news`), Gallery (`/gallery`)
- **Learn** — Claw Machine Tips (`/claw-machine-tips`), FAQ (`/faq`)

Implementation details:
- Replace the flat `moreLinks` array with a `moreGroups` array of `{ heading, links: [{label, href}] }`.
- Render the dropdown as a wider panel (e.g. `min-w-[640px]`) with a 4-column grid on desktop; each column shows the heading in small uppercase muted text, followed by the links styled like today's items.
- Mobile menu: render each group as a labeled section (heading + stacked links), replacing today's single "More" block.
- Keep existing hover/click/navigation behavior (`handleNav`, including external Square gift card link opening in a new tab).

### 4. Top-level nav cleanup
Since Gift Cards now lives under Purchase, decide whether to keep it in the top-level `navLinks`. Recommended: remove `GIFT CARDS` from the top bar to avoid duplication, keeping HOME, BIRTHDAYS, CLAW GAME, CAREERS plus MORE and BOOK EVENT. If you'd rather keep it in both places, say so and I'll leave it.

## Notes
- No backend or data-model changes; CMS content is static in `cmsData.ts`.
- No new dependencies.

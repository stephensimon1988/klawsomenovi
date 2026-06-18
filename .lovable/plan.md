# Plan

## 1. Group Vaporeon (and the rest of the Eevee evolutions) in /store

Vaporeon is currently floating away from the other Eeveelutions because Shopify's `BEST_SELLING` sort (used for the default "Most Popular" tab) just orders by sales — Vaporeon happens to land much lower than its siblings.

Fix it on the client without touching Shopify:

- In `src/components/shopify/Storefront.tsx`, after `fetchProducts` returns, apply a stable post-sort that detects any Eevee-family product (matches `/eevee|vaporeon|jolteon|flareon|espeon|umbreon|leafeon|glaceon|sylveon/i` against title + tags) and moves them into one consecutive block, anchored at the position of the first Eeveelution in the original list. Non-Eevee products keep their relative order.
- Within the Eevee block, sort by a fixed canonical order (Eevee first, then Vaporeon, Jolteon, Flareon, Espeon, Umbreon, Leafeon, Glaceon, Sylveon) so Vaporeon always sits next to its siblings regardless of which sort tab is active.
- Update the `pokemon` category matcher in `src/lib/shopify.ts` to include `vaporeon`, `jolteon`, `espeon`, `umbreon`, `leafeon`, `sylveon` (only `eevee`, `glaceon`, `flareon` are listed today) so the Pokémon category filter also catches Vaporeon.

No Shopify product mutations required.

## 2. Unify every stroked heading to the "Celebrate at Klawsome" format

The `/birthdays` hero h1 uses `ds-stroke ds-stroke--h1 ds-stroke--navy` — navy fill, yellow inner ring, red outer ring. Today other pages mix `ds-stroke--red` and `ds-stroke--yellow`. Convert all of them to `--navy` for visual consistency. Stroke size class (`--h1` vs default h2 vs `--h3`) stays the same on each element.

Files to update (every `ds-stroke--red` and `ds-stroke--yellow` → `ds-stroke--navy`):

- `src/components/KawaiiHero.tsx` (home page h1)
- `src/components/KawaiiNews.tsx`
- `src/components/KawaiiGiftCards.tsx`
- `src/components/KawaiiReviews.tsx`
- `src/components/KawaiiTokenPrices.tsx`
- `src/components/FloatingContactWidget.tsx` (the floating "We'd love to hear from you" chip — keep as navy too)
- `src/pages/Rewards.tsx` (hero h1 + the two non-navy h2s)
- `src/pages/CommunityPartners.tsx`
- `src/pages/Rental.tsx`
- `src/pages/OurStory.tsx`
- `src/pages/ClawMachineTips.tsx`
- `src/pages/BusinessDevelopment.tsx`

Pages already using `--navy` (KawaiiAbout, KawaiiVisit, KawaiiStory, DynamicSections, Gallery, Index scheduling section, PageHero) need no change.

## Out of scope

- No Shopify product/variant edits.
- No changes to the underlying stroke CSS tokens in `src/index.css` — only the variant class on each heading.
- No layout, font-size, or spacing changes; just the color variant swap and the storefront grouping logic.

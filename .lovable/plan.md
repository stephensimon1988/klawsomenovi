## Goal

In `PageHero.tsx`, the row of jump-link pills currently rendered inside the hero (above "Join Rewards Today") will be replaced with the same 3 CTAs on every page:

1. **Book Now** — opens the global Acuity booking modal (`openBookingModal()` from `BookNowDialog`)
2. **Buy Gift Card** — links to `https://app.squareup.com/gift/ML1R35ZH9VKRW/order` (new tab)
3. **Buy Plushies** — links to `/store`

These are the same destinations already used elsewhere in the site (top nav + `KawaiiGiftCards` section), so behavior stays consistent.

The sticky **yellow sub-nav** that slides in on scroll (the second `<nav>` block in `PageHero.tsx`) keeps its current behavior — it continues to render the per-page `jumpLinks` prop (FAQ, Waiver, Gallery, etc.) as in-page anchors.

## Changes

**File: `src/components/PageHero.tsx`**

- Remove the in-hero `<nav aria-label="Jump to section">` block (currently rendered when `links.length > 0`).
- In its place, render a fixed 3-button CTA row, always shown, regardless of `jumpLinks`:
  - Book Now → `<button onClick={openBookingModal}>`
  - Buy Gift Card → `<a href="https://app.squareup.com/gift/ML1R35ZH9VKRW/order" target="_blank" rel="noopener noreferrer">`
  - Buy Plushies → `<Link to="/store">`
- Reuse the existing `linkBtnClass` styling so the pills match the current look (kawaii-navy bg, yellow hover lift).
- Respect `align === 'center'` for justification.
- Keep the sticky yellow sub-nav (`fixed top-20 ...`) untouched — it still iterates `links` for in-page anchors.
- Add `import { openBookingModal } from './BookNowDialog'`.

No changes to any other file. The `jumpLinks` prop continues to drive only the sticky yellow nav.

## Out of scope

- Top site nav (`KawaiiNav.tsx`) — unchanged.
- Per-page `jumpLinks={...}` definitions — unchanged.

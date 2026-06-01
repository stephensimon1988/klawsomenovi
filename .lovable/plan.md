## Changes

### 1. Rename "Book Now" → "Book Event" site-wide
Update label text in:
- `src/components/KawaiiHero.tsx` (hero CTA)
- `src/components/KawaiiNav.tsx` (desktop + mobile nav buttons, 2 spots — keep `BOOK EVENT` uppercase)
- `src/components/KawaiiStory.tsx` (story CTA, uppercase)
- `src/components/PageHero.tsx` (shared page hero CTA)
- `src/pages/Rental.tsx` (2 spots)
- `src/content/cmsData.ts` (`cta_text` value)

Aria-labels / `open-booking` event handlers stay unchanged.

### 2. Recolor primary CTAs from navy → klawsome red, keep yellow hover
Scope = the navy pill CTAs only (Book Event, Buy Gift Card, Buy Plushies, nav Book Event, jump-link pills, story CTA, PageHero CTA, Rental CTAs). Form/dialog/utility/admin buttons untouched.

Swap on each button's className:
- `bg-klawsome-navy` → `bg-klawsome-red`
- `border-klawsome-navy` → `border-klawsome-red`
- `text-white` stays
- Hover (`hover:bg-klawsome-yellow hover:text-klawsome-navy hover:border-klawsome-yellow` + yellow glow shadow) stays as-is

Files touched for color:
- `src/components/KawaiiHero.tsx` (3 hero CTAs + sticky jump-link pills)
- `src/components/KawaiiNav.tsx` (Book Event buttons, desktop + mobile)
- `src/components/KawaiiStory.tsx` (story CTA)
- `src/components/PageHero.tsx` (hero CTA + any jump-link pills using the same navy pattern)
- `src/pages/Rental.tsx` (2 Book Event CTAs)

### 3. Verify
- Grep for remaining `Book Now` / `bg-klawsome-navy` on CTA buttons to confirm none missed.
- Visual check of `/` hero, nav, and `/rental` in preview.

## Out of scope
- shadcn `<Button>` default variant, dialog/form/admin buttons, footer links, Storefront/cart buttons — left as-is per "only primary CTAs".
- No token changes in `index.css` / `tailwind.config.ts`.

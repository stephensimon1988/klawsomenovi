## Goal

1. Standardize the pill-shaped CTA buttons used in headers/heroes (like "Book a Birthday Party" / "Reserve") into a single reusable size so padding is consistent everywhere.
2. On the homepage hero, replace the lone "Reserve" button with a row of buttons — one per page section — that smooth-scrolls to that section.

## Part 1 — Shared header button size

Right now each hero/header re-declares `rounded-full px-10 py-6 text-sm font-heading font-bold tracking-wider uppercase` inline. We'll move that into the existing `Button` component as a new size variant.

**Implementation**
- In `src/components/ui/button.tsx`, add a new size to `buttonVariants`:
  - `hero: "h-auto rounded-full px-8 py-3.5 text-sm font-heading font-bold tracking-wider uppercase"`
  - Padding values tuned to match the screenshot (equal-feel top/bottom and left/right, pill shape).
- Optionally add two visual variants reused in headers:
  - `variant: "heroSolid"` → solid primary pink
  - `variant: "heroGhost"` → translucent white glass (`bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20`)
- Refactor existing call sites to use `<Button size="hero" variant="heroSolid">…`:
  - `KawaiiHero.tsx` (Play / Reserve)
  - `Birthdays.tsx` hero ("Book a Birthday Party" / "Reserve")
  - Any other page hero pair (Rental, Careers, etc.) using the same pattern

Result: one place controls header-button sizing across the whole site.

## Part 2 — Homepage hero "jump buttons"

Replace the single "Reserve" button in `KawaiiHero` with a row of buttons that scroll to each top-level section on `/`. Keep the primary "Play" CTA as-is on the left.

**Sections to expose** (matching `Index.tsx` order):
About · Visit · Tokens · Reviews · News · Gift Cards · Story · Book

Each section already has (or will get) a stable `id` so `scrollIntoView` works. We'll audit and add missing IDs (`about`, `visit`, `reviews`, `news`, `gift-cards`, `story`) on the corresponding components.

**Layout**
- Primary "Play" button stays prominent (solid pink).
- A horizontal, wrap-friendly row of ghost pill buttons (the new `heroGhost` variant) sits beside/under it.
- On mobile they wrap to two rows; on desktop one line.

### What to call them

A few options — pick one and I'll use it everywhere (component name, aria-label, internal docs):

- **Jump Links** — clearest, common UI term for in-page anchors
- **Quick Links** — friendly, marketing-y
- **Section Pills** — describes the shape
- **Explore Buttons / "Explore the Arcade"** — on-brand kawaii framing
- **Hero Chips** — if we want to lean shape-first

My recommendation: **Jump Links**, presented under a small "Explore" eyebrow label above the row.

## Files touched

- `src/components/ui/button.tsx` — new `hero` size + optional `heroSolid` / `heroGhost` variants
- `src/components/KawaiiHero.tsx` — swap Reserve for jump-link row; use new size
- `src/pages/Birthdays.tsx` — adopt new size on the two hero buttons
- Section components missing IDs (`KawaiiAbout`, `KawaiiVisit`, `KawaiiReviews`, `KawaiiNews`, `KawaiiGiftCards`, `KawaiiStory`) — add `id="…"` to their root `<section>`
- (Optional) other page heroes that share the pill pattern, swept to use `size="hero"`

## Out of scope

- No changes to nav bar `BOOK NOW` button styling unless you also want it unified (happy to include).
- No new data, no CMS changes — section labels are static for now.
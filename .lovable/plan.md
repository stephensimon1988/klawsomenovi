## Goal
Make the CartDrawer button visible in the header bar on mobile and tablet (currently only shown on desktop and inside the open hamburger menu).

## Change
**File:** `src/components/KawaiiNav.tsx`

In the top header row (around the hamburger button), add a `<CartDrawer />` rendered only on `md:hidden`, placed immediately to the left of the hamburger menu button. Wrap them in a small flex container with a gap so they sit side-by-side.

Also remove the duplicate `<CartDrawer />` currently rendered inside the open mobile menu dropdown (it's redundant once the header has its own).

## Out of scope
- Desktop header (already has the cart button — unchanged)
- Cart drawer contents, styling, or logic
- Product card "Add to Cart" buttons

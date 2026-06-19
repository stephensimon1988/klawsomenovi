Consolidate "Buy Gift Card" and "Buy Plushies" buttons into a single "Store" button on every hero header.

## Files to change

### 1. `src/components/KawaiiHero.tsx` (homepage hero)
Lines 120-133 currently contain:
- An `<a>` button linking to Square gift card page labeled "Buy Gift Card"
- A `<Link>` button linking to `/store` labeled "Buy Plushies"

Replace both with a single `<Link to="/store">` button labeled "Store".

### 2. `src/components/PageHero.tsx` (reusable page hero for all subpages)
Lines 96-106 currently contain:
- An `<a>` button linking to Square gift card page labeled "Buy Gift Card"
- A `<Link>` button linking to `/store` labeled "Buy Plushies"

Replace both with a single `<Link to="/store">` button labeled "Store".

These are the only two hero/header components in the codebase containing these dual CTA buttons. After this change, every page using either hero will show one unified "Store" button.
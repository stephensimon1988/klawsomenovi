## Show picked variant image in cart + move cart button to top nav

### 1. Cart drawer shows the selected variant's image
File: `src/components/shopify/CartDrawer.tsx`

- For each cart line, look up the variant in `item.product.node.variants.edges` matching `item.variantId` and use `variant.image.url` for the thumbnail.
- Fallback chain: variant image → first product image → placeholder.
- No changes to `cartStore` / `CartItem` shape; the data already lives on `item.product`.

### 2. Move cart button into the top nav, right of BOOK EVENT
Files: `src/components/KawaiiNav.tsx`, `src/components/shopify/Storefront.tsx`

- Import `CartDrawer` in `KawaiiNav` and render it inside the desktop link cluster, immediately after the `BOOK EVENT` button (so the order reads `… MORE  BOOK EVENT  🛒`).
- Add it to the mobile menu panel as well, below the mobile `BOOK EVENT` button, so mobile users still have access.
- Remove the `<CartDrawer />` instance currently rendered inside `Storefront.tsx` (and the now-unused import) so the cart only appears once, in the nav.
- No styling changes to the cart button itself beyond what's needed to sit nicely next to the red BOOK EVENT pill.

### Out of scope
- Cart store, Shopify queries, variant selection logic on product cards, and the QuickAddModal stay untouched.

## Quick-Add Glassmorphic Product Modal

Add a click-to-open quick-add modal for every product card on `/store`. The modal shows a full image gallery, description, variation pickers, quantity, and add-to-cart — without leaving the store page.

### Behavior

- Clicking anywhere on a product card (except inside the existing "Add to cart" button) opens the modal for that product.
- ESC, backdrop click, and a top-right `X` button close it.
- Body scroll is locked while open.

### Visual design

- Backdrop: Klawsome navy (`bg-klawsome-navy`) at ~85% opacity with `backdrop-blur-xl`.
- Sprinkled animated star GIFs (reuse existing `LottieAccent` star/sparkle assets already used in the kawaii theme) positioned absolutely across the backdrop with gentle float/twinkle animations — pointer-events: none.
- Modal panel: glassmorphic — `bg-white/15 backdrop-blur-2xl border border-white/25 rounded-kawaii shadow-2xl`, max-w ~5xl, max-h ~90vh, scrollable inner.
- Close `X` button: top-right, circular, glass style, white icon.
- Pastel accent borders/glows consistent with kawaii tokens.

### Modal content (two-column on desktop, stacked on mobile)

Left — Gallery:
- Large main image with prev/next arrows.
- Thumbnail strip below (all `n.images.edges`).
- Click thumbnail to switch.

Right — Details:
- Title, price (updates with selected variant), category tag.
- Full description (HTML rendered safely from `n.description`).
- Variant option pickers: one row per `n.options` (e.g. Color swatches, Size pills). Selecting options resolves to the matching variant via `selectedOptions`.
- Quantity stepper (− / number / +), min 1.
- "Add to cart" primary button (full width). On success: toast + keep modal open so the user can keep configuring; secondary "View cart" link opens the drawer.
- Sold-out state disables button.

### Size charts (clothing only)

- Show a collapsible "Size chart" link beneath the Size picker **only when** the product has a Size option AND is apparel (detected via `productType` includes "apparel" / "shirt" / tags include `t-shirt`, `tee`, `apparel`).
- For tees (tag/title contains `tee`, `t-shirt`): render the **Gildan adult unisex tee** size chart (researched from Gildan's published spec for styles like 5000/64000):

  | Size | Chest (in) | Body Length (in) |
  |------|------------|------------------|
  | S    | 34–36      | 28               |
  | M    | 38–40      | 29               |
  | L    | 42–44      | 30               |
  | XL   | 46–48      | 31               |
  | 2XL  | 50–52      | 32               |
  | 3XL  | 54–56      | 33               |

  With a "How to measure" note: measure chest under arms, fully relaxed.

- For other apparel: render a generic US apparel size chart (S–XXL with bust/waist/hip ranges in inches).
- Size chart opens in a nested glass sub-panel (or accordion) within the modal.

### Files

- New: `src/components/shopify/QuickAddModal.tsx` — the modal + gallery + variant logic.
- New: `src/components/shopify/SizeChart.tsx` — Gildan tee chart + generic apparel chart, picks which to render based on product.
- Edit: `src/components/shopify/Storefront.tsx` — `ProductCard` becomes clickable; opens modal via local state. Existing "Add to cart" button stays and uses `e.stopPropagation()`.
- Reuse: `useCartStore.addItem`, existing kawaii color tokens, `LottieAccent` for sprinkled stars.

### Technical notes

- Use shadcn `Dialog` as the primitive (already in project) with custom styling overrides for the glass look and to inject the animated star layer inside `DialogOverlay`/`DialogContent`.
- Variant resolution: build a map keyed by sorted `selectedOptions` so changing Color+Size finds the right `variant.id`, `price`, and `availableForSale`.
- Default selection: first available variant.
- Description rendering: Shopify returns plain text in `description`; render with `whitespace-pre-line`. (No HTML field fetched, so no sanitizer needed.)
- Accessibility: focus trap via Dialog, labelled close button, alt text on gallery images.

### Out of scope

- No change to cart/checkout flow.
- No new Shopify fields fetched (existing `PRODUCTS_QUERY` already returns images, variants, options, description).

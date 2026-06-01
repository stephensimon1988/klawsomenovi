## Inline variant gallery on product cards

Move the variation-gallery / variant-picker behavior from the modal onto the product card itself, and restrict modal opening to clicks on the main image only.

### File touched
`src/components/shopify/Storefront.tsx` — `ProductCard` component (the modal stays unchanged; it remains available for "see full details" via image click).

### Behavior changes

1. **Click target shrinks to the image**
   - Today: the entire card opens `QuickAddModal` (`onClick={() => setOpen(true)}` on the outer `div`).
   - New: only the hero image (and an optional small "View details" affordance) opens the modal. The rest of the card — thumbnails, title, price, Add to cart — does not.
   - Remove the `role="button"` / outer keyboard handler from the card root; move them to the image wrapper.

2. **Variant thumbnail strip under the main image**
   - Below the hero image, render a small horizontal row of thumbnails, one per variant that has its own image (fallback: per gallery image, like the modal does).
   - Reuse the same selection styling as the modal (active = navy border + yellow ring) but at card scale (~40–48px, `grid-cols-3` for the plush product, wrap for more).
   - If there's only one variant / only one image, the strip is hidden — card looks the same as today.

3. **Thumbnail click → swap card image + select variant**
   - Local card state: `displayedImageIdx`, `selectedVariantId` (initialized to the first available variant, mirroring the modal's `firstAvailable` logic).
   - Clicking a thumbnail sets both: the displayed image swaps in the card hero, and the matching variant becomes selected. No modal opens.

4. **Add to cart uses the selected variant**
   - `handleAdd` reads from the currently selected variant (not always `variants[0]`).
   - Price label in the card updates to the selected variant's price so the user sees what they're buying.
   - Disabled / "Sold out" label still reflects `availableForSale` for the selected variant.

5. **Modal opening rules**
   - Image click → opens `QuickAddModal`, seeded with the card's currently selected variant (pass `initialVariantId` prop) so the modal opens on the same image/variant the user was browsing.
   - Thumbnail clicks, Add to cart clicks: do not open the modal (`e.stopPropagation()`).

### Small supporting change
`QuickAddModal` gets an optional `initialVariantId?: string` prop. When provided, its `initialOptions` derives from that variant instead of `firstAvailable`. Backward compatible — no other callers pass it.

### Out of scope
- No changes to cart store, Shopify query, or category/sort logic.
- No new product detail page route.
- Modal layout itself unchanged.

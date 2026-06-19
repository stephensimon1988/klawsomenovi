## Changes to `src/components/shopify/Storefront.tsx`

1. **Pin gift cards as the first 2 results only on initial load.**
   - Add an `isGiftCard(p)` helper matching `productType === 'Gift Cards'` or title/tag containing `gift card`.
   - Track an `interacted` flag, flipped to `true` the first time the user changes sort, picks a category, or hits Surprise Me.
   - When `interacted === false` AND `sort === 'most-popular'` (the default) AND no category filter, hoist gift card products to the top. Once the user interacts, products render in normal sort/filter order — gift cards behave like any other product.

2. **Display price as a range for gift cards.**
   - Extend `PRODUCTS_QUERY` in `src/lib/shopify.ts` to also fetch `priceRange.maxVariantPrice { amount currencyCode }` and update the `ShopifyProduct` type.
   - In `ProductCard`, when `isGiftCard(n)` render `$<min> - $<max>` (e.g. `$30 - $250`) using the priceRange. Non-gift-card products keep the current single-price display.

3. **Remove the SKU / short ID line on `/store`.**
   - Delete the `<p>#{n.id.slice(-4)}</p>` line in `ProductCard`.

## Out of scope
- No changes to gift card configurator, cart, checkout, or product detail modal pricing.
- No changes to the Shopify gift card product itself — the displayed range comes from existing variant prices in Shopify. If the cheapest variant is not currently $30, say the word and I'll reprice the variants too.

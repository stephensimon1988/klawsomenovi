## Rule (save to project memory)

For any Shopify product on `/store` that has selectable variations (more than one purchasable variant, ignoring the implicit `Default Title` variant), clicking **Add to cart** on the product card must open the QuickAddModal instead of adding straight to cart. Single-variant products keep the current one-click add behavior. This is a permanent rule — save under `mem://features/store-add-to-cart` and reference from `mem://index.md` Core.

## Change

File: `src/components/shopify/Storefront.tsx` — `ProductCard.handleAdd`

- Compute `hasVariations`: `variants.length > 1` OR any option has more than one value (excluding a sole `Default Title`).
- If `hasVariations` → `setOpen(true)` and return (do not call `addItem`, do not toast).
- Else → existing behavior: `addItem(...)` + success toast.

No changes to `QuickAddModal` (it already requires the user to confirm via its own Add to cart button, so the rule is satisfied end-to-end).

## Goal
Re-enable gift card purchasing, but route users to the existing Square gift card page: `https://app.squareup.com/gift/ML1R35ZH9VKRW/order`.

## Changes

### 1. `src/components/KawaiiGiftCards.tsx` (homepage gift cards section)
Replace the disabled "Temporarily Unavailable" `Button` with an active anchor-style button that opens the Square URL in a new tab.
- Use `content?.cta_url` (falls back to the Square URL) so the CMS-configured link keeps working.
- Restore original button styling (pink pill, hover state) — remove the `disabled`, `aria-disabled`, muted classes.
- Open with `target="_blank"` and `rel="noopener noreferrer"`.

### 2. `src/components/shopify/Storefront.tsx` (store grid)
Change the Add to cart flow for gift-card products only:
- In `ProductCard.handleAdd`, when `isGiftCard(n)` is true, call `window.open('https://app.squareup.com/gift/ML1R35ZH9VKRW/order', '_blank', 'noopener,noreferrer')` instead of adding to the Shopify cart or opening `QuickAddModal`.
- Also short-circuit `openModal` (thumbnail click) for gift cards so clicking the tile also sends them to Square, matching the previous behavior.
- Keep the button label as "Add to cart" (no other visual changes requested).

Non-gift-card products keep the existing Shopify cart flow untouched.

## Out of scope
- No changes to `QuickAddModal`, `CartDrawer`, or the Shopify cart store.
- No CMS/data edits — the Square URL already exists in `cmsData.ts` under `gift_cards_content.cta_url`.

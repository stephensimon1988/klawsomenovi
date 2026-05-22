Make the thumbnail selection stick in the product quick-add modal.

**Problem:** When you click a small thumbnail under the main product image, the main image briefly updates and then snaps back. The variant→image sync effect re-runs on every render and forces the hero back to the current variant's image whenever the clicked thumbnail isn't tied to that variant.

**Fix (single file: `src/components/shopify/QuickAddModal.tsx`):**
- Add a `useRef` that stores the last variant id we synced an image for.
- Change the sync effect so it only updates `imgIdx` when `matchedVariant.id` actually changes (i.e., the user picked a different variant via the option pills), not on every render or thumbnail click.
- Reset the ref when the modal opens, alongside the existing `setImgIdx(0)` reset.

**Result:**
- Clicking a variant option still updates the hero image (unchanged behavior).
- Clicking any thumbnail — variant-linked or not — now stays put.

No other components, styles, or logic change.
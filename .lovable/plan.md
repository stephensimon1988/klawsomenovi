## Add "Filipino Sun Plush" to Shopify

Create a new product in your live Shopify store with the provided images, description, price, and stock.

**Product details**
- Title: Filipino Sun Plush – Klawsome Exclusive
- Price: $29.99
- Inventory: 15 (tracked by Shopify, stop selling at 0)
- Product type: Plushies
- Tags: plush, plushie, filipino, sun, klawsome-exclusive, collectible
- Vendor: Klawsome
- Description: full marketing copy you provided, formatted as HTML with the bullet lists, features, warning, and limited-availability line
- Images: both uploads
  - `user-uploads://sun-plushie.jpg` (primary — front view)
  - `user-uploads://sun-plush-back.jpg` (back / size / softness reference)

**Steps**
1. Copy the two uploaded images into `src/assets/` so they're available to the create tool.
2. Call `shopify--create_product` with the fields above (single default variant, price 29.99, inventory_management: shopify, inventory quantity 15).
3. Verify it appears via `shopify--get_product`, then confirm it shows up on the live storefront on klawsomearcade.com (the Store page pulls from Shopify automatically — no code changes needed).

**Note**: This writes to your live Shopify store and will be visible to customers immediately.
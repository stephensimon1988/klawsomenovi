## Create "Klawsome Crew Plush Collection" product in Shopify

### Product
- **Title:** Klawsome Crew Plush Collection
- **Vendor:** Klawsome
- **Type:** Plush
- **Tags:** plush, mascot, klawsome, collectible
- **Body (HTML):** full description provided, with the three character sections rendered as headings + paragraphs, plus the bullet list of features. Emoji preserved.
- **Image:** uploaded group shot (`user-uploads://image-214.png`) used as the main product image. Shopify variant images for Ami/Vivi/Sylvie aren't separately provided, so the group shot is the only image for now (we can add individual character shots later when you have them).

### Variants (single option: "Character")
| Character | Price | SKU |
|---|---|---|
| Ami the Panda | 26.99 | KLAW-PLUSH-AMI |
| Vivi the Cat | 26.99 | KLAW-PLUSH-VIVI |
| Sylvie the Fox | 26.99 | KLAW-PLUSH-SYLVIE |

All variants: inventory tracked by Shopify, `inventory_policy: deny` (no overselling).

### Storefront
No code changes required — the existing Shopify-backed Store page already pulls products from the Storefront API, so the new product will appear automatically with all 3 character variants selectable on the product detail page.

### Out of scope
- Per-variant solo images (can be added later via update_product_variant once you have them).
- Inventory quantities (left at 0 until you set stock in Shopify admin).

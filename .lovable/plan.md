## Add "Klawsome Kawaii Sun Tee" to Shopify

Create a new t-shirt product with 8 color variants × 5 sizes (40 variants total), and generate front + back mockup images for every color using your navy reference photos.

### Product setup

- **Title:** Klawsome Kawaii Sun Tee
- **Price:** $24.99
- **Vendor:** Klawsome
- **Product type:** Apparel
- **Tags:** apparel, t-shirt, kawaii, filipino, sun, klawsome
- **Inventory tracking:** off (sell freely, no quantity limit)
- **Options:**
  - Color: Royal Blue, Navy, Black, Red, Pink, Cream, Sky Blue, White
  - Size: S, M, L, XL, XXL
- **Variants:** 40 total (8 colors × 5 sizes), all at $24.99
- **Description:** Marketing copy highlighting the kawaii Filipino sun back print, "KLAWSOME!" front chest logo, soft cotton tee, and Klawsome exclusive vibe.

### Image generation (16 images, 2 per color)

For each color, generate one front and one back mockup using AI image editing on your `front.jpg` / `back.jpg` reference, recoloring the shirt while keeping the exact same:
- Model pose, framing, lighting, gray background
- "KLAWSOME!" front chest logo (red letters + yellow outline)
- Kawaii Filipino sun back print (yellow sun on dark navy square)

Navy uses your originals as-is. The other 7 colors will be AI-edited from those references.

Each variant's color will be linked to its matching front image as the variant image, with the back image as a secondary gallery shot.

### Technical details

1. Copy `user-uploads://front.jpg` and `user-uploads://back.jpg` into `src/assets/`.
2. Use `imagegen--edit_image` for each non-navy color: prompt the model to recolor only the t-shirt fabric to the target color, keep prints unchanged. Save as `src/assets/tee-{color}-front.jpg` and `tee-{color}-back.jpg`.
3. QA all 16 generated images visually before upload (check prints are intact, color is correct, no artifacts).
4. Call `shopify--create_product` with:
   - 2 options (Color, Size)
   - 40 variants, each $24.99, no inventory tracking
   - All 16 images attached
5. Verify with `shopify--get_product`.

### Notes

- This writes to your live Shopify store immediately.
- Image generation is the slowest step (~30–60s per image, so ~10 min total). I'll QA each one before attaching.
- If a generated mockup looks off for any color, I'll regenerate before publishing.

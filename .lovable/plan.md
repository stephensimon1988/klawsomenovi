# Show full gift card images (no cropping)

## Problem
Gift card images render with `ds-img-thumb` which applies `object-cover` + `aspect-square`, cropping the edges of the square card art.

## Where gift cards appear
After scanning the site, gift card images are only rendered in **one place**:
- `src/components/KawaiiGiftCards.tsx` — the homepage "Gift Cards" section grid (and same component is reused anywhere `KawaiiGiftCards` is mounted; currently only `Index.tsx`).

The Prismic-managed table `gift_card_images` and the `KlawsomeAdmin` editor are data sources, not display surfaces.

## Fix
In `src/components/KawaiiGiftCards.tsx`, swap `ds-img-thumb` for classes that show the whole image:
- `w-full h-auto object-contain` (keeps native aspect ratio, full width, no crop)
- Keep `rounded-2xl` and lazy loading
- Remove the forced `aspect-square` so tall/short variants also render fully

I'll leave `ds-img-thumb` untouched globally (Gallery still wants cropped thumbnails).

## Files to edit
- `src/components/KawaiiGiftCards.tsx`
## Partner with Klawsome — layout + divider fixes

All edits in `src/pages/BusinessDevelopment.tsx`.

### 1. Contact section — two-column intro

Current: image banner above, centered intro below, form below that.

New: top row is a 2-column grid (`grid md:grid-cols-2 gap-10 items-center mb-10`):
- Left column: eyebrow + title + subtitle (left-aligned instead of centered).
- Right column: the existing `contactPhotoAsset` image, taller (`h-72 md:h-full max-h-[420px]`), rounded, same `img-hover` wrapper.

Form stays full-width below in the same `max-w-3xl` container — no change to fields or submit logic.

### 2. "Getting Started is Easy" — 4 columns with Gallery photos

- Change the inner grid from `md:grid-cols-[1fr_320px]` two-zone layout to a single `grid grid-cols-2 md:grid-cols-4 gap-7` block (drop the right-side `processPhotoAsset` image — it doesn't fit the 4-col rhythm).
- Pull the first 4 photos from the CMS `gallery_photos` table via `useCmsTable<GalleryPhoto>('gallery_photos')`, sorted by `sort_order`.
- For each of the 4 `howSteps`, replace the numbered circle with a square photo (`aspect-square object-cover rounded-2xl` inside an `img-hover` wrapper) using `galleryPhotos[index].image_url`. Title + description stay below.
- Fallback: if fewer than 4 gallery photos are available, fall back to the numbered circle for that slot so the page never breaks.

### 3. Remove duplicate divider before footer

The page currently renders two stacked dividers between Contact and Footer:
1. Page-level `<KawaiiDivider cloud baby-blue → baby-pink stroke=white />` (line 551).
2. Footer's auto-divider `<KawaiiDivider scallop baby-pink → baby-blue />` (KawaiiFooter renders this when `prevColor !== 'baby-blue'`).

Fix:
- Delete the page-level KawaiiDivider at line 551.
- Change the Contact section background from `bg-[hsl(var(--klawsome-baby-blue))]` to `bg-[hsl(var(--klawsome-baby-pink))]` so it matches the footer's auto divider's `from="baby-pink"` per the divider color rule (from/to must match adjacent section bg).
- Keep `<KawaiiFooter prevColor="baby-pink" />` as-is.
- Update the divider directly above Contact (line 479) from `petals white → baby-blue` to `petals white → baby-pink` so the "to" side matches the new Contact background.

### Out of scope
- No CMS schema changes, no new uploads.
- Hero, Hosted, Partner, Plushie sections untouched.
- `processPhotoAsset.json` stays in the repo for now (can clean up later).

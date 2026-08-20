# Images on the "Book with Klawsome" cards

## What changes

Every selection card in the booking popup becomes an image-on-top card: a 3:2 landscape photo fills the top edge-to-edge, with the title, description and price stacked below it.

### 1. Booking type cards (first step)
- Klawsome Private Party — private party photo (kids at a claw machine in-store)
- Semi-Private Party — in-store party table / plush machine photo
- Rent a Klaw Machine — machine delivered/being played at a venue
- Book Klawsome Mobile — mobile arcade setup at an outdoor/community event

### 2. Package cards
- Rental: 1-Hour Party Package and 2-Hour Extended Party each get a rental photo
- Klawsome Mobile tiers (Token Pre-Buy, Unlimited Play, Reserve Arcade) each get a photo matching the vibe of that tier

Cards keep their current selected/hover states, price emphasis and click behavior — only the layout gains an image block.

### Image sourcing
Existing project photos are used wherever a good match exists (private-party photos, rental photos, community-event photos already in the gallery/assets). Where no suitable photo exists for a card, a kawaii illustration in the site's style is generated so all cards look consistent. Nothing is stretched: images are cropped to fill a fixed 3:2 box.

## Technical notes

- Edit `src/components/booking/BookingWizard.tsx` only (`PathwayStep`, `PackageStep`, `MobileTierStep`), plus an image map added alongside the card definitions.
- Image block: `aspect-[3/2] w-full overflow-hidden rounded-t-2xl` with `object-cover`; card body gets `p-5` below it and the card wrapper switches to `overflow-hidden flex flex-col` so the image sits flush at the top.
- Images are `loading="lazy"` with descriptive alt text.
- Grids stay as-is (2–3 columns desktop, 1 column mobile) so nothing overflows at 390px.
- No booking logic, pricing, catalog or backend changes.

## Open item
Add-on cards (decor, XL plushie, photographer, extra hour, etc.) are left text-only in this pass since they're compact multi-select rows; say the word and they get thumbnails too.

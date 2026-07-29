## Goal
Make all text inside the event booking pop-ups (the "Book with Klawsome" wizard) render at roughly double its current size, without affecting any other dialogs or pages.

## Approach
1. Add a scoped class (e.g. `booking-dialog`) to the booking wizard's `DialogContent` in `src/components/booking/BookingWizard.tsx`.
2. In `src/index.css`, add one scoped CSS block that doubles the font size of the text utilities used inside that container:
   - `.booking-dialog` base font-size doubled
   - overrides for `.text-xs`, `.text-sm`, `.text-base`, `.text-lg`, `.text-xl`, `.text-2xl`, `.text-3xl` and their line-heights inside `.booking-dialog`
   - dialog title/description sizes doubled too
3. Nudge layout so the larger text still fits: the pop-up already spans 75% width / 90% height, so the main adjustment is allowing content to wrap and keeping the sticky footer (Back / Estimated total / Next) readable and on one row on desktop, stacking on mobile.

## Scope
Applies to every step of the booking wizard (pathway, package/tier, date & time, add-ons, delivery ZIP, contact details, review, redirect) since they all render inside the same dialog. No pricing, cart, or backend logic changes.

## Verification
Open the booking pop-up in the preview across a couple of steps at desktop and mobile widths and confirm the text is doubled, nothing overflows or clips, and other dialogs on the site (cart drawer, quick add, job descriptions) are unchanged.

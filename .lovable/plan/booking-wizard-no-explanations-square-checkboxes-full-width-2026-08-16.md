# Booking wizard: no explanations, square checkboxes, full-width desktop layout

## 1. Remove all "why" copy from the mobile booking flow

Every helper line that explains a qualifier, an exception, or a reason goes away. Questions and results stay, justifications don't.

Removed / rewritten:
- Under "Is your event fully indoors?" — drop "Indoor venues are always eligible, no matter the ZIP code."
- Under "Will attendance be over 200 people?" — drop "Large, staffed events qualify for an automatic exception."
- Drop the "Indoor event / Event over 200 guests — service-area restrictions don't apply" confirmation line.
- Restricted-ZIP panel: no mention of areas, neighborhoods, cities, ZIP risk, or security. It becomes a neutral logistics line only: "Let's confirm this booking over the phone." plus the phone button and hours. Approval-request panel keeps only "Request approval" + fields; the notes label becomes "Notes (optional)".
- Pending panel: keep "Waiting on approval — request #X. Call us and mention your request number." Drop the unlock explanation.
- Denied panel: keep "Request #X wasn't approved. Please give us a call." Drop any suggested alternative.
- Out-of-range / not-found panel: single neutral line — "Please call us to confirm delivery for this ZIP before checking out." No mileage-range or auto-quote reasoning.
- The gates keep a plain "Answer both questions above to continue."
- Nothing customer-facing ever implies a place or its people are risky. All wording stays neutral scheduling/logistics language ("we need to confirm this one by phone"), and the words blocked, restricted, unsafe, dangerous, crime, and security do not appear in customer-facing copy. The same neutral phrasing applies to the two gate questions, which are asked of every mobile booking regardless of ZIP.

Pricing facts (miles, surcharge, free-delivery threshold) are not explanations and stay as-is.

## 2. Checkboxes render as true squares

The shared checkbox can get squeezed in flex rows and by the booking dialog's larger font scale. It gets `aspect-square`, a fixed min width/height, and `self-start` so it always renders square and never stretches. Applies everywhere checkboxes are used, including the safety-policy checkbox at review/checkout.

## 3. Desktop layout: full-width sections per step

Right now every step body is capped narrow (`max-w-md` on the delivery step), leaving a big empty right side in the wide modal.

- Step bodies fill the dialog width on desktop with comfortable centered max-width only on very wide screens.
- Delivery step becomes a two-column desktop layout: gate questions + ZIP input on the left, the result / call-us / approval panel on the right; single column on mobile.
- Package, add-ons, and review grids widen to 2–3 columns on desktop instead of staying in a narrow column.
- Contact step stays a 2-column grid but spans the full width.
- Consistent vertical rhythm and section padding so each step reads as full-width bands.

## Technical notes

- `src/components/booking/BookingWizard.tsx`: strip `help` text passed to `GateToggle` (and drop the prop if unused), remove the explanation paragraphs listed above, replace `max-w-md` with a responsive full-width wrapper, add `lg:grid-cols-2` to the delivery step, widen the package/add-on/review grids.
- `src/components/ui/checkbox.tsx`: add `aspect-square min-h-[1.15rem] min-w-[1.15rem] self-start` alongside existing sizing.
- No backend, pricing, or approval-logic changes.

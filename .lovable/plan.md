## Booking feedback — remaining work (Simon confirmed)

Simon confirmed both rental packages include: our 40 plushies OR your product (5–10 in, 0–5 lb).

### 1. Extend Klawsome Mobile blackout to Aug 24, 2026
Insert blackout rows in `event_blackout_dates` for `event_type='mobile'`, dates `2026-08-16` through `2026-08-23`, reason `"Launch blackout — Klawsome Mobile opens Aug 24, 2026"`. Update any existing mobile blackout rows before Aug 24 to use the same reason. First bookable mobile date becomes Aug 24, 2026.

### 2. Hero copy: "Book Your Visit" → "Book an Event with Klawsome"
- `src/pages/Index.tsx` line 36: change scheduling section eyebrow and the h2 to event-focused copy.
- `src/content/cmsData.ts` lines 2786 & 4792: update the scheduling section label and heading block to "Book an Event with Klawsome".

### 3. Tighten rental package copy — `src/lib/booking/catalog.ts`
- 1-hr package description: "40 regular-size plushies (based on availability) OR your supplied product (5–10 in, 0–5 lb)."
- 2-hr package description: same wording for consistency.

### 4. Availability disclaimer in booking wizard
`src/components/booking/BookingWizard.tsx` PackageStep: add italic footnote "*Plushie selection subject to stock." under the rental/mobile package list.

### Not touching (already done)
Flow order, multi-add-on selection, delivery pricing, comparison-table decor tiers, attendant copy.

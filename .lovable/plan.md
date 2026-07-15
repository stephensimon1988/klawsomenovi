## Automated delivery mileage — prepaid, offline ZCTA lookup

Replace the hand-curated `zipMiles.ts` table with a full US ZIP coverage system using the free US Census ZCTA centroid dataset. Every quote is calculated instantly, added to the cart, and paid upfront at Shopify checkout. No post-order invoicing.

---

### How mileage is calculated

- Bundle the **US Census ZCTA centroid dataset** (~33k ZIPs, lat/lng each, ~1MB gzipped JSON) as a static asset the frontend loads once and caches.
- Origin fixed at Klawsome Novi (`48377`, lat/lng hardcoded).
- On ZIP entry: haversine distance from origin → destination centroid, multiplied by **1.3 road-factor** to approximate driving miles.
- Round up to the next whole mile before pricing (matches current `deliveryLine` behavior).
- Result is instant, offline, zero API cost, zero secrets.

### Pricing rules (unchanged)

- ≤ 20 miles → free delivery.
- > 20 miles → `(miles − 20) × $3` added as the existing `DELIVERY_SURCHARGE_VARIANT` line in the Shopify cart. Paid upfront at checkout. No later billing, ever.

### Service-area cap → "call to confirm"

Anything the system can't confidently auto-quote must route the customer to a phone call **before** they can proceed to checkout:

- **Over the cap (default 60 mi road-miles)** — too far to auto-quote confidently.
- **ZIP not found in the ZCTA dataset** (rare: PO-box-only ZIPs, brand-new ZIPs).
- **Invalid / non-5-digit input** — existing inline validation.

For the first two cases, replace the current "email events@" red box with a **call-to-confirm gate**:

> **Let's confirm this one over the phone.**
> Your ZIP is about **{miles} mi** away, which is outside our standard auto-quote range. Please call **(248) XXX-XXXX** during business hours (**{today's hours from `store_hours`}**) so we can confirm the exact distance and delivery total before you check out.
>
> [ Call now ] (tel: link, mobile-first)

The **Next** button stays disabled in this state — the customer cannot proceed to Shopify checkout until they either enter a ZIP inside the auto-quote range, or a staff member (over the phone) directs them to a specific bookable ZIP / manually overrides. This enforces the prepaid rule: Shopify only ever sees a cart with the correct, staff-confirmed total.

Business hours come from the existing `store_hours` table so the modal always shows today's real hours (or "We're closed right now — call tomorrow after {open_time}" outside hours).

### Phone number source

Pull the business phone from `site_settings` (or add a `booking_phone` row if not present) so ownership can change it without a code edit.

---

### Files touched

- **New:** `src/lib/booking/zctaCentroids.json` (bundled dataset, lazy-imported so it doesn't bloat initial page load) + `src/lib/booking/distance.ts` (haversine + road-factor helpers).
- **Replaced:** `src/lib/booking/zipMiles.ts` — same `getMilesForZip(zip)` signature but backed by ZCTA lookup; returns `{ known: true, miles }`, `{ known: false, reason: 'not_found' | 'out_of_range', miles?: number }`.
- **Updated:** `src/components/booking/BookingWizard.tsx` delivery step — new "call to confirm" panel, disabled Next when unresolved, `tel:` link, today's hours from `store_hours` hook.
- **Config:** add `SERVICE_AREA_CAP_MILES = 60` and `ROAD_FACTOR = 1.3` alongside existing `FREE_DELIVERY_MILES` in `catalog.ts`.

### Not building

- No edge function.
- No Google Maps key.
- No post-checkout invoicing, draft orders, or admin "bill overage" UI. Everything is prepaid at the initial Shopify checkout.

### Technical notes

- ZCTA JSON is fetched with a dynamic `import('./zctaCentroids.json')` inside the ZIP handler, so the ~1MB payload only downloads when a customer actually reaches the delivery step.
- Local top-ZIP fallback (current hardcoded values) is kept in-memory for instant response on the ~80 most common ZIPs, avoiding the JSON load for Novi/Detroit-area customers.
- Haversine formula uses miles directly; road-factor and cap are tunable constants at the top of `distance.ts`.
- The exact phone number and service-area cap should be confirmed before I wire them in.

### Questions

1. **Service-area cap:** 60 road-miles OK, or a different number (50 / 75)?
2. **Phone number** to display on the call-to-confirm panel? (I can pull it from `site_settings` if you tell me which key, or add a new setting.)

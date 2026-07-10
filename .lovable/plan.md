# Custom Booking + Shopify Checkout (replace Acuity)

Replace the Acuity iframe (`BookNowDialog`) with a native multi-step booking wizard that builds a Shopify cart and opens Shopify Checkout. Backed by Lovable Cloud for availability, bookings, and post-payment fulfillment.

## Scope

Three booking pathways, all ending in a Shopify checkout:

- **A. Book an Event** (`/birthdays`) — Private Party, Semi-Private, Rent a Klaw, Book Klawsome Mobile
- **B. Rent a Klaw Machine** (`/rental`) — 1hr / 2hr / add-ons + ZIP-mileage delivery
- **C. Klawsome Mobile** — 1hr / 2hr / all-day, ZIP-mileage delivery, blackout until Aug 15

Acuity iframe (`BookNowDialog`) is retired. All existing `openBookingModal()` call sites open the new wizard, defaulting to the correct pathway per page.

## 1. Shopify products to create

Use `shopify--create_product` (each variant carries the fixed price; the wizard picks the right variant per selection).

**Events**
- Klawsome Private Party — $319 / 1 hr
- Semi-Private Party (Paris Baguette Table) — $250 / 1 hr

**Event add-ons**
- Private Event Decorations — $119
- Small Balloon Decoration — $89 (private only)
- Semi-Private Party Decorations — $89
- Birthday Pal Visit — $89 (variants: Pikachu, Hello Kitty, Kuromi, Bluey — Cinnamoroll excluded per note)
- XL Plushie — $89
- Event Photographer — $79/hr

**Rentals**
- 1-Hour Party Package — $445
- 2-Hour Extended Party — $645
- Extra Hour — $145
- Plushie Refill — $200
- Additional Machine — $245

**Klawsome Mobile** (single product, three variants)
- 1 hour, 2 hour, All-day

**Utility**
- Delivery Surcharge — $3 (cart quantity = extra miles over 20)

Each variant's Shopify ID is stored in a small typed registry (`src/lib/bookingCatalog.ts`) so the wizard can resolve id → variantId at build time. If Shopify variant IDs change, only that file updates.

## 2. Availability system (Lovable Cloud)

New tables (migration):

- **`event_availability`** — one row per event type (`private`, `semi_private`, `rental`, `mobile`), storing weekday open/close hours as JSON (e.g. `{"mon":{"open":"10:00","close":"20:00"},...}`) plus slot length (default 60 min).
- **`event_blackout_dates`** — `(event_type, date, reason)` — admin-managed blackout list. Klawsome Mobile is seeded blacked out through **2026-08-15**.
- **`event_bookings`** — reservation ledger. Written when a Shopify webhook confirms payment. Prevents double-booking via unique `(event_type, start_at)`.

RLS + GRANTs:
- `event_availability` / `event_blackout_dates` — public SELECT, service-role write.
- `event_bookings` — service-role only; no client read.

Admin UI (in existing `KlawsomeAdmin`) gets a **Booking Availability** tab to toggle weekday hours and add/remove blackout dates per event type. This is how staff "block out dates."

## 3. ZIP → miles table

Bundled as static data (`src/lib/zipMiles.ts`) covering MI ZIPs within ~75 mi of the store (pre-computed driving distance). Includes helper `getMilesForZip(zip)` returning `{ miles } | { unknown: true }`.

Wizard logic:
- `miles ≤ 20` → free delivery line
- `miles > 20` → adds Delivery Surcharge variant with `quantity = ceil(miles − 20)`
- unknown ZIP → block checkout, show "We'll quote delivery — contact us"

## 4. Booking wizard component

New `src/components/booking/BookingWizard.tsx` — replaces `BookNowDialog`. Same global event API (`openBookingModal()` dispatches `open-booking`) so all existing buttons keep working, but the dialog now renders the wizard with an optional starting pathway (`private | semi | rental | mobile`).

Wizard steps (conditional per pathway):

1. **Pick pathway** (only shown when opened without a preset) — 4 cards
2. **Pick event type / package** (private vs semi, or 1hr vs 2hr, or mobile duration)
3. **Date & time picker** — shadcn Calendar + generated time-slot chips from `event_availability`, filtered by `event_blackout_dates` and existing `event_bookings`
4. **Add-ons** — filtered per pathway (private-only vs semi-only vs shared; rental extras). Birthday Pal Visit shows character selector; each add-on quantity 0/1.
5. **Delivery ZIP** (rental + mobile only) — ZIP input → live miles/fee display
6. **Contact form** — name, email, phone, party size, celebrant name/age, favorite color/theme/plushies, special requests. Zod-validated.
7. **Review & checkout** — line-item summary, total, "Continue to Payment" button

On submit:
- Save draft to `event_bookings` with `status = 'pending'` and a generated `booking_ref`
- Build Shopify cart via `cartCreate` with:
  - main event/package variant
  - each add-on variant
  - Delivery Surcharge variant with computed qty (rental/mobile only)
  - **cart-level `attributes`**: `booking_ref`, `event_type`, `start_at`, `party_size`, `celebrant`, `character`, `zip`, `miles`, `contact_email`, `contact_phone`, notes
  - **per-line `attributes`**: `start_at`, `character` (for Birthday Pal)
- Open the formatted `checkoutUrl` in a new tab (`window.open(url, '_blank')`)

## 5. Post-payment fulfillment

New edge function **`booking-order-webhook`** (`verify_jwt = false`, signature-verified):

- Registered as a Shopify `orders/paid` webhook (using `SHOPIFY_ACCESS_TOKEN` + `shopify--` tools during setup, verified via `X-Shopify-Hmac-Sha256`).
- Reads cart `note_attributes` on the order, resolves `booking_ref`, flips `event_bookings.status = 'confirmed'`, stores `shopify_order_id`.
- Sends two emails through the existing queued transactional-email system (`send-transactional-email`):
  - **Customer**: booking confirmation with an inline `.ics` calendar invite attachment (generated in the function)
  - **`events@klawsomenovi.com`**: booking details for staff

Two new React Email templates in `supabase/functions/_shared/transactional-email-templates/` + registry entries.

## 6. Page changes

- `src/pages/Birthdays.tsx` — every `openBookingModal()` call passes the correct pathway (private / semi / event picker). "Reserve your time at Klawsome" section on `Index.tsx` also opens the wizard.
- `src/pages/Rental.tsx` — pathway = `rental`. Add copy notes: "Comes with our 40 plushies OR your own product (5–10 in, 0–5 lb)", "40 regular-size plushies, based on availability", "Free delivery within 20 miles; $3/mile beyond 20". (Attendant note intentionally not added yet.)
- New `KawaiiMobile` entry point (button or card, wherever "Book Klawsome Mobile" lives) — wizard opens on `mobile` pathway.
- `Index.tsx` — replace Acuity iframe section with a CTA card that opens the wizard.
- `BookNowDialog` → `BookingWizardDialog` (kept at same import path, same `openBookingModal` API, extended to accept `openBookingModal(pathway?)`).

## 7. Community-outreach copy fixes

Already applied earlier this session per the previous request; no change here.

## Technical details (for developers)

- **New files**
  - `src/components/booking/BookingWizard.tsx`, `steps/*.tsx` (DateTime, AddOns, Delivery, Contact, Review)
  - `src/lib/bookingCatalog.ts` — typed map of Shopify variant IDs + pathway/add-on metadata
  - `src/lib/zipMiles.ts` — prebuilt MI ZIP → miles table + lookup
  - `src/lib/booking/cart.ts` — builds `CartInput` with `attributes` and `lines[].attributes`
  - `src/hooks/useAvailability.ts` — reads `event_availability` + blackouts + confirmed bookings
  - `supabase/functions/booking-order-webhook/index.ts` — HMAC-verified Shopify webhook → booking confirm + emails + ics
  - `supabase/functions/_shared/transactional-email-templates/booking-customer.tsx`, `booking-staff.tsx`
  - Admin: `src/components/admin/BookingAvailabilityEditor.tsx` in `KlawsomeAdmin`
- **Migrations**
  - `event_availability`, `event_blackout_dates`, `event_bookings` (+ GRANTs + RLS + updated_at trigger)
  - Seed Klawsome Mobile blackouts through 2026-08-15
- **Cart**: uses existing `storefrontApiRequest` in `src/lib/shopify.ts`. Booking cart is **separate** from the store cart (`useCartStore`) so mixing plushies with a party booking doesn't collide — booking submits directly to a fresh cart and opens checkout in a new tab.
- **Webhook registration**: performed once via edge function using Shopify Admin API; endpoint is `https://<project>.supabase.co/functions/v1/booking-order-webhook`.
- **Secrets needed**: `SHOPIFY_WEBHOOK_SECRET` (for HMAC verification) — will be requested via `add_secret` once the webhook endpoint exists.
- **Cinnamoroll** is excluded from character variants until stock arrives (per note).
- **Photographer description link**: add-on card supports an optional `descriptionUrl` (opens a modal or new tab) when the URL becomes available.

## Out of scope (explicit)

- Rescheduling / cancellation self-service (staff handles via Shopify + admin panel for now)
- Discount codes in the wizard (Shopify checkout still accepts them at the payment step)
- Non-MI delivery ZIPs — falls back to "We'll quote delivery"
- Real-time inventory of plushies / machines beyond blackout dates

# Klawsome Mobile: Service Area Safety Screening

Goal: stop Klawsome Mobile bookings in high-risk areas automatically, using free public data, with a tiered response and an admin tab to manage it. Plus a required safety-policy checkbox before checkout.

## How the screening works

1. Customer enters the delivery ZIP in the booking wizard (same field as today).
2. The ZIP is looked up against a service-area list with three levels:
   - **Allowed** — books normally.
   - **Review** — can't check out online; must call during business hours to confirm (the same gate already used for long-distance ZIPs).
   - **Blocked** — cannot proceed; message explains we don't service that area and to contact us.
3. Any ZIP not on the list is treated as Allowed, so nothing outside Detroit metro breaks.

This applies to Klawsome Mobile and trailer-rental delivery only. In-store parties are unaffected.

## Where the "dangerous areas" data comes from (free)

The dark-blue areas in your screenshot are largely Detroit-proper high-crime tracts. Seed data comes from free public sources:

- Detroit Open Data Portal crime incidents (free, no key), aggregated per ZIP.
- FBI / Michigan State Police reported-offense rates for surrounding cities.

Incidents per 1,000 residents per ZIP get mapped to levels:

- Top tier (darkest-blue equivalent) → **Blocked**
- Next tier (medium blue) → **Review**
- Everything else → **Allowed**

Seeded once and stored in the database. A live crime API on every booking would add rate limits, latency, and breakage; a stored list you can refresh or adjust anytime stays free forever and is instant for customers.

## Admin tab

New **Service Area** tab in /klawsome-admin:

- Table of ZIPs with city name, level (Allowed / Review / Blocked), and an optional internal note.
- Add, edit, and delete rows; search by ZIP.
- Short legend explaining what each level does to the customer.

## Safety-policy checkbox at checkout

On the review/checkout step of the booking wizard, a required checkbox:

> **Service Area & Safety Policy:** Klawsome Mobile reserves the right to decline or modify an event based on operational, logistical, or safety considerations. Factors may include the specific event location, parking and loading conditions, security arrangements, operating hours, accessibility, ability to safely park and secure the trailer, and other conditions that could reasonably affect the safety of our employees, equipment, or guests. We don't operate in locations where we cannot reasonably protect our employees and equipment.

- The checkout button stays disabled until it's checked.
- Acceptance is recorded with the booking (with timestamp) and shown on the booking record and admin email, so there's proof the customer agreed.

## Technical notes

- New table `service_area_zips` (zip, city, level, notes) — public read, service-role write; seeded with a data insert.
- `src/lib/booking/zipMiles.ts` gains a level lookup; `ZipLookup` extends with a `level` so distance and safety resolve in one pass.
- `BookingWizard.tsx`: delivery step shows the block/review message; `validateStep` blocks progression for Blocked and routes Review into the existing call-to-confirm gate; review step adds the checkbox and gates the checkout button.
- `safety_policy_accepted` stored on `event_bookings` and passed through `create-pending-booking` plus cart attributes so it lands on the Shopify order and emails.
- Admin: new editor in `CmsEditors.tsx` and a tab in `ContentTabs.tsx`, following the existing MultiRowEditor pattern.
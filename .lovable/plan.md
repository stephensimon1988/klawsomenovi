# Automated Test Suite for Klawsome Mobile Checkout & Pricing

Goal: replace the one-off manual QA pass with a suite that can be re-run any time to prove every Klawsome Mobile / machine-rental checkout path prices correctly and that Command Center price edits reach the customer wizard.

## Three layers

### 1. Fast pricing tests (no browser, run in seconds)
Unit tests over the pricing/catalog logic that all quotes flow through:

- Mobile tiers: token pre-buy, unlimited play, reserve arcade — weekday vs weekend, 1 hour, 2 hours, and extra hours.
- Machine rentals: Klaw Mini (whole day, pickup and delivery) and Klaw Classic (4-hour blocks, delivery only), weekday vs weekend.
- Plush pack vs bring-your-own.
- Delivery math: per-machine base fee, free-mile allowance, per-mile rate, road-distance factor, and the 60-mile service cap.
- ZIP handling: allowed, review, and blocked ZIPs, plus the indoor / 200+ guest exceptions.
- Variant mapping: every selectable combination resolves to a non-empty Shopify item, and no two different choices collide on the same item.
- Cart lines: the generated line list totals exactly to the quoted price for a table of scenarios.

### 2. Browser tests of the real wizard (Playwright)
Scripted runs against the live preview that click through the actual "Book with Klawsome" popup:

- Klaw Mini weekday pickup, Mini weekend delivery, Classic multi-block delivery, and each mobile tier.
- Asserts the on-screen summary total matches the expected price for each path.
- Blocked-ZIP path shows the call-the-store gate; indoor exception unlocks it.
- Guest caps (12 adults / 12 children) and the mandatory safety-policy checkbox are enforced.
- Cart behaviour: item can be removed and the cart empties cleanly.
- Runs stop just before payment — no real orders are placed.

### 3. Pricing-propagation and drift checks
- **Admin → frontend**: a test edits a rental price in the Command Center, confirms the wizard quote changes, then restores the original value (self-cleaning, so it can run repeatedly).
- **Wizard → Shopify drift check**: compares every price in the Command Center against the matching live Shopify item and reports any mismatch. This is the check that would have caught the stale-price situation the mismatch guard currently blocks at checkout.

## Running it

- One command runs the fast pricing tests.
- A second command runs the browser tests.
- The drift check is separate so it can be run before a launch or after any price change.
- Any records created during a run are cleaned up automatically, and the suite skips creating live Shopify carts by default so it never pollutes real store data.

## Technical notes

- Layer 1: Vitest specs next to the logic (`src/lib/booking/*.test.ts`) — pure functions from `catalog.ts`, `cart.ts`, `zipMiles.ts`, with CMS rate rows stubbed so tests are deterministic.
- Layer 2: Playwright specs under `tests/e2e/` using the existing `playwright.config.ts`, driving `http://localhost:8080` with role-based selectors and per-path fixtures.
- Layer 3: a Playwright spec for the admin round-trip (Command Center edit → wizard assert → restore), and a Node script (`scripts/check-rental-price-drift.mjs`) that reads `booking_rental_pricing` / `booking_rental_options` and diffs against Shopify. The Shopify half needs a valid Admin API token; without one the script reports the token as unavailable rather than failing silently.
- Test bookings use a recognisable prefix so any stray rows are easy to identify and purge.

# QA Pass: New Klawsome Mobile & Machine Rental Checkout

Note: there is no `/klawsome-mobile` public route in the project. The mobile/rental pricing is edited in the Command Center (`/klawsome-admin` → "🕹 Machine Rental Pricing") and consumed by the "Book with Klawsome" wizard. This plan tests that pair end to end.

## 1. Admin → frontend propagation (then revert)

For each change: record the original value, edit it in the Command Center, confirm the new value appears in the booking wizard, then restore the original.

- Klaw Mini weekday rate, Klaw Classic 4-hour block rate
- Weekend rate (confirm weekday vs weekend switches with the chosen date)
- Extra-block price for Klaw Classic
- Delivery base fee and free-miles for both machines
- A plush pack option (label + price) and toggling one option inactive/active

Verification is done by driving the live preview in a browser: open the wizard, pick a weekday date, read the displayed prices, then repeat with a weekend date.

## 2. Booking wizard paths to exercise

- Rental → Klaw Mini → weekday, self-pickup (no delivery step shown)
- Rental → Klaw Mini → weekend, delivery with an in-range ZIP (base + per-mile lines)
- Rental → Klaw Classic → single 4-hour block, then multiple blocks
- Plush pack selected vs "bring your own"
- Klawsome Mobile tiers: token pre-buy, unlimited play, reserve arcade, weekday and weekend
- ZIP gates: in-area ZIP, out-of-range ZIP (call-to-confirm), blocked ZIP with the indoor / 200+ exception questions
- Safety policy checkbox required before continuing
- Back-navigation between steps keeps selections and re-prices correctly

## 3. Checkout + cart cleanup

- Complete a rental selection through Review, confirm the Shopify cart is created with correct line items (machine variant, plush pack, delivery base, per-mile line)
- Confirm the checkout URL is generated with `channel=online_store`
- Remove the lines from the cart and confirm the cart empties (no test order is placed)

## 4. Report

A written pass/fail list per case, with screenshots for the pricing checks and the exact cart lines observed, plus any bugs found (and whether to fix them in a follow-up).

## Technical notes

- Testing uses Playwright against `http://localhost:8080`; admin edits go through the existing `cms-admin` function and are reverted in the same session.
- Cart lines are removed via the storefront cart mutations already in the project; no orders are submitted.

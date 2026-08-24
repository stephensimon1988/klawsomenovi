# Machine Rental: Mini vs Full-Size, Weekday/Weekend Pricing

Replace the current "Rent a Klaw Machine" packages (1-hour $445 / 2-hour $645) with the two-machine structure from the pricing sheet, including weekday/weekend rates, pickup vs delivery, and a required plush-fill choice. Klawsome Mobile tiers stay as they are.

## New rental structure

Single Mini (H30 x L16 x W16, prizes 3 in or less)
- Whole day: $95 weekday / $145 weekend
- Fulfillment: Self-pickup from Klawsome (no extra charge), or Delivered +$20 base plus $3/mile for every mile
- Plush fill (pick one): 20 plush of choice $50, or bring your own plush (free)
- Damage note shown on the card: customer agrees to pay up to $700 for substantial damage, $50 for aesthetic damage

Klaw Classic (full size)
- Delivered, per 4-hour block: $445 weekday / $195 weekend per each additional block
- First block: $445 weekday; each additional block $195 weekday / $245 weekend (confirm final weekend first-block rate before Shopify variants are created)
- Delivery: free first 10 miles, then $3/mile
- Plush fill (pick one): 20 plush of choice $80, or bring your own plush (free)

## Checkout flow changes

New "Machine" step for the rental pathway, ordered so pricing is unambiguous:

```text
Pathway -> Machine (mini | classic) -> Date & time -> Fulfillment (pickup/delivery)
  -> Duration (classic: 4h blocks) -> Plush fill (required) -> Add-ons -> Details -> Review
```

- Weekday/weekend rate is chosen automatically from the selected date (same helper the Mobile tiers already use), so date comes before the price summary.
- Self-pickup skips the ZIP entry, mileage quote, service-area screening, and the safety policy checkbox.
- Delivery keeps ZIP entry, the automated mileage quote, the safety/approval gate, and the call-to-confirm gate past the mileage cap.
- Delivery pricing becomes per-machine instead of one global rule: mini = $20 + $3/mile from mile 1; classic = free first 10 miles then $3/mile. Mobile tiers keep their existing rule.
- Live total and the review screen show machine, day type, duration/blocks, plush choice, and mileage as separate lines.
- No explanatory copy about why anything is priced or gated (existing tone rule).

## Admin (/klawsome-admin)

Today the wizard's real prices live in code (`src/lib/booking/catalog.ts`); the Rental Packages tab is display copy only. Plan:

1. New database table `booking_rental_pricing` — one row per sellable combination: machine, day type, unit (whole day / 4h block / extra block), price cents, Shopify variant ID, active flag, sort order.
2. New database table `booking_rental_options` — pickup/delivery surcharge, per-mile rate, free-mile allowance, and the two plush-fill choices, each with price cents and variant ID.
3. New admin tab "🎪 Rental Pricing" built with the existing `MultiRowEditor`, added to `CONTENT_TABS` and to `cms-admin`'s `TABLES_ALLOWED`, with public read + service-role write grants.
4. The wizard reads these tables at runtime with the code values as fallback, so staff can change prices and mileage rules without a code change.
5. Existing "🎪 Rental Packages" tab stays for marketing copy on /rental and /birthdays; it will be relabeled "Rental Page Copy" to avoid confusion.

## Shopify updates

After approval, create one product per machine with variants for every priced combination, then wire the new variant IDs into the pricing table:

- Klaw Mini — Whole Day (Weekday) $95, Whole Day (Weekend) $145
- Klaw Mini — Delivery Base $20
- Klaw Mini — Plush Pack (20) $50
- Klaw Classic — 4-Hour Block (Weekday) $445, additional block $195
- Klaw Classic — 4-Hour Block (Weekend) TBD, additional block $245
- Klaw Classic — Plush Pack (20) $80
- Reuse the existing per-mile delivery surcharge variant ($3/mile, quantity = billable miles)
- Retire the old 1-hour/2-hour rental variants (kept in Shopify for order history, removed from checkout)

## Public pages

/rental and /birthdays comparison tables and add-on eligibility tags updated to show the two machines with weekday/weekend rates and the pickup option.

## Technical notes

- `src/lib/booking/catalog.ts`: replace `RENTAL_PACKAGES` with a machine registry mirroring the `MOBILE_TIERS` shape (day-type keyed rates + variant IDs); add per-pathway delivery rules.
- `src/components/booking/BookingWizard.tsx`: add `machine`, `fulfillment`, `blocks`, `plushChoice` to wizard state, extend `stepOrder`/`validateStep`, and add the machine/fulfillment/plush steps with 3:2 card images.
- `src/lib/booking/cart.ts`: `deliveryLine` takes the machine's free-mile allowance and base-fee variant instead of the single global constant.
- Booking records already store `addons` JSON and attributes, so machine, day type, blocks, and plush choice are added as cart attributes and surfaced on the admin bookings calendar and confirmation emails.

## Open item

The sheet lists $445 weekday / $195 weekend on the Klaw Classic first-block row, which reads as first block vs each additional rather than weekday vs weekend. Confirm the weekend first-block price before the Shopify variants are created.

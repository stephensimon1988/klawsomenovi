## Goal

Replace the current Klawsome Mobile packages ($445 / $645 / $1495 all-day) with the pricing sheet: three tiers, 1 or 2 hours, weekday vs weekend rates, plus a per-additional-hour rate.

## Pricing to implement

| Tier | Hours | Tokens | Weekday | Weekend |
|---|---|---|---|---|
| Token pre-buy | 1 | 400 | $595 | $720 |
| Token pre-buy | 2 | 600 | $795 | $920 |
| Token pre-buy | +1 hr | 100 | $195 | $245 |
| Unlimited play | 1 | Infinite (30-token tray at a time) | $1,190 | $1,245 |
| Unlimited play | 2 | Infinite (30-token tray at a time) | $2,150 | $2,450 |
| Unlimited play | +1 hr | — | $950 | $1,045 |
| Reserve arcade (tokens bought separately) | 1 | — | $295 | $395 |
| Reserve arcade | 2 | — | $545 | $645 |
| Reserve arcade | +1 hr | — | $195 | $245 |

Weekday = Mon–Fri, Weekend = Sat–Sun, based on the selected event date.

## Shopify work

Create one product, "Klawsome Mobile", with options Tier / Duration / Day type:
- 12 base variants (3 tiers x 1hr,2hr x weekday,weekend)
- 6 "additional hour" variants (3 tiers x weekday,weekend), sold as quantity = number of extra hours

Variants are untracked inventory, no shipping (delivery is already billed via the existing per-mile surcharge variant). The old mobile variants stay in Shopify but are no longer referenced by the site.

## Booking wizard changes

1. **Date first for Mobile.** Reorder the mobile flow so the date/time step comes before the package step, since the date decides weekday vs weekend pricing. Order becomes: pathway → datetime → package → add-ons → delivery → contact → review.
2. **New package step for Mobile.** Show the three tiers as cards; each card shows the 1-hour and 2-hour price for the selected day type, with tokens/description. A "day type" badge ("Weekday pricing" / "Weekend pricing") explains the rate shown.
3. **Extra hours control.** Replace the generic "$145 Extra Hour" add-on for Mobile with a stepper on the package step that uses the tier + day-type specific additional-hour variant and price. Rental keeps its existing $145 extra-hour add-on.
4. **Totals.** Estimated total and review screen use the day-type-correct base price plus extra hours plus existing add-ons and delivery surcharge.
5. **Checkout lines.** Cart line for the chosen tier/duration/day-type variant, plus a line for the additional-hour variant with quantity = extra hours, plus existing add-on and delivery lines. Booking attributes gain `tier`, `duration_hours`, `day_type`, and `extra_hours` so they appear on the Shopify order and the admin record.
6. **Duration in the record.** `duration_minutes` sent to `create-pending-booking` reflects base hours + extra hours instead of the default 60.

## Copy updates

Update the Mobile pathway card ("from $445") and any Mobile pricing copy on the Rental/Business pages to "from $295" with a note that rates vary by weekday/weekend and tier.

## Technical notes

- `src/lib/booking/catalog.ts`: replace `MOBILE_PACKAGES` with a `MOBILE_TIERS` structure keyed by tier with weekday/weekend prices per duration and per extra hour, plus new variant IDs.
- `src/components/booking/BookingWizard.tsx`: step reorder for mobile, new tier picker + extra-hours stepper, total and cart-line logic.
- No database schema change needed; extra detail rides in the existing `addons` JSON and attributes.

## Verification

Build, then walk the Mobile flow in the preview for a weekday date and a weekend date, confirming prices switch, extra hours add correctly, and the review total matches the sheet.

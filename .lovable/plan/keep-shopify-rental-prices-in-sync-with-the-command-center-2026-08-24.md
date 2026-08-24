# Keep Shopify Rental Prices In Sync With The Command Center

## The problem this fixes

Right now the booking wizard shows prices from the Command Center pricing tables, but Shopify charges whatever price is saved on each Shopify variant. Those two are set independently, so editing a rental price in the Command Center changes what the customer *sees* while checkout still charges the old amount.

Confirmed today: the nine rental variants in Shopify (Klaw Mini day rates, delivery base fee, plush packs, Klaw Classic blocks, per-mile surcharge) currently match the Command Center values, so nothing is mispriced at this moment — but the next price edit in the Command Center would silently break the total.

## What we'll build

### 1. A "Sync to Shopify" action in the Command Center

A button at the top of the **Machine Rental Pricing** tab that pushes every active pricing/option row to its Shopify variant:

- Updates the Shopify variant **price** to the Command Center price.
- Updates the Shopify variant **name** to the Command Center label (so admin order lines read the same wording customers saw).
- Renames the rental products' option group from the generic "Option" to **Rental Option**, and Klawsome Mobile's to **Package**.
- Reports back per row: synced, already matching, or failed (with the reason), plus a warning for any row whose variant ID doesn't exist in Shopify.

The same sync runs automatically right after a row is saved, so the normal path needs no extra clicks; the button is for re-checking or repairing.

### 2. A price-mismatch guard before checkout

Before creating the cart, the wizard compares the Shopify cart total to the total it quoted. If they differ, it blocks checkout with "Prices are being updated — please try again in a moment" instead of sending the customer to a checkout with the wrong amount, and logs the mismatch so staff see it in the Approvals-style admin view.

### 3. Per-machine per-mile variant

Mini and Classic currently share one $3/mile surcharge variant, so a per-machine per-mile change in the Command Center can't be reflected in Shopify. We'll add a dedicated per-mile variant to each rental product and point the `per_mile` option row at it, keeping the shared one for Klawsome Mobile.

## The mapping (single source of truth)

Every rental choice resolves to exactly these Shopify variants:

```text
Klaw Mini   weekday      -> Klaw Mini Machine Rental / Whole Day (Weekday)
Klaw Mini   weekend      -> Klaw Mini Machine Rental / Whole Day (Weekend)
Klaw Mini   plush pack   -> Klaw Mini Machine Rental / Plush Pack (20 Plush)
Klaw Mini   BYO plush    -> (no line)
Klaw Mini   pickup       -> (no line)
Klaw Mini   delivery     -> Delivery Base Fee (x1) + per-mile (x billable miles, 0 free miles)

Klaw Classic first block  -> First 4-Hour Block          (same rate both day types)
Klaw Classic extra blocks -> Additional 4-Hour Block (Weekday|Weekend) x count
Klaw Classic plush pack   -> Plush Pack (20 Plush)
Klaw Classic BYO plush    -> (no line)
Klaw Classic delivery     -> per-mile x max(0, miles - 10)   (delivery only, no base fee)
```

Billable miles are always `ceil(miles - free miles)` for the selected machine, using the free-mile and per-mile values from the Command Center.

## Technical notes

- New edge function `shopify-rental-sync`: reads `booking_rental_pricing` and `booking_rental_options`, and calls Shopify Admin `productVariantsBulkUpdate` / `productOptionUpdate`. It reuses the existing Admin-token discovery helper already proven in `shopify-booking-sync`, so no new secrets are needed.
- `src/components/admin/ContentTabs.tsx`: sync button, result list, and auto-sync on row save in the Machine Rental Pricing tab.
- `src/lib/booking/catalog.ts`: add `perMileVariantId` per machine; `src/hooks/useRentalPricing.ts` maps the `per_mile` row's variant onto it; `src/lib/booking/cart.ts` uses the rule's per-mile variant instead of the global constant.
- `src/components/booking/BookingWizard.tsx`: post-cart total comparison guard.
- New Shopify variants: one per-mile variant on each of the two rental products.
- Verification after build: edit a Mini rate in the Command Center, confirm the Shopify variant price changes, run a full wizard checkout and confirm the Shopify cart total equals the quoted total, then revert.

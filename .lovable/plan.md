## What's happening

The Nov 7 booking (KLW-2607161547-NUD8, 20-person private party) *did* go through — Shopify order #1007 exists and is Paid. But `/klawsome-admin` reads from the `event_bookings` table in Lovable Cloud, and that table is empty (verified via a live query). Nothing in the codebase writes to `event_bookings` — the BookingWizard just creates a Shopify cart and hands the buyer to Shopify checkout. So every completed booking is currently only recorded on the Shopify side, invisible to the admin calendar.

## Fix

### 1. New edge function `shopify-order-webhook`
- Receives Shopify `orders/paid` (and `orders/create` as a fallback) webhooks.
- Verifies the HMAC using a shared secret (new `SHOPIFY_WEBHOOK_SECRET`).
- Reads `note_attributes` from the order — the BookingWizard already writes every field we need there (`booking_ref`, `event_type`, `start_at`, `party_size`, `adults`, `children`, `celebrant_name`, `celebrant_age`, `favorites`, `notes`, `contact_name/email/phone`, `zip`, `miles`, addons).
- Upserts a row into `event_bookings` keyed on `booking_ref`, populating `shopify_order_id`, `total_cents` (from order total), and `status = 'confirmed'`.
- Idempotent: repeat deliveries update the same row.

### 2. Register the webhook once
- Add a small admin-triggered action (button on `/klawsome-admin`) that calls the Shopify Admin API to register the webhook against the deployed edge function URL. This avoids needing the store owner to configure it manually.

### 3. Backfill existing paid bookings
- One-time task in the same deploy: fetch recent Shopify orders whose `note_attributes` contain a `booking_ref` starting with `KLW-` and insert them into `event_bookings` (covers order #1007 and any others already paid). Runs from the same edge function via a `?backfill=1` call the admin button triggers once.

### 4. Optional but recommended: pre-write on checkout start
- When the BookingWizard successfully creates the Shopify cart, also insert a `pending` row into `event_bookings` via a new lightweight edge function. The webhook later flips it to `confirmed` and adds `shopify_order_id`. This means abandoned checkouts show up as pending in the admin (useful for follow-up) instead of vanishing.
- If you'd rather keep the admin view "paid only," skip this and rely solely on the webhook — say the word.

## Files touched
- `supabase/functions/shopify-order-webhook/index.ts` (new)
- `supabase/functions/shopify-order-webhook/deno.json` (new)
- `src/components/booking/BookingWizard.tsx` (optional: call the new pending-insert function)
- `supabase/functions/booking-create-pending/index.ts` (new, only if we do step 4)
- `src/pages/KlawsomeAdmin.tsx` or `src/components/admin/BookingsCalendar.tsx` (add "Sync Shopify bookings" button)
- New secret: `SHOPIFY_WEBHOOK_SECRET`

## Verification
- After deploy + backfill, `event_bookings` will contain order #1007 (Nov 7, private, 20 pax, Madden's 6th birthday). The admin calendar's Nov 7 cell will show it, and future paid bookings will appear within seconds of Shopify marking them paid.

## Open question
Do you want step 4 (pending rows on checkout start) so you can see abandoned/in-progress bookings, or webhook-only (paid bookings only)?

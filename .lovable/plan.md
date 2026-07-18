# Booking confirmation emails with calendar invites

## Current state
No booking confirmation email is sent from our side today. The only email a customer gets is Shopify's default order receipt (no calendar link). The admin emails (`team@klawsomenovi.com`, `events@klawsomenovi.com`) currently receive nothing from the booking flow.

## What to build
When a booking is paid (Shopify webhook flips it to `confirmed`), send **one** transactional email to:
- the customer
- `team@klawsomenovi.com`
- `events@klawsomenovi.com`

All three recipients get the **same calendar invite** — a real `.ics` attachment they can click "Add to calendar" on in Gmail / Apple Mail / Outlook. The email body differs slightly (customer gets a friendly confirmation; admin copy is a heads-up "new booking" summary), but the `.ics` payload is identical so everyone lands on the same event in their calendar.

## Changes
1. **New template** `supabase/functions/_shared/transactional-email-templates/booking-confirmation-customer.tsx` — friendly confirmation with date/time, party type, guest count, address (or "we'll come to you" for Mobile), and a note that the `.ics` is attached.
2. **New template** `booking-confirmation-admin.tsx` — internal summary: customer name/email/phone, event type, date/time, guest counts, ZIP + quoted delivery fee (for Mobile), booking ref, link to `/klawsome-admin`.
3. **New ICS helper** `supabase/functions/_shared/ics.ts` — builds a valid VCALENDAR/VEVENT string from a booking row (UID = `booking_ref@klawsomenovi.com`, organizer = events@, location depends on event type, 2-hour default duration).
4. **Extend `send-transactional-email`** to accept an optional `attachments: [{ filename, contentBase64, contentType }]` field and pass it through to the underlying provider call (Lovable email API supports attachments on transactional sends).
5. **Register templates** in `registry.ts`.
6. **Trigger from `shopify-order-webhook`** — after we flip a booking to `confirmed`, invoke `send-transactional-email` three times (customer, team@, events@) with the same generated `.ics` attachment. Idempotency key = `booking-confirm-${booking_ref}-${recipient}` so webhook retries don't double-send.
7. Deploy the two edge functions.

## Out of scope
- No changes to the booking wizard UI.
- No email on the "pending_payment" step — only fires once payment is confirmed via the Shopify webhook (matches how Shopify's own receipt works).
- Not touching the Shopify order receipt itself.

## Technical notes
- ICS `DTSTART`/`DTEND` in UTC with `Z` suffix; include `METHOD:REQUEST` and a `SEQUENCE:0` so calendar clients treat it as an invite.
- Attachment filename: `klawsome-booking-${booking_ref}.ics`, content type `text/calendar; method=REQUEST; charset=utf-8`.
- Admin recipients hardcoded in the webhook, not the template (keeps templates recipient-agnostic).

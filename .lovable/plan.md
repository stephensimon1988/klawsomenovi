# Party cap wording + booking sync check

## Current state (verified)
- Booking wizard **already** enforces separate caps: up to 12 adults **and** up to 12 children (not a combined 12). See `BookingWizard.tsx` lines 367–368, 687–688.
- Wizard note already reads: "a maximum of 12 adults are allowed along with a maximum of 12 children..." (line 677).
- FAQ (`cmsData.ts` line 280) uses slightly off wording: "along with **the** maximum of 12 children" — reads like a shared cap.
- Database check: new bookings **are** flowing into `/klawsome-admin`. Since Nov 7:
  - `KLW-2607181853` — Sarah Imbrunone, private, Aug 8 2026, **confirmed** (paid)
  - `KLW-2607192048` — Carmen Gutierriez, private, Aug 22 2026, **pending_payment** (never checked out)
  - Note: both were booked at afternoon times, meaning they were created **before** we enforced the 9–11 AM private-party rule. New attempts will be blocked going forward.

## Changes

1. **Reword the "12 + 12" rule everywhere it appears** so it clearly reads as two independent caps, not a combined 12:
   - `src/content/cmsData.ts` FAQ answer (line 280) — change "along with **the** maximum of 12 children" → "along with **a separate** maximum of 12 children".
   - `src/components/booking/BookingWizard.tsx` note block (line 677) — same tightening + add a short "(24 total, counted separately)" clarifier.
   - Add matching copy to `src/pages/Birthdays.tsx` party-rules section (currently silent on capacity) so it's stated on the marketing page too.

2. **Backend booking check — no code change needed.** Confirm to the user that:
   - Bookings are landing in `event_bookings` and rendering on the admin calendar.
   - Sarah's Aug 8 booking is `confirmed` (webhook fired), Carmen's Aug 22 is `pending_payment` (abandoned checkout).
   - Old afternoon private bookings pre-date the 9–11 AM enforcement; new ones can't slip through.

## Out of scope
- No change to numeric caps (still 12 adults + 12 children).
- No change to booking flow, emails, webhooks, or Shopify sync.

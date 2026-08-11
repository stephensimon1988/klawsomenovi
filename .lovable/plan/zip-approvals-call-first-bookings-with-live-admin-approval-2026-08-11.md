# ZIP Approvals: call-first bookings with live admin approval

## What changes for customers (Klawsome Mobile)

Two new qualifying questions are added to the delivery step, asked for every mobile booking:

1. Is this event fully indoors?
2. Is expected attendance over 200 people?

If either answer is Yes, the event qualifies as an exception: the ZIP safety screen is bypassed and booking continues normally (the 60-mile service cap still applies).

If both are No and the ZIP is flagged (review or blocked):

- The customer sees a clear "Call us first" panel with the store phone number and hours, plus the reason.
- A short "Request approval" form (name, phone, email, event date, ZIP, notes) submits the request.
- The wizard stays open and shows "Waiting for approval". The moment staff approves, the block lifts live and Next unlocks — no refresh.
- If the customer closes the modal, the approval is remembered on that device by an approval code. Reopening the wizard (or starting over from scratch) restores it and the ZIP is no longer blocked.
- If staff denies it, the customer sees the denial with the call-us message.

## What changes for staff

A new **Approvals** tab in /klawsome-admin:

- Pending requests at the top with a count badge, then recently decided ones.
- Each card shows contact name, phone, email, requested date, ZIP + city, ZIP level (review/blocked), indoors / over-200 answers, and notes.
- **Approve** and **Deny** buttons on each card, with an optional short internal note.
- The list updates live as new requests come in.

## Live updates, at no cost

Realtime is already included in the backend at no extra charge — no third-party service or polling loop. Approval state changes are pushed over a single realtime channel on a status-only record (an approval code and its status, no personal data), so it is safe for the public site to listen to. A one-time status fetch on wizard open covers the case where the customer was away.

## ZIP list update requested earlier

All 12 Detroit ZIPs (48204, 48205, 48206, 48207, 48208, 48210, 48211, 48212, 48213, 48214, 48215, 48238) are set to **Review required**, matching the table provided. With this plan, "Review required" now means: call the store, request approval, get unlocked — instead of a dead end.

## Technical notes

**Database (one migration)**

- `booking_approval_requests` — request_code (unique short token), event_type, contact_name/phone/email, requested_date, zip, city, zip_level, is_indoors, over_200, party_size, customer_notes, status (`pending` | `approved` | `denied`), staff_note, decided_at, timestamps. Service-role only policy (admin reads through the existing `cms-admin` function); `updated_at` trigger.
- `booking_approval_status` — request_code (PK), status, updated_at. Public read for anon/authenticated, service-role write, no PII. Added to `supabase_realtime` publication.
- Trigger on `booking_approval_requests` insert/update mirrors status into `booking_approval_status`.
- GRANTs written in the same migration for both tables.

**Edge functions**

- New `request-booking-approval` (public, no JWT): validates input with Zod, generates the request code, inserts the request, returns the code. Rate-limited per phone/ZIP per hour.
- `cms-admin`: add `booking_approval_requests` to `TABLES_ALLOWED` plus a `decide_approval` action (id, decision, staff_note) that sets status/decided_at.

**Frontend**

- `src/lib/booking/approvals.ts` — create request, fetch status by code, subscribe to realtime status, localStorage code persistence (keyed by ZIP).
- `BookingWizard.tsx` / `DeliveryStep` — two Yes/No gate questions in state, exception bypass logic, call-first panel, request form, waiting/approved/denied states; `validateStep` for `delivery` accepts a known ZIP OR an active approval OR an exception answer.
- `src/components/admin/ApprovalsEditor.tsx` — new Approvals tab with realtime list and Approve/Deny actions.
- Booking payload gains indoors / over-200 / approval code so the record shows why a flagged ZIP was allowed (stored in the booking's notes/attributes; no schema change to `event_bookings`).

## Verification

Playwright run with screenshots: (1) blocked ZIP with both answers No shows call-first + request form, (2) request appears in the Approvals tab, (3) approving unlocks the customer's Next step live, (4) blocked ZIP with "indoors" or "over 200" = Yes proceeds straight through, (5) a normal ZIP is unaffected.

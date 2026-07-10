# Booking Schedule cleanup + Bookings Calendar

Two changes to `/klawsome-admin`:

## 1. Remove "Slot length" from Booking Schedule editor

Customers pick their own duration during checkout, so a fixed slot granularity is misleading. Keep the value in the DB (still used by `generateSlots` for the time-picker grid in the wizard), but hide the input in the admin and stop editing it. The wizard keeps working off the stored default (60 min) — we can revisit if you want to remove slot-based time pickers from the wizard too.

Edits: `src/components/admin/BookingScheduleEditor.tsx` — remove the "Slot length (minutes)" `<Input>` and drop `slot_minutes` from the save payload; keep `lead_time_hours` (still important — it's the "how far in advance customers must book" cutoff).

## 2. New "Bookings Calendar" tab

We already have an `event_bookings` table (currently empty) that the booking wizard writes to. It stores `start_at`, `duration_minutes`, `event_type`, `pathway`, `status`, contact info, party size, addons, Shopify order id, total, etc. Nothing in the admin surfaces it yet.

Add a new tab **📆 Bookings** with a real month calendar view of every booking.

```text
[< Nov 2026]   Nov 2026   [Dec 2026 >]      Filter: [All types ▾] [All statuses ▾]

  Sun   Mon   Tue   Wed   Thu   Fri   Sat
   1     2     3     4     5     6     7
                   • 2p Private
                     Smith (8)
                   • 6p Rental
   8     9    10    11    12    13    14
        BLACKOUT
                              • 3p Mobile
                                Jones (12)
   …
```

- Month grid (7×5/6). Prev/Next month arrows + "Today".
- Each cell lists that day's bookings (time + type + contact name + party size), color-coded by event type (private / semi / rental / mobile).
- Blackout days from `event_blackout_dates` are visually marked.
- Closed days (per `event_availability.hours`) are dimmed.
- Clicking a booking opens a details drawer/dialog with:
  - Full contact (name, email, phone)
  - Start time + duration, event type, pathway
  - Party size, celebrant, favorites, special requests, character pick
  - Zip/miles (for mobile), addons, Shopify order id + total
  - Status badge with a dropdown to change status (`pending` → `confirmed` / `cancelled` / `completed`)
- Filters: event type (all / private / semi / rental / mobile) and status.
- Above the calendar: quick "Upcoming (next 14 days)" list for at-a-glance triage.

### Data / API

- Extend `cms-admin` `TABLES_ALLOWED` with `event_bookings` so the admin can read the list and patch status through the existing password-gated function.
- Load the visible month via `cmsInvoke('read', 'event_bookings')` (small volume; no server-side date filter needed yet — can add later if it grows).
- Status updates use the existing `action: 'update'` path.
- No schema changes.

## Files

- `src/components/admin/BookingScheduleEditor.tsx` — remove slot input
- `src/components/admin/BookingsCalendar.tsx` (new) — month grid + detail dialog
- `src/pages/KlawsomeAdmin.tsx` — new `<TabsTrigger value="bookings">📆 Bookings</TabsTrigger>` + content
- `supabase/functions/cms-admin/index.ts` — add `event_bookings` to `TABLES_ALLOWED`

## Out of scope

- Manually creating bookings from the admin (bookings still come only from the customer wizard)
- iCal/Google Calendar sync (can be a follow-up)
- Rescheduling by drag-and-drop

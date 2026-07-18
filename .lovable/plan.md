## Goal
Lock the booking wizard so:
- **Private parties**: only bookable 9:00–11:00 AM (before the arcade opens to the public)
- **Semi-private parties**: only bookable 11:00 AM–9:00 PM (during public hours)

## Current state (verified)
The `event_availability` table drives the time-slot generator in `src/hooks/useAvailability.ts`. Right now:
- `private` row: opens at 11:00 or 12:00 depending on day, closes 20:00/21:00, Mon/Tue closed.
- `semi_private` row: same schedule as private.

That's why guests can book private parties at any public-hours slot today.

Store is currently open **every day 11 AM – 9 PM** (from `store_hours`).

## Changes

### 1. Update `event_availability` rows (data change, no code)
- **private** → every day open 09:00–11:00, 60-min slots (yields exactly 9:00 AM and 10:00 AM start options — a 10 AM start would finish right at open, so we'll keep only the 9:00 AM slot by setting close to 10:00 if you'd prefer a single slot; default plan is 09:00–11:00 which offers 9 AM and 10 AM).
- **semi_private** → every day open 11:00–21:00, 60-min slots. Last bookable start = 8:00 PM (party ends at 9 PM close).
- Mobile and rental rows are untouched.

### 2. No frontend code changes needed
The wizard reads these rows live, so updating them propagates immediately to `/index` "Start Booking" and the admin schedule editor.

### 3. Admin visibility
`BookingScheduleEditor` in `/klawsome-admin` already shows per-event-type hours, so the owner can tweak the windows themselves after this change without needing engineering help again.

## Open question
Only one slot vs. two for private: with a 09:00–11:00 window and 60-min slots the wizard offers **9:00 AM and 10:00 AM** start times (10 AM party ends at 11 AM right as public opens). If you want only a single 9:00 AM start, we set close to 10:00 instead. Default in this plan: keep both (9 AM and 10 AM).

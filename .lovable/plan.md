## Goal

Make blackouts in `/klawsome-admin` → Booking Schedule easier to manage:
1. Enter a **date range** instead of one day at a time.
2. Optionally apply that range to **all 4 event types** at once ("every kind of event booking").
3. **Display consecutive blackout dates as a single range row** (e.g. `2026-07-11 → 2026-08-24 · Launch blackout — Klawsome Mobile opens Aug 24, 2026`) instead of one line per day.
4. Support **multiple range blackouts** in the future — nothing prevents adding another range for holidays, etc.

Data model stays the same (one row per date in `event_blackout_dates`) so the booking flow and calendar keep working unchanged; ranges are just a UI convenience for entry and display.

## Changes

**`src/components/admin/BookingScheduleEditor.tsx`**

Per-event-type editor (the existing card):
- Replace the single date input with **Start date + End date + Reason + Add** row.
- On Add: expand the range into daily rows and bulk-insert via `cmsInvoke` (`event_blackout_dates`).
- Replace the flat day list with a **grouped list**: consecutive dates that share the same `reason` collapse into one row showing `YYYY-MM-DD → YYYY-MM-DD · reason` (single days still show as one date). Trash icon deletes every row in that group.

New "All event types" section at the top of the editor:
- Start date, End date, Reason, Add-to-all button.
- Inserts the expanded dates for **all 4 event types** in one call, then reloads. Existing dates for a given (type, date) are skipped so re-adding is safe.

**No schema changes**, no changes to `BookingWizard`, `useAvailability`, or `BookingsCalendar` — they already read the per-day rows.

## Technical notes

- Grouping: sort rows by `blackout_date`, walk the list, start a new group whenever the next date isn't exactly +1 day from the previous or the reason differs.
- Range expansion done in JS (UTC-safe date arithmetic) — capped at e.g. 366 days per submit to avoid runaway inputs.
- Bulk insert uses sequential `cmsInvoke` calls (the existing edge action only inserts one row at a time); a small progress toast covers the wait.
- Deleting a grouped range issues one delete per underlying row id, then reloads.

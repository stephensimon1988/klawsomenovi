# Admin tab: Booking Schedule

Add a "Booking Schedule" tab to `/klawsome-admin` that controls when customers can book each of the four service types.

## What already exists

The booking wizard reads from `event_availability` (per event_type):
- `event_type` — one of `private`, `semi_private`, `rental`, `mobile`
- `hours` — JSON `{ mon, tue, wed, thu, fri, sat, sun }`, each either `null` (closed) or `{ open: "HH:MM", close: "HH:MM" }` (24h)
- `slot_minutes` — booking slot granularity (default 60)
- `lead_time_hours` — earliest booking cutoff (default 48/72)

Plus `event_blackout_dates` (per event_type, per date) to block specific days.

The wizard is wired to these tables via `useAvailability`, so anything saved here takes effect immediately in the booking flow.

## New admin tab

New tab labeled **Schedule** with a section per event type:

```text
Private Parties        [Slot: 60 min]  [Lead time: 48 h]
  Mon  [ Closed ]
  Tue  [ Closed ]
  Wed  [12:00] → [20:00]   [x Open]
  Thu  [12:00] → [20:00]   [x Open]
  Fri  [12:00] → [21:00]   [x Open]
  Sat  [11:00] → [21:00]   [x Open]
  Sun  [11:00] → [20:00]   [x Open]

  Blackout dates
  • 2026-07-04  Independence Day        [Remove]
  • 2026-12-25  Christmas               [Remove]
  [ + Add blackout date ]
  [ Save Private Parties ]

Semi-Private Parties   …  (same shape)
Rental (in-store rental of a machine)  …
Klawsome Mobile (delivered / off-site) …
```

Per event type:
- Open/close time inputs per day + a "Closed" toggle that greys the times
- Slot minutes (numeric) and Lead time hours (numeric)
- Blackout list with add/remove (date + optional reason)
- Single "Save" button per event type that writes the whole `hours` object plus scalars

Time inputs are `<input type="time">` so we get native 24h pickers and store `HH:MM` strings, matching what `useAvailability` already parses.

## Data / API

- Reuse the existing `cms-admin` edge function pattern — add `event_availability` and `event_blackout_dates` to `TABLES_ALLOWED`, then all CRUD flows through the existing password-gated function.
- No schema changes needed (tables and RLS already in place).
- The `hours` column is `jsonb`; the editor serializes/deserializes it into the seven-day form.

## Files

- `src/pages/KlawsomeAdmin.tsx` — new `<TabsTrigger value="schedule">` + `<TabsContent>`
- `src/components/admin/BookingScheduleEditor.tsx` (new) — the per-event-type editor block
- `supabase/functions/cms-admin/index.ts` — extend `TABLES_ALLOWED` with the two booking tables

## Out of scope

- Editing booking-add-ons or per-service durations beyond the slot size (Klawsome Mobile's 1h/2h/all-day live in Shopify variants, not here).
- Viewing/managing individual bookings — the tab is only for scheduling rules.

## Open questions

1. Do you want a single global "operating hours" that applies to all four service types, or keep them independent (current setup allows different hours per type — e.g. rental opens earlier than private parties)?
2. Do you want per-day "buffer" minutes between bookings (turnover time) as a separate field, or is `slot_minutes` enough for now?

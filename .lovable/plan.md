## How blackouts work today

Blackouts are already **per event type**, not global. There are 4 event types, each with its own blackout list:

- Private Parties
- Semi-Private Parties
- In-Store Rental
- Klawsome Mobile

In the admin **Schedule** editor, each event type has its own "Blackout dates" list (with optional reason). Adding a blackout under Klawsome Mobile only blocks Mobile bookings — Private, Semi-Private and Rental stay bookable on that same day.

## Why the calendar looks confusing

The **Calendar** tab currently merges all four event types into a single `Set<blackout_date>` and stamps a red "BLACKOUT" label on any day that has *at least one* event-type blackout. It doesn't say which event type is blocked or why. So a day you only blacked out for Mobile visually looks the same as a day blacked out for everything.

## Plan — surface per-event blackouts on the calendar

Edit `src/components/admin/BookingsCalendar.tsx` only. No schema changes.

1. **Group blackouts by day → array of `{event_type, reason}`** instead of a flat `Set` of dates.
2. **Respect the existing "Type" filter**: when a specific type is selected, only show that type's blackout dot on the day. When "All types" is selected, show one small colored dot per blacked-out event type using the same `TYPE_META` colors as bookings (pink=Private, purple=Semi, sky=Rental, emerald=Mobile).
3. **Replace the red "BLACKOUT" text** with a compact row of colored dots at the top-right of the day cell. Each dot has a `title` tooltip like `"Klawsome Mobile — Founder out of town"` (event label + reason if present).
4. **Full-blackout shortcut**: if all 4 event types are blacked out on the same day, render a single red "BLACKOUT" pill (current styling) so the "everything closed" case still reads at a glance.
5. **Legend row** below the month header: small chips showing the 4 event-type colors + a "Blackout" swatch, so admins can decode the dots without hovering.
6. **Detail popover on click** (optional, low-risk): clicking a day cell with blackouts opens a lightweight popover listing each blacked-out event type and its reason. If this adds too much scope we can defer — the tooltips from step 3 already cover the main need.

Result: a day blocked only for Mobile shows a single emerald dot (with tooltip); a day blocked for all four types shows the red "BLACKOUT" pill.

### Technical notes

- Data source stays `event_blackout_dates` (already loaded).
- No changes to `BookingScheduleEditor.tsx`, `useAvailability.ts`, or the customer-facing booking flow — those already scope blackouts by event type correctly.
- Reuse `TYPE_META` for colors/labels so calendar bookings and blackout dots stay visually consistent.

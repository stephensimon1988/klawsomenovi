# Fix blackout dates showing one day early in the Command Center

## What's happening

The blackout dates you saved are stored correctly — that's why the customer booking flow shows the right days. The bug is purely in how the admin list *displays* them.

In `src/components/admin/BookingScheduleEditor.tsx`, the `fmtISO` helper turns a stored date like `2026-07-04` into a timestamp at midnight UTC, then formats it in your local timezone (Detroit, UTC-4/-5). Midnight UTC on Jul 4 is 8pm on Jul 3 locally, so the label renders as "Jul 3, 2026". Every blackout row in that list, including range start/end labels, shifts back one day.

## The fix

Format the stored `YYYY-MM-DD` string directly from its year/month/day parts instead of routing it through a timezone-sensitive `Date` conversion. Month name and day number come from a plain lookup, so no timezone can shift them.

This changes only the labels in the Blackout lists (all-event-types section and the per-event-type sections). No stored data changes, no changes to the booking flow, the 7-day preview, or the Bookings calendar — those already handle dates correctly.

## Verification

After the change, the existing rows should read: Jul 4, 2026; Sep 3, 2026; Sep 11 → Sep 12, 2026; Sep 30, 2026 — matching what you entered and what customers see.

## Technical detail

- Replace `fmtISO` with a string-part formatter (`iso.split('-')` → `MONTHS[m-1] d, y`).
- Leave `parseISO`/`toISO`/`expandRange`/`groupBlackouts` untouched — they are consistently UTC-based and correct for arithmetic and grouping.

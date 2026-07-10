## Goal

End-to-end smoke test of `/klawsome-admin` (all tabs, all CRUD paths) with Playwright, capture screenshots and network/console output, and confirm every action leaves the database in its original state.

## Approach

Drive the live preview at `http://localhost:8080/klawsome-admin` with headless Chromium. For every mutation, record the "before" state, run the action, verify the "after" state visually + via the `cms-admin` response, then run the inverse action to revert. Screenshots and a JSON log go to `/tmp/browser/klawsome-admin/`.

Password comes from the `ADMIN_PASSWORD` secret. I'll read it inside Playwright via `os.environ` — never echoed.

## Test matrix

### A. Blackout dates (primary focus)
1. Load Booking Schedule tab → screenshot each event-type card.
2. Read current `event_blackout_dates` rows (baseline count per event type).
3. For each of the 4 event types (private, semi_private, rental, mobile):
   - Add a blackout on a far-future date (e.g. 2027-12-31) with reason "DEBUG — auto test".
   - Verify row appears in the UI list and in a fresh `read`.
   - Delete it.
   - Verify it's gone.
4. Check edge cases: duplicate date insert, empty date submit (should toast error), past date insert.
5. Confirm `event_blackout_dates` row count matches baseline at end.

### B. Booking Schedule hours
1. Snapshot current `event_availability.hours` + `lead_time_hours` for one type (e.g. private).
2. Toggle Monday open/closed, change an open/close time, change lead time → Save.
3. Verify persisted value via `read`.
4. Restore original values → Save → verify.

### C. Bookings Calendar tab
1. Load tab → screenshot empty state (table is empty).
2. Insert a fake `event_bookings` row via `cms-admin` `insert` (start_at in current month, status pending, contact "DEBUG Test").
3. Verify it appears on the correct calendar day and in the "Upcoming 14 days" list.
4. Click the booking → screenshot the details dialog.
5. Change status via the dropdown → verify update.
6. Navigate month prev/next/today → screenshots.
7. Apply type + status filters → screenshots.
8. Delete the debug row via `cms-admin` `delete` → verify calendar is empty again.

### D. Other admin tabs (light smoke)
Load each remaining tab (Hours, Site Settings, plus any others visible in `KlawsomeAdmin.tsx`), screenshot, confirm rows render and no console/network errors. No mutations here unless something looks broken.

### E. Failure paths
- Call `cms-admin` with wrong password → expect 401.
- Call with disallowed table name → expect 400.
- Call with missing fields → expect 400.

## Deliverables

- `/tmp/browser/klawsome-admin/screenshots/*.png` — one per step
- `/tmp/browser/klawsome-admin/report.md` — pass/fail per case, with the cms-admin request/response summary, console errors, and a final "DB state restored ✅/❌" line
- Short chat summary highlighting any real bugs found (especially anything blackout-related), plus recommended fixes to plan separately

## Revert guarantee

Every mutation is paired with its inverse in the same script, wrapped in try/finally so a mid-script crash still runs cleanup. Before finishing, the script re-reads `event_blackout_dates`, `event_availability`, and `event_bookings` and diffs against the baseline snapshot; the report fails loudly if anything drifted.

## Out of scope

- Fixing bugs found (separate plan after the report)
- Load / concurrency testing
- Auth flow changes

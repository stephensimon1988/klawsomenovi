# Back to Monday-closed hours

## What changes

Hours become: **Tuesday–Sunday, 11:00 AM – 9:00 PM. Closed Mondays.**

1. **Store hours data** — Monday is currently marked open 11:00 AM–9:00 PM in the database. Flip Monday to closed; all other days stay 11:00 AM–9:00 PM. Every place that reads live hours (homepage hero strip, "Find us at Sakura Novi" block, footer/contact info) updates automatically.
2. **Summer announcement banner** — the homepage banner currently reads "Special Summer Hours — Open every day, 11 a.m. to 9 p.m. CLOSED Saturday, July 4, 2026…" That is now wrong and out of date, so it gets turned off (text left in place in admin so it can be reused later).
3. **Admin** — the Hours tab on /klawsome-admin will show Monday toggled Closed after the data change. No new UI is needed; it already edits these rows live.
4. **Static fallback copy** — the built-in fallback text used before the database loads already says "Closed Mondays" in the FAQ, hero subheadline and contact blurb, so it stays as is. Only fallback strings that contradict the new hours get corrected.

## Technical notes

- Migration/update on `public.store_hours`: `is_closed = true` for `day_of_week = 1`; `open_time`/`close_time` left as-is so re-opening Monday is a one-toggle change.
- `public.site_settings`: `announcement_enabled = false`.
- No code change expected in `src/lib/hoursSummary.ts` — with six open days it renders "Tuesday–Sunday", "11:00 AM to 9:00 PM", "Closed Mondays".
- Verification: reload the homepage and confirm the hero strip and Visit block read Tuesday–Sunday with the Closed Mondays line, and that the summer banner is gone.

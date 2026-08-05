# Verify the new admin content tabs with screenshots

The 11 new content tabs are built. This plan covers proving they work end to end, with screenshot evidence for each tab.

## What gets verified

1. **Admin login + tab bar** — sign into /klawsome-admin and capture the full tab bar so every new tab is visible and labeled.
2. **Each content tab loads real data** — open all 11 tabs one by one (Token Prices, News, FAQ, Careers, Party Packages, Rental Packages, Homepage Copy, Gallery, Reviews, Page Banners, Announcement) and screenshot each, confirming rows come from the database (not empty tables, not the static fallback).
3. **Search and filters** — on FAQ (filter by page), Gallery (filter by album), and Careers (filter by category), apply a filter and a search term and screenshot the narrowed results.
4. **Round-trip edit test** — make one harmless edit through the UI (change a token tier's bonus text), save, confirm the success toast, reload the tab to confirm it persisted, then check the matching public page shows the new value, then revert it back to the original and confirm the public page returns to normal. Screenshots at each step.
5. **Add / delete safety** — add a throwaway row in one table, confirm it appears, then delete it and confirm it's gone, so owners can trust those buttons.
6. **Public pages unchanged** — screenshot homepage, /gallery, /careers, /news, /faq, /birthdays, /rental and compare against expected content so the switch to live database reads didn't change what visitors see.
7. **Console + network check** — collect browser errors and failed requests across all of the above; report anything real (the sandbox already blocks one external animation file, which is expected and unrelated).

## Deliverable

A short report in chat listing what passed, plus the screenshots. If anything fails (a tab erroring, a column not saving, a public page losing content), it gets fixed and re-tested in the same pass before reporting.

## Technical notes

Testing is done with a headless browser against the running preview, logging in with the admin password from the existing `admin-auth` flow, and driving the `cms-admin` edge function through the real UI (no direct database writes) so the whole path — UI to edge function to database to public page — is exercised. Screenshots are captured per tab and per verification step; any test data created is removed at the end.

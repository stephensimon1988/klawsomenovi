## What's happening

You edited Store Hours in `/klawsome-admin` and the **Visit Us** section on the homepage actually did pick that up — it shows "11:00 AM to 9:00 PM" (live from the DB). What did **not** change is the **hero subheadline** ("Open Tuesday to Sunday 11 a.m. to 9 p.m. Closed Mondays") and the "Tuesday–Sunday / Closed Mondays" labels near the Hours card. Those are still hard-coded strings, not derived from the `store_hours` table.

At the same time, the admin only exposes four editable areas today — **Vital Info, Hours, Booking Schedule, Bookings**. Everything else on the site (hero headline, story copy, token tiers, FAQs, news, birthdays, reviews, gift cards, careers, page heroes, etc.) is baked into `src/content/cmsData.ts` and is not touchable from `/klawsome-admin` at all. This plan focuses on making the fields you *can* currently edit fully propagate. If you also want new admin tabs to edit that other content, that's a separate (larger) piece of work — call it out and I'll plan it next.

## Changes

### 1. Hero subheadline is now live
- `src/components/KawaiiHero.tsx`: stop reading `hero_subheadline` from static `homepage_content`. Instead, compose a live subheadline from `store_hours` (e.g. `"Open Tuesday–Sunday, 11:00 AM to 9:00 PM. Closed Mondays."`), with a graceful fallback while the query is loading.

### 2. Visit Us section fully live
- `src/components/KawaiiVisit.tsx`:
  - Replace the hard-coded `"Tuesday–Sunday, {hoursText}"` and `"Closed Mondays"` with a helper that reads `store_hours` and outputs the actual open-day range plus the actual closed-day(s).
  - Keep the same visual layout; only the strings become dynamic.

### 3. Shared "hours summary" helper
- Add `src/lib/hoursSummary.ts` exporting `formatHoursSummary(hours: StoreHour[])` returning `{ dayRange, timeRange, closedDays, full }`. Both Hero and Visit use it so the wording stays consistent and future components can reuse it.

### 4. Propagation audit for currently-editable fields
Verify every reference to Vital Info + Store Hours reads from the live hook (they mostly do already). Confirmed live: `KawaiiFooter`, `KawaiiContactInfo`, `KawaiiVisit`, `FloatingContactWidget`, `Business`, `BusinessDevelopment`, `Birthdays`. No changes needed there — just documented so we know the audit is complete.

### 5. Cache freshness
`useCmsContent`'s live query has a 60s `staleTime`. Confirm this is acceptable; changes made in admin show up on the site within ~60s or on next page load. No code change unless you want instant refresh (would need a broadcast channel or shorter staleTime).

## Explicitly out of scope (flag if you want it)
- Adding admin editors for `homepage_content` (hero headline / story), `token_tiers`, `news_articles`, `faqs`, `birthdays_content`, `reviews`, `gift_cards_content`, `page_heroes`, `our_story_sections`, `rewards_benefits`, `business_sections`, `party_options`, `job_listings`, `invite_templates`. Each would need (a) a new admin tab, (b) moving that table into `LIVE_TABLES`, and (c) seeding the DB from `cmsData.ts`.

## Question before I build
Do you want me to also expand `/klawsome-admin` with tabs for the other content areas (homepage hero copy, FAQs, news, token tiers, reviews, gift cards, etc.), or just do the propagation fix above for now?

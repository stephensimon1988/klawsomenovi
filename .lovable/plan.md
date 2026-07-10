# Wire all pages to Vital Info + Hours

## Goal
Every place on the site that shows phone, email, address, social links, or store hours reads from `site_settings` / `store_hours` (edited in `/klawsome-admin`). No hardcoded copies that silently override the admin.

## Audit findings (what's already wired vs. not)

**Already CMS-wired (via `useCmsContent`)**
- `KawaiiFooter` — email, phone, address, socials (with hardcoded fallbacks)
- `KawaiiVisit` — address + hours (with hardcoded fallbacks)
- Homepage About/Hero/Story blocks

**Hardcoded — bypasses admin today**
- `KawaiiContactInfo.tsx` — team@ / events@ emails, phone, address
- `FloatingContactWidget.tsx` — hardcoded email recipients
- `KawaiiNav.tsx` — any address/phone in header
- `Birthdays.tsx` — `bookingEmail` fallback `events@klawsomenovi.com`
- `Business.tsx` / `BusinessDevelopment.tsx` — `hello@`, `team@`, "Novi, MI (48375)"
- `BookingWizard.tsx` — hardcoded `events@klawsomenovi.com`
- `data/jobDescriptions.ts` — full street address + store hours embedded in job copy
- Fallback hours strings in `KawaiiVisit` ("Closed Mondays")

## Plan

### 1. Extend Vital Info (site_settings) with missing fields
Add editable fields the site actually uses but the admin doesn't expose:
- `events_email` (separate from general `email`)
- `booking_phone` (if different from main phone)
- Keep existing: business_name, phone, email, address, google_maps_url, instagram_url, tiktok_url, facebook_url, youtube_url

### 2. Rewire every hardcoded reference to CMS
Replace hardcoded strings with `useCmsContent()` reads + a single shared fallback (used only if the row is truly missing):
- `KawaiiContactInfo` → email / events_email / phone / address from settings
- `FloatingContactWidget` → recipients from settings
- `Birthdays` → booking email from settings (drop hardcoded fallback)
- `Business`, `BusinessDevelopment` → contact email + address from settings
- `BookingWizard` → events email from settings
- `KawaiiFooter`, `KawaiiVisit` → keep wiring, remove stale hardcoded fallbacks
- `jobDescriptions.ts` → template strings that inject address + hours at render time (or a note that job copy is static — see Open Question)

### 3. Rewire hours everywhere
- Ensure `KawaiiVisit`, footer hours block, and any "hours" mention on Birthdays / Business / Careers read from `store_hours` (via `useCmsContent().hours`), formatted by a small shared helper.
- Remove "Closed Mondays" hardcoded caption; derive from data.

### 4. Add a build-time guard
Small script (`scripts/check-hardcoded-contact.mjs`) that greps `src/**` for the literal phone / emails / address and fails if new hardcoded copies appear. Wired into the existing `scripts/` folder pattern.

### 5. Manual verification checklist
After changes, walk these routes and confirm every element updates when the admin value changes:
`/`, `/rental`, `/birthdays`, `/business`, `/business-development`, `/careers`, `/community-partners`, `/gallery`, `/faq`, `/news`, `/our-story`, `/rewards`, `/store`, `/klawsome-video-game`, `/claw-machine-tips`, footer + nav on every page, Floating Contact widget, Booking Wizard "email us" screen.

## Open questions

1. **Job descriptions** in `src/data/jobDescriptions.ts` embed the full address and tentative hours inside long paragraphs. Do you want those rewritten to pull from CMS at render time, or leave that copy static (since it's legal/HR-style text)?
2. **Separate "events" email** — right now the site uses `team@klawsomenovi.com` for general and `events@klawsomenovi.com` for bookings. Add a second `events_email` field in Vital Info, or collapse both to a single `email`?
3. **Phone number** — do you also want a `booking_phone` distinct from the main phone, or one number everywhere?

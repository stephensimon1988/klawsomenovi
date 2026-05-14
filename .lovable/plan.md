# Simplify /contact page

## Goal
Strip the verbose CMS-driven contact sections and replace with a clean, condensed two-column layout: image on the left, all four contact items stacked in a single column on the right.

## Changes

**`src/pages/Contact.tsx`**
- Keep `KawaiiNav`, `PageHero` (still pulled from CMS), and `KawaiiFooter`.
- Remove `<DynamicSections pageKey="contact" />`.
- Add a new hardcoded `<section>` with a 2-column grid (`md:grid-cols-2`, single column on mobile):
  - **Left column:** a friendly contact-themed image (reuse an existing kawaii asset from `src/assets/`, or fall back to a pastel illustrative image already in the project). Rounded corners, soft shadow, matches kawaii tokens.
  - **Right column:** four stacked items, each with a small icon + label + value + one short supporting line. No bullet lists.
    1. **General Inquiries** — `team@klawsomenovi.com` — "Gameplay, tokens, lost items, feedback, media."
    2. **Events & Birthdays** — `events@klawsomenovi.com` — "Birthday parties, group events, school & corporate visits."
    3. **Phone** — `(248) 938-4093` — "Call during open hours; leave a message if we're on the floor."
    4. **Visit Us** — `42768 Grand River Avenue, Suite C-140, Novi, MI 48375` — "Inside Sakura Novi · Tue–Sun, 11 a.m. – 9 p.m."
  - Emails and phone become `mailto:` / `tel:` links.

## Styling
- Use existing kawaii semantic tokens (pastel bg, rounded corners, Quicksand headings / Nunito body). No new colors.
- Section background chosen to respect divider rules vs. the hero above and footer below (`secondary-soft` previously fed into footer — keep that boundary intact).

## Out of scope
- No Prismic CMS edits (existing contact slices remain in CMS but unused on this page).
- No changes to nav, footer, or hero.
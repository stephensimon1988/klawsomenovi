## Goal

1. Delete the `/contact` page entirely.
2. Take the "contact info" section currently on `/contact` (image + 4 info cards on baby-blue) and make it the final section above the footer on every page.
3. Audit the dividers so the new section flows cleanly into the footer everywhere.

## Changes

### 1. Remove `/contact`
- Delete `src/pages/Contact.tsx`.
- Remove the `Contact` lazy import and `/contact` route in `src/App.tsx`.
- Remove the `Contact` entry from `moreLinks` in `src/components/KawaiiNav.tsx`.

### 2. New shared component `src/components/KawaiiContactInfo.tsx`
- Lift the existing baby-blue contact block from `Contact.tsx` (image on left, 4 info cards on right: General Inquiries, Events & Birthdays, Phone, Visit Us).
- Same content/styling as the current screenshot (`bg-klawsome-baby-blue`, rounded image card, icon cards). Reuses `contactImage` from `@/assets/contact-hero.webp`.
- Self-contained section, no props.

### 3. Wire it into the global footer
- In `src/components/KawaiiFooter.tsx`:
  - Import and render `<KawaiiContactInfo />` as the first thing returned.
  - Place a `<KawaiiDivider from={prevColor} to="baby-blue" />` above the contact section (skipping when `prevColor === 'baby-blue'`).
  - Then a `<KawaiiDivider from="baby-blue" to="red" />` between contact section and the red footer.
  - Remove the now-dead `showReadyToPlay` CTA block (it has been hard-coded `false` for a while and would conflict with the new fixed section).

Because every page already ends with a call to `<KawaiiFooter prevColor={...} />`, this single change adds the contact section above the footer on every page automatically — no per-page edits needed.

### 4. Divider audit (per `mem://design/divider-rules`)
Current `prevColor` values handed to the footer:
- `white` — Index, Store, Rewards, Rental, OurStory, Business, News, Gallery, Faq
- `baby-pink` — BusinessDevelopment, ClawMachineTips, Birthdays (conditional)
- `navy` — Birthdays (conditional)
- `secondary-soft` — CommunityPartners, InfoHub
- (no page currently uses `baby-blue` for `prevColor` — Contact is the only one and it's being removed)

For each value the new top divider becomes `from={prevColor} to="baby-blue"`, which is a valid color change in every case. No page has a final section colored baby-blue, so we won't hit the "same color across a divider" rule. The bottom divider `baby-blue → red` is also a clean transition.

I will spot-check Birthdays (its conditional `prevColor` already passes a real color in both branches) and ClawMachineTips (uses an `as any` cast on `'baby-pink'`, still valid).

### Verification
- Build passes.
- Visually confirm `/`, `/gallery`, `/birthdays`, `/community-partners`, `/business-development` show the new section above the footer with proper scallop dividers and no color clashes.
- Confirm `/contact` now 404s and the "Contact" link is gone from the More menu.

## New page: `/claw-machine-tips`

A static informational page styled to match the rest of the site (PageHero + alternating sections + kawaii dividers + footer), modeled on the structure of `OurStory.tsx` / `Birthdays.tsx`.

### Route
- Add lazy import and `<Route path="/claw-machine-tips" element={<ClawMachineTips />} />` in `src/App.tsx` above the catch-all.

### New file: `src/pages/ClawMachineTips.tsx`
Structure (top → bottom), all wrapped with `KawaiiNav` and `KawaiiFooter`:

1. **PageHero**
   - Eyebrow: "Klaw School"
   - Title: "Tips to Win Claw Machines"
   - Subtitle: short tagline about strategy beating luck
   - Reuses an existing kawaii hero image (e.g. one of the claw/plush assets already in `src/assets/`)
   - Jump links to each section below

2. **Section 1 — Intro / Strategy Basics** (white bg)
   - Lead paragraph: "The claw doesn't grab the same strength every time — but smart positioning greatly increases your chances of winning."
   - Body covering: aiming for top of plush is the #1 mistake; look for stacked or "alone" toys; aim for the gap between toys; commit to the drop; go for smaller prizes; near-the-chute plays; check depth from the side.

3. **Section 2 — Aim for the Right Plush** (secondary/40 bg)
   - Two-column "Best to grab" ✅ vs "Avoid" ❌ list cards.

4. **Section 3 — Push, Don't Just Grab** (white)
   - Short copy + 3-bullet list (push toward chute, use claw edges, reposition, make progress on every grab).

5. **Section 4 — Watch Before You Play** (secondary/40)
   - Bullet list (loose plush, recent wins, machine patterns).

6. **Section 5 — Start With Beginner Machines** (white)
   - Highlights Klawsome's "play till you win" machines as a great starting point.

7. **Section 6 — Pro Tips** (boxed, on a colored band — navy or baby-pink)
   - A single bordered/rounded "card" callout with the 🔥 bullets (plush near prize door, aim slightly behind, reposition before grabbing, stay patient).

8. **CTA strip** (small)
   - "Ready to test your skills?" with a Book/Visit button linking to `/store` or opening the booking modal — keeps it consistent with other pages.

### Styling rules followed
- Uses existing design tokens / classes (`ds-container`, `ds-h2`, `ds-eyebrow`, `ds-lead`, `ds-stroke--red/yellow`, `rounded-kawaii`, `section-y`, `section-x`).
- Alternating section backgrounds (`bg-background` ↔ `bg-secondary/40`, plus one accent band for Pro Tips), separated by `KawaiiDivider` with matching from/to colors per the divider rules in memory.
- No new design tokens; no custom colors; semantic tokens only.

### Out of scope
- No CMS schema. Content is hard-coded in the page (matches the tone of the request, which provided the exact copy).
- No nav link addition — page is reachable via the direct URL only, unless you want it added to the nav.

### Files touched
- `src/App.tsx` — add lazy import + route.
- `src/pages/ClawMachineTips.tsx` — new file.

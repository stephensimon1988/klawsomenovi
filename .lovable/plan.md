## Goal

Audit every subpage and ensure a kawaii divider sits at every section background-color transition. Fix the gaps found.

## Audit Results

### Pages already correctly dividered
- **Birthdays** — navy → red → navy transitions all have dividers
- **OurStory** — auto-cycles dividers between alternating sections
- **Careers** — navy → red → navy dividers present
- **Rental** — wave/scallop wrap the pricing section
- **Rewards** — cloud + bumps between white/navy/white
- **BusinessDevelopment** — has dividers around How It Works + Contact
- **Community / Contact / Store / InfoHub** — render via `DynamicSections`, which already auto-injects dividers between alternating bg sections
- **Team / News / Faq / Gallery** — single-bg-color pages, no internal transitions to divide

### Missing dividers (gaps to fix)

**1. Site-wide: `PageHero` → first content section.** Every page using `PageHero` ends the hero with a sharp dark gradient edge butting into the white content below — no kawaii divider. This affects: OurStory, Careers, Rental, Rewards, Team, Faq, Gallery, News, Community, Contact, Store, InfoHub, Birthdays (custom hero, but uses navy→navy so OK).

**2. BusinessDevelopment — between the three opportunity sections.**
- `#hosted` ends `bg-white` → `#partner` starts `bg-klawsome-navy` (no divider)
- `#partner` ends `bg-muted/30` → `#plushie` starts pink-gradient (no divider)

**3. BusinessDevelopment hero/tabs.** Hero is navy, tabs bar is `bg-muted/90` (sticky), then `#hosted` is mint gradient. The sticky tabs bar makes a divider here visually awkward — leave as-is.

## Changes

### A. `src/components/PageHero.tsx`

Append a bottom kawaii divider that transitions from the hero's dark gradient to white. Since the hero ends in a near-black gradient overlay and the next section is `bg-background` (white), use a `wave` or `brush` divider with `from="navy"` to `to="white"`, baby-pink stroke, height ~80. Render it as a sibling AFTER the hero `<section>` (still inside the component) so it doesn't overlap the hero content.

This single edit fixes the hero→content gap on **every** page using `PageHero`.

Edge cases:
- Pages where the next section is NOT white (e.g. Rewards' first benefits section is `bg-background` ✓; Rental's first section is `bg-secondary/50` — its existing wave divider already handles that, but adding navy→white above it would create navy→white→[wave]→secondary-soft which still flows). To handle this cleanly, pick `to="white"` since `bg-background` ≈ white on all subpages, and the existing internal dividers handle subsequent transitions.

### B. `src/pages/BusinessDevelopment.tsx`

Add two dividers between the opportunity sections:

1. **Between `#hosted` and `#partner`** — after the `bg-white` block of hosted closes (line ~336), before `<section id="partner">` opens:
   ```tsx
   <KawaiiDivider variant="petals" from="white" to="navy" stroke="baby-pink" height={90} />
   ```

2. **Between `#partner` and `#plushie`** — after partner's `bg-muted/30` block closes (line ~386), before `<section id="plushie">`:
   ```tsx
   <KawaiiDivider variant="bumps" from="muted-soft" to="baby-pink" stroke="yellow" height={90} />
   ```

(`muted-soft` is already supported in `KawaiiDivider`; `baby-pink` matches the start of the pink gradient closely enough.)

### C. Verify with built-in DividerAudit

The `DividerAudit` component (Shift+D in dev) walks the DOM and reports same-color stacking and from/to mismatches. After the edits, run it on each page and confirm zero issues.

## Out of scope
- `Business.tsx` (legacy `/business` route) — already has its own custom SVG wave hero divider; leave untouched unless requested.
- Birthdays' custom hero — already navy on both sides, no divider needed.

## Files touched
- `src/components/PageHero.tsx` (1 edit, propagates to ~12 pages)
- `src/pages/BusinessDevelopment.tsx` (2 dividers added)

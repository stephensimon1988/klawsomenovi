## Problem
Business hours are only mentioned once at the very top of the homepage and then buried inside a paragraph in the Visit Us section near the bottom. Customers who scroll through reviews and pricing have no easy way to spot hours again without scrolling back up or digging through footer text.

## Goal
Make hours immediately visible to scanners in the "Visit Us" section by extracting them from the paragraph into a distinct, icon-led info block.

## Proposed Change
In `src/components/KawaiiVisit.tsx`:

1. **Add a hours info row** below the paragraph and above the CTA buttons.
2. **Use the existing `Clock` icon** (already imported) and CMS `hours` data.
3. **Style as a rounded card** with a light background (`bg-background/70`, `rounded-xl`, `p-4`) so it pops against the baby-pink section background.
4. **Keep the paragraph text** but remove the hours sentence from it so the info block becomes the single, scannable source of truth for hours in this section.

### Visual layout
```text
[Visit Us]
[Find us at Sakura Novi]
[Klawsome sits at {address}.]

┌─────────────────────────────────────┐
│ 🕐  Tue–Sun, 11 a.m. – 9 p.m.       │
│     Closed Mondays                   │
└─────────────────────────────────────┘

[Directions]  [Call Us]
```

## Files to edit
- `src/components/KawaiiVisit.tsx` (only file)

## Out of scope
- No changes to the footer or hero hours.
- No new dependencies.
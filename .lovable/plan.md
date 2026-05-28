# Site-wide framed image treatment

## Goal
Recreate the "under-layer" look from `/claw-machine-tips` as a reusable piece and roll it out to all section/content photos, with three upgrades:
1. The **bottom CTA photo** (the contact / "Visit Us" style section) becomes **square** and gets the treatment.
2. The under-layer panels use **varied pastel colors** across sections.
3. The **frame rotates ~5° clockwise** while the **photo inside stays perfectly upright** (zoomed in slightly to fill the tilted frame), and the **colored under-layer stays stationary** (no rotation).

## How the effect works
Three stacked layers in a `relative` wrapper:

```text
┌──────────────────────────────┐
│  under-layer (stationary)    │  offset colored rounded panel, NOT rotated
│   ┌────────────────────┐     │
│   │ frame (rotated 5°)  │     │  rounded corners + shadow, rotate(5deg)
│   │   [ photo upright ] │     │  img counter-rotated -5° + scale(~1.15)
│   └────────────────────┘     │
└──────────────────────────────┘
```

- Frame element: `rotate(5deg)`, `overflow-hidden`, `rounded-kawaii`, shadow.
- Image: `rotate(-5deg) scale(1.15)` so it nets to upright and still fully covers the tilted frame (no empty corners, same resolution — just zoomed).
- Under-layer: an absolutely-positioned offset div behind the frame, colored, **not** transformed.

## New reusable component: `src/components/FramedImage.tsx`
Props: `src`, `alt`, `color` (pastel token name, e.g. `baby-pink`), `aspect` / `className` for sizing, `rotate` (default `5`), `loading`. It renders the three-layer structure above and accepts class overrides so each section can set its own height/aspect ratio (e.g. square for the CTA, 4:5 elsewhere).

Colors cycle through existing pastel tokens — `baby-pink`, `baby-blue`, lavender, mint, peach, yellow — so under-layers stay "all different colors" as requested.

## Where it gets applied (section/content photos + page heroes only)
Excluded per scope: nav/footer logos, review avatars, product grid thumbnails, dense gallery grids, and the full-bleed home hero background.

- **Bottom CTA** — `src/components/KawaiiContactInfo.tsx`: change the photo from `aspect-[4/5]` to **square**, wrap in `FramedImage`.
- `src/pages/ClawMachineTips.tsx` — replace the existing hand-built under-layer markup (5 section photos) with `FramedImage` and add the new 5° frame rotation so it matches site-wide behavior.
- `src/pages/OurStory.tsx` — intro photo + the two story-section photos.
- `src/components/KawaiiStory.tsx`, `src/components/KawaiiVisit.tsx` — section feature photos.
- Section/feature photos on `src/pages/Birthdays.tsx`, `Careers.tsx`, `CommunityPartners.tsx`, `Rewards.tsx`, `Rental.tsx`, `BusinessDevelopment.tsx` (single feature/section images only, not repeating card grids).
- `src/components/PageHero.tsx` — the contained hero photo (kept subtle).

Each call site passes a different `color` so adjacent sections vary.

## Technical notes
- Pastel colors come from existing CSS vars (`--klawsome-baby-pink`, `--klawsome-baby-blue`, etc.) — no new design tokens needed.
- `rounded-kawaii` and `shadow-lg` already exist and are reused.
- Scale factor (~1.15) is tuned so a 5° counter-rotation never reveals frame corners on both square and 4:5 ratios; the image keeps its native resolution (CSS transform only).
- No backend, data, or routing changes — purely presentational.

## Out of scope (will not touch)
Logos, avatars, product/store thumbnails, gallery/news thumbnail grids, and the full-bleed homepage hero background.
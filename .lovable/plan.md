## Goal
Add an animated divider and a new colored "Sponsorships or Donations" section to the `/community-outreach` page, positioned directly under the "Getting Started is Easy" section.

## Layout

```
[PageHero]
[Getting Started is Easy]  ← white bg
<KawaiiDivider wave white → baby-pink>
[Sponsorships or Donations]  ← baby-pink bg (new)
<KawaiiDivider wave baby-pink → white>
[Our Partners]             ← white bg (existing)
[Cross-Promote]            ← existing
[KawaiiFooter]
```

## Changes

### 1. `src/pages/CommunityPartners.tsx`

- Import `KawaiiDivider`.
- Insert **two** `KawaiiDivider` components around the new section:
  - `from="white" to="baby-pink"` (above)
  - `from="baby-pink" to="white"` (below)
- Add a new `<section id="donations">` between the dividers with `bg-klawsome-baby-pink/30` and standard `section-y section-x` padding.
- Section content:
  - Eyebrow: "Give Back"
  - H2: "Sponsorships or Donations" (with `ds-stroke ds-stroke--navy`)
  - Intro paragraph
  - Two highlighted gift-package options in a card grid:
    - **XL Plushie Package** — $20 gift card + XL plushie (total value $90)
    - **Regular Plushie Package** — $20 gift card + two regular plushies in gift basket (total value $70)
  - Processing & pickup info (5 days lead time, Mon–Thu pickup preferred)
  - Social-media request paragraph with the Facebook share link
  - Closing thank-you paragraph
  - **Image grid** — 4 placeholder divs in a 2×2 (mobile) / 4-column (desktop) grid, each with `aspect-[3/4]` and a soft placeholder background (`bg-white/60 rounded-2xl flex items-center justify-center text-muted-foreground text-sm`). These are explicitly marked with `data-placeholder` so the user can swap in real images later.

### 2. Content tone
Match the warm, friendly kawaii brand voice already used on the page.

### 3. No other files touched.

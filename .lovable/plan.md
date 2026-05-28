## Goal

Two improvements to the site-wide `FramedImage` treatment:
1. The colored under-layer must never match the background of the section it sits in.
2. Add a hover interaction: the frame straightens (rotates to level) so it lines up perfectly over the stationary under-layer, the photo stays upright (orientation never changes), and the photo zooms in slightly as the frame straightens.

## Part 1 — Under-layer never matches the section background

Root cause found: in `index.css`, `--secondary` and `--klawsome-baby-blue` are the identical HSL value (`190 75% 91%`). So a `baby-blue` under-layer inside a `bg-secondary` (or `bg-secondary/40`) section is invisible — it blends into the section.

Two-part fix:

**A. Defensive guard in the component.** Add an optional `sectionBg` prop to `FramedImage` (accepts a pastel token name plus `'secondary'`, `'white'`, `'background'`, `'navy'`, `'primary'`). When the requested under-layer `color` resolves to the same family as `sectionBg`, the component automatically shifts to the next pastel in the cycle so it can never blend in. Treat `secondary` as equivalent to `baby-blue` in this check.

**B. Audit + fix every call site** so the chosen color already contrasts (the guard is a safety net, not the primary mechanism):

```text
Component / page          Section bg            Current color   Action
KawaiiStory               secondary (=blue)     baby-blue       CONFLICT -> change to lavender/peach
OurStory (even sections)  secondary/40 (blue)   baby-blue       CONFLICT -> change to peach/mint
OurStory intro            white                 baby-pink       ok
KawaiiVisit               baby-pink             lavender        ok
KawaiiContactInfo         (verify)              peach           verify, pass sectionBg
Birthdays                 navy                  baby-blue       ok
ClawMachineTips x5        white / blue / pink   pink/blue/mint/
                                                lavender/yellow ok (watch=mint on blue ok)
DynamicSections           white / secondary     cycled          pass section color so cycle skips it
```

All call sites will pass `sectionBg` so the guard stays accurate even if content/section colors change later.

## Part 2 — Hover animation

Current resting state: frame `rotate(5deg)`, photo counter-rotated `rotate(-5deg) scale(1.15)` so it reads upright and covers the tilted frame. Under-layer is stationary.

On hover:
- Frame animates from `rotate(5deg)` to `rotate(0deg)` — it straightens and aligns perfectly over the stationary under-layer.
- Photo animates from `rotate(-5deg)` to `rotate(0deg)` so it stays perfectly upright the whole time (net orientation is upright at rest and on hover — the picture never appears to spin).
- Photo scale increases slightly (e.g. `1.15` to `1.22`) for the subtle zoom-in.
- Under-layer never moves.

Smooth transition (~350-450ms ease-out) on both the frame and the photo transforms. Works on touch/no-hover gracefully (just stays in the resting tilted state).

## Technical notes

- Because the rotation amount is a dynamic prop, the hover transforms will be driven by CSS custom properties (e.g. `--frame-rot`, `--img-rot`, `--img-scale`) set inline on the element, with a small CSS rule block (in `index.css`) that reads those vars and overrides them on `:hover` of the wrapping `group`. This keeps the per-instance `rotate` prop working while still allowing a CSS hover transition.
- `transition-transform` + easing added to both the frame and photo layers.
- No backend, data, or routing changes — purely presentational edits to `FramedImage.tsx`, `index.css`, and the under-layer color props at each call site.
- After implementation: visually QA the hover on a couple of sections (e.g. the Story and Visit sections, plus a `bg-secondary` section) to confirm the frame lands flush on the under-layer and no section shows a matching/invisible under-layer.

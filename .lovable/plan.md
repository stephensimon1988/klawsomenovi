## Goal

Animate `KawaiiDivider` so each divider is wider than the viewport and slides horizontally based on the user's mouse X position — a subtle parallax that feels alive but never causes a horizontal scrollbar.

## Behavior

- Each divider's inner SVG renders at **110vw** width, centered (so there's ~5vw of bleed on each side).
- The divider container clips overflow (`overflow-hidden`) so the extra width never affects page scroll.
- As the mouse moves across the page horizontally, the inner SVG translates left/right within its ~10vw of slack:
  - Mouse at far left → SVG shifted ~+5vw (showing left bleed pulled in)
  - Mouse at far right → SVG shifted ~-5vw
  - Mouse centered → SVG centered
- Movement is smoothed (eased / lerped) so it feels gentle, not twitchy.
- Respects `prefers-reduced-motion`: stays centered, no tracking.
- On touch / no-pointer devices: stays centered (no listener attached).

## Implementation

1. **`KawaiiDivider.tsx`**
   - Wrap the `<svg>` in an inner element styled `width: 110vw; margin-left: -5vw;` (or `left: -5vw; position: relative`). Outer wrapper keeps `w-full overflow-hidden`.
   - Apply a CSS variable for the horizontal offset, e.g. `transform: translate3d(var(--divider-x, 0px), 0, 0)` on the inner element, with a short `transition` for smoothing.

2. **Global mouse tracker** (single listener, not per-divider)
   - Add a small hook `useDividerParallax` mounted once (e.g. in `App.tsx` or a tiny `<DividerParallax />` component rendered inside `App`).
   - On `pointermove`, compute normalized X: `nx = (clientX / innerWidth) * 2 - 1` (range -1..1).
   - Use `requestAnimationFrame` + lerp toward target for smoothing.
   - Write the value to `document.documentElement.style.setProperty('--divider-x', `${nx * -vwPx * 0.05}px`)` (≈5vw max shift, inverted so movement feels "natural" — image follows cursor rather than runs away; we'll pick the direction that feels best during build).
   - Skip when `matchMedia('(prefers-reduced-motion: reduce)').matches` or `matchMedia('(pointer: coarse)').matches`.

3. **No per-page changes required.** All existing `<KawaiiDivider />` usages benefit automatically.

## Out of scope

- No changes to divider shapes, colors, heights, or section backgrounds.
- No vertical parallax, no scroll-based animation (mouse-driven only, per request).
- No changes to non-divider elements.

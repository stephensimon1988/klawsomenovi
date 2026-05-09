## Goal
Add a playful "claw machine" interaction to the top nav: a claw image hangs from the top of the viewport, drops down on nav hover, and tracks the cursor horizontally as it moves across the nav.

## Asset
- Copy `user-uploads://toppng.com-advertising-marketing-claw-machine-claw-closed-1053x1716.png` into `src/assets/nav-claw.png` and import as ES6 module.

## New component: `src/components/NavClaw.tsx`
A fixed-position element rendered as a sibling of the nav (mounted inside `KawaiiNav.tsx`), independent of nav layout flow.

### Structure
```tsx
<div
  ref={clawRef}
  className="fixed top-0 z-40 pointer-events-none"
  style={{ left: x, transform: `translate(-50%, ${y}px)`, width: 100 }}
>
  <img src={navClaw} className="w-[100px] h-auto" />
</div>
```
- `width: 100px` cap, anchored by its bottom edge.
- `pointer-events-none` so it never blocks nav clicks.
- `z-40` so it sits below the nav bar contents (`z-50`) — claw "hangs from" the bar.

### Behavior
Two states driven by hover on the nav element:

1. **Idle** — claw hidden above viewport (`y = -clawHeight`).
2. **Drop** — on `mouseenter` of the nav container, animate `y` so the claw's bottom is 100px below the top of the viewport (i.e. `y = 100 - clawHeight`). Use Framer Motion `animate` with a spring (stiffness ~120, damping ~14) for a satisfying bounce.
3. **Track** — while hovering, `mousemove` on the nav updates `x` to the cursor's clientX, smoothed via Framer Motion `useSpring` (stiffness ~150, damping ~20) so it lags slightly like a real claw cable. Vertical position stays locked at the dropped value (horizontal tracking only).
4. **Retract** — on `mouseleave`, animate `y` back above the viewport.

### Implementation details
- Use Framer Motion `motionValue` for `x` and `y`, wrapped with `useSpring` for smoothed cursor follow.
- Initial `x` = `window.innerWidth / 2`.
- Listen on the `<nav>` element via React refs added in `KawaiiNav`. Pass the nav ref into `NavClaw`, or attach handlers (`onMouseEnter`, `onMouseMove`, `onMouseLeave`) directly on the nav root.
- Disable on mobile (`md:` breakpoint) — the claw is decorative and pointer-driven; render only when `window.matchMedia('(min-width: 768px)').matches`.
- Respect `prefers-reduced-motion`: skip the drop/spring and just keep claw hidden.

## Edits to `src/components/KawaiiNav.tsx`
- Add `onMouseEnter` / `onMouseLeave` / `onMouseMove` handlers on the root `<nav>` to drive `NavClaw` state (via local state or context).
- Render `<NavClaw>` as a sibling inside the nav root, outside the inner container so absolute positioning isn't affected.
- Keep existing nav transparency / scrolled styles untouched.

## Edge cases
- When `scrolled` is true and nav has a background, claw stays in front of background gradient but behind dropdown menus (`z-40` < `z-50` dropdown).
- Window resize: recalculate clamping so the claw never leaves the viewport horizontally (clamp `x` to `[clawWidth/2, innerWidth - clawWidth/2]`).
- Mobile menu open: hide claw.

## Files touched
- New: `src/assets/nav-claw.png`, `src/components/NavClaw.tsx`
- Edit: `src/components/KawaiiNav.tsx`

No backend, no design tokens, no other pages affected.
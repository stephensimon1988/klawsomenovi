

## Plan: Match Hero container width to Nav

**Problem**: The nav uses `container mx-auto px-4` (Tailwind's `container` class, max-width 1400px centered). The hero content wrapper uses `w-full px-4` with no max-width constraint, so it stretches wider than the nav on large screens.

**Fix**: Replace the hero's inner content `div` (line 68) with the same `container mx-auto px-4` pattern used by the nav.

**Change in `src/components/KawaiiHero.tsx`**:
- Line 68: Change `<div className="relative z-10 w-full px-4 py-16">` to `<div className="relative z-10 container mx-auto px-4 py-16">`

One line change, one file.


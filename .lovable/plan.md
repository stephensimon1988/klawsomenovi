## Plan

**1. Upload new image as a Lovable Asset**
- Run `lovable-assets create` on `/mnt/user-uploads/plushie.jpg` → `src/assets/bizdev/plushie-custom-orders.jpg.asset.json`.

**2. Swap the image in `src/pages/BusinessDevelopment.tsx` (line ~372–379)**
- Update the import to use the new `.asset.json`.
- Update the `alt` text to describe the new photo (person holding a yellow sunflower plushie in front of Klawsome claw machines).

**3. Add a confined parallax effect to that single image card**
- Wrap the image in a fixed-aspect, `overflow-hidden` container (keep current rounded-2xl shadow). The container becomes the "window".
- Inner `<img>` is taller than the window (e.g. ~140% of container height) and translated on the Y axis based on scroll.
- Use a small React component (e.g. `ParallaxImage`) local to this file:
  - Tracks the container's bounding rect via `requestAnimationFrame` + scroll/resize listeners.
  - Computes `progress = (viewportCenter − containerCenter) / (viewportHeight/2 + containerHeight/2)`, clamped to `[-1, 1]`.
  - When `progress === 0` (container perfectly centered in viewport) → `translateY(0)` so the image's true center is shown.
  - Otherwise translate by `progress * maxOffset`, where `maxOffset = (imageHeight − containerHeight) / 2`. This guarantees the image always fully covers the window (no empty edges) and the center aligns exactly when the window is centered.
  - Slow speed comes from making the image only modestly taller than the window (~30–40% extra), so the max travel is small over a full scroll pass.
- Respect `prefers-reduced-motion` → disable translation.
- Only affects this one image; nothing else on the page changes.

### Technical details
- No new dependencies; pure React + CSS transform with `will-change: transform`.
- Use `transform: translate3d(0, Ypx, 0)` for GPU compositing.
- Container: keep responsive height roughly matching current `max-h-72` look (e.g. `h-72 md:h-80`), `overflow-hidden`, `rounded-2xl`.
- Image: `absolute inset-x-0 top-0 w-full h-[140%] object-cover`.

# Fix framed-photo overflow on mobile/tablet

## What's happening
Measured at 767px wide on `/`, `/our-story`, `/birthdays`, `/claw-machine-tips`: the only elements still pushing past the page edges are the tilted framed photos (`FramedImage`).

Two things make it wider than its column:
1. The colored under-layer sits at `-inset-3` (12px outside the photo on every side).
2. The frame is rotated 5deg, so its corners swing another ~15-20px past the column edge at this width.

Measured frame box: left `-15px`, right `782px` in a 767px viewport — about 15px bleeding out on each side. Sections whose wrapper happens to have `overflow-hidden` hide it; the rest leak and create the sideways scroll. That's why it only shows up on this one section type across pages.

## The fix
Handle it once inside `FramedImage` so every page benefits, and size it to match the framed photos that already sit correctly inside the gutters:

- Give the framed photo's own wrapper room for the offset panel instead of letting it hang outside the column (inner padding equal to the under-layer offset), so the panel is inside the layout box rather than bleeding out.
- Below the `lg` breakpoint, flatten the tilt (frame and counter-rotated photo both go to 0deg) so no rotated corner can extend sideways. Desktop keeps the current 5deg tilt and hover straighten exactly as today.
- Clamp the wrapper to `max-w-full` so it can never exceed its grid column.

No changes to the photos used, section copy, ordering, or the hover zoom behavior.

## Technical details
- `src/components/FramedImage.tsx`: root wrapper gets `relative max-w-full p-3` and the under-layer moves from `-inset-3` to `inset-0`, so the offset panel renders inside the element box. Frame keeps `--frame-rot`.
- `src/index.css` (`.framed-frame` / `.framed-img` block): add a `@media (max-width: 1023px)` rule setting `--frame-rot: 0deg` and `--img-rot: 0deg` so the tilt is desktop-only.
- Verify with Playwright at 390px and 820px on `/`, `/our-story`, `/birthdays`, `/claw-machine-tips`, `/rental`, `/business` that `scrollWidth === clientWidth` and no element's bounding box crosses the viewport edges.
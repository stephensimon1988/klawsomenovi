# Match the lower framed photo to the upper one (and stop it bleeding off-screen)

## What I measured at 767px on `/`
- Upper framed photo ("Find us at Sakura Novi"): wrapper 655px wide, sits inside the page gutters. This is the correct size.
- Lower framed photo (contact section, "Klawsome friends ready to help"): wrapper 735px wide, and the rotated frame reaches `left = -2px` with the photo box out to `-25px` — past the left edge.

Two separate causes, both confirmed by measurement:

1. **Different gutters.** The contact section uses `ds-container-content px-4` (16px sides) instead of the site-standard `section-x` gutters (24px, 48px at lg) that every other framed-photo section uses. That alone makes it ~80px wider than the upper one.
2. **The below-desktop tilt flattening isn't taking effect.** `FramedImage` sets `--frame-rot` / `--img-rot` as inline styles on the elements, and inline custom properties beat the `@media (max-width: 1023px)` rule in `index.css` that tries to reset them to `0deg`. So the frame is still rotated ~5deg at 767px and its corners swing outside the column.

## The fix
- Contact section: use the standard `section-x` gutters (drop the one-off `px-4`), so its framed photo lands at exactly the same width as the "Sakura Novi" one and every other section on the site.
- Make the below-desktop flattening actually win: instead of resetting the custom properties, the `@media (max-width: 1023px)` block sets `transform` directly on `.framed-frame` / `.framed-img` (rotation 0, keeping the existing image scale), and the hover transforms become desktop-only. Desktop keeps today's 5deg tilt, hover straighten, and zoom unchanged.

This makes the sizing rule global: any section using `FramedImage` with standard gutters gets the same width from now on — on the homepage and on `/our-story`, `/birthdays`, `/claw-machine-tips`, and CMS-driven sections.

## Technical details
- `src/components/KawaiiContactInfo.tsx`: section gets `section-x` and the container drops `px-4`, matching `KawaiiVisit` / `KawaiiStory`.
- `src/index.css`: replace the var-based `@media (max-width: 1023px)` reset with direct `transform: rotate(0deg)` on `.framed-frame` and `transform: rotate(0deg) scale(var(--img-scale, 1.15))` on `.framed-img`; wrap the `.group:hover` rules in `@media (min-width: 1024px)`.
- Verify with Playwright at 390px, 767px, and 820px on `/`, `/our-story`, `/birthdays`, `/claw-machine-tips`: every `.framed-frame` / `.framed-img` box stays within 0..viewport width, and the contact-section wrapper width equals the Sakura Novi wrapper width.
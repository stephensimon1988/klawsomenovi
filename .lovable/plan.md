## Goal
Replace the blurry Filipino-community group photo (currently the `KlawsomeCrewSelfieWall.webp` CDN asset) shown in the second story section on `/our-story` with the sharper hosted image:

`https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/eac946a6-e513-4e64-acdc-dd5024eb5a61/IMG_1638.webp`

## Scope
Only the `/our-story` page. Other pages that still reference the same CDN asset (`PageHero.tsx`, `ClawMachineTips.tsx`, `cmsData.ts`) are left untouched.

## Change
In `src/pages/OurStory.tsx`, update the second entry of the `SECTION_IMAGES` array (index 1) from the `/__l5e/assets-v1/.../KlawsomeCrewSelfieWall.webp` URL to the new Squarespace IMG_1638 URL.

No other files modified, no asset cleanup (the CDN asset is still used elsewhere).
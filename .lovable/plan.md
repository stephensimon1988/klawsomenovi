## Part 1 — Swap intro image on /our-story
In `src/pages/OurStory.tsx`:
- Remove `import ourStoryIntroImage from '@/assets/our-story-intro.png'`.
- Change the intro `<FramedImage src={ourStoryIntroImage} ... />` to use:
  `https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/eac946a6-e513-4e64-acdc-dd5024eb5a61/IMG_1638.webp`

## Part 2 — Replace image on "Bringing our family into the brand" section
That section is `SECTION_IMAGES[1]` in `OurStory.tsx` (it currently uses the IMG_1638 community photo). Since IMG_1638 is now being used in the intro, this slot needs a different image anyway.

**I need your input on what image to use here.** A few options:

1. **You provide a URL** (e.g. a photo of the Filipowski family, the kids designing the logo, or a kawaii detail shot) — paste it in your reply and I'll drop it in.
2. **Reuse an existing brand asset** — for example one of the kawaii illustration pieces already in the project (e.g. the Klawsome friends-and-family photo at `Klawsome_FriendsFamily-056.webp`, though that's already used in the "Where it all began" section above it, so it would repeat).
3. **Leave the slot empty** — without an image, the section falls back to a centered text-only layout (the code already supports that when `SECTION_IMAGES[idx]` is undefined).

Tell me which option (and a URL if option 1) and I'll wire it up in the same change.
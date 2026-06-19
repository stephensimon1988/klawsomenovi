## Move "Getting Started is Easy" section → Community Outreach page

### 1. Remove from `src/pages/BusinessDevelopment.tsx`
- Delete the whole "HOW IT WORKS" block (lines ~448–482): the `KawaiiDivider variant="bumps" from="red" to="white"` and the entire `<section>` that renders "The Process / Getting Started is Easy" + the `howSteps` grid.
- Update the next divider (currently `from="white" to="baby-pink"`) to `from="red" to="baby-pink"` so it bridges the now-adjacent red plushie section to the baby-pink contact section. Keep `variant="petals"`, change stroke to a contrasting kawaii token (`baby-blue` stays fine).
- Remove now-unused locals: `dbHowSteps`, `howSteps`, `galleryPhotos`, `stepPhotos`, the `business_how_steps` and `gallery_photos` `useCmsTable` calls, and the `fallbackHowSteps` constant.

### 2. Add to `src/pages/CommunityPartners.tsx`
- Insert the section between the existing "Our Partners" section and the "cross-promote" section.
- Add imports for `useCmsTable`, `BusinessHowStep` type.
- Inline a `fallbackHowSteps` constant (same 4 items: Reach Out, We Connect, Review & Plan, Launch!).
- Hook into the same two CMS tables (`business_how_steps`, `gallery_photos`) and reproduce the same JSX (eyebrow "The Process", h2 "Getting Started is Easy", 2/4-col grid of photo + title + description).
- Wrap in `<section className="section-y section-x bg-background">` so it sits cleanly between the white partners section and the secondary/40 cross-promote section. No `KawaiiDivider` needed (no bg change → bg change is white→secondary/40, already divider-free on this page).

### Out of scope
- No CMS schema changes; same tables continue to feed the section, just on a different page.
- No route, nav, or footer changes.

## Rename to /partner-with-klawsome + one photo per section + 1280 width

### 1. Route rename with redirect
`src/App.tsx`
- Add `<Route path="/partner-with-klawsome" element={<BusinessDevelopment />} />`.
- Keep `/business-development` but make it `<Navigate to="/partner-with-klawsome" replace />` so old links/SEO still land in the right place.

`src/components/KawaiiNav.tsx` (and any other internal link)
- Update the "Business Development" entry in `moreLinks` to `{ label: 'Partner with Klawsome', href: '/partner-with-klawsome' }`.

### 2. Copy / title changes
`src/pages/BusinessDevelopment.tsx`
- Page hero: title → `Partner with Klawsome!`, eyebrow → `🤝 Partner with Klawsome`, subtitle stays (it already speaks to all three opportunities).
- Update `<title>` / any page heading reading "Business Development" / "Grow With Klawsome" to "Partner with Klawsome".
- Leave the three opportunity section names (Host / Partner / Custom Plushies) as-is — they're sub-sections, not the page title.

CMS fallback only — don't touch existing CMS rows; the fallback strings drive what the user sees today.

### 3. Widen sections to the 1280px rule
The project standard for multi-column content is `max-w-7xl` (=1280px) — already defined as `.ds-container-content` in `index.css`. The three opportunity sections currently cap at `max-w-5xl` (1024px), which is why they feel cramped.

In `BusinessDevelopment.tsx`, change:
- Hosted section inner wrapper: `ds-container max-w-5xl` → `ds-container max-w-7xl`
- Partner section inner wrapper: same change
- Plushie section inner wrapper: same change
- How-it-works and Contact stay as they are (centered prose / form).

### 4. One claw-machine photo per section, tastefully
Upload the 5 attached photos via `lovable-assets` so they live on the CDN, then place exactly one per section. No collages, no duplicates.

Assignment (chosen to match the section's vibe):
- **Hosted** (`hosted`) — `f205519d8…jpg` (twin rainbow Prize Claw cabinets) — replaces the current `hostMachinePhoto` in the "10% of every token played" card. Reads as "your spot, our machine".
- **Partner** (`partner`) — `2ebddafaa…jpg` (front-on Prize Claw lineup, big prizes inside) — replaces `groupPhoto` in the "freedom box" right column. Reads as "your own arcade floor".
- **Plushie** (`plushie`) — `Weixin_…004025_963_19.jpg` (Prize Claw Twin loaded with plushies) — replaces `plushieClaw` in the minimum-order card. On-message for custom plushies.
- **How it works** (`process` band) — `a877c538…png` (clean studio shot of Prize Claw Multi) — add a single rounded photo to the right of the steps grid on `md+`, steps stack to its left in a 2-column layout (`md:grid-cols-[1fr_360px]`). This section currently has no imagery.
- **Contact** (`contact`) — `Weixin_…004048_972_19.jpg` (XL plush cabinet, atmospheric) — add as a slim 16:6 banner above the form, rounded, low height (~h-48 md:h-56) so it sets the mood without crowding the form.

Old imports that get fully replaced (`hostMachinePhoto`, `groupPhoto`, `plushieClaw`) get removed from the file. Other `bizdev/*` asset imports (used inside the "What Klawsome Supplies" card grid and the plushie "how it works" sub-steps) are untouched — they're per-card, not per-section, so they don't conflict with the one-photo-per-section rule.

All new `<img>` tags get `loading="lazy"`, descriptive `alt`, and live inside an `img-hover rounded-2xl` wrapper to match the existing photo treatment.

### Out of scope
- CMS-managed page hero rows for `business-development` (we'll keep reading from that key; renaming the CMS key is a separate ask).
- Sitemap entries (route still resolves the same content).
- Restyling the form, pricing tiers, or supplies grid.

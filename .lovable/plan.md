## Plan: Split "Private Parties" into Minecraft + Summer sections

### Sections (new section keys in `cmsData.ts` → `gallery_photos`)
- `private_minecraft` → "Minecraft Party (Indoors)"
- `private_summer` → "Summer Party (Indoors + Outdoors)"

Update `src/pages/Gallery.tsx`:
- Add labels in `sectionLabels`.
- Add both keys to `sectionOrder` where `private` currently sits.
- Remove the old `private` label entry (no entries will use it after migration).

### Reclassify existing `private_party` entries (22 total)
Move to `private_minecraft` (clearly Minecraft-themed by caption):
- `2f7e61bb…` Minecraft themed party setup
- `0f169e54…` Kids at Minecraft party
- `5ca20444…` Minecraft balloon arch
- `8d7e09c7…` Gaming controller balloon
- `9dea9a98…` Balloon collection *(if Minecraft — see Question 1)*

Move to `private_summer` (the existing girls-themed plush/cake entries):
- `pp-paaralang-shirt-claw`, `pp-ice-cream-cone-plush`, `pp-girl-strawberry-claw`, `pp-girl-koi-fish`, `pp-kids-turtle-machine`
- `17c37df8…` Dinosaur birthday cake
- `7cc3c8fb…` Birthday cake celebration
- `8a515d74…` Party group photo

Remaining ambiguous entries (generic "balloons / arcade party / crowd / families") — see Question 1.

### Add 6 new Summer party photos (uploads)
Upload each to CDN via `lovable-assets` and append to `gallery_photos` with `section: "private_summer"`:
1. `party1.jpg` — "Blue balloon arch at the entrance"
2. `party-2.jpg` — "Pretzels and candy jars on the party table"
3. `party3.jpg` — "Horchata dispenser and tropical straws"
4. `party-5.jpg` — "Going for the cow plush"
5. `party6.jpg` — "Cake reveal with the birthday crew"
6. `party7.jpg` — "Walk around the Sakura Novi pond"

### Files touched
- `src/content/cmsData.ts` — change `section` on existing private_party rows; append 6 new summer rows.
- `src/pages/Gallery.tsx` — update `sectionLabels` + `sectionOrder`.
- `src/assets/gallery/` — 6 new `.asset.json` pointers.

### Question 1 — ambiguous existing rows
These captions don't say Minecraft or Summer. Where should they go?
- "Birthday balloons and decorations", "Birthday celebration with balloons", "Balloon collection", "Indoor arcade party", "Crowd at arcade party", "Lively birthday party", "Party setup with claw machines", "Families enjoying the arcade"

Options:
- **A** Put them all under Summer (since Minecraft is clearly the boys' party and the rest are mixed).
- **B** Put them all under Minecraft.
- **C** I'll inspect each thumbnail and decide (slower but accurate).

Reply with A / B / C and I'll execute the full split.

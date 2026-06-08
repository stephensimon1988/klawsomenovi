## Plan: Clean up Gallery page sections

All edits happen in `src/content/cmsData.ts` → `gallery_photos`. `KawaiiNews`/`Gallery` re-render automatically. To pick which specific photos to drop, I'll open each section in the live preview, view the thumbnails, and pick the duplicates / Pikachu repeats visually — then remove those entries.

### Targets per section (current → target)

| Section | Current | Target | Rule |
|---|---|---|---|
| Novi Community Fest (`novi-community-fest`) | 30 | **12** | Eliminate repeated photos; keep only 1 cornhole-Pikachu and 1 sign-holding Pikachu (drop the other ~half of Pikachu shots). |
| Trunk or Treat (`trunk-or-treat`) | 9 | **8** | Eliminate repeated photos. |
| Gleaners Canned Food Drive (`canned-food-drive`) | 19 | **8** | Eliminate repeated photos. Also rename section heading to cover **both** service projects (Canned Food Drive **and** Toys for Tots) in the sub-head. |
| MSU Pass (`msu-pass`) | 32 | **12** | Eliminate repeated photos. |
| Novi Library / Paaralang Pilipino | 6 | 6 | No change (not in screenshots). |

### Sub-head rename
In `src/pages/Gallery.tsx` → `sectionLabels`, change:
```
'canned-food-drive': 'Canned Food Drive'
```
to:
```
'canned-food-drive': 'Gleaners Canned Food Drive / Toys for Tots'
```

### Pikachu-photo rule (Novi Community Fest)
The cornhole + sign-holding Pikachu shots repeat across the 30 entries. Keep exactly:
- 1 photo of Pikachu next to the cornhole board
- 1 photo of Pikachu holding/standing with a sign
- Drop every other Pikachu shot, then trim the rest of the section down to 12 total, keeping the strongest non-Pikachu booth/crowd photos.

### Execution
1. Open `/gallery` in preview, jump to each affected section.
2. For each section, pick the entry `id`s to delete (visual dedupe + Pikachu rule).
3. Remove those objects from `gallery_photos` in `cmsData.ts`.
4. Update the `canned-food-drive` label in `Gallery.tsx`.
5. Reload `/gallery` and confirm counts: 12 / 8 / 8 / 12.

### Open question
Do you want me to pick the duplicates myself based on the live thumbnails, or should I post the candidate `id` lists for you to approve before deleting? (Picking myself is faster; your approval is safer if you have favorites.)

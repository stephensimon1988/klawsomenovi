## Why the GM card is missing

The in-store grid is data-driven from `src/content/cmsData.ts → job_listings`. A "General Manager" record exists, but it's tagged `category: "hybrid"` with an empty `description` and empty `image_url`, so:

- It renders in the (currently empty) Hybrid / Paid section, not In-Store.
- Even if moved, it would show with no description and the crown-icon fallback instead of a photo.

The `Careers.tsx` sort already pins "General Manager" first when it appears in `inStoreJobs`, so once the category flips, it will land in the first column automatically — no component changes needed.

## Changes

### 1. `src/content/cmsData.ts` — update the existing General Manager row

In the `"General Manager"` entry (around line 1332):

- `category`: `"hybrid"` → `"in-store"`
- `sort_order`: `5` → `0` (belt-and-suspenders; the component sort already promotes GM)
- `description`: fill in with the same short-blurb style used by Assistant GM and Store Associate, e.g.:
  > "The General Manager (GM) oversees day-to-day operations of the Klawsome! arcade — leading the team to deliver superior customer service, ensuring operational excellence, driving store sales and profitability, managing inventory and restocking, promoting brand awareness, and fostering a positive, inclusive work environment."
- `image_url`: reuse the Assistant GM photo URL (`https://images.squarespace-cdn.com/.../PXL_20250822_201918587.webp`) per your answer.
- Leave `job_desc_url` (already points at the GM PDF) and `apply_url` (already the same `mailto:` pattern as Assistant GM) as-is.

### 2. `src/data/jobDescriptions.ts` — add a structured "General Manager" entry

Today the modal falls back to the plain `description` blurb when there's no entry here (that's why Assistant GM's modal shows formatted sections but other roles don't). Add a `'General Manager'` key mirroring the Assistant GM structure, populated from the PDF:

- **meta**: FLSA Classification "Exempt (Full-Time) / Non-Exempt (Part-Time)"; Full / Part-Time "Full-Time or Part-Time"; Pay Range "$18–$28/hr"; Reports To "Founders / Owners (Agnes & Michal)".
- **summary**: the PDF's summary paragraph.
- **sections**: Essential Functions, Required Skills and Abilities, Schedule, Work Environment, Physical Demands, Background Check & Drug Screen Requirements, Experience & Certifications — all transcribed from the PDF as bullet lists / body paragraphs.

The existing `JobDescriptionDialog` already renders an **Open PDF** button (links to `job_desc_url`) and an **Apply Here** button (links to `apply_url`) in the modal footer, so no dialog code needs to change.

### 3. Divider / footer logic — no changes required

`Careers.tsx` already conditionally renders the In-Store section based on `inStoreJobs.length > 0`, and the Hybrid / Paid section likewise. Moving GM out of Hybrid drops that category to zero items, which simply hides the now-empty Hybrid section and its divider. The footer's `prevColor` chain already handles that branch.

## Result

`/careers` In-Store Positions grid renders three cards in this order: **General Manager** (new, with photo, description, View Job Description → formatted modal with Open PDF + Apply Here, and Apply Here button), **Assistant General Manager**, **Store Associate**.

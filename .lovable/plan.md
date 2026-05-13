## Plan: Careers page improvements

### 1. Upload PDFs to storage
Copy the 5 uploaded PDFs into the `images` storage bucket under `careers/`:
- `Summer_Intern.pdf`
- `Assistant_General_Manager.pdf`
- `Corporate_Development_Fellow.pdf`
- `General_Manager.pdf`
- `Store_Associate.pdf`

### 2. Update `job_listings` data
Rename + relink the 5 PDF-backed jobs and set `apply_url` to mailto links for all 7 listings.

| Current title | New title | job_desc_url | apply_url |
|---|---|---|---|
| Internship (Unpaid) | Summer Intern | …/Summer_Intern.pdf | mailto:team@klawsomenovi.com?subject=Application%3A%20Summer%20Intern |
| Assistant Store Manager | Assistant General Manager | …/Assistant_General_Manager.pdf | mailto:…Assistant%20General%20Manager |
| Corporate Development Fellow (Founder's Office, Unpaid) | Corporate Development Fellow | …/Corporate_Development_Fellow.pdf | mailto:…Corporate%20Development%20Fellow |
| General Manager | (same) | …/General_Manager.pdf | mailto:…General%20Manager |
| Store Associate | (same) | …/Store_Associate.pdf | mailto:…Store%20Associate |
| Events Assistant Manager | (same, keep existing Google Doc URL) | unchanged | mailto:…Events%20Assistant%20Manager |
| Purchasing Specialist | (same, keep existing Google Doc URL) | unchanged | mailto:…Purchasing%20Specialist |

### 3. Careers.tsx UI changes
- **Wider columns**: change in-store and unpaid grids from `md:grid-cols-2` to single column or `lg:grid-cols-2` with a wider `max-w-4xl` → `max-w-6xl`; change hybrid `md:grid-cols-3` → `md:grid-cols-2` with `max-w-5xl` so each card is meaningfully wider.
- **Job Description button**: instead of `<a target="_blank">`, open a shadcn `Dialog` modal containing a PDF viewer (`<iframe src={job_desc_url}>` at ~75vh) with the job title as the dialog header and a "Open in new tab" fallback link.
- **Apply Here button**: render as `<a href={job.apply_url}>` (already mailto from step 2). No code logic change beyond ensuring it stays a plain anchor.

### Technical notes
- New component `JobDescriptionDialog.tsx` wrapping shadcn `Dialog` + iframe.
- mailto subjects URL-encoded (`%20`, `%3A`).
- Storage upload via `supabase--storage_upload` to bucket `images`, path `careers/<file>.pdf`.
- Data update via `supabase--insert` (UPDATE statements on `job_listings`).
- No schema changes; no migration needed.

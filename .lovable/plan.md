## Scope
Handle the seven items of feedback. Five are code/content changes I can make. Two (#2 and #3) live inside Acuity Scheduling (klawsome.as.me) and can only be fixed by reordering appointment types and grouping them into categories in the Acuity dashboard — flagged for the user.

---

## 1) Birthdays comparison table — decoration row (Regan's first ask)
File: `src/pages/Birthdays.tsx` (`comparisonRows`)

Replace the "Decoration setup" row values:
- Private: `'Full set up - $119'` → `'Included add-on — see details'` (link/anchor)
- Semi: `'Simple set up - $89'` → `'Included add-on — see details'` (link/anchor)

Render strings starting with `'Included add-on'` as an in-cell link to `#add-ons` (the existing "Make It Extra Special" section already lists both Private Event Decorations $129 and Paris Baguette Basic Decor $89). Drop the "simple" vs "full" wording entirely as requested.

Update `Cell` so a sentinel value renders as an underlined "See Decor Add-Ons →" anchor instead of plain text.

## 2) BookNowDialog title (Regan #1)
File: `src/components/BookNowDialog.tsx`
- Change `DialogTitle` text from `Book your visit` → `Book an Event with Klawsome`.

## 3) Acuity booking flow (Regan #2 & #3) — OUT OF CODE
The booking modal embeds `https://klawsome.as.me/schedule/366e2b9b`. The order of items in that menu and the two-step "pick event → pick add-ons" flow are configured in Acuity, not in this project. Action for the user:
- In Acuity, reorder appointment types so Private Birthday Party and Semi-Private Birthday Party appear first.
- Move all add-ons into a separate "Add-Ons" category that only shows after an event type is selected (Acuity → Appointment Types → Categories / "Group Appointments").
- I will note this in the in-app booking dialog by adding a one-line helper above the iframe: "Pick your event type first, then add any extras." (no flow change, just guidance).

## 4) Rental "Party Package" plush wording (Regan #4)
File: `src/content/cmsData.ts` → `rental_packages` → Party Package (`id: ca509ea1...`)
- Feature "Filled with your product (5–10 inch, 0–5 lbs)" →
  `Filled with our 40 plushies OR your supplied product (5–10 inch, 0–5 lbs)`

File: `src/pages/Rental.tsx` (hardcoded comparison rows)
- Row "Filled with Your Product" → relabel to `Plushies Included` with desc `Our 40 plush OR your supplied product (5–10 in, 0–5 lbs).` Both columns = ✓.
- Remove the now-redundant "40 Plushies of Your Choice" row (covered by row #5).

## 5) Extended Package + availability disclaimer (Regan #5)
File: `src/content/cmsData.ts` → Extended Party Package
- "40 plushies of your choice (subject to stock)" →
  `40 regular-size plushies of your choice (subject to availability)`

File: `src/pages/Rental.tsx`
- New row `Pick Your Plush Lineup` desc `40 regular-size plushies, subject to availability.` Party = ✕, Extended = ✓.

## 6) Delivery beyond 20 miles (Regan #6)
File: `src/pages/Rental.tsx` comparison rows
- After "Free Delivery within 20 Miles" add a row:
  - Label: `Beyond 20 Miles`
  - Desc: `$3 / mile over 20 miles.`
  - Both columns: text value `$3 / mile`

Also append the same line to both packages' feature lists in `cmsData.ts`.

## 7) On-site attendant (Regan #7)
File: `src/pages/Rental.tsx` comparison rows
- New row: `On-Site Attendant` desc `A Klawsome attendant stays with the machine during your rental.` Both = ✓.

Also add feature `On-site Klawsome attendant included` to both packages in `cmsData.ts`.

---

## Out of scope
- Acuity reordering / category grouping (must be done by user in Acuity).
- Pricing changes other than the add-on delivery line.
- Visual restyling of the tables — only the rows themselves change.

## Files touched
- `src/pages/Birthdays.tsx`
- `src/components/BookNowDialog.tsx`
- `src/pages/Rental.tsx`
- `src/content/cmsData.ts`
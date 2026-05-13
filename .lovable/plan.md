## Goal

On `/rental`, replace the two side-by-side "Party Package" / "Extended Party Package" cards with a comparison-table layout that mirrors the "Package Comparison" table on `/birthdays`. Add-on cards below stay unchanged.

## Scope

Frontend-only edit to `src/pages/Rental.tsx`. No DB changes — data continues to come from `rental_packages`.

## New section design

Match Birthdays styling:

- Section background: `bg-primary` (Klawsome red), white text
- Eyebrow "Choose Your Package" + heading "Package Comparison" + lead copy, all centered
- Table container: `rounded-kawaii`, white/20 borders, `bg-klawsome-navy/40 backdrop-blur-sm`
- Header row: empty cell + "Party Package" column (red bg, white text) + "Extended Party Package" column highlighted (`bg-klawsome-yellow`, navy text), each with the price beneath
- Body rows: alternating `bg-white/5`, label on left, check / x / text in each column
- Footer: yellow "Book Your Event" CTA aligned right, linking to first package's `cta_url` (or `#scheduling` fallback)

## Comparison rows

Built from the two packages' feature lists. Party = ✓ where the feature exists in Party Package, Extended = ✓ where it exists in Extended (Extended also inherits Party's via "Everything in Party Package"). Final row set:

| Label | Party | Extended |
|---|---|---|
| Claw Machines | 1 | 1 |
| Play Time | 1 hour | 2 hours |
| Filled with your product (5–10 in, 0–5 lbs) | ✓ | ✓ |
| 40 plushies of your choice (subject to stock) | ✗ | ✓ |
| Free delivery within 20 miles | ✓ | ✓ |
| Full delivery and setup | ✓ | ✓ |
| Easy win difficulty | ✓ | ✓ |
| Free-play mode | ✓ | ✓ |

Rows defined as a local const array in the file (similar to `comparisonRows` in Birthdays). The two package records are looked up by name (`Party Package`, `Extended Party Package`) so prices stay CMS-driven.

## Add-ons

Existing "Add-On" cards block (renderCard with compact=true) stays exactly as-is, rendered below the comparison table.

## Dividers

Existing `KawaiiDivider` after the section is kept. Section bg changes from `bg-secondary/50` to `bg-primary` — verify the divider `from`/`to` colors still match adjacent sections per the divider memory rule, and adjust if needed (likely change preceding hero-to-packages transition and the trailing divider's `from` to `red`).

## Technical notes

- Add a small `Cell` helper component (mirrors Birthdays) that renders ✓ / ✗ / arbitrary text given a value
- Reuse Tailwind tokens already in the project (`klawsome-yellow`, `klawsome-navy`, `primary`, `rounded-kawaii`)
- No new dependencies, no schema changes

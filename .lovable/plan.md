### More Menu Column Header Styling Update

Update the column headers in the "More" navigation dropdown to be more prominent.

#### Changes
- **File:** `src/components/KawaiiNav.tsx`
- **What:** Increase the font size and weight of the column headings (`Connect`, `Purchase`, `Remember`, `Learn`) in both the desktop dropdown and the mobile hamburger menu.

#### Details
- Current size: `text-[10px]` (10px)
- New size: `text-[13px]` (~1.25x larger)
- Current weight: `font-bold`
- New weight: `font-black` (maximum weight for stronger visual hierarchy)

Both the desktop mega-menu heading (line 144) and the mobile menu heading (line 202) will be updated with the same new styling.
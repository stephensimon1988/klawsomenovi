## Footer Redesign: White Background with Navy Text

### Goal
Change the site footer from its current red background to a clean white background, with dark navy text for readability. Preserve the contact image and all existing layout structure.

### Files to Change
- `src/components/KawaiiFooter.tsx`

### Changes
1. **Footer background**: Change `bg-primary` (red) → `bg-white`
2. **Text colors**: Change all `text-white` → `text-klawsome-navy` (dark navy) for headings, links, and body text
3. **Link opacity colors**: Change `text-white/75` → `text-klawsome-navy/70` for secondary links
4. **Copyright text**: Change `text-white/60` → `text-klawsome-navy/50`
5. **Hover states**: Change `hover:text-white` → `hover:text-primary` (red on hover for accent)
6. **Borders**: Change `border-white/15` and `border-white/20` → `border-klawsome-navy/15` and `border-klawsome-navy/20`
7. **Divider transition**: Update the divider above the footer from `baby-blue → red` → `baby-blue → white`
8. **Keep intact**: The contact info section (`KawaiiContactInfo`), the animated logo, and the contact image on the right side of the contact section are untouched.

### Visual Result
- Clean white footer matching the rest of the site's light sections
- Navy text maintains high contrast and readability
- Red hover accents on links keep the brand color present
- Dividers flow naturally from baby-blue contact section into white footer
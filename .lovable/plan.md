## Token Prices section redesign

Update `src/components/KawaiiTokenPrices.tsx` to match the reference style (second screenshot).

### Changes
1. **Remove side images** — delete the `coinRef` cat image and `animalsRef` bears image (and their imports/refs).
2. **Wider table** — drop the flex row layout; center a single full-width table (max-w-3xl or 4xl) inside the container.
3. **Bigger typography** — Price/Tokens/Bonus headings use `ds-h3`/`font-heading` at a larger size (e.g. `text-3xl md:text-4xl`) in navy-style heading color. Row values bumped to `text-2xl md:text-3xl` bold heading font.
4. **Column header underline** — single horizontal divider under the Price/Tokens/Bonus headers (instead of dividers between every row).
5. **Highlight row** — soft yellow pill background spanning the full row width, like the `$100` row in the reference. Keep `is_highlight` logic from CMS data.
6. **Remove inter-row borders** — rely on generous vertical padding for separation, matching the airy spacing in the reference.
7. **Keep** the existing section background (red/primary), GSAP stagger animation on rows, LottieAccent star, and the "Top Pick" caption.

### Notes
- Pure presentation change; no CMS/schema changes.
- Text color stays white on the red background (reference uses navy on blue — we keep our red section with white text per existing palette).
- Animation refs simplified to header + table stagger only.

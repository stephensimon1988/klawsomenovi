## Goal
The store's apparel ships from an Asian manufacturer, so the size labels on the garments (S/M/L/XL) run 1–2 sizes smaller than US sizes. The current `SizeChart` shows US measurements next to those same letters, which misleads American customers. Rework the chart so shoppers can pick the correct *Asian-labeled* size for their *US* body.

## Approach
Replace both existing tables (`TEE_ROWS`, `APPAREL_ROWS`) with a single **Asian → US conversion table** plus a prominent "runs small — size up" callout. Keep the same component API (`SizeChart`, `productNeedsSizeChart`) so `QuickAddModal` doesn't change.

## New chart contents

**Callout (above the table):**
> ⚠️ These shirts use Asian sizing and run 1–2 sizes smaller than US sizes. We recommend sizing up. If you normally wear a US Medium, order a Large or XL.

**Conversion table — Unisex Tee (Asian sizing):**

| Tag size (Asian) | US equivalent | Chest (in) | Body length (in) |
|---|---|---|---|
| S   | US XS    | 32–34 | 25.5 |
| M   | US S     | 34–36 | 26.5 |
| L   | US M     | 36–38 | 27.5 |
| XL  | US L     | 38–40 | 28.5 |
| 2XL | US XL    | 40–42 | 29.5 |
| 3XL | US 2XL   | 42–44 | 30.5 |

**Conversion table — Apparel (Asian sizing) — same Tag → US offset, with bust/waist/hip:**

| Tag size (Asian) | US equivalent | Bust | Waist | Hip |
|---|---|---|---|---|
| S   | US XS  | 32–33 | 25–26 | 35–36 |
| M   | US S   | 34–35 | 27–28 | 37–38 |
| L   | US M   | 36–37 | 29–30 | 39–40 |
| XL  | US L   | 38–40 | 31–33 | 41–43 |
| 2XL | US XL  | 41–43 | 34–36 | 44–46 |
| 3XL | US 2XL | 44–46 | 37–39 | 47–49 |

Numbers come from standard Gildan/Bella Asian-fit charts shifted one size down from US Gildan measurements.

**Footnote (under the table):**
> Measurements are the *garment's* finished dimensions, not body measurements. Measure a shirt you already own flat across the chest, then pick the row that matches — or size up if you're between sizes. Tolerance ±1″.

## Code changes (single file)
`src/components/shopify/SizeChart.tsx`:
1. Replace `TEE_ROWS` and `APPAREL_ROWS` with new arrays that include an extra `usEquivalent` column.
2. Add a yellow/pink callout block above the table with the "sizes run small" message.
3. Add an extra `<th>` and `<td>` column for "US equivalent".
4. Update the heading from "Unisex Tee Size Chart (Gildan, inches)" → "Unisex Tee Size Chart — Asian sizing (inches)" and from "US Apparel Size Chart (inches)" → "Apparel Size Chart — Asian sizing (inches)".
5. Replace the existing footnote with the new garment-measurement note.

No changes to `productNeedsSizeChart` triggers (already correctly only shows on shirts/apparel), no changes to `QuickAddModal`, no Shopify variant relabeling.

## Out of scope
- Renaming Shopify variants (we keep the manufacturer's S/M/L/XL on the listing).
- Adding a US-size-to-order picker that re-maps the cart variant.
- Per-product custom charts.
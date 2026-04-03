

## Plan: Context-Aware Glow on Buttons & Cards Only

### Problem
The current glow applies to ALL interactive elements (links, images, nav items), creating awkward effects on PNGs and non-card elements.

### Solution
Replace the blanket glow with targeted CSS utility classes that only apply to buttons and cards, with color variants that match the element's visual context.

### Glow Color Rules
| Element context | Glow color |
|---|---|
| Pink/primary buttons (e.g. "Play", "Purchase") | `--klawsome-red` (coral pink) |
| Dark/navy buttons (e.g. "Reserve") | `--klawsome-baby-blue` |
| White/light cards (reviews, news) | `--klawsome-baby-pink` |
| Dark cards (product cards on navy bg) | `--klawsome-baby-blue` |
| Ghost/outline buttons | `--klawsome-baby-pink` |
| Yellow-highlighted tier row | `--klawsome-yellow` |

### CSS Changes (`src/index.css`)
1. **Remove** the global auto-apply rule (the `button, a, [role="button"]... { @apply glow-hover }` block)
2. **Create color variants** of the glow:
   - `.glow-pink` — uses `--klawsome-baby-pink`
   - `.glow-blue` — uses `--klawsome-baby-blue`
   - `.glow-coral` — uses `--klawsome-red`
   - `.glow-yellow` — uses `--klawsome-yellow`
3. Each variant sets `--glow-color` and the base `.glow-hover` reads from it
4. Keep the `glow-pulse` keyframes as-is

### Component Changes
Apply the correct glow class to buttons and cards in each component:

- **KawaiiHero.tsx** — "Play" button: `glow-coral`, "Reserve" button: `glow-blue`, hours card: `glow-blue`
- **KawaiiAbout.tsx** — "Play" button: `glow-pink`, step cards: no glow (they're just text+image, not bordered cards)
- **KawaiiProducts.tsx** — product cards: `glow-blue`, "Buy" buttons: `glow-coral`
- **KawaiiTokenPrices.tsx** — highlighted tier row: `glow-yellow`
- **KawaiiReviews.tsx** — each review card: `glow-pink`, nav buttons: `glow-pink`
- **KawaiiNews.tsx** — each article card: `glow-pink`
- **KawaiiGiftCards.tsx** — "Purchase" button: `glow-coral`
- **KawaiiNav.tsx** — "Book Your Visit" button: `glow-coral`
- **KawaiiScheduling.tsx** — booking cards/buttons: `glow-coral`
- **KawaiiVisit.tsx** — "Directions" button: `glow-pink`, "Call" button: `glow-pink`

### What gets NO glow
- Plain `<a>` links (nav links, text links)
- Images (logo, decorative PNGs, GIFs)
- Non-card layout containers


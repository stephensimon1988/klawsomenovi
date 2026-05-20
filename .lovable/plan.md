# Branded multi-stroke headers

Goal: give all section headings (and the "We'd love to hear from you" callout) the same chunky double-outline look as the Klawsome logo — a main fill color surrounded by an inner stroke and an outer stroke in two other brand colors.

## The CSS technique

Browsers only support a single `-webkit-text-stroke`, so two real strokes need to be faked with stacked `text-shadow` rings. For each "ring" we offset the same color in all 8 directions (and a couple of half-step offsets) so it reads as a solid outline rather than a dotted halo.

```css
.ds-stroke {
  /* main fill set per-variant */
  color: var(--stroke-fill);
  /* inner ring at ~2px, outer ring at ~5px */
  text-shadow:
    /* inner stroke — 2px ring */
    -2px -2px 0 var(--stroke-inner), 2px -2px 0 var(--stroke-inner),
    -2px  2px 0 var(--stroke-inner), 2px  2px 0 var(--stroke-inner),
     0   -2px 0 var(--stroke-inner), 0    2px 0 var(--stroke-inner),
    -2px  0   0 var(--stroke-inner), 2px  0   0 var(--stroke-inner),
    /* outer stroke — 5px ring (4 cardinals + 4 diagonals + halves) */
    -5px  0 0 var(--stroke-outer),  5px  0 0 var(--stroke-outer),
     0   -5px 0 var(--stroke-outer), 0   5px 0 var(--stroke-outer),
    -4px -4px 0 var(--stroke-outer), 4px -4px 0 var(--stroke-outer),
    -4px  4px 0 var(--stroke-outer), 4px  4px 0 var(--stroke-outer),
    -3px -5px 0 var(--stroke-outer), 3px -5px 0 var(--stroke-outer),
    -3px  5px 0 var(--stroke-outer), 3px  5px 0 var(--stroke-outer),
    -5px -3px 0 var(--stroke-outer), 5px -3px 0 var(--stroke-outer),
    -5px  3px 0 var(--stroke-outer), 5px  3px 0 var(--stroke-outer);
  paint-order: stroke fill;
}
```

Stroke widths scale by heading size (use slightly thinner rings on H3 / small text so it doesn't look mushy):
- H1: 3px inner / 6px outer
- H2: 2px inner / 5px outer
- H3 & callout: 1.5px inner / 3.5px outer

## Three variants (pick from navy / red / yellow only)

Only the three "main text" colors from the logo references are used as fills, and the two remaining brand colors form the rings. The outer ring is always the darkest of the three so the letterforms still read against any background.

| Variant | Fill | Inner stroke | Outer stroke |
|---|---|---|---|
| `ds-stroke--navy` | klawsome-navy | klawsome-yellow | klawsome-red |
| `ds-stroke--red` | klawsome-red | klawsome-yellow | klawsome-navy |
| `ds-stroke--yellow` | klawsome-yellow | klawsome-red | klawsome-navy |

(Baby-blue is reserved for backgrounds, not strokes — matches the logo references.)

## Where to add it

New utilities in `src/index.css` (under `@layer utilities`):
- `.ds-stroke` — base (sets paint-order + ring widths via CSS vars)
- `.ds-stroke--navy`, `.ds-stroke--red`, `.ds-stroke--yellow` — set the three color vars
- `.ds-stroke--h1`, `.ds-stroke--h2`, `.ds-stroke--h3` — scale ring widths

Then apply across the site so each section gets one of the three variants, alternating to keep visual variety. Proposed mapping:

- `KawaiiHero` H1 → `--red` (matches logo)
- `KawaiiAbout` "How to Play!" H2 → `--navy`
- `KawaiiProducts` H2 → `--red`
- `KawaiiTokenPrices` H2 → `--yellow`
- `KawaiiStory` H2 → `--navy`
- `KawaiiReviews` H2 → `--red`
- `KawaiiGiftCards` H2 → `--yellow`
- `KawaiiVisit` H2 → `--navy`
- `KawaiiNews` H2 → `--red`
- `PageHero` H1 (used by Story, Info Hub, etc.) → `--navy` by default, prop-overridable
- `OurStory` per-section H2s → alternate `--red` / `--yellow`
- Floating "We'd love to hear from you!" widget label → `--red` (matches the pink/red attachment)
- Card H3s inside Steps / Reviews / Products → `--navy` (smaller, less ring weight)

The change is centralized: heading components already use `.ds-h1` / `.ds-h2` / `.ds-h3`, so I'll add the stroke utility alongside those in each component's JSX rather than baking it into `.ds-h2` itself (so admin/CMS-only screens stay unstroked).

## Files to touch

1. `src/index.css` — add `.ds-stroke*` utilities.
2. Heading components: `KawaiiHero`, `KawaiiAbout`, `KawaiiProducts`, `KawaiiTokenPrices`, `KawaiiStory`, `KawaiiReviews`, `KawaiiGiftCards`, `KawaiiVisit`, `KawaiiNews`, `KawaiiGallery` (if present), `KawaiiBirthdays` sections, `PageHero`, `OurStory`, `Faq`, `Rewards`, `Rental`, `Business`, `Careers`, `Contact`, `News`, `InfoHub`, `Birthdays`, `CommunityPartners`, `BusinessDevelopment`, `Store`.
3. `FloatingContactWidget` — apply `--red` to the "We'd love to hear from you" text.
4. Step / card H3s in `KawaiiAbout`, `KawaiiReviews`, `KawaiiProducts` (smaller stroke scale).

## Notes / tradeoffs

- `text-shadow` rings stack pixels — at very large H1 sizes the outer 5px ring can look slightly stepped on diagonals. The half-step offsets in the snippet above smooth that out enough for our heading sizes.
- The effect adds visual weight, so I'll keep body copy untouched and only apply to display/heading text + the contact callout, exactly like the logo treatment.
- Works in light and dark backgrounds because the outer ring is always navy.
- No JS, no SVG — pure CSS, fully responsive, no perf cost.
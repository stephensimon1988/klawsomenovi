

# Fool-Proof Standardized Section Layout Engine

## Core Idea

Replace the current 7 ad-hoc template functions with a single **universal layout engine** that sorts ANY combination of blocks into 3 guaranteed zones. No AI. No guessing. Every section looks like a proper Bootstrap/Stripe-style section regardless of what the user puts in.

```text
┌──────────────────── 100vw SECTION ────────────────────────┐
│                                                            │
│  ┌──────── container (1200px, centered) ────────────┐     │
│  │                                                    │     │
│  │  ╔══ HEADER ZONE (max-w-3xl, text-center) ═════╗ │     │
│  │  ║  heading  →  always h2, text-3xl/4xl         ║ │     │
│  │  ║  text/richtext  →  always text-lg, opacity-80║ │     │
│  │  ╚══════════════════════════════════════════════╝ │     │
│  │                    ↕ space-y-10                    │     │
│  │  ╔══ CONTENT ZONE (full width) ═════════════════╗ │     │
│  │  ║  images → auto-grid (1=full, 2=2col, 3+=3col)║ │     │
│  │  ║  video/iframe → max-w-4xl centered            ║ │     │
│  │  ║  widgets → full width                         ║ │     │
│  │  ║  cards → auto-grid                            ║ │     │
│  │  ╚══════════════════════════════════════════════╝ │     │
│  │                    ↕ space-y-8                     │     │
│  │  ╔══ CTA ZONE (flex justify-center) ════════════╗ │     │
│  │  ║  buttons → always centered, gap-4             ║ │     │
│  │  ╚══════════════════════════════════════════════╝ │     │
│  │                                                    │     │
│  └────────────────────────────────────────────────────┘     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Block Classification (every block type accounted for)

| Block Type | Zone | Rendering Rule |
|---|---|---|
| `heading` | HEADER | `h2`, `text-3xl md:text-4xl`, `font-bold`, centered |
| `text` | HEADER | `p`, `text-lg`, `opacity-80`, centered |
| `richtext` | HEADER | `div`, `text-lg`, prose styles, centered |
| `image` | CONTENT | Auto-grid: 1 img = full width rounded, 2 = 2-col, 3+ = 3-col |
| `video` | CONTENT | `max-w-4xl mx-auto`, aspect-video |
| `iframe` | CONTENT | `max-w-4xl mx-auto`, aspect-video |
| `button` | CTA | Always `flex justify-center gap-4` |
| `spacer` | (inline) | Renders in place between zones |
| `divider` | (inline) | Renders in place between zones |
| `code` | CONTENT | `max-w-3xl mx-auto`, monospace block |
| `list` | HEADER | Centered list under text |
| `cards` | CONTENT | Auto-grid based on item count |
| `pricing` | CONTENT | Full-width grid widget |
| `hours` | CONTENT | Centered `max-w-md` widget |
| `reviews` | CONTENT | Centered widget |
| `news` | CONTENT | 3-col grid widget |
| `faq` | CONTENT | `max-w-3xl` centered accordion |
| `jobs` | CONTENT | Full-width stacked cards |
| `party_options` | CONTENT | 2-col grid widget |
| `templates` | CONTENT | 2-col grid widget |

## Hero Override

When `sectionType === 'hero'`, the engine makes two adjustments:
1. Header zone gets larger type: `text-4xl md:text-5xl lg:text-6xl` for headings
2. If there's exactly 1 image block, it becomes a background (rendered behind content via absolute positioning) instead of going into the content zone — so hero images always look full-bleed

## What Changes

### 1. `DynamicSection.tsx` — Full Rewrite

**Delete** all 7 template functions (`ImageLedHero`, `HeroSplit`, `TextWithGallery`, `VideoEmbed`, `CTAStrip`, `CardsLayout`, `StackedLayout`).

**Replace** with a single `UniversalLayout` that:
1. Classifies every block into `header`, `content`, or `cta` zone
2. Renders the 3 zones in order with consistent spacing
3. Auto-grids images/media based on count
4. Centers text blocks with `max-w-3xl mx-auto text-center`

**Keep** all specialized widgets (`PricingWidget`, `HoursWidget`, etc.) unchanged — they already look good.

**Fix `BlockRenderer`**: Remove priority-based font sizing. Every heading is `text-3xl md:text-4xl`. Every body text is `text-lg`. Consistency over variety.

### 2. `SectionWrapper.tsx` — Minor Tweak

Add `text-center` as default on the container div so all inherited text is centered. Already handles the section/container hierarchy correctly.

### 3. Accessibility Hardened

- All headings use `<h2>` (already done)
- Images get fallback `alt="Section image"` if none provided
- Buttons wrapped in `<a>` with visible text
- Auto text color + text shadow on bg images (already in SectionWrapper)
- Focus-visible from Tailwind defaults

## Cost

**Zero AI calls.** Pure deterministic zone-sorting logic. The "smartness" is in the rigid classification rules — every block type maps to exactly one zone, always.

## Why This Is Fool-Proof

The current system fails because it tries to pick between 7 templates using heuristics (count of images, priority of first block, etc.). Those heuristics create edge cases. The new system has **no template selection** — there's only one layout, and it handles every combination by sorting blocks into zones. There are no edge cases because every block type has a predetermined zone.


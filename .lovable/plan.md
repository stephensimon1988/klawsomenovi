## Goal

Make every multi-column content section line up to the same width across the entire site, and make all `FramedImage` photos perfectly square. Single-column / prose layouts stay exactly as they are.

Chosen standard width: **1280px (`max-w-7xl`)**.

## The two problems today

**1. Inconsistent column widths**
- Most pages wrap two-column content in `ds-container` = **1536px** (Our Story, Claw Machine Tips, Kawaii Story/Visit/Contact, Dynamic Sections).
- Birthdays uses `max-w-6xl` = **1152px** (party section) and `max-w-5xl` elsewhere.
- Gaps and grid structures also differ (`grid-cols-12 + col-span-6` vs `md:grid-cols-2`, gaps ranging `gap-10/12/14/16`).

**2. Inconsistent FramedImage shapes**
- `aspect-square` ✓ (Kawaii Story, Contact, Birthdays, Dynamic Sections)
- `aspect-[4/5]` ✗ (Kawaii Visit, Our Story ×2)
- fixed `h-[420px] md:h-[520px]` ✗ (Claw Machine Tips ×5)

## Plan

### 1. Add two shared utilities in `src/index.css`
```text
.ds-container-content  →  container mx-auto max-w-7xl   /* 1280px standard for multi-column sections */
.ds-cols               →  grid md:grid-cols-2 gap-10 lg:gap-16 items-center
```

### 2. Convert every multi-column content section to the shared utilities
Replace the per-page container + grid with `ds-container-content` + `ds-cols` (keeping each section's existing left/right order via `md:order-1` / `md:order-2`):
- `KawaiiStory.tsx` (currently `grid-cols-12 + col-span-6`)
- `KawaiiVisit.tsx` (currently `lg:grid-cols-2 gap-16`)
- `KawaiiContactInfo.tsx` (currently `grid-cols-2 gap-14`)
- `OurStory.tsx` — both story sections
- `Birthdays.tsx` — party-rules section (from `max-w-6xl`)
- `ClawMachineTips.tsx` — all 5 content sections
- `DynamicSections.tsx` (from `grid-cols-12 + col-span-6`)

### 3. Align page-level container widths so whole pages match
On Birthdays, the other section wrappers currently at `max-w-6xl` / `max-w-5xl` (packages table, add-on cards) will move to `max-w-7xl` so the whole page lines up with the rest of the site.

### 4. Make all FramedImage photos square
Set every `FramedImage` call-site class to `aspect-square w-full`:
- `KawaiiVisit.tsx`: `aspect-[4/5]` → `aspect-square`
- `OurStory.tsx` ×2: `aspect-[4/5]` → `aspect-square`
- `ClawMachineTips.tsx` ×5: `h-[420px] md:h-[520px]` → `aspect-square`
- The rest are already square (no change).

### 5. Leave single-column layouts untouched
`ds-container-narrow` (max-w-3xl) prose/FAQ blocks, hero, nav, and full-width chrome keep their current widths.

## Technical notes
- `ds-container` itself is **not** changed (it's used by nav/hero/full-width chrome); only the multi-column content sections switch to the new narrower `ds-container-content`.
- Purely presentational — no data, routing, or backend changes.
- After implementing, I'll screenshot Our Story, Birthdays, and Claw Machine Tips to confirm columns line up at the same width and all framed photos render square, including the hover straighten/zoom.

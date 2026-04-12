

# Pixel-Perfect Live Preview via SectionWrapper

## Problem
The admin preview manually recreates background/overlay styles and renders only `DynamicSection` — missing all the production styling that `SectionWrapper` provides: auto text color, text shadow, vertical centering, correct overlay opacity (45%), padding rules, min-height, and the centered container with max-width.

## Solution
**Replace the manual preview container with the actual `SectionWrapper` component** — the same one used on the homepage. This guarantees every visual aspect is identical.

## Changes (1 file: `KlawsomeAdmin.tsx`)

### 1. Import SectionWrapper
Add `import SectionWrapper from '@/components/SectionWrapper';` at the top.

### 2. Replace the preview container (lines 713-732)
Remove the hand-coded `backgroundColor`, `backgroundImage`, overlay div, and bare `DynamicSection`. Replace with:

```tsx
<div className="w-full rounded-xl border border-white/10 overflow-hidden">
  <div
    className="origin-top-left"
    style={{
      transform: 'scale(0.5)',
      transformOrigin: 'top left',
      width: '200%',
      maxHeight: '400px',
      overflow: 'hidden',
    }}
  >
    <SectionWrapper
      key={`preview-${section.id}-${previewKey}-${section.layout_template}`}
      config={{
        ...section,
        hero_height: '400px',   // cap so hero doesn't expand to 100vh
      }}
    >
      <DynamicSection
        sectionId={section.id}
        sectionType={section.section_type || 'section'}
        layoutTemplate={section.layout_template || 'stacked'}
      />
    </SectionWrapper>
  </div>
</div>
```

### What this fixes — everything at once
| Aspect | Before (broken) | After (accurate) |
|--------|-----------------|-------------------|
| Text color | Always dark | Auto white on dark bg, auto dark on light bg |
| Text shadow | None | Applied when bg image present |
| Vertical centering | Top-aligned | Flex center for hero sections |
| Overlay opacity | 40% hardcoded | 45% matching production |
| Padding/spacing | None | Section-type-aware padding |
| Container max-width | None | Global site_settings value |
| Min-height | None | Respects section_type rules |
| Photo gallery | Missing | Rendered if photos exist |

### No other files change
`SectionWrapper` already handles all styling logic. We just need to use it.


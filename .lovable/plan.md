

# Restructure All Pages to Be Fully CMS-Driven

## Problem

There are two parallel systems fighting each other:

1. **Hardcoded "Kawaii" components** (`KawaiiStory`, `KawaiiAbout`, `KawaiiHero`, `KawaiiVisit`, etc.) — they have their own `<section>` tags, padding, backgrounds, and hardcoded labels like "Our Story" / "How It Works". They render via `fullControl={true}`, which bypasses `SectionWrapper`'s layout rules entirely.

2. **CMS-driven DynamicSection** — uses `SectionWrapper` properly with the section/hero/small type system and priority-based block layout.

The result: the admin CMS shows sections but half of them say "no editable content" or only edit a few fields in a separate table. The frontend ignores the section type/background settings for built-in sections because `fullControl` skips `SectionWrapper`. Labels like "Our Story" are baked into component code, not the CMS.

## Solution

Convert all built-in sections to use `DynamicSection` + `SectionWrapper` so every section on the site is controlled the same way: section type, background, and content blocks — all from the admin.

## What Changes

### 1. Database Migration
- Seed `section_content_blocks` rows for each existing built-in section (hero, about, visit, story, tokens, etc.) so they have content blocks matching what's currently hardcoded.
- These blocks will pull their default content from the existing CMS tables (`homepage_content`, `homepage_steps`, `site_settings`, etc.) during migration.

### 2. Remove Hardcoded Components
Delete or deprecate these files (their content moves into CMS blocks):
- `KawaiiStory.tsx` — "Our Story" label + story_title/story_body → heading + richtext blocks
- `KawaiiAbout.tsx` — "How It Works" + steps → heading + text + card blocks
- `KawaiiHero.tsx` — hero headline/subheadline/CTA → heading + text + button blocks on a hero section with bg image
- `KawaiiVisit.tsx` — address/hours/map → structured blocks
- `KawaiiTokenPrices.tsx` — token tiers → card blocks or a dedicated "pricing" block type
- `KawaiiReviews.tsx` — Google reviews → embed or dedicated block
- `KawaiiNews.tsx` — news articles grid → card blocks
- `KawaiiGiftCards.tsx` — gift card CTA → heading + button blocks

### 3. Add New Block Types to DynamicSection
Add a few specialized block types so structured data renders well:
- **`pricing`** — renders a pricing tier grid (pulls from `token_tiers` or inline content)
- **`hours`** — renders store hours (pulls from `store_hours`)
- **`reviews`** — renders Google reviews widget
- **`cards`** — renders a grid of cards with icon/title/description (for "How It Works" steps, news articles, etc.)

### 4. Simplify Page Files
All page files (`Index.tsx`, `Birthdays.tsx`, `Careers.tsx`, `Business.tsx`, `News.tsx`) reduce to the same pattern:

```typescript
const Page = () => {
  const { data: sections } = usePageSections('home');
  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      {sections?.map(s => (
        <SectionWrapper key={s.id} config={s}>
          <DynamicSection sectionId={s.id} sectionType={s.section_type} />
        </SectionWrapper>
      ))}
      <KawaiiFooter />
    </div>
  );
};
```

No more `SECTION_MAP`, no more `fullControl`, no more `FALLBACK_SECTIONS`. Every section is a `DynamicSection`.

### 5. Remove `BuiltInEditor` from Admin
Since all sections now use `ContentBlockEditor`, the `BuiltInEditor` routing and all individual editors (`HomeHeroEditor`, `HomeStoryEditor`, `HomeAboutEditor`, etc.) are removed. Every section gets the same block editor experience.

### 6. Keep Existing Data Tables
Tables like `homepage_content`, `token_tiers`, `store_hours`, `news_articles` stay as data sources. Some block types (pricing, hours, reviews) will reference these tables to render structured data. The admin's Settings tab still edits `site_settings`.

## Files Changed

| File | Change |
|------|--------|
| Migration SQL | Seed content blocks for all existing built-in sections |
| `DynamicSection.tsx` | Add pricing, hours, reviews, cards block types |
| `SectionWrapper.tsx` | Remove `fullControl` prop entirely |
| `Index.tsx` | Simplify to universal section loop |
| `Birthdays.tsx` | Same universal loop |
| `Business.tsx` | Same universal loop |
| `Careers.tsx` | Same universal loop |
| `News.tsx` | Same universal loop |
| `KlawsomeAdmin.tsx` | Remove `BuiltInEditor` and all individual editors; all sections use `ContentBlockEditor` |
| Delete `KawaiiStory.tsx`, `KawaiiAbout.tsx`, `KawaiiHero.tsx`, `KawaiiVisit.tsx`, `KawaiiTokenPrices.tsx`, `KawaiiReviews.tsx`, `KawaiiNews.tsx`, `KawaiiGiftCards.tsx` | Content now lives in CMS blocks |

## Result
- Every section on every page is controlled identically from the admin
- No more "no editable content" messages
- No more hardcoded labels like "Our Story"
- Section type, background, and content blocks all work consistently
- The admin CMS is the single source of truth for everything on the site


## Goal

Two passes in one go:
1. Add tasteful, consistent hover animations to content images across the site.
2. Audit every page's `PageHero` and ensure each has a working sub-menu of jump links to its main sections.

No content or layout changes — purely additive polish.

---

## Part 1 — Image hover animations

Add a reusable utility class so every content image gets the same kawaii-feeling hover treatment, instead of one-off styles.

**New utility (in `src/index.css` under `@layer components`):**
- `.img-hover` — wraps a fixed-aspect container with `overflow-hidden rounded-[inherit]`, applies `transition-transform duration-500 ease-out group-hover:scale-[1.04]` on the `<img>`, plus a soft gradient overlay that fades in on hover and a subtle ring/shadow lift.
- `.img-hover-tilt` — variant with a tiny `rotate-[0.5deg]` on hover for cards in grids (gallery, news, products).
- Respects `prefers-reduced-motion` via `motion-safe:` prefixes so we don't animate for users who opted out.

**Apply to these image surfaces (wrap parent with `group` + add classes):**
- `KawaiiGallery` / `Gallery.tsx` grid tiles → `img-hover-tilt`
- `KawaiiNews` / `News.tsx` article cards → `img-hover`
- `KawaiiProducts` / `Store.tsx` product cards → `img-hover`
- `KawaiiAbout`, `KawaiiStory`, `OurStory` inline images → `img-hover`
- `CommunityPartners` partner logos → lighter `img-hover` (scale only, no overlay)
- `Birthdays`, `Rental`, `Business`, `BusinessDevelopment`, `Careers` section images → `img-hover`
- `InfoHub`, `Faq` thumbnails (if any) → `img-hover`

`PageHero` hero images stay untouched (they have parallax/gradient already).

---

## Part 2 — Jump-link audit

`PageHero` already supports a `jumpLinks` prop that renders the sub-menu. Pages currently passing it: Birthdays, Careers, Rewards, Rental, BusinessDevelopment, OurStory.

**Pages using `PageHero` but missing `jumpLinks` — add them:**

| Page | Proposed sub-menu items |
|------|--------------------------|
| `Gallery.tsx` | (already added previously — verify still wired) |
| `Store.tsx` | Featured, Plushies, Tokens, Gift Cards |
| `CommunityPartners.tsx` | Partners, Apply, Programs |
| `Contact.tsx` | Visit, Hours, Message Us, FAQ |
| `InfoHub.tsx` | How It Works, Rules, Safety, FAQ |
| `Faq.tsx` | Visiting, Games, Memberships, Birthdays |
| `News.tsx` | Latest, Events, Press |

**Each section in those pages gets:**
- A matching `id="..."` on the section wrapper
- `scroll-mt-28` (or existing nav offset utility) so the sticky nav doesn't cover the heading
- IDs match the `jumpLinks` array exactly

**Also verify:**
- `PageHero` sub-menu renders on mobile (it currently uses horizontal scroll) — confirm and leave as-is if working.
- The previously-reported Gallery sub-menu not appearing — re-check that the `jumpLinks` array is actually being passed and that `PageHero`'s render condition (`links.length > 0`) is satisfied. Fix if regressed.

---

## Files touched

- `src/index.css` — add `.img-hover` / `.img-hover-tilt` utility classes
- `src/components/PageHero.tsx` — only if sub-menu render needs a fix (verify first)
- `src/components/Kawaii{Gallery,News,Products,About,Story}.tsx` — add `group` + `img-hover*`
- `src/pages/{Gallery,Store,CommunityPartners,Contact,InfoHub,Faq,News}.tsx` — add `jumpLinks` prop + section `id`s + `scroll-mt-28`
- `src/pages/{Birthdays,Rental,Business,BusinessDevelopment,Careers,OurStory}.tsx` — wrap inline images with hover utility (no jump-link changes; they're already done)

## Out of scope

- No new motion library, no Framer/GSAP additions (uses existing Tailwind transitions).
- No copy/content changes, no layout restructuring.
- No changes to `KawaiiHero` (homepage) jump links — already present.

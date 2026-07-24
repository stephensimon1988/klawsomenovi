
# Performance optimization (no functionality changes)

The site's core cost is heavy media plus a few always-mounted animations. All fixes below are presentation-layer only — no changes to booking, admin, payments, Shopify/webhooks, database, or auth.

## What's actually slow (verified)

- `public/gallery/` = **34 MB** across 101 files. Many single WebP images are 450–600 KB even though they render at thumbnail size. The `/gallery` page is by far the heaviest route.
- `public/hero-intro.mp4` = **5.3 MB** in `public/` (unoptimized, no poster).
- `src/assets/klawsome-crew-plush.png` (426 KB PNG), `our-story-intro.png` (117 KB PNG), `klawsome-logo.png` (139 KB PNG) — PNGs that should be WebP.
- `KawaiiHero` loads **gsap + ScrollTrigger** eagerly on the homepage, and `LottieAccent` (lottie-react) is mounted immediately.
- `App.tsx` already lazy-loads routes and defers extras — good baseline, small further wins available.

## Changes

### 1. Image asset diet (biggest win)
- Re-encode every `public/gallery/*.webp` at `quality ~72`, `max-width 1600`, stripped metadata. Target ≤ ~150 KB each; expect ~34 MB → ~8–10 MB total. Visual quality preserved.
- Convert three heavy PNGs to WebP and swap imports: `klawsome-crew-plush.png`, `our-story-intro.png`, `klawsome-logo.png`.
- Add `loading="lazy"` and `decoding="async"` to every non-hero `<img>` on `/gallery`, `/news`, `/community-outreach`, `/our-story`, `/careers`, and gallery-style rows on the homepage. Only the LCP hero image keeps `fetchpriority="high"`.
- Add explicit `width`/`height` (or aspect-ratio) on gallery thumbnails to eliminate layout shift.

### 2. Hero video
- Add a lightweight WebP poster and set `<video preload="metadata" playsinline muted>` so the 5.3 MB file only fetches on interaction / when the section scrolls in via `IntersectionObserver`.
- Consider a smaller 720p re-encode of `hero-intro.mp4` (target ~1.5 MB). Ship as `.mp4` still, no format change.

### 3. Defer animation libraries
- Move `gsap` + `ScrollTrigger` in `KawaiiHero` behind a `requestIdleCallback` / `IntersectionObserver` dynamic `import()`. Fade-in still works; parallax activates after first paint. Removes gsap from the initial critical chunk.
- Lazy-mount `LottieAccent` the same way (already `exclude`d from optimizeDeps — just gate the mount).

### 4. Route/data hygiene
- Add `staleTime: 5 * 60_000` and `refetchOnWindowFocus: false` on the `QueryClient` default so `site_settings` / `store_hours` / `google-rating` don't re-fetch on every tab focus.
- Prefetch the `/gallery`, `/store`, `/birthdays` route chunks on idle (they're the most-visited).

### 5. Head / network
- Add `<link rel="preconnect">` for the Shopify Storefront + Google Fonts hosts already used.
- Keep the existing hero image `preload` — leave that alone.

## Explicitly NOT touching

- No changes to `BookingWizard`, edge functions, webhooks, Shopify/Square integrations, admin pages, RLS, or database.
- No new dependencies, no framework/router changes.
- No design/palette/font changes.

## Technical notes

- Re-encoding will use `sharp` via a one-off script run locally in the sandbox (not shipped). Output files replace the originals in `public/gallery/`; filenames unchanged so all references keep working.
- Dynamic imports for gsap/lottie use `const { default: gsap } = await import('gsap')` inside a `useEffect` gated by `IntersectionObserver`. If the user has `prefers-reduced-motion`, skip loading gsap entirely.
- Expected impact: initial JS ~ -80–120 KB gz (gsap+lottie out of critical path), `/gallery` payload ~ -25 MB, LCP on homepage unchanged or slightly better (video no longer competes with hero image).

Approve and I'll implement in a single pass.

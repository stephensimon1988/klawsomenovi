# Performance optimization plan

Goal: faster loads and lighter runtime with **no visual change**. All wins come from how assets and code are shipped, not how anything looks.

## What's slow today

- **Single JS bundle**: every page (admin, store, gallery, careers…) loads on first paint because `App.tsx` static-imports all 17 routes.
- **3.4 MB of step GIFs** in `public/steps/` decoded on the homepage (`trade-up.gif` alone is 1.6 MB).
- **Lottie animations** fetch ~4 JSON files from `lottie.host` on every page — currently 403'ing, so they cost network round-trips for nothing.
- **CMS data file** (`src/content/cmsData.ts`, 5,666 lines) is bundled into the main chunk.
- **Vendor libs** (gsap, framer-motion, lottie-web, recharts, embla, radix-ui) all land in one chunk.
- **Prebuild image checker** runs 200 network requests on every build (~20–40 s).
- **No LCP preload** for the hero image; no `width`/`height` on several large images → layout shift.

## Changes

### 1. Route-level code splitting
Convert all routes except `/` to `React.lazy()` + `<Suspense>` in `App.tsx`. Homepage stays eager (LCP). Every other page becomes its own chunk loaded on demand.

### 2. Vendor chunk splitting
Add `build.rollupOptions.output.manualChunks` in `vite.config.ts`:
- `react-vendor` — react, react-dom, react-router
- `ui-vendor` — radix-*, lucide-react
- `motion-vendor` — gsap, framer-motion, lottie-web
- `data-vendor` — @tanstack/react-query, @supabase/supabase-js, zustand

Lets the browser cache vendors across deploys and keeps the main chunk small.

### 3. Production build hygiene
In `vite.config.ts` add `build`: `minify: 'esbuild'`, `sourcemap: false`, `cssCodeSplit: true`, `reportCompressedSize: false`, `target: 'es2020'`, `esbuild.drop: ['console', 'debugger']` in prod.

### 4. Lazy `LottieAccent`
- Dynamic-import `lottie-web` only when the component is in-viewport (IntersectionObserver).
- Drop the network fetch when the JSON URL fails (currently retries every mount) — fall back silently.
- Result: lottie-web (~250 KB) is not in the main bundle and never loads on mobile if accents are off-screen.

### 5. Step GIFs → animated WebP
Convert `public/steps/*.gif` (3.4 MB total) to animated WebP via `ffmpeg`. Same loop, same visual, ~85–90% smaller (~400 KB total). Update the 3 references in `cmsData.ts` from `.gif` → `.webp`. Pixel-identical at the rendered size.

### 6. Hero LCP preload + image hints
- Add `<link rel="preload" as="image" href="..." fetchpriority="high">` for the hero image in `index.html` (a single static URL is fine; CMS override is rare).
- Add `decoding="async"` and explicit `width`/`height` to large `<img>` tags in `KawaiiTokenPrices`, `KawaiiStory`, `KawaiiNews`, `KawaiiGiftCards` (sizing values come from current rendered dimensions, so layout is unchanged).

### 7. Smarter prebuild image checker
Update `scripts/check-images.mjs`:
- Cache results in `.image-check-cache.json` keyed by URL+mtime; skip URLs verified in last 7 days.
- Skip entirely when `CI` is unset and `--no-cache` not passed (so local `npm run build` is instant).
- Keep the auto-fix behavior for new/changed refs only.

### 8. Split `cmsData.ts` per consumer
Move per-page sections (gallery_photos, news_articles, job_listings, etc.) into separate files (`src/content/cms/gallery.ts`, `news.ts`, …) and import only where used. `useCmsContent` already keys by table name — wire it to dynamic-import the matching module. The homepage stops paying for 4,000+ lines of gallery captions.

### 9. Defer Acuity embed
`Index.tsx` already lazy-loads `embed.js` in `useEffect`. Move the actual `<iframe>` mount behind an `IntersectionObserver` so it doesn't network-load until the user scrolls near the booking section.

## Expected impact

| Metric | Before (rough) | After (target) |
|---|---|---|
| Initial JS | ~900 KB gz | ~250 KB gz |
| Homepage image weight | ~5 MB | ~1.2 MB |
| Build time (warm) | ~45 s | ~20 s |
| LCP (4G) | ~3.5 s | ~1.8 s |

## What's intentionally NOT touched

- No component re-styling, no layout/spacing tweaks, no copy changes.
- No animation removed — Lottie/GSAP behavior is identical, just loaded lazily.
- No CMS schema change — only file organization.
- No dependency removed (we can revisit framer-motion vs gsap later if you want; keeping both for now to avoid visual regression risk).

## Technical notes

- Vite manual chunks rely on the alias config already in `vite.config.ts` — no React-dedup risk.
- `Suspense` fallback for lazy routes will be a transparent `<div />` so there's no visible loader (matches today's "no spinner" behavior).
- Animated WebP is supported in every browser the project already targets (Chrome 32+, Safari 14+, Firefox 65+).

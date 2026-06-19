# Performance Optimization Plan

Goal: make the site **load fast** (smaller bundles, smaller images, faster LCP) and **run fast** (lighter animations, fewer re-renders, less main-thread work).

The site currently ships ~39MB of assets in `src/assets`, uses three animation libraries (framer-motion, gsap, lottie-web), and eagerly loads the homepage. Below is a prioritized, low-risk pass.

---

## 1. Image weight (biggest LCP win)

**Problem:** 25+ images over 200KB. Notable offenders:
- `klawsome-logo-animated.gif` — 2.1MB
- 20+ tee shirt photos — 1.0–1.2MB each (Store page = ~25MB just in tees)
- `community/toys-for-tots.webp` — 1.4MB
- Several hero/news webp/jpg in the 500–700KB range

**Actions:**
- Convert oversized PNG/JPG to WebP (or AVIF) and resize to actual rendered sizes (most tee photos display at ~600px, not 2000px).
- Replace the 2.1MB animated GIF with an MP4/WebM `<video autoplay muted loop playsinline>` (typically 5–15× smaller) or a static WebP if motion isn't critical.
- Add `loading="lazy"` and `decoding="async"` to every non-hero `<img>`; add `fetchpriority="high"` + `<link rel="preload">` only to the page-specific LCP image (e.g. the hero on Index).
- Add explicit `width`/`height` (or aspect-ratio) on all images to eliminate CLS.

**Target:** drop `src/assets` from 39MB to ~6–8MB; cut Store page initial transfer by ~80%.

## 2. Code-splitting & lazy loading

**Problem:** `Index.tsx` is imported eagerly, and the homepage pulls in `KawaiiHero`, `KawaiiProducts`, `KawaiiReviews`, `KawaiiNews`, etc., plus framer-motion + gsap + lottie up front. `FloatingContactWidget`, `BackToTop`, `BookNowDialog`, and `DividerParallax` mount on every route.

**Actions:**
- Lazy-load `Index` like the other routes.
- Lazy-load below-the-fold homepage sections (`KawaiiProducts`, `KawaiiReviews`, `KawaiiNews`, `KawaiiGiftCards`, etc.) with `React.lazy` + `Suspense`, or mount them on first scroll via `IntersectionObserver`.
- Defer `FloatingContactWidget`, `BackToTop`, `BookNowDialog`, `DividerParallax` until after first paint (`requestIdleCallback` / dynamic import).
- Lazy-load `LottieAccent` only when its container is on screen; keep `lottie-web` out of the initial chunk.

## 3. Animation library consolidation

**Problem:** framer-motion + gsap + lottie-web all ship to most pages. That's ~150–200KB gzipped of animation code for mostly small effects.

**Actions:**
- Audit each usage. Where the effect is a simple fade/slide/hover, replace with CSS keyframes / Tailwind utilities (`animate-fade-in`, `hover-scale`, already defined).
- Standardize on **one** runtime animation library. Recommendation: keep framer-motion for component-level interactions, drop gsap entirely (only used in `useGsapScroll` + a few pages — replace with CSS `scroll-driven` animations or IntersectionObserver + class toggles).
- Lazy-import the remaining lib so it loads after first paint.
- Replace lottie-web with a static SVG/CSS animation where feasible; otherwise lazy-load and pause when off-screen.

## 4. Render-time wins

- Memoize heavy lists (`KawaiiProducts` tee grid, news cards) with `React.memo` + stable keys; avoid recreating inline objects in props on each render.
- Guard scroll/resize listeners with `passive: true` and rAF throttling (check `DividerParallax`, `BackToTop`, `KawaiiNav`).
- Pause off-screen animations using `IntersectionObserver` (especially lottie + any infinite CSS loops).
- Respect `prefers-reduced-motion` — disable decorative animations for users who opt out (also a perf win on low-end devices).

## 5. Build & delivery

- Add `vite-imagetools` so imports like `hero.jpg?w=800;1600&format=webp&as=picture` generate responsive `<picture>` srcsets at build time.
- Add a `<link rel="preconnect">` for the Supabase storage origin used by hero images.
- Keep current manual chunk split; verify the resulting `react-vendor` chunk still contains gsap/framer/lottie only if those libs are actually needed in the initial route — otherwise move them to their own async chunk.
- Enable HTTP `cache-control: immutable` headers on hashed build assets (Lovable hosting default — just verify).

## 6. Verification

After each change set:
- Run `browser--performance_profile` on `/`, `/store`, `/careers` and record LCP, CLS, INP, total transfer.
- Compare bundle output (`dist/assets/*.js` sizes) before/after.
- Spot-check that lazy sections still render correctly and animations are not janky.

**Target metrics (homepage, fast 4G):**
- LCP < 2.0s (currently likely 3–5s with multi-MB hero candidates)
- Initial JS < 200KB gzipped
- Total initial transfer < 1MB

---

## Suggested execution order

1. Image compression + responsive `<picture>` + GIF → video (highest ROI).
2. Lazy-load `Index` + below-fold homepage sections + floating widgets.
3. Replace decorative framer/gsap usage with CSS; drop gsap dep.
4. Lottie cleanup + reduced-motion handling.
5. Re-measure, tighten manual chunks if needed.

I can execute these in stages so you can review after each one — recommend starting with **Stage 1 (images)** since it's the single biggest user-visible speedup.

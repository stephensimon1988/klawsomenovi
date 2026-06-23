# Performance Cleanup Plan

You're right — there's real lag, especially on the homepage. Here's what I found and what I'd fix, ordered by impact-to-effort.

## What's causing the lag

1. **`public/hero-intro.mp4` is 36 MB** and the `<video>` uses `preload="auto"`, so the browser downloads the whole thing during the critical first paint, fighting the rest of the page for bandwidth.
2. **One giant JS bundle.** `vite.config.ts` lumps GSAP + framer-motion + lottie-web + Supabase into a single `react-vendor` chunk, so every page (even simple ones) downloads all of it.
3. **5 Lottie animations on the homepage** (Hero, About, Tokens, Gift Cards, Story) — each runs a 60 fps SVG loop and fetches JSON from `lottie.host`.
4. **`public/rewards/rocking-klawsome-cat.gif` is 1.4 MB** — GIFs decode on the CPU.
5. **9 GSAP ScrollTriggers** on the homepage, and `useGsapStagger` doesn't wrap in `gsap.context()`, so triggers can leak on fast remounts.
6. **Gallery page loads ~34 MB** of full-size images with no responsive `srcset` or pagination.
7. **`src/assets/klawsome-crew-plush.png` is 426 kB** (PNG, not WebP).

## Proposed fixes

### Phase 1 — Quick wins (biggest impact, low risk)
- **Hero video:** change `preload="auto"` → `preload="metadata"` in `KawaiiHero.tsx`, add a `prefers-reduced-motion` guard that falls back to the poster image, and re-encode `hero-intro.mp4` to ≤5 MB at 1280px wide (ffmpeg, H.264 CRF 28).
- **Split the vendor chunk** in `vite.config.ts`: separate buckets for `gsap`, `framer-motion`, `lottie-web`, and `@supabase`. Pages that don't use them stop downloading them.
- **Convert the 1.4 MB GIF** to a muted/looping `<video>` (WebM/MP4, ~150–200 kB) wherever `rocking-klawsome-cat.gif` is referenced.
- **Convert `klawsome-crew-plush.png`** (and `our-story-intro.png`) to WebP.

### Phase 2 — Animation diet
- **Reduce Lottie count from 5 → 2** on the homepage. Keep the Hero sparkle and one other; replace the rest with a CSS sparkle (lightweight, GPU-only). LottieAccent already lazy-mounts, so this is purely about cutting concurrent animation loops.
- **Fix `useGsapStagger` cleanup** in `src/hooks/useGsapScroll.ts` — wrap the effect in `gsap.context(el)` and return `ctx.revert()`, matching the pattern `KawaiiHero` already uses. Prevents trigger leaks.

### Phase 3 — Gallery (optional, only if /gallery feels slow)
- Add a "Load more" pattern (render 12 at a time) and generate 400w/800w responsive variants via a Vite image plugin so phones don't pull 600 kB per thumbnail.

## What I'd leave alone
- `DividerParallax` and `NavClaw` cursor springs — both already respect reduced-motion and touch, and they're not the culprits.
- `framer-motion` itself — it's genuinely used by the nav and a couple of pages; the fix is the chunk split, not removal.

## Expected result
Phase 1 alone should make the homepage feel dramatically snappier: ~35 MB less to download, faster Time-to-Interactive, and far less main-thread work during scroll. Phase 2 cleans up the sustained 60 fps animation load.

## Want me to go ahead?
I'd suggest doing **Phase 1 + Phase 2** in one pass — it's all low-risk, frontend-only, and that's where the perceived lag lives. Let me know and I'll switch to build mode.

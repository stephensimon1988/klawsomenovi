
# Claw Game Embed + Sticky CTAs + 5OFF Discount

## Heads-up
Poki is cross-origin — we cannot hide their in-iframe header. We'll wrap their page with our nav on top (Option A, confirmed).

---

## Phase 1 — `/claw-game` wrapped with our nav

- Remove `ClawGameRedirect` from `src/App.tsx`; route `/claw-game` to a new `src/pages/ClawGame.tsx`.
- `ClawGame.tsx`:
  - `<KawaiiNav />` at the top.
  - Full-bleed `<iframe src="https://poki.com/en/g/lucky-claw-machine">` sized to `calc(100vh - navHeight)`, `allow="autoplay; fullscreen"`.
  - Loading shimmer + fallback "If the game doesn't load, [open in new tab]" in case Poki blocks framing.
- No footer (keeps it game-focused).
- Hide the cat `FloatingContactWidget` on this route (route check via `useLocation`).

## Phase 2 — Sticky bottom-right CTAs

New `src/components/ClawGameCTAs.tsx`, mounted only on `/claw-game`.

Layout, anchored bottom-right (same corner the cat normally lives):

```text
        ┌──────────────────────────────┐
        │  ✨ 5% OFF — code: 5OFF  ✨  │  ← pulsing/glowing popup
        │  Tap to copy & shop          │     (appears after 10 min)
        └──────────────────────────────┘
  [ Join Rewards ] [ Book Event ] [ Shop Store ]   ← row of 3 buttons (always visible)
```

### The 3 buttons (immediate, always visible)
- Row of 3 pill buttons, kawaii tokens (rounded-full, border, soft shadow).
- **Join Rewards** → `/rewards`
- **Book Event** → calls `openBookingModal()` from `BookNowDialog`
- **Shop Store** → `/store`
- Each dismissible? No — buttons stay. Only the discount popup is dismissible.

### The discount popup (appears after 10 min)
- Sits **above** the row of buttons.
- Card content: "🎉 5% off your order — code **5OFF**" + small "Copy code" affordance (clipboard + toast) and a click-through to `/store`.
- **Pulsing glow** animation: soft outer glow using `box-shadow` that pulses via a new `@keyframes pulse-glow` in `tailwind.config.ts` (HSL pink/yellow tokens). Combine with a gentle scale pulse.
- Entrance: framer-motion spring slide-up + fade.
- Dismissible (X) — state in `sessionStorage` so it doesn't re-appear that session.

### Timer
- 10-minute timer starts on mount, pauses on `visibilitychange` (hidden tab doesn't count), persists elapsed ms in `sessionStorage` so refresh resumes.
- Dev override: `?ctaDelay=5` (seconds) for QA.

## Phase 3 — Shopify `5OFF` discount
Using Shopify tools (requires reconnect prompt):
- Price rule: 5% off, applies to all products, no expiration, one use per customer, no minimum.
- Discount code `5OFF` tied to the rule.

## Phase 4 — QA
- `/claw-game`: nav renders, iframe loads, cat hidden, no console errors.
- Buttons row appears immediately and routes/opens modal correctly.
- After 10 min (or `?ctaDelay=5`): glowing discount popup appears above buttons, copy works, dismiss persists for session.
- `5OFF` applies 5% at Shopify checkout.

---

## Files
- **Add:** `src/pages/ClawGame.tsx`, `src/components/ClawGameCTAs.tsx`
- **Edit:** `src/App.tsx` (route), `src/components/FloatingContactWidget.tsx` (hide on `/claw-game`), `tailwind.config.ts` (add `pulse-glow` keyframes)

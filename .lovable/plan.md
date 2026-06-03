## Hidden /clawsome-video-game page

Create a secret page that embeds the itch.io claw machine game. Not linked in nav or sitemap.

### Files

**New: `src/pages/ClawsomeVideoGame.tsx`**
- Minimal page with `KawaiiNav` + `KawaiiFooter`
- Centered responsive iframe (16:9, max-width ~1100px) loading `https://html-classic.itch.zone/html/14041243/index.html` (itch.io's direct HTML embed URL for ninneko's claw-machine-3d-2)
- `allow="fullscreen; autoplay; gamepad; pointer-lock"`, `allowFullScreen`
- Heading: "Welcome to the Secret Klawcade 🎮"
- Small fallback link to `https://ninneko.itch.io/claw-machine-3d-2` in case the iframe is blocked
- SEO: `<title>Klawsome Secret Game</title>`, `<meta name="robots" content="noindex, nofollow" />`

**Edit: `src/App.tsx`**
- Lazy import `ClawsomeVideoGame`
- Add `<Route path="/clawsome-video-game" element={<ClawsomeVideoGame />} />` above the catch-all
- Do not touch `KawaiiNav.tsx`

**Do NOT edit:** `public/sitemap.xml`, `public/robots.txt`, `KawaiiNav.tsx` — keeps it hidden from nav and crawlers.

### Caveat

itch.io only allows external iframe embedding when the creator opts in. If ninneko's game is not embeddable, the iframe will render an itch.io block message. In that case the page falls back to a "Play on itch.io" link that opens the game in a new tab. If you want a guaranteed-embeddable alternative game instead, say the word.

## Plan: Update News page photos

Replace the `image_url` for three news cards in `src/content/cmsData.ts` → `news_articles` array. The News page (`KawaiiNews`) reads from this list, so updates flow through automatically.

### Mappings (screenshot → entry)
1. **Spartan** → `news-spartan-msu-2026` ("Klawsome: A Filipino-American Family's Claw Arcade" — Spartan Story Hub)
2. **Sakura draws crowds** → `news-wxyz-2026` ("Michigan's first Asian-inspired mixed-use development draws crowds in Novi" — WXYZ Detroit)
3. **Buzz Grows Around Novi Spot** → `news-detroitnews-2026` ("Buzz grows around Novi spot with Asian-themed shops and cuisine" — Detroit News)

### Steps (once you send the photos)
1. Upload each photo via `lovable-assets` CLI into `src/assets/news/` as `.asset.json` pointers:
   - `spartan.jpg.asset.json`
   - `sakura-draws-crowds.jpg.asset.json`
   - `buzz-grows-novi.jpg.asset.json`
2. In `src/content/cmsData.ts`, replace the `image_url` field of the three matching news entries with the CDN URLs from the new asset pointers.
3. No component changes needed — `KawaiiNews.tsx` already renders `image_url` directly.

Send the 3 photos in the next message (label which is which, or send them in the same order as the screenshot: Spartan, Sakura, Buzz) and I'll execute.

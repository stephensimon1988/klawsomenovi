Add the "As Seen On" press logos image to `src/components/KawaiiFooter.tsx`, placed between the existing menu/logo block and the copyright line.

## Changes

**`src/components/KawaiiFooter.tsx`**
- Inside the footer `<div className="container">`, after the existing `flex flex-col md:flex-row ...` block (logo + menu columns) and before the `<div className="border-t ...">` copyright block, insert a centered image:
  - Source: the existing Squarespace CDN URL already used on `News.tsx` and `KawaiiNews.tsx` (`https://images.squarespace-cdn.com/.../As+Seen+On.webp`) — no new upload needed since the same image is already in use.
  - Alt: "As seen on Michigan Mama News, Hour Detroit, Little Guide, Hometown Life"
  - Classes: `max-w-md w-full mx-auto mb-8` with `loading="lazy"`.

No other files change.

# Consistent Buttons Site-Wide

Every button on the public pages gets the same height, the same font size, and ALL-CAPS text. Colors stay exactly as they are today.

## The standard

- Height: 45px, fixed for every button
- Text: 18px, heading font, bold, letter-spaced, uppercase
- Shape: pill (rounded-full), generous horizontal padding
- Colors: unchanged — red stays red, yellow stays yellow, outline/ghost stay as-is
- Capitalization: forced by CSS, so buttons read "BOOK EVENT", "SHOP NOW", "APPLY NOW" regardless of how the label is typed

Mobile keeps the same 45px height so tap targets stay comfortable; full-width buttons stay full-width.

## What gets updated

One shared button style becomes the single source of truth, then every public-page button is pointed at it:

- Nav bar (desktop + mobile menu) — BOOK EVENT
- Homepage — hero CTAs, story section, token prices, gift cards, products, visit/hours section, floating contact widget
- Page banners (shared hero component used across pages)
- Birthdays, Rental, Business, Business Development, Careers, Rewards, Gallery, Community Partners, News, Our Story, FAQ, Claw Machine Tips, Unsubscribe
- Store — product cards, quick-add modal, cart drawer, gift card links
- Dynamic CMS-driven sections (buttons whose labels come from the admin dashboard)

Untouched: the /klawsome-admin dashboard and the booking pop-up (its text was intentionally enlarged earlier), plus non-button controls like the hamburger icon, carousel arrows, and cart icon.

## Verification

After the change, each public page is loaded in a browser and buttons are measured to confirm 45px height and 18px uppercase text, with screenshots of the homepage, birthdays, rental, careers, and store.

## Technical notes

- `src/components/ui/button.tsx`: add a `cta` size (`h-[45px] rounded-full px-8 text-[18px] font-heading font-bold tracking-wider uppercase`); keep the existing `sm`/`lg`/`icon`/`hero` sizes so admin and booking-wizard buttons are unaffected.
- Replace `size="hero" | "heroSm" | "lg" | "sm"` with `size="cta"` on public-page `<Button>` instances, and strip per-button `text-*`, `h-*`, `py-*` overrides that would fight the standard.
- Hand-rolled pill CTAs written as raw `<a>`/`<button>` (in `KawaiiHero`, `KawaiiStory`, `KawaiiVisit`, `KawaiiGiftCards`, `PageHero`, `Rental`, `BusinessDevelopment`, `Rewards`, `Gallery`, `CommunityPartners`, `Birthdays`, `Storefront`, `DynamicSections`, `FloatingContactWidget`) get a shared `btn-cta` utility class in `index.css` built from the same values, keeping their existing color classes.
- Note on font size: "18pt" is applied as 18px, which already reads large next to the current 12–14px buttons and fits a 45px pill. True 18pt (24px) would need a taller button — easy to switch if you want it bigger.
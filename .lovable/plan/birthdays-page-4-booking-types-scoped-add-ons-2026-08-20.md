# Birthdays page: 4 booking types + scoped add-ons

## What changes

### 1. Package Comparison — all four booking types
The comparison table on `/birthdays` currently compares Private vs Semi-Private only. It becomes a four-column comparison matching the booking wizard's pathways:

- Private Party ($319)
- Semi-Private Party ($250)
- Rent a Klaw Machine (from $445)
- Klawsome Mobile (from $295)

Rows are rewritten so each one has a meaningful answer for all four (tokens/play, exclusivity, play time, location, seating, outside food, food service, decor setup, plushie selection, machine color/music, delivery to your venue, number of machines).

Layout: four price/header columns with a label column. On desktop all five columns fit; on tablet/mobile the table becomes horizontally scrollable inside its card with the label column pinned, so nothing overflows the page. Each column keeps a distinct accent (red = private, yellow = semi, blue = rental, pink = mobile) and its own "Book" action below the table.

### 2. "Make It Extra Special" — grouped by booking type
The add-ons area is reorganized into clearly labelled groups so it's obvious what pairs with what:

- **In-Store Party Add-Ons (Private & Semi-Private)** — existing cards: Private Event Decorations, Paris Baguette Basic Decor, Costumed Mascot Show, XL Plushie, Event Photographer. Each card gets a small eligibility tag (e.g. "Private only", "Semi-private only", "Private & Semi-private").
- **Rent a Klaw Machine Add-Ons (new group)** — Extra Hour ($145), Plushie Refill ($200), Additional Machine ($245), plus a short intro line on what a rental includes (1 hr $445 / 2 hr $645, 40 plushies or your own product).
- **Klawsome Mobile Add-Ons (new group)** — the three mobile tiers (Token Pre-Buy, Unlimited Play, Reserve Arcade) summarized with weekday/weekend starting prices, plus Plushie Refill, and a note that mobile pricing varies by weekday vs weekend and includes delivery quoting at checkout.

Each group gets a one-line "Goes with: …" clarifier and its own CTA into the booking modal.

Prices and eligibility come from the same source the booking wizard uses so the page can't drift from checkout.

## Technical notes

- Edit `src/pages/Birthdays.tsx` only (plus jump links in its `PageHero`: add "Rental & Mobile" anchor if a separate section is warranted).
- Import `PATHWAYS`, `RENTAL_PACKAGES`, `MOBILE_TIERS`, `ADDONS`, `addonsFor`, `fmtUSD` from `src/lib/booking/catalog.ts` for prices and `scope` tags instead of hardcoding new numbers. Existing CMS `party_options` prices stay as the override for private/semi headers.
- Comparison cells reuse the existing `Cell` component; extend its `color` prop to include the rental/mobile accents.
- Wrap the table in `overflow-x-auto` with `min-w` on the grid so mobile scrolls the table, not the page (keeps the site-wide no-horizontal-overflow rule).
- Buttons use the existing `size="cta"` variant and all-caps styling; no new button styles.
- No backend, schema, or booking-logic changes.

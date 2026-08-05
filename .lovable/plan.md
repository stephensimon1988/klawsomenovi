# Editable Token Tiers in the Admin Panel

## What you'll get

A new **Token Prices** tab in /klawsome-admin where you can edit the token pricing table shown on the homepage: price, tokens, bonus %, which row gets the yellow "TOP PICK" highlight, and the row order. Add or delete tiers too. Changes appear on the site without a code change.

## How it works today (why this needs a small backend change)

Right now only **Vital Info** and **Store Hours** read live from the database. Token tiers live in a static content file, so edits in the admin panel wouldn't stick. This plan creates a real `token_tiers` table, seeded with today's 5 tiers ($10, $30, $50, $100 highlighted, $249), and switches the homepage to read from it — same pattern already used for hours.

## Steps

1. Create the `token_tiers` table (price, tokens, bonus, highlight flag, order) with public read access and admin-only writes, then seed it with the current 5 tiers exactly as they appear now.
2. Add `token_tiers` to the live-data list so the homepage reads from the database, falling back to the current values if the fetch fails.
3. Add a **💰 Token Prices** tab in /klawsome-admin using the existing multi-row editor (edit / add / delete / reorder, highlight toggle).

## Other sections worth making editable (my recommendation, in priority order)

These are all content the owners will realistically want to change without asking a developer. Each follows the same table + tab pattern.

**High value — likely to change often**
- **News / Press articles** — add a new press mention (title, source, date, link, image) and hide old ones.
- **FAQ items** — question, answer, which page it shows on. Rules and policies change.
- **Job listings** — open/close a role, edit title, description, apply link. You already had to ask me twice this year.
- **Party & rental pricing** (private, semi-private, rental packages, Klawsome Mobile tiers) — read-only display copy in the admin plus editable descriptions; note that the actual checkout prices come from Shopify variants, so the admin would edit the marketing copy, not the charge amount.

**Medium value — occasional edits**
- **Homepage copy** — hero headline, subheadline, button text, "how it works" steps.
- **Gallery photos** — captions, album names, ordering, delete/add photos (you did a big caption pass manually).
- **Reviews / testimonials** — swap in fresh quotes.
- **Page banners** — eyebrow, title, subtitle for /our-story, /news, /careers, etc.
- **Special announcement banner** — a new single field for things like "Special Summer Hours" so seasonal notices don't need code edits.

**Lower value — set once, rarely touched**
- Rewards tiers and redemptions, gift card copy, our-story sections, community partners, invite templates.

## Technical notes

- New table: `public.token_tiers` (`price text`, `tokens text`, `bonus text`, `is_highlight bool`, `sort_order int`, timestamps + updated_at trigger). Public read grant for `anon`/`authenticated`, writes only via the existing `cms-admin` edge function's service role.
- `token_tiers` is already in the `cms-admin` allow-list, so no edge function change is needed.
- `src/hooks/useCmsContent.ts`: add `token_tiers` to `LIVE_TABLES`.
- `src/pages/KlawsomeAdmin.tsx`: new `TabsTrigger`/`TabsContent` rendering `MultiRowEditor` with columns price / tokens / bonus / is_highlight(bool) / sort_order.
- `KawaiiTokenPrices.tsx` already calls `useCmsTable('token_tiers')` — no component change required.

Tell me which of the "other sections" you want and I'll fold them into the same build.

# Klawsome Master Feedback — Audit & Outstanding Items

I parsed the Word doc (18 pages, embedded images included). Below is a page-by-page audit against the current codebase, flagged as **DONE**, **NOT DONE**, or **PARTIAL / NEEDS REVIEW**.

---

## Global / Branding

- **NOT DONE** — Mobile responsiveness pass (explicit ask: "optimize for mobile views not just laptop")
- **NOT DONE** — Acquire `klawsomemobile.com` domain (user-side task, not code)
- **NOT DONE** — Change favicon / tab icon to the Filipino sun (currently `/favicon.png`)
- **NOT DONE** — Overall lighter/brighter palette like luckypuppyarcade.com; lighten all photo filters (increase red/blue opacity, avoid 100% white text on photos)
- **NOT DONE** — Use NEW event photos from the two Google Drive folders + Filipino Blessing folder
- **NOT DONE** — Use logo-animal vector files consistently throughout the site
- **NOT DONE** — Replace white body/heading text with dark blue (with lightened photos behind)
- **PARTIAL** — Scroll-to-top on route change: `BackToTop` exists but there is no global `ScrollToTop` on route change. Need to add one so page-links land at top.
- **NOT DONE** — Email address fix: `KawaiiFooter.tsx:81` still uses `info@klawsomenovi.com` → change to `team@klawsomenovi.com`
- **NOT DONE** — Add new pages: "Tips to Win Claw Machines" and "Fundraising"
- **NOT DONE** — More movement/animation; feature video and Instagram content more prominently (Lucky Puppy style)

## Homepage

- **NOT DONE** — Add TikTok link at bottom (footer has TikTok text link, but ask is to surface it more prominently alongside FB/IG/YT icons)
- **NOT DONE** — Add a pop-up cat on right-hand side to engage with social media / send a message (like current live site). `FloatingContactWidget` exists but needs the cat character + social engagement framing.
- **NOT DONE** — Reduce visible wordiness; bury SEO copy in FAQ at bottom; keep customer-facing copy aesthetic
- **NOT DONE** — "How to Play": restore the original wavy-decoration look, remove numbered steps, fewer words
- **NOT DONE** — Visit/Find Us: de-word, remove duplicate hours mentions
- **NOT DONE** — Token prices: revert to the simpler original layout (bonus % + Top Pick badge) instead of the current package-grid pricing table
- **NOT DONE** — Reviews: live-link to actual Google rating + count; curate only featured reviews; tone animals to Klawsome style/colors
- **NOT DONE** — Add stronger social proof block: TikTok videos, Instagram reels, Google reviews, MSU feature, press mentions, UGC
- **NOT DONE** — Delete the standalone "Schedule / Book Your Visit" section (redundant with top-right Book Now button)
- **NOT DONE** — Delete the duplicate "Ready to Play / Book Your Visit" CTA section
- **NOT DONE** — Replace static gift-card section with a scrolling "always visible" floating button cluster (Book Party / Gift Cards / Store) that follows the user as they scroll
- **NOT DONE** — Fox chat widget feels too small; make it bigger

## Rental Page

- **NOT DONE** — Delete the "(~every 3 tries)" copy
- **NOT DONE** — Add new add-on: "One extra claw machine — $245 (coming soon)"
- **NOT DONE** — Add new add-on: "Extra hour — $145/machine"
- **NOT DONE** — Add KFT / Onezo / Halloween-at-our-house photos
- **NOT DONE** — Draft liability release / waiver (tip-over, electrocution, injury — 0 liability)
- **NOT DONE** — Generate additional FAQ entries
- **NOT DONE** — Swap hero illustration to use the three logo animals (vectors from Anna Jain)

## Store Page

- **PARTIAL** — Reimagined as Amazon/Walmart-style storefront (Shopify storefront was just built ✅). Outstanding: actually sell plushies & items — needs real product data populated in Shopify

## Birthdays / Events Page

- **NOT DONE** — Use orange gradient on "Klawsome!" wordmark; delete the white text variant
- **NOT DONE** — Delete the redundant "Klawsome wants to celebrate you! / free gift" header copy above the graphic
- **NOT DONE** — Delete the "Are tables and chairs provided?" FAQ (redundant with seating/space question)
- **NOT DONE** — Delete the entire "Hosting a Klawsome Event? — invite templates" section (`Birthdays.tsx:165` still present — PDFs aren't editable so they're not useful)
- **NOT DONE** — Delete the standalone "Ready to Play / Book Your Visit" CTA at the bottom of Birthdays

## Gift Cards

- **NOT DONE** — Make designs generic (remove Valentine's Day + Easter specifics)
- **NOT DONE** — Use Klawsome-style animals on the cards

## Careers

- **NOT DONE** — Replace generic job-card imagery with the individual logo animals

## Our Story

- **NOT DONE** — Add family photos (pull from `klawsomenovi.com/ourstory`)
- **NOT DONE** — Remove the "Team" page entirely (currently at `src/pages/Team.tsx`, routed in `App.tsx`)

## Community Outreach

- **NOT DONE** — Use photos Agnes sent via email
- **NOT DONE** — Pull content from Canva flyer
- **NOT DONE** — Add three event photo-album sections: Novi Community Fest / Kalayaan PH Independence Day / Novi Public Library Paaralang-Pilipino

## News

- **NOT DONE** — Refresh article list from `linktr.ee/klawsomenovi`

## Information Architecture

- **NOT DONE** — Combine Info Hub + Contact + FAQ into a single page (currently three separate pages: `InfoHub.tsx`, `Contact.tsx`, `Faq.tsx`)

## Gallery / Sakura Novi / Media Kit

- **NOT DONE** — Improve text legibility on hero (Gallery page)
- **NOT DONE** — Replace generic illustrations with logo-animal vectors throughout

---

## Already Done (✅)

- TikTok link present in footer
- `BackToTop` button exists
- Shopify storefront on `/store`
- Acuity scheduling iframe updated

---

## Recommended Implementation Order

Since this is a large backlog, I recommend tackling it in waves rather than one giant batch. Suggested grouping:

1. **Quick global fixes** (1 batch): email correction, favicon to Filipino sun, scroll-to-top on route change, delete Team page + route, delete duplicate CTA sections, delete invite-templates block, delete "Are tables and chairs" FAQ, delete "(~every 3 tries)" copy
2. **Rental page content** (1 batch): new add-ons, waiver PDF draft, new FAQ items, photo swap to logo animals
3. **Homepage restructure** (1 batch): revert How-to-Play to wavy/simpler, revert token-price layout, delete redundant Schedule + Ready-to-Play sections, add floating scroll CTA cluster, enlarge Fox chat
4. **Social proof + reviews** (1 batch): live Google rating, curated reviews, TikTok/IG/press strip
5. **Branding lightening pass** (1 batch): lighter photo filters, dark-blue text, logo-animal vectors throughout, brighter palette tuning
6. **IA consolidation** (1 batch): merge Info Hub + Contact + FAQ into one page
7. **Content updates** (1 batch): Our Story family photos, Community Outreach albums, News refresh, Gift Cards generic redesign, Careers animal swap
8. **New pages** (1 batch): Tips to Win + Fundraising

Tell me which wave you'd like to start with, or say "do all of wave 1" and I'll knock out the quick fixes first.

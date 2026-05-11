## Goal

Replace every "kawaii illustration" reference in the site with images from the storage folder `site-images/kawaii-real-characters/` (30 new files). Leave real photography (Squarespace URLs, friends/family photos) untouched.

## Scope — what gets swapped

**A. CMS table `page_content_sections` (30 rows, currently `…/kawaii-claw/*.png`)**

Apply a one-to-one mapping via a single SQL migration (UPDATE statements). Proposed pairings (theme-matched):

```text
community/rooted           → 24_kawaii_spring_picnic_with_delightful_friends.png
community/sakura-novi      → 27_spring_picnic_under_cherry_blossoms.png
community/collaboration    → 06_kawaii_animal_dance_party_celebration.png
community/culture          → 30_whimsical_garden_tea_party_with_friends.png
community/partner-with-us  → 03_claw_machine_team_application_adventure.png
contact/general            → 17_kawaii_arcade_with_cheerful_tips_sign.png
contact/events             → 02_celebrating_in_pastel_arcade_paradise.png
contact/phone              → 19_kawaii_claw_machine_planning_session.png
contact/visit              → 26_planning_a_cute_claw_machine_adventure.png
info-hub/gallery           → 14_kawaii_arcade_prize_celebration.png
info-hub/location          → 05_cute_road_trip_to_the_arcade.png
info-hub/sakura-novi       → 25_kawaii_tea_party_in_pastel_paradise.png
info-hub/policies          → 22_kawaii_crafting_fun_with_adorable_animals.png
info-hub/accessibility     → 08_kawaii_animals_shopping_in_a_cozy_room.png
info-hub/media-kit         → 28_storytime_under_the_starry_sky.png
rental/intro               → 18_kawaii_birthday_party_celebration_scene.png
rental/how-it-works        → 09_kawaii_arcade_claw_machine_adventure.png
rental/perfect-for         → 29_whimsical_birthday_party_in_pastel_colors.png
rental/prizes              → 16_kawaii_arcade_prize_winners_with_plushies.png
rental/delivery            → 07_kawaii_animal_friends_in_plush_arcade.png
rental/rental-faq          → 01_baking_sweetness_with_cute_animal_friends.png
store/welcome              → 11_kawaii_arcade_fun_with_plush_prizes.png
store/philosophy           → 04_cozy_bedtime_story_in_a_blanket_fort.png
store/small-plush          → 12_kawaii_arcade_fun_with_plushies.png
store/medium-plush         → 13_kawaii_arcade_plushie_hug_fest.png
store/large-plush          → 15_kawaii_arcade_prize_haven.png
store/rare-plush           → 20_kawaii_claw_machine_plush_collection.png
store/trade-up             → 23_kawaii_friends_at_the_claw_machine.png
store/special              → 21_kawaii_coin_pusher_paradise_playtime.png
store/tokens               → 10_kawaii_arcade_fun_with_cute_animals.png
```

**B. Local fallback imports (3 components)** — point at the new storage URLs so non-CMS render paths also show the new art:

- `src/components/KawaiiStory.tsx` — fallback `community_collaboration.png` → `06_kawaii_animal_dance_party_celebration.png`
- `src/components/KawaiiReviews.tsx` — fallback `community_culture.png` → `30_whimsical_garden_tea_party_with_friends.png`
- `src/pages/Rental.tsx` — fallback `rental_rental-faq.png` → `01_baking_sweetness_with_cute_animal_friends.png`

## Out of scope (not touched)

- Squarespace family/event photos in `page_heroes` and `page_sections.bg_image_url` (these are real photography, not kawaii illustrations).
- `homepage_content.hero_image_url` / `story_image_url` (also real photos).
- Logo, favicon, gift card images, gallery photos.

## Technical details

- One Supabase migration with 30 `UPDATE public.page_content_sections SET image_url=… WHERE page_key=… AND section_key=…;` statements using full public URLs `https://nrxfzjysodxqmwsstcim.supabase.co/storage/v1/object/public/site-images/kawaii-real-characters/<file>.png`.
- Three small component edits to change the fallback import to a URL string (or keep as `import` from new path if we mirror locally — but using the storage URL avoids bloating the bundle).
- No schema changes, no RLS changes, no new dependencies.

## Verification

- After migration, query the 30 rows to confirm new URLs.
- Visit `/community`, `/contact`, `/info-hub`, `/rental`, `/store`, and the homepage to spot-check images load.

If the proposed pairings look off for any specific section, tell me which ones to swap and I'll re-map before running the migration.

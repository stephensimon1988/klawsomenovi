
-- Page heroes for secondary pages (eyebrow, title, subtitle, image)
CREATE TABLE IF NOT EXISTS public.page_heroes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL UNIQUE,
  eyebrow text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  cta_text text NOT NULL DEFAULT '',
  cta_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.page_heroes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read page_heroes" ON public.page_heroes FOR SELECT USING (true);

INSERT INTO public.page_heroes (page_key, eyebrow, title, subtitle, image_url, cta_text, cta_url, sort_order) VALUES
  ('rewards', 'Loyalty', 'Klawsome Rewards', 'Earn points every visit and unlock perks the more you play.', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg', 'Join Today', 'https://app.squareup.com/loyalty/check-in/MLR1JRG2NVT9F', 1),
  ('gallery', 'Gallery', 'Inside Klawsome', 'Peek at the prizes, the parties, and the people who make Klawsome, klawsome.', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg', '', '', 2),
  ('faq', 'Help', 'Frequently Asked Questions', 'Everything you need to know before you visit.', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg', '', '', 3),
  ('news', 'In The News', 'Klawsome in the press', 'See where Klawsome has been featured.', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg', '', '', 4),
  ('our_story', 'About Us', 'Our Story', '', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg', '', '', 5),
  ('careers', 'Join Us', 'Careers at Klawsome', 'Help us spread the joy.', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg', '', '', 6),
  ('business', 'Partnerships', 'Grow with Klawsome', 'Host a machine, partner with us, or order custom plushies.', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg', '', '', 7),
  ('birthdays', 'Parties', 'Celebrate at Klawsome', 'Make their birthday unforgettable.', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg', '', '', 8)
ON CONFLICT (page_key) DO NOTHING;

-- Our Story long-form sections
CREATE TABLE IF NOT EXISTS public.our_story_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  eyebrow text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.our_story_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read our_story_sections" ON public.our_story_sections FOR SELECT USING (true);

INSERT INTO public.our_story_sections (eyebrow, title, body, sort_order) VALUES
  ('Origin', 'Where it all began.', 'The idea for Klawsome was sparked by the owners'' children''s love for claw machines during a visit to their Lola in Las Vegas. Owners Agnes and Michal saw the joy and excitement it brought them, and wanted to share that same experience with the local community.

While visiting Las Vegas in 2023, the Filipowskis stumbled upon the first claw machine arcade to open in the area, in a strip mall near Agnes'' mother''s home. They were hooked after winning a bag full of Sanrio and other kawaii-style plushies. Since then, they''ve sought out clawcades in Vegas, Toronto, and other cities across the U.S.', 1),
  ('Family & Culture', 'Bringing our family into the brand.', 'Michal and Agnes lived in Korea for three years, where their older two daughters were born. They traveled throughout Southeast Asia and continue to seek out clawcades within Asian neighborhoods. Their children have been integral every step of the way — from designing the logo (each animal represents a child''s personality) to picking the name (spelling with a K to mimic the Filipino alphabet) to selecting the plushies they know their friends will love.

As a Filipino-American woman, Agnes is passionate about sharing a piece of Asian culture with the community — notice the elements of the Filipino flag woven into the logo. Klawsome is more than just an arcade; it''s a place for kapwa — connection and community in Tagalog — where couples, friends, and families create lasting memories.

Everyone comes away as a winner.', 2);

-- Reviews (homepage testimonials)
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL DEFAULT '',
  author_role text NOT NULL DEFAULT '',
  review_text text NOT NULL DEFAULT '',
  rating integer NOT NULL DEFAULT 5,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (is_active = true);

INSERT INTO public.reviews (author_name, author_role, review_text, sort_order) VALUES
  ('Patrick G.', 'Local arcade visitor', 'Great vibes! Staff is super friendly, and they go out of their way to make sure everyone gets prizes no matter their skill level!', 1),
  ('Daniel B.', 'Family outing guest', 'Had such a blast with the kids. Owner and staff are so friendly and its absolutely fun for kids to win prizes.', 2),
  ('Christine A.', 'Regular family visitor', 'Such a great experience! Love this place—so helpful and amazing time with the kiddos!', 3),
  ('Michelle D.', 'Arcade enthusiast', 'sooo fun!!! really cute prizes!!! friendly staff too ❤️', 4),
  ('Rich S.', 'Weekend visitor', 'The staff was very friendly and the prizes were not too difficult to win! Will definitely come back again and recommend this place to anyone!', 5),
  ('Lucy D.', 'Saturday night visitor', 'Klawsome was an awesome Saturday night activity! We had a great time and met Agnes, one of the owners. We enjoyed our time and got our money''s worth of prizes. We''ll be back!', 6),
  ('Genki N.', 'Family visitor', 'This is a great place to have fun with kids or even without kids! So many claw machines and bunch of toys. Staffs are great and very kind. Literally AWESOME place!', 7);

-- Gift cards section content
CREATE TABLE IF NOT EXISTS public.gift_cards_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  eyebrow text NOT NULL DEFAULT 'Gift Cards',
  headline text NOT NULL DEFAULT '',
  body_1 text NOT NULL DEFAULT '',
  body_2 text NOT NULL DEFAULT '',
  cta_text text NOT NULL DEFAULT 'Purchase Now',
  cta_url text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.gift_cards_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gift_cards_content" ON public.gift_cards_content FOR SELECT USING (true);

INSERT INTO public.gift_cards_content (headline, body_1, body_2, cta_url) VALUES
  ('Give the gift of Klawsome',
   'Want to make someone''s day more special? Klawsome''s got you. Whether you purchase a gift card for a friend, loved one, or yourself, enjoy some fun at Klawsome!',
   'Choose from one of many designs for a birthday, Valentine''s, or just because—more designs to come!',
   'https://app.squareup.com/gift/ML1R35ZH9VKRW/order');

-- Gift card images (multi-row)
CREATE TABLE IF NOT EXISTS public.gift_card_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL DEFAULT '',
  alt_text text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.gift_card_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gift_card_images" ON public.gift_card_images FOR SELECT USING (true);

INSERT INTO public.gift_card_images (image_url, alt_text, sort_order) VALUES
  ('https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/53ec5cfa-3e70-4278-95c0-3ab584efdb9a/CVday+gift+cards.png', 'Valentine''s Day Klawsome gift card', 1),
  ('https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/96257c57-bcd1-43d5-afcd-5d19b8c5e106/easter+card.jpg', 'Easter Klawsome gift card', 2);

-- Rewards benefits (the static "benefits" cards on /rewards)
CREATE TABLE IF NOT EXISTS public.rewards_benefits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.rewards_benefits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read rewards_benefits" ON public.rewards_benefits FOR SELECT USING (true);

INSERT INTO public.rewards_benefits (title, body, sort_order) VALUES
  ('Earn on every play', 'Every token spent stacks points toward your next reward.', 1),
  ('Member-only perks', 'Unlock bonus tokens, free spins, and surprise upgrades.', 2),
  ('Birthday bonus', 'Celebrate with us and get a sweet birthday-month gift.', 3);

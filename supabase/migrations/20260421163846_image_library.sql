CREATE TABLE IF NOT EXISTS public.image_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'graphic',
  tags text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.image_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read image_library"
  ON public.image_library
  FOR SELECT
  USING (true);

INSERT INTO public.image_library (name, url, category, sort_order) VALUES
('Klawsome_buybble', 'https://images.squarespace-cdn.com/content/679927505e618d391ae386e6/21e0e025-7d1b-43ce-8627-ec0b8e116700/Klawsome_buybble.png', 'logo', 0),
('panda', 'https://images.squarespace-cdn.com/content/679927505e618d391ae386e6/435bd544-249a-483f-a360-9b79e8b0dc6d/panda.png', 'graphic', 1),
('KlawsomeCrewSelfieWall', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/057fb62e-a01f-49c9-a963-255ce0091234/KlawsomeCrewSelfieWall.jpg', 'photo', 2),
('klawsome_coin', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/0a416091-9087-4f0b-9ee7-921ce146ba4a/klawsome_coin.gif', 'gif', 3),
('PXL_20251123_165459736', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/0b0121fc-43db-42df-ac24-f492fc34cef3/PXL_20251123_165459736.jpg', 'photo', 4),
('rocking klawsome cat larger size', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/10efece6-ffe8-4153-844a-d8671a038b7a/rocking+klawsome+cat+larger+size.gif', 'gif', 5),
('PXL_20251123_154035244', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/1908211d-7f46-498b-9adc-5110e06a95fd/PXL_20251123_154035244.jpg', 'photo', 6),
('PXL_20251123_165134954.MP', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/1f122357-5ae3-4412-8699-8a1b06e1f5a8/PXL_20251123_165134954.MP.jpg', 'photo', 7),
('klawsome in the news', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/1f9d4fe0-5f54-4077-be1b-a5c20318ebbe/klawsome+in+the+news.webp', 'graphic', 8),
('AgnesMichal_CandidClapping', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/21f62e3c-4e42-4460-ad61-8959feae0a54/AgnesMichal_CandidClapping.jpg', 'photo', 9),
('PHOTO-2025-09-02-19-49-33', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/2bb292a8-8873-46e9-a975-d3cb7f14825d/PHOTO-2025-09-02-19-49-33.jpg', 'photo', 10),
('PXL_20251123_165431956.MP', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/3ab2cb01-e94f-4ec2-97fb-b63a2b1eb6c8/PXL_20251123_165431956.MP.jpg', 'photo', 11),
('6781973c-65dd-430d-a0f0-2d3ccb5008ee', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/430f8240-3e2a-4755-a800-ce165dfc6a50/6781973c-65dd-430d-a0f0-2d3ccb5008ee.jpg', 'graphic', 12),
('klawsome_claw', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/493a2af7-fd04-4530-96c8-637de2e91e36/klawsome_claw.gif', 'gif', 13),
('Screenshot 2025-09-29 155500', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/49bc0727-86ab-4443-bf10-b0d5cbaa9380/Screenshot+2025-09-29+155500.png', 'graphic', 14),
('IMG-20251123-WA0065', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/4b9b9251-97dd-4814-9d88-5f4ede40440f/IMG-20251123-WA0065.jpg', 'photo', 15),
('PXL_20251123_042431224', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/606820e7-4e9a-4b76-86df-13db765394fc/PXL_20251123_042431224.jpg', 'photo', 16),
('PXL_20251123_164340558', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/646f8aba-749e-4931-b275-6e5394eb8d9d/PXL_20251123_164340558.jpg', 'photo', 17),
('loyalty background', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/6e3a924c-c088-4687-a655-9296880cb288/loyalty+background.png', 'graphic', 18),
('IMG-20251123-WA0066', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/720c33bf-ce63-4135-82dc-3f34cdb68158/IMG-20251123-WA0066.jpg', 'photo', 19),
('PXL_20251123_164404578', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9afcf44d-4bde-4a78-bc61-961613b981c2/PXL_20251123_164404578.jpg', 'photo', 20),
('Klawsome_FriendsFamily-056', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg', 'photo', 21),
('Copy of capsule shape bkg', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/a0634358-4153-4751-a6f5-785702c7cef1/Copy+of+capsule+shape+bkg.png', 'graphic', 22),
('PXL_20251123_165437496.MP', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/a94b12dd-ae78-4248-af3e-4f9277f1056f/PXL_20251123_165437496.MP.jpg', 'photo', 23),
('klawsome_cat', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/add7db7a-b61d-43bc-af28-ec7216a3aaaa/klawsome_cat.gif', 'gif', 24),
('IMG-20251123-WA0064', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/b423ffd5-9411-4093-96d5-b7dc4a6149b3/IMG-20251123-WA0064.jpg', 'photo', 25),
('PXL_20250822_201918587', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/c06c88ff-f9f2-466c-80e3-02444aa01d22/PXL_20250822_201918587.jpg', 'photo', 26),
('PXL_20251123_154055944.MP', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/cbd4c879-dfc8-4cbf-99f5-60aa1d4a5726/PXL_20251123_154055944.MP.jpg', 'photo', 27),
('klawsome hourdetroit', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/cf98d1f2-1b98-49e2-953a-6784766e898d/klawsome+hourdetroit.png', 'graphic', 28),
('PXL_20251123_042427353', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/d026a708-6eb8-4bdc-b3c2-528c7d867954/PXL_20251123_042427353.jpg', 'photo', 29),
('PXL_20251123_165445477.MP', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/da5c9a88-f35c-4e8c-8c9b-ec448be828e8/PXL_20251123_165445477.MP.jpg', 'photo', 30),
('PXL_20251123_171313007.MP', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/e5549656-b613-4e53-8e69-fe2736834823/PXL_20251123_171313007.MP.jpg', 'photo', 31),
('loyalty', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/e580739e-9724-4a5f-bb7b-b5931d69ec16/loyalty.png', 'graphic', 32),
('IMG_1638', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/eac946a6-e513-4e64-acdc-dd5024eb5a61/IMG_1638.jpg', 'photo', 33),
('PXL_20251123_171320314.MP', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/ef928fc3-8ede-4daf-b733-6bc18ea62d09/PXL_20251123_171320314.MP.jpg', 'photo', 34),
('PXL_20251123_154427454', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/f698aba6-b99d-4d0d-91f2-f2d8a3130444/PXL_20251123_154427454.jpg', 'photo', 35),
('klawsome sparkle animation', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/f822827c-3a96-424b-b348-27e426881817/klawsome+sparkle+animation.gif', 'gif', 36),
('CircularLogo_Klawsome_RGB', 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/f907dbc8-8a5c-43a3-8224-1729d43956bb/CircularLogo_Klawsome_RGB.png', 'logo', 37);

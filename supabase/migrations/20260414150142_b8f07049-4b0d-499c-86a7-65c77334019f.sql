
-- Rewards tiers table
CREATE TABLE public.rewards_tiers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tier_name text NOT NULL DEFAULT '',
  min_points text NOT NULL DEFAULT '0',
  benefit text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.rewards_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read rewards_tiers" ON public.rewards_tiers FOR SELECT TO public USING (true);

-- Rewards redemptions table
CREATE TABLE public.rewards_redemptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  points text NOT NULL DEFAULT '',
  reward text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.rewards_redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read rewards_redemptions" ON public.rewards_redemptions FOR SELECT TO public USING (true);

-- Gallery photos table
CREATE TABLE public.gallery_photos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gallery_photos" ON public.gallery_photos FOR SELECT TO public USING (true);

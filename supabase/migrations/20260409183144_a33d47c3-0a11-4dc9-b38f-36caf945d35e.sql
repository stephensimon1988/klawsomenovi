
-- Site Settings (single row for global info)
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL DEFAULT 'Klawsome',
  phone text DEFAULT '',
  email text DEFAULT '',
  address text DEFAULT '',
  google_maps_url text DEFAULT '',
  instagram_url text DEFAULT '',
  tiktok_url text DEFAULT '',
  facebook_url text DEFAULT '',
  youtube_url text DEFAULT '',
  gift_card_url text DEFAULT '',
  newsletter_text text DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);

-- Store Hours
CREATE TABLE public.store_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  day_label text NOT NULL,
  open_time text DEFAULT '',
  close_time text DEFAULT '',
  is_closed boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  UNIQUE(day_of_week)
);
ALTER TABLE public.store_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read store_hours" ON public.store_hours FOR SELECT USING (true);

-- Homepage Content (single row)
CREATE TABLE public.homepage_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_headline text NOT NULL DEFAULT '',
  hero_subheadline text DEFAULT '',
  hero_cta_text text DEFAULT 'Get Started',
  hero_image_url text DEFAULT '',
  story_title text DEFAULT '',
  story_body text DEFAULT '',
  story_image_url text DEFAULT '',
  about_title text DEFAULT '',
  about_subtitle text DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read homepage_content" ON public.homepage_content FOR SELECT USING (true);

-- Homepage Steps (about section steps)
CREATE TABLE public.homepage_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text DEFAULT '⭐',
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.homepage_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read homepage_steps" ON public.homepage_steps FOR SELECT USING (true);

-- Token Tiers
CREATE TABLE public.token_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  price text NOT NULL DEFAULT '',
  tokens text NOT NULL DEFAULT '',
  bonus text DEFAULT '',
  is_highlight boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.token_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read token_tiers" ON public.token_tiers FOR SELECT USING (true);

-- News Articles (shared across homepage + /news)
CREATE TABLE public.news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  source text DEFAULT '',
  date text DEFAULT '',
  url text NOT NULL DEFAULT '',
  image_url text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read news_articles" ON public.news_articles FOR SELECT USING (is_active = true);

-- Birthdays Content (single row)
CREATE TABLE public.birthdays_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_headline text DEFAULT '',
  hero_subheadline text DEFAULT '',
  hero_image_url text DEFAULT '',
  promo_text text DEFAULT '',
  rules_text text DEFAULT '',
  booking_email text DEFAULT '',
  booking_phone text DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.birthdays_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read birthdays_content" ON public.birthdays_content FOR SELECT USING (true);

-- Party Options
CREATE TABLE public.party_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  description text DEFAULT '',
  price text DEFAULT '',
  features text[] DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.party_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read party_options" ON public.party_options FOR SELECT USING (true);

-- FAQ Items (page field allows reuse across pages)
CREATE TABLE public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL DEFAULT '',
  answer text NOT NULL DEFAULT '',
  page text NOT NULL DEFAULT 'general',
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read faq_items" ON public.faq_items FOR SELECT USING (true);

-- Invite Templates
CREATE TABLE public.invite_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '',
  thumbnail_url text DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.invite_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read invite_templates" ON public.invite_templates FOR SELECT USING (true);

-- Job Listings
CREATE TABLE public.job_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'in-store',
  description text DEFAULT '',
  image_url text DEFAULT '',
  job_desc_url text DEFAULT '',
  apply_url text DEFAULT '',
  is_paid boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read job_listings" ON public.job_listings FOR SELECT USING (is_active = true);

-- Business Page Sections (keyed by section: hosted, partner, plushie)
CREATE TABLE public.business_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT '',
  subtitle text DEFAULT '',
  description text DEFAULT '',
  bullet_points text[] DEFAULT '{}',
  image_url text DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.business_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read business_sections" ON public.business_sections FOR SELECT USING (true);

-- Business Pricing Tiers
CREATE TABLE public.business_pricing_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  features text[] DEFAULT '{}',
  is_highlight boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.business_pricing_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read business_pricing_tiers" ON public.business_pricing_tiers FOR SELECT USING (true);

-- Business How-It-Works Steps
CREATE TABLE public.business_how_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  icon text DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.business_how_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read business_how_steps" ON public.business_how_steps FOR SELECT USING (true);


-- token_tiers
CREATE TABLE public.token_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  price text NOT NULL DEFAULT '',
  tokens text NOT NULL DEFAULT '',
  bonus text NOT NULL DEFAULT '',
  is_highlight boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.token_tiers TO anon, authenticated;
GRANT ALL ON public.token_tiers TO service_role;
ALTER TABLE public.token_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "token_tiers public read" ON public.token_tiers FOR SELECT USING (true);
CREATE TRIGGER token_tiers_set_updated_at BEFORE UPDATE ON public.token_tiers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- news_articles
CREATE TABLE public.news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT '',
  date text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news_articles TO anon, authenticated;
GRANT ALL ON public.news_articles TO service_role;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news_articles public read" ON public.news_articles FOR SELECT USING (true);
CREATE TRIGGER news_articles_set_updated_at BEFORE UPDATE ON public.news_articles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- faq_items
CREATE TABLE public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL DEFAULT '',
  answer text NOT NULL DEFAULT '',
  page text NOT NULL DEFAULT 'faq',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faq_items TO anon, authenticated;
GRANT ALL ON public.faq_items TO service_role;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faq_items public read" ON public.faq_items FOR SELECT USING (true);
CREATE TRIGGER faq_items_set_updated_at BEFORE UPDATE ON public.faq_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- job_listings
CREATE TABLE public.job_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  job_desc_url text NOT NULL DEFAULT '',
  apply_url text NOT NULL DEFAULT '',
  is_paid boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.job_listings TO anon, authenticated;
GRANT ALL ON public.job_listings TO service_role;
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "job_listings public read" ON public.job_listings FOR SELECT USING (true);
CREATE TRIGGER job_listings_set_updated_at BEFORE UPDATE ON public.job_listings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- party_options
CREATE TABLE public.party_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.party_options TO anon, authenticated;
GRANT ALL ON public.party_options TO service_role;
ALTER TABLE public.party_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "party_options public read" ON public.party_options FOR SELECT USING (true);
CREATE TRIGGER party_options_set_updated_at BEFORE UPDATE ON public.party_options FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- rental_packages
CREATE TABLE public.rental_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  cta_text text NOT NULL DEFAULT '',
  cta_url text NOT NULL DEFAULT '',
  is_highlight boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rental_packages TO anon, authenticated;
GRANT ALL ON public.rental_packages TO service_role;
ALTER TABLE public.rental_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rental_packages public read" ON public.rental_packages FOR SELECT USING (true);
CREATE TRIGGER rental_packages_set_updated_at BEFORE UPDATE ON public.rental_packages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- homepage_content
CREATE TABLE public.homepage_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_headline text NOT NULL DEFAULT '',
  hero_subheadline text NOT NULL DEFAULT '',
  hero_cta_text text NOT NULL DEFAULT '',
  hero_image_url text NOT NULL DEFAULT '',
  story_title text NOT NULL DEFAULT '',
  story_body text NOT NULL DEFAULT '',
  story_image_url text NOT NULL DEFAULT '',
  about_title text NOT NULL DEFAULT '',
  about_subtitle text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.homepage_content TO anon, authenticated;
GRANT ALL ON public.homepage_content TO service_role;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "homepage_content public read" ON public.homepage_content FOR SELECT USING (true);
CREATE TRIGGER homepage_content_set_updated_at BEFORE UPDATE ON public.homepage_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- homepage_steps
CREATE TABLE public.homepage_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.homepage_steps TO anon, authenticated;
GRANT ALL ON public.homepage_steps TO service_role;
ALTER TABLE public.homepage_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "homepage_steps public read" ON public.homepage_steps FOR SELECT USING (true);
CREATE TRIGGER homepage_steps_set_updated_at BEFORE UPDATE ON public.homepage_steps FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- gallery_photos
CREATE TABLE public.gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_photos TO anon, authenticated;
GRANT ALL ON public.gallery_photos TO service_role;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery_photos public read" ON public.gallery_photos FOR SELECT USING (true);
CREATE TRIGGER gallery_photos_set_updated_at BEFORE UPDATE ON public.gallery_photos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- reviews
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL DEFAULT '',
  author_role text NOT NULL DEFAULT '',
  review_text text NOT NULL DEFAULT '',
  rating integer NOT NULL DEFAULT 5,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews public read" ON public.reviews FOR SELECT USING (true);
CREATE TRIGGER reviews_set_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- page_heroes
CREATE TABLE public.page_heroes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL DEFAULT '',
  eyebrow text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  cta_text text NOT NULL DEFAULT '',
  cta_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.page_heroes TO anon, authenticated;
GRANT ALL ON public.page_heroes TO service_role;
ALTER TABLE public.page_heroes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "page_heroes public read" ON public.page_heroes FOR SELECT USING (true);
CREATE TRIGGER page_heroes_set_updated_at BEFORE UPDATE ON public.page_heroes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- announcement banner fields
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS announcement_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS announcement_title text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS announcement_body text NOT NULL DEFAULT '';

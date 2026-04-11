
-- Create page_sections table
CREATE TABLE public.page_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page text NOT NULL,
  section_key text NOT NULL,
  label text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  section_height text NOT NULL DEFAULT 'auto',
  wrapper_max_width text NOT NULL DEFAULT '1200px',
  padding_y text NOT NULL DEFAULT '7rem',
  bg_color text NOT NULL DEFAULT '',
  bg_image_url text NOT NULL DEFAULT '',
  custom_css_class text NOT NULL DEFAULT '',
  UNIQUE(page, section_key)
);

ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read page_sections"
  ON public.page_sections FOR SELECT
  USING (true);

-- Create custom_blocks table
CREATE TABLE public.custom_blocks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  block_key text NOT NULL UNIQUE,
  headline text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  image_position text NOT NULL DEFAULT 'right',
  cta_text text NOT NULL DEFAULT '',
  cta_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.custom_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read custom_blocks"
  ON public.custom_blocks FOR SELECT
  USING (true);

-- Create site-images storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true);

CREATE POLICY "Public read site-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');

CREATE POLICY "Authenticated upload site-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Authenticated update site-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'site-images');

CREATE POLICY "Authenticated delete site-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-images');

-- Seed homepage sections
INSERT INTO public.page_sections (page, section_key, label, sort_order, section_height, wrapper_max_width, padding_y) VALUES
  ('home', 'hero', 'Hero Banner', 1, '100vh', 'full', '0'),
  ('home', 'about', 'How It Works', 2, 'auto', '1200px', '7rem'),
  ('home', 'visit', 'Visit Us', 3, 'auto', '1200px', '7rem'),
  ('home', 'tokens', 'Token Prices', 4, 'auto', '1200px', '7rem'),
  ('home', 'reviews', 'Reviews', 5, 'auto', '1200px', '7rem'),
  ('home', 'news', 'In The News', 6, 'auto', '1200px', '7rem'),
  ('home', 'giftcards', 'Gift Cards', 7, 'auto', '1200px', '7rem'),
  ('home', 'scheduling', 'Book Your Visit', 8, 'auto', '900px', '7rem'),
  ('home', 'story', 'Our Story', 9, 'auto', '900px', '7rem');

-- Seed birthdays sections
INSERT INTO public.page_sections (page, section_key, label, sort_order, section_height, wrapper_max_width, padding_y) VALUES
  ('birthdays', 'hero', 'Hero Banner', 1, '70vh', 'full', '0'),
  ('birthdays', 'rules', 'Party Rules', 2, 'auto', '1200px', '7rem'),
  ('birthdays', 'options', 'Party Options', 3, 'auto', '1200px', '7rem'),
  ('birthdays', 'faq', 'FAQ', 4, 'auto', '900px', '7rem'),
  ('birthdays', 'templates', 'Invite Templates', 5, 'auto', '1200px', '7rem');

-- Seed careers sections
INSERT INTO public.page_sections (page, section_key, label, sort_order, section_height, wrapper_max_width, padding_y) VALUES
  ('careers', 'hero', 'Hero Banner', 1, '70vh', 'full', '0'),
  ('careers', 'instore', 'In-Store Jobs', 2, 'auto', '1200px', '7rem'),
  ('careers', 'hybrid', 'Hybrid/Paid Jobs', 3, 'auto', '1200px', '7rem'),
  ('careers', 'unpaid', 'Volunteer Roles', 4, 'auto', '1200px', '7rem');

-- Seed business sections
INSERT INTO public.page_sections (page, section_key, label, sort_order, section_height, wrapper_max_width, padding_y) VALUES
  ('business', 'hero', 'Hero Banner', 1, '70vh', 'full', '0'),
  ('business', 'opportunities', 'Opportunities Tabs', 2, 'auto', '1200px', '7rem'),
  ('business', 'howitworks', 'How It Works', 3, 'auto', '1200px', '7rem'),
  ('business', 'contact', 'Contact Form', 4, 'auto', '900px', '7rem');

-- Seed news sections
INSERT INTO public.page_sections (page, section_key, label, sort_order, section_height, wrapper_max_width, padding_y) VALUES
  ('news', 'hero', 'Hero Banner', 1, '70vh', 'full', '0'),
  ('news', 'articles', 'News Articles', 2, 'auto', '1200px', '7rem');

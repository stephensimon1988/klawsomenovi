
-- Generic editable rich sections per page (supports headline, body, image, optional list items as jsonb)
CREATE TABLE public.page_content_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL,
  section_key TEXT NOT NULL,
  eyebrow TEXT NOT NULL DEFAULT '',
  headline TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  cta_text TEXT NOT NULL DEFAULT '',
  cta_url TEXT NOT NULL DEFAULT '',
  list_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.page_content_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read page_content_sections"
ON public.page_content_sections FOR SELECT TO public USING (true);

CREATE INDEX idx_pcs_page_key ON public.page_content_sections(page_key, sort_order);

-- Team members
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  favorite_plush TEXT NOT NULL DEFAULT '',
  fun_facts TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read team_members"
ON public.team_members FOR SELECT TO public USING (is_active = true);

-- Press articles (similar to news_articles but for press coverage)
CREATE TABLE public.press_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  outlet TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.press_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read press_articles"
ON public.press_articles FOR SELECT TO public USING (is_active = true);

-- Rental pricing tiers (for Rental page)
CREATE TABLE public.rental_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  cta_text TEXT NOT NULL DEFAULT 'Check Availability',
  cta_url TEXT NOT NULL DEFAULT '',
  is_highlight BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.rental_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read rental_packages"
ON public.rental_packages FOR SELECT TO public USING (true);

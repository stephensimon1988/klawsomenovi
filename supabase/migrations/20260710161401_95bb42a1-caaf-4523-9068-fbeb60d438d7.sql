
-- site_settings ------------------------------------------------------
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  events_email text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  google_maps_url text NOT NULL DEFAULT '',
  instagram_url text NOT NULL DEFAULT '',
  tiktok_url text NOT NULL DEFAULT '',
  facebook_url text NOT NULL DEFAULT '',
  youtube_url text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings public read"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE TRIGGER site_settings_set_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (
  id, business_name, phone, email, events_email, address,
  google_maps_url, instagram_url, tiktok_url, facebook_url, youtube_url
) VALUES (
  'f9db3753-c677-4162-b38f-f24570b6338d',
  'Klawsome',
  '(248) 938-4093',
  'team@klawsomenovi.com',
  'events@klawsomenovi.com',
  '42768 Grand River Ave Suite C-140, Novi, MI 48375',
  'https://www.google.com/maps/place/42768+Grand+River+Ave+Suite+C-140,+Novi,+MI+48375',
  'https://www.instagram.com/klawsomenovi/',
  'https://www.tiktok.com/@klawsomenovi',
  'https://www.facebook.com/klawsomenovi',
  ''
);

-- store_hours --------------------------------------------------------
CREATE TABLE public.store_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week smallint NOT NULL UNIQUE,
  day_label text NOT NULL,
  open_time text NOT NULL DEFAULT '',
  close_time text NOT NULL DEFAULT '',
  is_closed boolean NOT NULL DEFAULT false,
  sort_order smallint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.store_hours TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.store_hours TO authenticated;
GRANT ALL ON public.store_hours TO service_role;

ALTER TABLE public.store_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "store_hours public read"
  ON public.store_hours FOR SELECT
  USING (true);

CREATE TRIGGER store_hours_set_updated_at
  BEFORE UPDATE ON public.store_hours
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.store_hours (id, day_of_week, day_label, open_time, close_time, is_closed, sort_order) VALUES
  ('5d4314f0-6d2b-4679-a84d-2497e63bd026', 0, 'Sunday',    '11:00 AM', '9:00 PM', false, 0),
  ('52d7771f-2554-4e48-95c7-fb5ae6fee08b', 1, 'Monday',    '',         '',        true,  1),
  ('0bb9dc26-c444-4fd5-953d-c0a9e5f0490d', 2, 'Tuesday',   '11:00 AM', '9:00 PM', false, 2),
  ('f5fcdf5a-24f6-4290-9573-c2bb75f064cd', 3, 'Wednesday', '11:00 AM', '9:00 PM', false, 3),
  ('a0521382-30cf-4d42-96f8-748a986662d4', 4, 'Thursday',  '11:00 AM', '9:00 PM', false, 4),
  ('6f41c254-0bd2-47ef-8925-ebd498336104', 5, 'Friday',    '11:00 AM', '9:00 PM', false, 5),
  ('5afeab47-17d9-48f5-8a87-55960adc49bd', 6, 'Saturday',  '11:00 AM', '9:00 PM', false, 6);

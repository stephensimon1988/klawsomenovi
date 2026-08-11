CREATE TABLE public.service_area_zips (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zip text NOT NULL,
  city text NOT NULL DEFAULT '',
  level text NOT NULL DEFAULT 'allowed',
  notes text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX service_area_zips_zip_key ON public.service_area_zips (zip);

GRANT SELECT ON public.service_area_zips TO anon;
GRANT SELECT ON public.service_area_zips TO authenticated;
GRANT ALL ON public.service_area_zips TO service_role;

ALTER TABLE public.service_area_zips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_area_zips public read" ON public.service_area_zips FOR SELECT USING (true);
CREATE POLICY "Service role manages service area" ON public.service_area_zips FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE TRIGGER service_area_zips_set_updated_at BEFORE UPDATE ON public.service_area_zips FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.event_bookings ADD COLUMN IF NOT EXISTS safety_policy_accepted_at timestamp with time zone;
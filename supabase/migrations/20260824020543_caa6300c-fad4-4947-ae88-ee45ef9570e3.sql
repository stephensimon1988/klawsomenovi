CREATE TABLE public.booking_rental_pricing (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  machine text NOT NULL,
  day_type text NOT NULL DEFAULT 'any',
  unit text NOT NULL,
  label text NOT NULL DEFAULT '',
  price_cents integer NOT NULL DEFAULT 0,
  variant_id text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.booking_rental_options (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  machine text NOT NULL,
  option_key text NOT NULL,
  label text NOT NULL DEFAULT '',
  price_cents integer NOT NULL DEFAULT 0,
  numeric_value numeric NOT NULL DEFAULT 0,
  variant_id text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.booking_rental_pricing TO anon;
GRANT SELECT ON public.booking_rental_pricing TO authenticated;
GRANT ALL ON public.booking_rental_pricing TO service_role;
GRANT SELECT ON public.booking_rental_options TO anon;
GRANT SELECT ON public.booking_rental_options TO authenticated;
GRANT ALL ON public.booking_rental_options TO service_role;

ALTER TABLE public.booking_rental_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_rental_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rental pricing is publicly readable"
  ON public.booking_rental_pricing FOR SELECT USING (true);
CREATE POLICY "Rental options are publicly readable"
  ON public.booking_rental_options FOR SELECT USING (true);

CREATE TRIGGER booking_rental_pricing_set_updated_at
  BEFORE UPDATE ON public.booking_rental_pricing
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER booking_rental_options_set_updated_at
  BEFORE UPDATE ON public.booking_rental_options
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
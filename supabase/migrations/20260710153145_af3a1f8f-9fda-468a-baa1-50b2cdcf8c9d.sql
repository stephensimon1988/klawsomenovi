
-- 1. event_availability: open hours per weekday per event type
CREATE TABLE public.event_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL UNIQUE,
  hours JSONB NOT NULL DEFAULT '{}'::jsonb,
  slot_minutes INTEGER NOT NULL DEFAULT 60,
  lead_time_hours INTEGER NOT NULL DEFAULT 48,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.event_availability TO anon, authenticated;
GRANT ALL ON public.event_availability TO service_role;
ALTER TABLE public.event_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read availability" ON public.event_availability FOR SELECT USING (true);
CREATE POLICY "Service role manages availability" ON public.event_availability FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- 2. event_blackout_dates: dates blocked per event type
CREATE TABLE public.event_blackout_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  blackout_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_type, blackout_date)
);
GRANT SELECT ON public.event_blackout_dates TO anon, authenticated;
GRANT ALL ON public.event_blackout_dates TO service_role;
ALTER TABLE public.event_blackout_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read blackouts" ON public.event_blackout_dates FOR SELECT USING (true);
CREATE POLICY "Service role manages blackouts" ON public.event_blackout_dates FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- 3. event_bookings: reservation ledger
CREATE TABLE public.event_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_ref TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  pathway TEXT NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'pending',
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  party_size INTEGER,
  celebrant_name TEXT,
  celebrant_age INTEGER,
  favorites TEXT,
  special_requests TEXT,
  character_pick TEXT,
  zip TEXT,
  miles NUMERIC,
  addons JSONB NOT NULL DEFAULT '[]'::jsonb,
  shopify_cart_id TEXT,
  shopify_order_id TEXT,
  total_cents INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX event_bookings_start_at_idx ON public.event_bookings (event_type, start_at);
CREATE INDEX event_bookings_status_idx ON public.event_bookings (status);
GRANT ALL ON public.event_bookings TO service_role;
ALTER TABLE public.event_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages bookings" ON public.event_bookings FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- updated_at trigger (reuse or create)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_event_availability_updated
  BEFORE UPDATE ON public.event_availability
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_event_bookings_updated
  BEFORE UPDATE ON public.event_bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed default availability. Hours: {mon..sun: {open, close} | null (closed)}
INSERT INTO public.event_availability (event_type, hours, slot_minutes, lead_time_hours) VALUES
  ('private', '{"sun":{"open":"11:00","close":"20:00"},"mon":null,"tue":null,"wed":{"open":"12:00","close":"20:00"},"thu":{"open":"12:00","close":"20:00"},"fri":{"open":"12:00","close":"21:00"},"sat":{"open":"11:00","close":"21:00"}}'::jsonb, 60, 48),
  ('semi_private', '{"sun":{"open":"11:00","close":"20:00"},"mon":null,"tue":null,"wed":{"open":"12:00","close":"20:00"},"thu":{"open":"12:00","close":"20:00"},"fri":{"open":"12:00","close":"21:00"},"sat":{"open":"11:00","close":"21:00"}}'::jsonb, 60, 48),
  ('rental', '{"sun":{"open":"10:00","close":"20:00"},"mon":{"open":"10:00","close":"20:00"},"tue":{"open":"10:00","close":"20:00"},"wed":{"open":"10:00","close":"20:00"},"thu":{"open":"10:00","close":"20:00"},"fri":{"open":"10:00","close":"21:00"},"sat":{"open":"10:00","close":"21:00"}}'::jsonb, 60, 72),
  ('mobile', '{"sun":{"open":"10:00","close":"20:00"},"mon":{"open":"10:00","close":"20:00"},"tue":{"open":"10:00","close":"20:00"},"wed":{"open":"10:00","close":"20:00"},"thu":{"open":"10:00","close":"20:00"},"fri":{"open":"10:00","close":"21:00"},"sat":{"open":"10:00","close":"21:00"}}'::jsonb, 60, 72);

-- Seed Klawsome Mobile blackouts through 2026-08-15
INSERT INTO public.event_blackout_dates (event_type, blackout_date, reason)
SELECT 'mobile', d::date, 'Launch blackout — Klawsome Mobile opens Aug 16, 2026'
FROM generate_series(CURRENT_DATE, DATE '2026-08-15', INTERVAL '1 day') AS d
ON CONFLICT (event_type, blackout_date) DO NOTHING;

CREATE TABLE public.booking_approval_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_code text NOT NULL UNIQUE,
  event_type text NOT NULL DEFAULT 'mobile',
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text NOT NULL DEFAULT '',
  requested_date date,
  zip text NOT NULL,
  city text NOT NULL DEFAULT '',
  zip_level text NOT NULL DEFAULT 'review',
  is_indoors boolean NOT NULL DEFAULT false,
  over_200 boolean NOT NULL DEFAULT false,
  party_size integer,
  customer_notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  staff_note text NOT NULL DEFAULT '',
  decided_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.booking_approval_requests TO service_role;
ALTER TABLE public.booking_approval_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages approval requests"
  ON public.booking_approval_requests FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE TRIGGER booking_approval_requests_set_updated_at
  BEFORE UPDATE ON public.booking_approval_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.booking_approval_status (
  request_code text NOT NULL PRIMARY KEY,
  status text NOT NULL DEFAULT 'pending',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.booking_approval_status TO anon, authenticated;
GRANT ALL ON public.booking_approval_status TO service_role;
ALTER TABLE public.booking_approval_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approval status public read"
  ON public.booking_approval_status FOR SELECT
  USING (true);
CREATE POLICY "Service role manages approval status"
  ON public.booking_approval_status FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION public.sync_booking_approval_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.booking_approval_status (request_code, status, updated_at)
  VALUES (NEW.request_code, NEW.status, now())
  ON CONFLICT (request_code)
  DO UPDATE SET status = EXCLUDED.status, updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER booking_approval_requests_sync_status
  AFTER INSERT OR UPDATE OF status ON public.booking_approval_requests
  FOR EACH ROW EXECUTE FUNCTION public.sync_booking_approval_status();

ALTER PUBLICATION supabase_realtime ADD TABLE public.booking_approval_status;
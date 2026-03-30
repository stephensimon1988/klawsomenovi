
-- Appointment types (services offered)
CREATE TABLE public.appointment_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Weekly availability slots
CREATE TABLE public.availability_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_type_id UUID REFERENCES public.appointment_types(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Customer bookings
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_type_id UUID REFERENCES public.appointment_types(id) ON DELETE CASCADE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT DEFAULT '',
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.appointment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Public read access for appointment types and availability (guest booking)
CREATE POLICY "Anyone can view active appointment types"
  ON public.appointment_types FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active availability slots"
  ON public.availability_slots FOR SELECT
  USING (is_active = true);

-- Allow anonymous inserts for guest bookings
CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

-- Allow reading own booking by email (via edge function with service role)
CREATE POLICY "Anyone can view bookings"
  ON public.bookings FOR SELECT
  USING (true);

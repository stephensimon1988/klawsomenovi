import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // GET: Fetch appointment types
    if (action === 'types') {
      const { data, error } = await supabase
        .from('appointment_types')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return new Response(JSON.stringify({ types: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET: Fetch availability for a type + month
    if (action === 'availability') {
      const typeId = url.searchParams.get('typeId');
      const month = url.searchParams.get('month'); // YYYY-MM

      if (!typeId || !month) {
        return new Response(JSON.stringify({ error: 'typeId and month required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get the appointment type for duration
      const { data: typeData } = await supabase
        .from('appointment_types')
        .select('duration_minutes')
        .eq('id', typeId)
        .single();

      if (!typeData) {
        return new Response(JSON.stringify({ error: 'Appointment type not found' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get weekly slots for this type
      const { data: slots } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('appointment_type_id', typeId)
        .eq('is_active', true);

      if (!slots || slots.length === 0) {
        return new Response(JSON.stringify({ availableDates: [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Calculate available dates in the month
      const [year, mon] = month.split('-').map(Number);
      const daysInMonth = new Date(year, mon, 0).getDate();
      const availableDates: string[] = [];

      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, mon - 1, d);
        const dayOfWeek = date.getDay();
        // Check if past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) continue;

        const hasSlot = slots.some(s => s.day_of_week === dayOfWeek);
        if (hasSlot) {
          const dateStr = `${year}-${String(mon).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          availableDates.push(dateStr);
        }
      }

      return new Response(JSON.stringify({ availableDates }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET: Fetch available time slots for a specific date
    if (action === 'times') {
      const typeId = url.searchParams.get('typeId');
      const date = url.searchParams.get('date'); // YYYY-MM-DD

      if (!typeId || !date) {
        return new Response(JSON.stringify({ error: 'typeId and date required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const dateObj = new Date(date + 'T00:00:00');
      const dayOfWeek = dateObj.getDay();

      // Get type duration
      const { data: typeData } = await supabase
        .from('appointment_types')
        .select('duration_minutes')
        .eq('id', typeId)
        .single();

      if (!typeData) {
        return new Response(JSON.stringify({ error: 'Type not found' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get slots for this day
      const { data: slots } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('appointment_type_id', typeId)
        .eq('day_of_week', dayOfWeek)
        .eq('is_active', true);

      if (!slots || slots.length === 0) {
        return new Response(JSON.stringify({ times: [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get existing bookings for this date + type
      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('start_time, end_time')
        .eq('appointment_type_id', typeId)
        .eq('booking_date', date)
        .eq('status', 'confirmed');

      const duration = typeData.duration_minutes;
      const times: { time: string; endTime: string }[] = [];

      for (const slot of slots) {
        // Parse start/end times
        const [startH, startM] = slot.start_time.split(':').map(Number);
        const [endH, endM] = slot.end_time.split(':').map(Number);
        const slotStartMin = startH * 60 + startM;
        const slotEndMin = endH * 60 + endM;

        // Generate time slots
        for (let t = slotStartMin; t + duration <= slotEndMin; t += 30) {
          const h = Math.floor(t / 60);
          const m = t % 60;
          const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
          const endT = t + duration;
          const endH2 = Math.floor(endT / 60);
          const endM2 = endT % 60;
          const endTimeStr = `${String(endH2).padStart(2, '0')}:${String(endM2).padStart(2, '0')}:00`;

          // Check conflicts with existing bookings
          const hasConflict = (existingBookings || []).some(b => {
            const bStart = b.start_time;
            const bEnd = b.end_time;
            return timeStr < bEnd && endTimeStr > bStart;
          });

          if (!hasConflict) {
            times.push({ time: timeStr, endTime: endTimeStr });
          }
        }
      }

      return new Response(JSON.stringify({ times }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST: Create a booking
    if (action === 'book' && req.method === 'POST') {
      const body = await req.json();
      const { typeId, customerName, customerEmail, customerPhone, date, startTime, endTime, notes } = body;

      if (!typeId || !customerName || !customerEmail || !date || !startTime || !endTime) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check for conflicts
      const { data: conflicts } = await supabase
        .from('bookings')
        .select('id')
        .eq('appointment_type_id', typeId)
        .eq('booking_date', date)
        .eq('status', 'confirmed')
        .lt('start_time', endTime)
        .gt('end_time', startTime);

      if (conflicts && conflicts.length > 0) {
        return new Response(JSON.stringify({ error: 'Time slot no longer available' }), {
          status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          appointment_type_id: typeId,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone || '',
          booking_date: date,
          start_time: startTime,
          end_time: endTime,
          notes: notes || '',
          status: 'confirmed',
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ booking }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

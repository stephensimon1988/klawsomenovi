// Public endpoint that returns a .ics calendar file for a booking.
// Used by confirmation emails so both customers and admins can add the event
// to Google/Apple/Outlook calendars in one click.
//
// GET /functions/v1/booking-ics?ref=KLW-...

import { createClient } from 'npm:@supabase/supabase-js@2'
import { buildBookingIcs, icsBookingRow } from '../_shared/ics.ts'

Deno.serve(async (req) => {
  if (req.method !== 'GET') {
    return new Response('method not allowed', { status: 405 })
  }

  const url = new URL(req.url)
  const ref = url.searchParams.get('ref')
  if (!ref) {
    return new Response('missing ref', { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const { data: row, error } = await supabase
    .from('event_bookings')
    .select(
      'booking_ref, event_type, start_at, duration_minutes, contact_name, contact_email, party_size, celebrant_name, zip',
    )
    .eq('booking_ref', ref)
    .maybeSingle()

  if (error || !row) {
    return new Response('booking not found', { status: 404 })
  }

  const ics = buildBookingIcs(icsBookingRow(row))
  return new Response(ics, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8; method=PUBLISH',
      'Content-Disposition': `attachment; filename="klawsome-booking-${row.booking_ref}.ics"`,
      'Cache-Control': 'no-store',
    },
  })
})
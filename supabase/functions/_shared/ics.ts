// Minimal RFC 5545 ICS builder for booking calendar invites.
// Produces a single VEVENT wrapped in a VCALENDAR with METHOD:PUBLISH so
// both Gmail and Apple Mail render "Add to calendar" affordances.

export interface BookingEvent {
  bookingRef: string
  eventType: string
  startAt: string // ISO
  durationMinutes?: number | null
  contactName?: string | null
  contactEmail?: string | null
  partySize?: number | null
  celebrantName?: string | null
  zip?: string | null
}

const KLAWSOME_ADDRESS = '42768 Grand River Ave Suite C-140, Novi, MI 48375'
const ORGANIZER_NAME = 'Klawsome Arcade'
const ORGANIZER_EMAIL = 'events@klawsomenovi.com'

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n)
}

function toIcsUtc(iso: string): string {
  const d = new Date(iso)
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  )
}

function esc(v: string): string {
  return String(v)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

function foldLine(line: string): string {
  // RFC 5545 lines should not exceed 75 octets — fold with CRLF + space.
  if (line.length <= 74) return line
  const parts: string[] = []
  let rest = line
  parts.push(rest.slice(0, 74))
  rest = rest.slice(74)
  while (rest.length > 73) {
    parts.push(' ' + rest.slice(0, 73))
    rest = rest.slice(73)
  }
  if (rest.length) parts.push(' ' + rest)
  return parts.join('\r\n')
}

function eventTitle(e: BookingEvent): string {
  const type = (e.eventType || 'event').toLowerCase()
  if (type === 'mobile') return `Klawsome Mobile — ${e.contactName || 'Booking'}`
  if (type === 'rental') return `Klawsome Rental — ${e.contactName || 'Booking'}`
  if (type === 'semi-private' || type === 'semi_private')
    return `Klawsome Semi-Private Party — ${e.celebrantName || e.contactName || 'Booking'}`
  if (type === 'private')
    return `Klawsome Private Party — ${e.celebrantName || e.contactName || 'Booking'}`
  return `Klawsome Booking — ${e.contactName || e.bookingRef}`
}

function eventLocation(e: BookingEvent): string {
  const type = (e.eventType || '').toLowerCase()
  if (type === 'mobile') {
    return e.zip
      ? `Klawsome Mobile — on-site delivery (ZIP ${e.zip})`
      : 'Klawsome Mobile — on-site delivery'
  }
  return KLAWSOME_ADDRESS
}

function eventDescription(e: BookingEvent): string {
  const lines: string[] = []
  lines.push(`Booking ref: ${e.bookingRef}`)
  if (e.contactName) lines.push(`Contact: ${e.contactName}`)
  if (e.contactEmail) lines.push(`Email: ${e.contactEmail}`)
  if (e.partySize) lines.push(`Party size: ${e.partySize}`)
  if (e.celebrantName) lines.push(`Celebrant: ${e.celebrantName}`)
  return lines.join('\n')
}

export function buildBookingIcs(e: BookingEvent): string {
  const duration = e.durationMinutes && e.durationMinutes > 0 ? e.durationMinutes : 120
  const start = new Date(e.startAt)
  const end = new Date(start.getTime() + duration * 60 * 1000).toISOString()
  const now = new Date().toISOString()
  const uid = `${e.bookingRef}@klawsomenovi.com`

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Klawsome Arcade//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toIcsUtc(now)}`,
    `DTSTART:${toIcsUtc(e.startAt)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${esc(eventTitle(e))}`,
    `LOCATION:${esc(eventLocation(e))}`,
    `DESCRIPTION:${esc(eventDescription(e))}`,
    `ORGANIZER;CN=${esc(ORGANIZER_NAME)}:mailto:${ORGANIZER_EMAIL}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ].map(foldLine)

  return lines.join('\r\n') + '\r\n'
}

// Build a Google Calendar "add event" URL — works one-click without any attachment.
export function buildGoogleCalendarUrl(e: BookingEvent): string {
  const duration = e.durationMinutes && e.durationMinutes > 0 ? e.durationMinutes : 120
  const start = new Date(e.startAt)
  const end = new Date(start.getTime() + duration * 60 * 1000).toISOString()
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle(e),
    dates: `${toIcsUtc(e.startAt)}/${toIcsUtc(end)}`,
    details: eventDescription(e),
    location: eventLocation(e),
  })
  return `https://www.google.com/calendar/render?${params.toString()}`
}

export function icsBookingRow(row: Record<string, any>): BookingEvent {
  return {
    bookingRef: row.booking_ref,
    eventType: row.event_type,
    startAt: row.start_at,
    durationMinutes: row.duration_minutes,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    partySize: row.party_size,
    celebrantName: row.celebrant_name,
    zip: row.zip,
  }
}
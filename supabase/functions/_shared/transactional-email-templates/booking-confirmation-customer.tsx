import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  contactName?: string
  eventTypeLabel?: string
  startPretty?: string
  partySize?: number
  celebrantName?: string
  locationLine?: string
  bookingRef?: string
  googleCalendarUrl?: string
  icsUrl?: string
}

const Email = ({
  contactName,
  eventTypeLabel,
  startPretty,
  partySize,
  celebrantName,
  locationLine,
  bookingRef,
  googleCalendarUrl,
  icsUrl,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Klawsome booking is confirmed — add it to your calendar</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>You're booked! 🎉</Heading>
        <Text style={lede}>
          {contactName ? `Hi ${contactName},` : 'Hi there,'} we can't wait to see you at Klawsome.
          Here are your booking details.
        </Text>

        <Section style={card}>
          <Text style={label}>Event</Text>
          <Text style={value}>{eventTypeLabel ?? 'Klawsome booking'}</Text>

          <Hr style={hr} />
          <Text style={label}>When</Text>
          <Text style={value}>{startPretty ?? '—'}</Text>

          {locationLine ? (
            <>
              <Hr style={hr} />
              <Text style={label}>Where</Text>
              <Text style={value}>{locationLine}</Text>
            </>
          ) : null}

          {partySize ? (
            <>
              <Hr style={hr} />
              <Text style={label}>Party size</Text>
              <Text style={value}>{partySize}</Text>
            </>
          ) : null}

          {celebrantName ? (
            <>
              <Hr style={hr} />
              <Text style={label}>Celebrant</Text>
              <Text style={value}>{celebrantName}</Text>
            </>
          ) : null}

          {bookingRef ? (
            <>
              <Hr style={hr} />
              <Text style={label}>Confirmation #</Text>
              <Text style={value}>{bookingRef}</Text>
            </>
          ) : null}
        </Section>

        <Section style={{ textAlign: 'center', margin: '28px 0 8px' }}>
          {googleCalendarUrl ? (
            <Button style={btnPrimary} href={googleCalendarUrl}>
              Add to Google Calendar
            </Button>
          ) : null}
        </Section>
        {icsUrl ? (
          <Text style={smallCenter}>
            Apple Calendar or Outlook? <Link href={icsUrl} style={link}>Download the calendar file (.ics)</Link>
          </Text>
        ) : null}

        <Text style={footer}>
          Questions? Just reply to this email — we're happy to help.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `Your Klawsome booking is confirmed${data?.startPretty ? ` — ${data.startPretty}` : ''}`,
  displayName: 'Booking confirmation (customer)',
  previewData: {
    contactName: 'Taylor',
    eventTypeLabel: 'Private Party',
    startPretty: 'Saturday, Nov 7, 2026 at 11:00 AM',
    partySize: 20,
    celebrantName: 'Madden (6)',
    locationLine: '42768 Grand River Ave Suite C-140, Novi, MI 48375',
    bookingRef: 'KLW-2607161547-NUD8',
    googleCalendarUrl: 'https://www.google.com/calendar/render?action=TEMPLATE',
    icsUrl: 'https://example.com/booking-ics?ref=KLW',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Nunito', 'Helvetica Neue', Arial, sans-serif",
  padding: '24px 0',
}
const container = { maxWidth: '560px', margin: '0 auto', padding: '8px 24px' }
const h1 = {
  fontFamily: "'Quicksand', 'Helvetica Neue', Arial, sans-serif",
  fontSize: '26px',
  fontWeight: 700,
  color: '#1e2a52',
  margin: '0 0 12px',
}
const lede = { fontSize: '15px', color: '#55575d', lineHeight: '1.55', margin: '0 0 20px' }
const card = {
  backgroundColor: '#fdf4f9',
  borderRadius: '16px',
  padding: '20px 22px',
  border: '1px solid #f5d8e6',
}
const label = {
  fontFamily: "'Quicksand', 'Helvetica Neue', Arial, sans-serif",
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: '#9a4d76',
  margin: '0 0 4px',
}
const value = { fontSize: '15px', color: '#1e2a52', margin: '0' }
const hr = { borderColor: '#f5d8e6', margin: '14px 0' }
const btnPrimary = {
  backgroundColor: '#e94ea1',
  color: '#ffffff',
  padding: '12px 22px',
  borderRadius: '999px',
  fontWeight: 700,
  fontSize: '15px',
  textDecoration: 'none',
}
const smallCenter = {
  fontSize: '13px',
  color: '#55575d',
  textAlign: 'center' as const,
  margin: '10px 0 0',
}
const link = { color: '#9a4d76', textDecoration: 'underline' }
const footer = { fontSize: '12px', color: '#999', margin: '28px 0 0', textAlign: 'center' as const }
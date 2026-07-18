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
  contactEmail?: string
  contactPhone?: string
  eventTypeLabel?: string
  startPretty?: string
  partySize?: number
  celebrantName?: string
  celebrantAge?: number
  locationLine?: string
  zip?: string
  bookingRef?: string
  shopifyOrderId?: string
  totalDollars?: string
  specialRequests?: string
  googleCalendarUrl?: string
  icsUrl?: string
  adminUrl?: string
}

const Email = ({
  contactName,
  contactEmail,
  contactPhone,
  eventTypeLabel,
  startPretty,
  partySize,
  celebrantName,
  celebrantAge,
  locationLine,
  zip,
  bookingRef,
  shopifyOrderId,
  totalDollars,
  specialRequests,
  googleCalendarUrl,
  icsUrl,
  adminUrl,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New paid booking: {eventTypeLabel} — {startPretty}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New paid booking</Heading>
        <Text style={lede}>
          A booking just came through and payment cleared. Add it to your calendar below.
        </Text>

        <Section style={card}>
          <Text style={label}>Event</Text>
          <Text style={value}>{eventTypeLabel ?? '—'}</Text>

          <Hr style={hr} />
          <Text style={label}>When</Text>
          <Text style={value}>{startPretty ?? '—'}</Text>

          {locationLine ? (
            <>
              <Hr style={hr} />
              <Text style={label}>Where</Text>
              <Text style={value}>{locationLine}{zip ? ` (ZIP ${zip})` : ''}</Text>
            </>
          ) : null}

          <Hr style={hr} />
          <Text style={label}>Customer</Text>
          <Text style={value}>{contactName ?? '—'}</Text>
          {contactEmail ? <Text style={value}>{contactEmail}</Text> : null}
          {contactPhone ? <Text style={value}>{contactPhone}</Text> : null}

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
              <Text style={value}>{celebrantName}{celebrantAge ? ` (age ${celebrantAge})` : ''}</Text>
            </>
          ) : null}

          {specialRequests ? (
            <>
              <Hr style={hr} />
              <Text style={label}>Special requests</Text>
              <Text style={value}>{specialRequests}</Text>
            </>
          ) : null}

          <Hr style={hr} />
          <Text style={label}>Booking ref</Text>
          <Text style={value}>{bookingRef ?? '—'}</Text>
          {shopifyOrderId ? (
            <>
              <Hr style={hr} />
              <Text style={label}>Shopify order</Text>
              <Text style={value}>#{shopifyOrderId}{totalDollars ? ` — ${totalDollars}` : ''}</Text>
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
            Apple/Outlook: <Link href={icsUrl} style={link}>Download .ics</Link>
          </Text>
        ) : null}
        {adminUrl ? (
          <Text style={smallCenter}>
            <Link href={adminUrl} style={link}>Open admin calendar →</Link>
          </Text>
        ) : null}
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `New booking: ${data?.eventTypeLabel ?? 'Klawsome'}${data?.startPretty ? ` — ${data.startPretty}` : ''}`,
  displayName: 'Booking confirmation (admin)',
  previewData: {
    contactName: 'Taylor Weintraub',
    contactEmail: 'tchaness@gmail.com',
    contactPhone: '(248) 894-8946',
    eventTypeLabel: 'Private Party',
    startPretty: 'Saturday, Nov 7, 2026 at 11:00 AM',
    partySize: 20,
    celebrantName: 'Madden',
    celebrantAge: 6,
    locationLine: '42768 Grand River Ave Suite C-140, Novi, MI 48375',
    bookingRef: 'KLW-2607161547-NUD8',
    shopifyOrderId: '1007',
    totalDollars: '$319.00',
    specialRequests: 'Blue, Spiderman, superheroes',
    googleCalendarUrl: 'https://www.google.com/calendar/render?action=TEMPLATE',
    icsUrl: 'https://example.com/booking-ics?ref=KLW',
    adminUrl: 'https://klawsomearcade.com/klawsome-admin',
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
  fontSize: '24px',
  fontWeight: 700,
  color: '#1e2a52',
  margin: '0 0 12px',
}
const lede = { fontSize: '14px', color: '#55575d', lineHeight: '1.5', margin: '0 0 20px' }
const card = {
  backgroundColor: '#f4f7fd',
  borderRadius: '16px',
  padding: '20px 22px',
  border: '1px solid #d7e0f2',
}
const label = {
  fontFamily: "'Quicksand', 'Helvetica Neue', Arial, sans-serif",
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: '#3b528c',
  margin: '0 0 4px',
}
const value = { fontSize: '15px', color: '#1e2a52', margin: '0 0 2px' }
const hr = { borderColor: '#d7e0f2', margin: '14px 0' }
const btnPrimary = {
  backgroundColor: '#3b528c',
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
const link = { color: '#3b528c', textDecoration: 'underline' }
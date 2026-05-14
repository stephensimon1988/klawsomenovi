import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Klawsome Arcade'

interface ContactFormNotificationProps {
  name?: string
  email?: string
  message?: string
  submittedAt?: string
}

const ContactFormNotificationEmail = ({
  name,
  email,
  message,
  submittedAt,
}: ContactFormNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New message from {name ?? 'a visitor'} via {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New contact form submission</Heading>
        <Text style={lede}>
          Someone just reached out through the {SITE_NAME} website.
        </Text>

        <Section style={card}>
          <Text style={label}>From</Text>
          <Text style={value}>{name ?? '—'}</Text>

          <Hr style={hr} />

          <Text style={label}>Email</Text>
          <Text style={value}>{email ?? '—'}</Text>

          <Hr style={hr} />

          <Text style={label}>Message</Text>
          <Text style={messageText}>{message ?? '—'}</Text>

          {submittedAt ? (
            <>
              <Hr style={hr} />
              <Text style={label}>Submitted</Text>
              <Text style={value}>{submittedAt}</Text>
            </>
          ) : null}
        </Section>

        <Text style={footer}>
          Reply directly to {email ?? 'the sender'} to follow up.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactFormNotificationEmail,
  subject: (data: Record<string, any>) =>
    `New contact form message${data?.name ? ` from ${data.name}` : ''}`,
  displayName: 'Contact form notification',
  previewData: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'Hi! We would love to book a birthday party for 12 kids.',
    submittedAt: 'May 14, 2026 at 2:30 PM',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Nunito', 'Helvetica Neue', Arial, sans-serif",
  padding: '24px 0',
}
const container = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '8px 24px',
}
const h1 = {
  fontFamily: "'Quicksand', 'Helvetica Neue', Arial, sans-serif",
  fontSize: '24px',
  fontWeight: 700,
  color: '#1e2a52',
  margin: '0 0 12px',
}
const lede = {
  fontSize: '14px',
  color: '#55575d',
  lineHeight: '1.5',
  margin: '0 0 20px',
}
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
const value = {
  fontSize: '15px',
  color: '#1e2a52',
  margin: '0',
}
const messageText = {
  fontSize: '15px',
  color: '#1e2a52',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}
const hr = {
  borderColor: '#f5d8e6',
  margin: '14px 0',
}
const footer = {
  fontSize: '12px',
  color: '#999999',
  margin: '24px 0 0',
}
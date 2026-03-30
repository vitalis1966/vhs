import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Section, Hr, Img, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Vitalis Health Strategies'
const LOGO_URL = 'https://www.vitalisstrategies.com/vitalis-logo.webp'

const INTEREST_LABELS: Record<string, string> = {
  'new-practice': 'New Practice Build',
  'operations': 'Operational Excellence',
  'revenue': 'Revenue & Finance',
  'growth': 'Growth Strategy',
  'recruitment': 'Practitioner Recruitment',
  'ma': 'M&A / Transition',
  'healthcare-it': 'Healthcare IT & Technology',
  'people': 'People Management',
  'assessment': 'Strategic Assessment',
  'general': 'General Inquiry',
}

interface Props {
  name?: string
  email?: string
  phone?: string
  organization?: string
  area_of_interest?: string
  message?: string
}

const FieldRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <tr>
    <td style={fieldLabel}>{label}</td>
    <td style={fieldValue}>{value}</td>
  </tr>
)

const ContactInternalNotificationEmail = ({
  name = 'Unknown',
  email = '',
  phone,
  organization,
  area_of_interest,
  message = '',
}: Props) => {
  const interestLabel = area_of_interest
    ? (INTEREST_LABELS[area_of_interest] || area_of_interest)
    : null

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Montserrat:wght@400;500;600&display=swap');`}</style>
      </Head>
      <Preview>New contact form submission from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with logo */}
          <Section style={header}>
            <Img src={LOGO_URL} width="160" alt={SITE_NAME} style={logo} />
          </Section>

          {/* Title bar */}
          <Section style={titleBar}>
            <Heading style={h1}>New Contact Form Submission</Heading>
            <Text style={subtitle}>Submitted via vitalisstrategies.com/contact</Text>
          </Section>

          {/* Fields table */}
          <Section style={tableSection}>
            <table width="100%" cellPadding="0" cellSpacing="0" style={table}>
              <tbody>
                <FieldRow label="Name" value={name} />
                <FieldRow label="Email" value={
                  <a href={`mailto:${email}`} style={linkStyle}>{email}</a>
                } />
                {phone && <FieldRow label="Phone" value={phone} />}
                {organization && <FieldRow label="Organization" value={organization} />}
                {interestLabel && (
                  <FieldRow label="Interest" value={
                    <span style={interestBadge}>{interestLabel}</span>
                  } />
                )}
                <FieldRow label="Message" value={
                  <span style={messageText}>{message}</span>
                } />
              </tbody>
            </table>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Button href={`mailto:${email}?subject=Re: Your Vitalis inquiry`} style={button}>
              Reply to {name} →
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Hr style={divider} />
            <Text style={footerCompany}>{SITE_NAME} Inc.</Text>
            <Text style={footerContact}>
              Calgary, Alberta, Canada{'   |   '}
              <Link href="mailto:info@vitalisstrategies.com" style={linkStyle}>info@vitalisstrategies.com</Link>
              {'   |   '}
              <Link href="https://vitalisstrategies.com" style={linkStyle}>vitalisstrategies.com</Link>
            </Text>
            <Text style={confidential}>
              CONFIDENTIAL — This message is intended solely for authorized personnel of {SITE_NAME} Inc. It was generated automatically from a contact form submission on vitalisstrategies.com and contains personal information submitted by a prospective client. Do not forward, copy, or share without authorization. If received in error, delete immediately and contact info@vitalisstrategies.com.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ContactInternalNotificationEmail,
  subject: (data: Record<string, any>) => {
    const interest = data.area_of_interest
      ? (INTEREST_LABELS[data.area_of_interest] || data.area_of_interest)
      : 'General'
    return `New Contact Submission — ${data.name || 'Unknown'} · ${interest}`
  },
  to: 'info@vitalisstrategies.com',
  displayName: 'Contact Form — Internal Notification',
  previewData: {
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '+1 (403) 555-0199',
    organization: 'Mountain View Dental',
    area_of_interest: 'new-practice',
    message: 'We are looking to open a second location in the Calgary area and would like to discuss the planning process.',
  },
} satisfies TemplateEntry

// Styles
const main = { backgroundColor: '#f9f6f1', fontFamily: "'Montserrat', Arial, sans-serif", margin: '0', padding: '0' }
const container = { maxWidth: '620px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' as const, border: '1px solid #dde4e0' }
const header = { backgroundColor: '#173026', padding: '28px 32px', textAlign: 'center' as const }
const logo = { margin: '0 auto' }
const titleBar = { padding: '24px 32px 16px', borderBottom: '3px solid #c89741' }
const h1 = { margin: '0', color: '#264a39', fontSize: '22px', fontWeight: '600' as const, fontFamily: "'Playfair Display', Georgia, serif" }
const subtitle = { margin: '6px 0 0', color: '#5a7060', fontSize: '13px', fontWeight: '500' as const }
const tableSection = { padding: '24px 32px 8px' }
const table = { width: '100%' as const, borderCollapse: 'collapse' as const }
const fieldLabel = { padding: '10px 14px', fontWeight: '600' as const, color: '#264a39', borderBottom: '1px solid #dde4e0', width: '130px', verticalAlign: 'top' as const, fontSize: '13px', backgroundColor: '#f9f6f1' }
const fieldValue = { padding: '10px 14px', color: '#172620', borderBottom: '1px solid #dde4e0', fontSize: '14px', verticalAlign: 'top' as const }
const linkStyle = { color: '#c89741', textDecoration: 'none' }
const interestBadge = { display: 'inline-block' as const, backgroundColor: '#264a39', color: '#ffffff', padding: '3px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' as const }
const messageText = { whiteSpace: 'pre-wrap' as const }
const ctaSection = { padding: '24px 32px', textAlign: 'center' as const }
const button = { backgroundColor: '#c89741', color: '#ffffff', textDecoration: 'none', padding: '13px 32px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' as const, display: 'inline-block' }
const footerSection = { padding: '0 32px 28px' }
const divider = { border: 'none', borderTop: '1px solid #dde4e0', margin: '0 0 20px' }
const footerCompany = { fontSize: '13px', fontWeight: '600' as const, color: '#264a39', margin: '0 0 4px', textAlign: 'center' as const }
const footerContact = { fontSize: '12px', color: '#5a7060', lineHeight: '1.6', margin: '0 0 16px', textAlign: 'center' as const }
const confidential = { fontSize: '10px', color: '#5a7060', lineHeight: '1.5', margin: '0', fontStyle: 'italic' as const, backgroundColor: '#f9f6f1', padding: '12px 14px', borderRadius: '4px' }

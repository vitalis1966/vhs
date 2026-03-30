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

const FieldRow = ({ label, value, isLast }: { label: string; value: React.ReactNode; isLast?: boolean }) => (
  <tr>
    <td style={{ ...fieldLabel, borderBottom: isLast ? 'none' : '1px solid #dde4e0' }}>{label}</td>
    <td style={{ ...fieldValue, borderBottom: isLast ? 'none' : '1px solid #dde4e0' }}>{value}</td>
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

  // Build field list to determine which is last
  const fields: Array<{ label: string; value: React.ReactNode }> = [
    { label: 'NAME', value: name },
    { label: 'EMAIL', value: <Link href={`mailto:${email}`} style={goldLink}>{email}</Link> },
  ]
  if (phone) fields.push({ label: 'PHONE', value: phone })
  if (organization) fields.push({ label: 'ORGANIZATION', value: organization })
  if (interestLabel) {
    fields.push({
      label: 'INTEREST',
      value: <span style={sageBadge}>{interestLabel}</span>,
    })
  }
  fields.push({ label: 'MESSAGE', value: <span style={messageStyle}>{message}</span> })

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Montserrat:wght@400;500;600&display=swap');`}</style>
      </Head>
      <Preview>New contact form submission from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Dark green header with logo */}
          <Section style={header}>
            <Img
              src={LOGO_URL}
              width="180"
              height="auto"
              alt="Vitalis Health Strategies"
              style={logoImg}
            />
            {/* Text fallback visible if image fails */}
            <Text style={logoFallback}>VITALIS HEALTH STRATEGIES</Text>
          </Section>

          {/* Gold accent bar */}
          <Section style={goldBar} />

          {/* Heading block */}
          <Section style={headingBlock}>
            <Heading style={h2}>New Contact Form Submission</Heading>
            <Text style={subtitleText}>Submitted via vitalisstrategies.com/contact</Text>
          </Section>

          {/* Fields table */}
          <Section style={tableSection}>
            <table width="100%" cellPadding="0" cellSpacing="0" style={table}>
              <tbody>
                {fields.map((field, i) => (
                  <FieldRow
                    key={field.label}
                    label={field.label}
                    value={field.value}
                    isLast={i === fields.length - 1}
                  />
                ))}
              </tbody>
            </table>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Button
              href={`mailto:${email}?subject=Re: Your Vitalis inquiry`}
              style={ctaButton}
            >
              Reply to {name} →
            </Button>
          </Section>

          {/* Sage divider */}
          <Hr style={sageDivider} />

          {/* Contact block */}
          <Section style={contactBlock}>
            <Text style={contactCompany}>{SITE_NAME} Inc.</Text>
            <Text style={contactLocation}>Calgary, Alberta, Canada</Text>
            <Text style={contactLinks}>
              <Link href="mailto:info@vitalisstrategies.com" style={goldLink}>
                info@vitalisstrategies.com
              </Link>
              {'   |   '}
              <Link href="https://vitalisstrategies.com" style={goldLink}>
                vitalisstrategies.com
              </Link>
            </Text>
          </Section>

          {/* Confidential footer */}
          <Section style={legalFooter}>
            <Text style={legalText}>
              CONFIDENTIAL — This message is intended solely for authorized
              personnel of {SITE_NAME} Inc. It was generated automatically from
              a contact form submission on vitalisstrategies.com and contains
              personal information submitted by a prospective client. Do not
              forward, copy, or share without authorization. If received in
              error, delete immediately and contact info@vitalisstrategies.com.
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
    message:
      'We are looking to open a second location in the Calgary area and would like to discuss the planning process.',
  },
} satisfies TemplateEntry

/* ─── Styles ─── */

const main = {
  backgroundColor: '#f9f6f1',
  fontFamily: "'Montserrat', Arial, sans-serif",
  margin: '0',
  padding: '20px 0',
}
const container = {
  maxWidth: '620px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  overflow: 'hidden' as const,
}
const header = {
  backgroundColor: '#173026',
  padding: '32px',
  textAlign: 'center' as const,
}
const logoImg = {
  margin: '0 auto',
  display: 'block' as const,
  color: '#ffffff',
  fontSize: '18px',
  fontFamily: "'Playfair Display', Georgia, serif",
  fontWeight: '600' as const,
}
const logoFallback = {
  display: 'none' as const,
  color: '#ffffff',
  fontSize: '18px',
  fontFamily: "'Playfair Display', Georgia, serif",
  fontWeight: '600' as const,
  letterSpacing: '0.08em',
  textAlign: 'center' as const,
  margin: '8px 0 0',
}
const goldBar = {
  height: '4px',
  backgroundColor: '#c89741',
  margin: '0',
  padding: '0',
  lineHeight: '0' as const,
  fontSize: '0' as const,
}
const headingBlock = { padding: '28px 40px 12px' }
const h2 = {
  margin: '0 0 6px',
  color: '#264a39',
  fontSize: '22px',
  fontWeight: '600' as const,
  fontFamily: "'Playfair Display', Georgia, serif",
  lineHeight: '1.3',
}
const subtitleText = {
  fontSize: '12px',
  color: '#5a7060',
  margin: '0',
  fontFamily: "'Montserrat', Arial, sans-serif",
}
const tableSection = { padding: '8px 40px 32px' }
const table = { width: '100%' as const, borderCollapse: 'collapse' as const }
const fieldLabel = {
  padding: '11px 14px',
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  color: '#5a7060',
  width: '140px',
  verticalAlign: 'top' as const,
  fontWeight: '600' as const,
  fontFamily: "'Montserrat', Arial, sans-serif",
}
const fieldValue = {
  padding: '11px 14px',
  fontSize: '15px',
  color: '#172620',
  verticalAlign: 'top' as const,
  fontFamily: "'Montserrat', Arial, sans-serif",
  lineHeight: '1.5',
}
const goldLink = { color: '#c89741', textDecoration: 'none' }
const sageBadge = {
  display: 'inline-block' as const,
  backgroundColor: '#A9B1A1',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '600' as const,
  padding: '4px 12px',
  borderRadius: '20px',
}
const messageStyle = { whiteSpace: 'pre-wrap' as const }
const ctaSection = { padding: '0 40px 32px', textAlign: 'center' as const }
const ctaButton = {
  backgroundColor: '#264a39',
  color: '#ffffff',
  textDecoration: 'none',
  padding: '13px 32px',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '600' as const,
  display: 'inline-block',
  fontFamily: "'Montserrat', Arial, sans-serif",
}
const sageDivider = {
  border: 'none',
  borderTop: '1px solid #dde4e0',
  margin: '0',
}
const contactBlock = {
  padding: '24px 40px 16px',
  textAlign: 'center' as const,
}
const contactCompany = {
  fontSize: '13px',
  fontWeight: '700' as const,
  color: '#264a39',
  margin: '0 0 2px',
  fontFamily: "'Montserrat', Arial, sans-serif",
}
const contactLocation = {
  fontSize: '12px',
  color: '#5a7060',
  margin: '0 0 6px',
  fontFamily: "'Montserrat', Arial, sans-serif",
}
const contactLinks = {
  fontSize: '12px',
  color: '#5a7060',
  margin: '0',
  fontFamily: "'Montserrat', Arial, sans-serif",
}
const legalFooter = {
  backgroundColor: '#f9f6f1',
  borderTop: '1px solid #dde4e0',
  padding: '20px 40px 28px',
}
const legalText = {
  fontSize: '10px',
  color: '#8a9e92',
  lineHeight: '1.7',
  margin: '0',
  fontStyle: 'italic' as const,
  fontFamily: "'Montserrat', Arial, sans-serif",
}

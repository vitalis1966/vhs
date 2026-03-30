import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Vitalis Health Strategies'

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
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>New Contact Form Submission</Heading>
            <Text style={subtitle}>{SITE_NAME}</Text>
          </Section>
          <Section style={tableSection}>
            <table width="100%" cellPadding="0" cellSpacing="0" style={table}>
              <tbody>
                <FieldRow label="Name" value={name} />
                <FieldRow label="Email" value={
                  <a href={`mailto:${email}`} style={linkStyle}>{email}</a>
                } />
                {phone && <FieldRow label="Phone" value={phone} />}
                {organization && <FieldRow label="Organization" value={organization} />}
                {interestLabel && <FieldRow label="Area of Interest" value={interestLabel} />}
                <FieldRow label="Message" value={message} />
              </tbody>
            </table>
          </Section>
          <Section style={ctaSection}>
            <Button href={`mailto:${email}`} style={button}>
              Reply to {name}
            </Button>
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
    return `New Contact Form Submission — ${data.name || 'Unknown'} (${interest})`
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

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { maxWidth: '600px', margin: '0 auto' }
const header = { backgroundColor: '#1C3D2E', padding: '28px 32px' }
const h1 = { margin: '0', color: '#ffffff', fontSize: '20px', fontWeight: '700' as const, letterSpacing: '0.5px' }
const subtitle = { margin: '6px 0 0', color: '#B8860B', fontSize: '13px', fontWeight: '600' as const, letterSpacing: '1px', textTransform: 'uppercase' as const }
const tableSection = { padding: '24px 32px 8px' }
const table = { border: '1px solid #e8e4de', borderRadius: '8px', overflow: 'hidden' as const }
const fieldLabel = { padding: '10px 16px', fontWeight: '600' as const, color: '#1C3D2E', borderBottom: '1px solid #e8e4de', width: '160px', verticalAlign: 'top' as const, fontSize: '14px' }
const fieldValue = { padding: '10px 16px', color: '#333', borderBottom: '1px solid #e8e4de', fontSize: '14px' }
const linkStyle = { color: '#B8860B' }
const ctaSection = { padding: '24px 32px 32px', textAlign: 'center' as const }
const button = { backgroundColor: '#B8860B', color: '#ffffff', textDecoration: 'none', padding: '12px 28px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' as const, display: 'inline-block' }

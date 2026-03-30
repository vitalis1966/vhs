import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Link, Section, Hr,
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
  area_of_interest?: string
  message?: string
}

const ContactClientConfirmationEmail = ({
  name = 'there',
  area_of_interest,
  message = '',
}: Props) => {
  const interestLabel = area_of_interest
    ? (INTEREST_LABELS[area_of_interest] || area_of_interest)
    : null

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Thank you for reaching out to {SITE_NAME}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Thank You for Reaching Out</Heading>
            <Text style={subtitle}>{SITE_NAME}</Text>
          </Section>
          <Section style={content}>
            <Text style={greeting}>Hi {name},</Text>
            <Text style={text}>
              Thank you for reaching out to {SITE_NAME}. A member of our team
              will be in touch within one business day.
            </Text>
            {interestLabel && (
              <Text style={text}>
                You indicated interest in:{' '}
                <strong style={{ color: '#1C3D2E' }}>{interestLabel}</strong>
              </Text>
            )}
            <Text style={messageLabel}>Your message:</Text>
            <Section style={quoteBlock}>
              <Text style={quoteText}>{message}</Text>
            </Section>
            <Hr style={divider} />
            <Text style={footer}>
              <strong style={{ color: '#1C3D2E' }}>{SITE_NAME}</strong>
              <br />
              Calgary, Alberta, Canada
              <br />
              <Link href="mailto:info@vitalisstrategies.com" style={linkStyle}>
                info@vitalisstrategies.com
              </Link>
              <br />
              <Link href="https://vitalisstrategies.com" style={linkStyle}>
                vitalisstrategies.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ContactClientConfirmationEmail,
  subject: 'We received your message — Vitalis Health Strategies',
  displayName: 'Contact Form — Client Confirmation',
  previewData: {
    name: 'Dr. Sarah Chen',
    area_of_interest: 'new-practice',
    message: 'We are looking to open a second location in the Calgary area and would like to discuss the planning process.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { maxWidth: '600px', margin: '0 auto' }
const header = { backgroundColor: '#1C3D2E', padding: '28px 32px' }
const h1 = { margin: '0', color: '#ffffff', fontSize: '20px', fontWeight: '700' as const }
const subtitle = { margin: '6px 0 0', color: '#B8860B', fontSize: '13px', fontWeight: '600' as const, letterSpacing: '1px', textTransform: 'uppercase' as const }
const content = { padding: '28px 32px' }
const greeting = { fontSize: '15px', color: '#333', lineHeight: '1.6', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#333', lineHeight: '1.6', margin: '0 0 20px' }
const messageLabel = { fontSize: '13px', color: '#666', margin: '0 0 8px', fontWeight: '600' as const }
const quoteBlock = { borderLeft: '3px solid #B8860B', padding: '12px 16px', backgroundColor: '#F5F2EC', borderRadius: '0 6px 6px 0', margin: '0 0 24px' }
const quoteText = { fontSize: '14px', color: '#555', lineHeight: '1.6', margin: '0', whiteSpace: 'pre-wrap' as const }
const divider = { border: 'none', borderTop: '1px solid #e8e4de', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#888', lineHeight: '1.6', margin: '0' }
const linkStyle = { color: '#B8860B', textDecoration: 'none' }

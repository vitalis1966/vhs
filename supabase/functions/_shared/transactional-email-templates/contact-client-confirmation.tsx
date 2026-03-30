import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Link, Section, Hr, Img,
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
  area_of_interest?: string
  message?: string
}

const ContactClientConfirmationEmail = ({
  name = 'there',
  email,
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
      <Preview>Thank you for reaching out to {SITE_NAME}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Dark green header with logo */}
          <Section style={header}>
            <Img
              src={LOGO_URL}
              width="180"
              alt="Vitalis Health Strategies"
              style={logo}
            />
          </Section>

          {/* Gold accent bar */}
          <Section style={goldBar} />

          {/* White card body */}
          <Section style={cardBody}>
            <Heading style={h2}>We received your message.</Heading>

            <Text style={bodyText}>Hi {name},</Text>

            <Text style={bodyText}>
              Thank you for reaching out to {SITE_NAME}. We have received your
              message and a member of our team will be in touch within one
              business day.
            </Text>

            {interestLabel && (
              <Text style={bodyText}>
                You indicated interest in:{' '}
                <span style={sageBadge}>{interestLabel}</span>
              </Text>
            )}

            {/* Message echo block */}
            <Section style={messageBlock}>
              <Text style={messageLabel}>YOUR MESSAGE</Text>
              <Text style={messageText}>{message}</Text>
            </Section>

            <Text style={bodyText}>
              If you have anything to add or questions in the meantime, simply
              reply to this email and it will reach our team directly.
            </Text>
          </Section>

          {/* Sage divider */}
          <Hr style={sageDivider} />

          {/* Contact block */}
          <Section style={contactBlock}>
            <Text style={contactCompany}>{SITE_NAME}</Text>
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

          {/* Legal footer */}
          <Section style={legalFooter}>
            <Text style={legalText}>
              This message and any information contained herein are confidential
              and intended solely for the use of the named recipient. It was sent
              in response to a contact form submission made at
              vitalisstrategies.com. If you did not submit this form or believe
              you received this email in error, please disregard it and contact
              us at info@vitalisstrategies.com.
            </Text>
            <Text style={legalText}>
              {SITE_NAME} Inc. is committed to protecting your privacy. We do
              not share, sell, or disclose your personal information to third
              parties. Your submission is stored securely and used solely to
              respond to your inquiry. View our Privacy Policy:{' '}
              <Link href="https://vitalisstrategies.com/privacy" style={goldLink}>
                vitalisstrategies.com/privacy
              </Link>
            </Text>
            <Text style={legalText}>
              © 2026 {SITE_NAME} Inc. All rights reserved. Calgary, Alberta,
              Canada
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
    email: 'sarah.chen@example.com',
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
const logo = { margin: '0 auto', display: 'block' as const }
const goldBar = {
  height: '4px',
  backgroundColor: '#c89741',
  margin: '0',
  padding: '0',
  lineHeight: '0' as const,
  fontSize: '0' as const,
}
const cardBody = { padding: '36px 40px' }
const h2 = {
  margin: '0 0 20px',
  color: '#264a39',
  fontSize: '24px',
  fontWeight: '600' as const,
  fontFamily: "'Playfair Display', Georgia, serif",
  lineHeight: '1.3',
}
const bodyText = {
  fontSize: '15px',
  color: '#172620',
  lineHeight: '1.75',
  margin: '0 0 16px',
  fontFamily: "'Montserrat', Arial, sans-serif",
}
const sageBadge = {
  display: 'inline-block' as const,
  backgroundColor: '#A9B1A1',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '600' as const,
  padding: '4px 12px',
  borderRadius: '20px',
  verticalAlign: 'middle' as const,
}
const messageBlock = {
  borderLeft: '4px solid #A9B1A1',
  backgroundColor: '#f9f6f1',
  padding: '16px 20px',
  borderRadius: '0 6px 6px 0',
  margin: '0 0 20px',
}
const messageLabel = {
  fontSize: '10px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  color: '#5a7060',
  margin: '0 0 8px',
  fontWeight: '600' as const,
  fontFamily: "'Montserrat', Arial, sans-serif",
}
const messageText = {
  fontSize: '14px',
  color: '#172620',
  lineHeight: '1.75',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
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
const goldLink = { color: '#c89741', textDecoration: 'none' }
const legalFooter = {
  backgroundColor: '#f9f6f1',
  borderTop: '1px solid #dde4e0',
  padding: '20px 40px 28px',
}
const legalText = {
  fontSize: '10px',
  color: '#8a9e92',
  lineHeight: '1.7',
  margin: '0 0 10px',
  fontFamily: "'Montserrat', Arial, sans-serif",
}

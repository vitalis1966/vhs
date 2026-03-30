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
          {/* Header with logo */}
          <Section style={header}>
            <Img src={LOGO_URL} width="160" alt={SITE_NAME} style={logo} />
          </Section>

          {/* Title */}
          <Section style={titleSection}>
            <Heading style={h1}>We received your message.</Heading>
          </Section>

          {/* Body content */}
          <Section style={content}>
            <Text style={greeting}>Hi {name},</Text>
            <Text style={text}>
              Thank you for reaching out to {SITE_NAME}. A member of our team will be in touch within one business day.
            </Text>

            {interestLabel && (
              <Text style={text}>
                You indicated interest in:{' '}
                <strong style={{ color: '#264a39' }}>{interestLabel}</strong>
              </Text>
            )}

            {message && (
              <>
                <Text style={messageLabel}>Your message:</Text>
                <Section style={quoteBlock}>
                  <Text style={quoteText}>{message}</Text>
                </Section>
              </>
            )}
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Hr style={divider} />
            <Text style={footerCompany}>{SITE_NAME}</Text>
            <Text style={footerContact}>
              Calgary, Alberta, Canada
              <br />
              <Link href="mailto:info@vitalisstrategies.com" style={linkStyle}>info@vitalisstrategies.com</Link>
              {'   |   '}
              <Link href="https://vitalisstrategies.com" style={linkStyle}>vitalisstrategies.com</Link>
            </Text>
            <Text style={disclaimer}>
              This is an automated confirmation. Please do not reply directly to this email — replies are monitored and will be seen by our team.
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
    message: 'We are looking to open a second location in the Calgary area and would like to discuss the planning process.',
  },
} satisfies TemplateEntry

// Styles
const main = { backgroundColor: '#f9f6f1', fontFamily: "'Montserrat', Arial, sans-serif", margin: '0', padding: '0' }
const container = { maxWidth: '620px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' as const, border: '1px solid #dde4e0' }
const header = { backgroundColor: '#173026', padding: '28px 32px', textAlign: 'center' as const }
const logo = { margin: '0 auto' }
const titleSection = { padding: '28px 32px 0', borderBottom: '3px solid #c89741' }
const h1 = { margin: '0 0 20px', color: '#264a39', fontSize: '24px', fontWeight: '600' as const, fontFamily: "'Playfair Display', Georgia, serif" }
const content = { padding: '24px 32px' }
const greeting = { fontSize: '15px', color: '#172620', lineHeight: '1.6', margin: '0 0 16px', fontWeight: '500' as const }
const text = { fontSize: '14px', color: '#172620', lineHeight: '1.7', margin: '0 0 16px' }
const messageLabel = { fontSize: '12px', color: '#5a7060', margin: '20px 0 8px', fontWeight: '600' as const, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const quoteBlock = { borderLeft: '3px solid #c89741', padding: '14px 18px', backgroundColor: '#f9f6f1', borderRadius: '0 6px 6px 0', margin: '0 0 16px' }
const quoteText = { fontSize: '14px', color: '#172620', lineHeight: '1.6', margin: '0', whiteSpace: 'pre-wrap' as const }
const footerSection = { padding: '0 32px 28px' }
const divider = { border: 'none', borderTop: '1px solid #dde4e0', margin: '0 0 20px' }
const footerCompany = { fontSize: '14px', fontWeight: '600' as const, color: '#264a39', margin: '0 0 4px', textAlign: 'center' as const }
const footerContact = { fontSize: '12px', color: '#5a7060', lineHeight: '1.8', margin: '0 0 16px', textAlign: 'center' as const }
const linkStyle = { color: '#c89741', textDecoration: 'none' }
const disclaimer = { fontSize: '11px', color: '#5a7060', lineHeight: '1.5', margin: '0', textAlign: 'center' as const, fontStyle: 'italic' as const }

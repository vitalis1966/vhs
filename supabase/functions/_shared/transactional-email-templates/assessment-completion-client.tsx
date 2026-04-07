import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr, Img, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Vitalis Health Strategies'
const LOGO_URL = 'https://www.vitalisstrategies.com/vitalis-logo-email.png'

interface Props {
  full_name?: string
  assessment_title?: string
}

const AssessmentCompletionClientEmail = ({
  full_name = 'there',
  assessment_title = 'Strategic Assessment',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Montserrat:wght@400;500;600&display=swap');`}</style>
    </Head>
    <Preview>Thank you for completing your Vitalis Strategic Assessment</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img src={LOGO_URL} width="216" height="auto" alt={SITE_NAME} style={logoImg} />
        </Section>
        <Section style={goldBar} />

        <Section style={cardBody}>
          <Heading style={h2}>Your assessment is complete.</Heading>
          <Text style={bodyText}>Hi {full_name},</Text>
          <Text style={bodyText}>
            Thank you for completing your {assessment_title}. We have received your full responses
            and our advisory team will now conduct a structured review of your results.
          </Text>
          <Text style={bodyText}>Here is what happens next:</Text>
          <Text style={bodyText}>
            ① Our team reviews your assessment responses across all dimensions, identifying
            patterns, gaps, and priority areas.
          </Text>
          <Text style={bodyText}>
            ② We prepare a personalized practice health summary tailored to your responses
            — not a generic report.
          </Text>
          <Text style={bodyText}>
            ③ You will receive your Strategic Assessment Report within 24 hours. If we have
            any questions or need clarification, a member of our team will reach out directly.
          </Text>
          <Text style={bodyText}>
            In the meantime, if you have anything to add or questions, simply reply to this email.
          </Text>

          <Hr style={sageDivider} />

          {/* What to expect box */}
          <Section style={expectBlock}>
            <Text style={expectLabel}>WHAT TO EXPECT</Text>
            <Text style={expectItem}>• Your report will arrive within 24 hours</Text>
            <Text style={expectItem}>• Review will cover operations, revenue, growth, and strategic direction</Text>
            <Text style={expectItem}>• You may be contacted if we need clarification</Text>
            <Text style={{ ...expectItem, margin: '0' }}>• All responses are kept strictly confidential</Text>
          </Section>
        </Section>

        <Hr style={divider} />

        <Section style={contactBlock}>
          <Text style={contactCompany}>{SITE_NAME}</Text>
          <Text style={contactLocation}>Calgary, Alberta, Canada</Text>
          <Text style={contactLinks}>
            <Link href="mailto:info@vitalisstrategies.com" style={linkStyle}>info@vitalisstrategies.com</Link>
            {'   |   '}
            <Link href="https://vitalisstrategies.com" style={linkStyle}>vitalisstrategies.com</Link>
          </Text>
        </Section>

        <Section style={legalFooter}>
          <Text style={legalText}>
            This message and any information contained herein are confidential and intended solely
            for the use of the named recipient. It was sent in response to a strategic assessment
            completed at vitalisstrategies.com. If you did not complete this assessment or believe
            you received this email in error, please disregard it and contact us at info@vitalisstrategies.com.
          </Text>
          <Text style={{ ...legalText, marginTop: '10px' }}>
            {SITE_NAME} Inc. is committed to protecting your privacy. We do not share, sell, or
            disclose your personal information to third parties. Your submission is stored securely
            and used solely to respond to your inquiry. View our{' '}
            <Link href="https://vitalisstrategies.com/privacy" style={linkStyle}>Privacy Policy</Link>
          </Text>
          <Text style={{ ...legalText, marginTop: '8px' }}>
            © 2026 {SITE_NAME} Inc. All rights reserved. Calgary, Alberta, Canada
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AssessmentCompletionClientEmail,
  subject: 'Your Vitalis Strategic Assessment — Thank You',
  displayName: 'Assessment Completion — Client Thank You',
  previewData: {
    full_name: 'Dr. Sarah Chen',
    assessment_title: 'Performance Assessment',
  },
} satisfies TemplateEntry

/* ─── Styles ─── */
const main = { backgroundColor: '#f9f6f1', fontFamily: "'Montserrat', Arial, sans-serif", margin: '0', padding: '20px 0' }
const container = { maxWidth: '620px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' as const }
const header = { backgroundColor: '#ffffff', borderBottom: '2px solid #A9B1A1', padding: '28px 40px', textAlign: 'center' as const }
const logoImg = { margin: '0 auto', display: 'block' as const, maxWidth: '216px', width: '100%' as const }
const goldBar = { height: '4px', backgroundColor: '#c89741', margin: '0', padding: '0', lineHeight: '0' as const, fontSize: '0' as const }
const cardBody = { padding: '36px 40px' }
const h2 = { margin: '0 0 20px', color: '#264a39', fontSize: '24px', fontWeight: '600' as const, fontFamily: "'Playfair Display', Georgia, serif", lineHeight: '1.3' }
const bodyText = { fontSize: '15px', color: '#172620', lineHeight: '1.75', margin: '0 0 16px', fontFamily: "'Montserrat', Arial, sans-serif" }
const sageDivider = { border: 'none', borderTop: '2px solid #A9B1A1', margin: '0 0 20px' }
const expectBlock = { borderLeft: '4px solid #A9B1A1', backgroundColor: '#f9f6f1', padding: '16px 20px', borderRadius: '0 6px 6px 0', margin: '0 0 20px' }
const expectLabel = { fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#5a7060', margin: '0 0 10px', fontWeight: '600' as const, fontFamily: "'Montserrat', Arial, sans-serif" }
const expectItem = { fontSize: '14px', color: '#172620', lineHeight: '1.75', margin: '0 0 4px', fontFamily: "'Montserrat', Arial, sans-serif" }
const divider = { border: 'none', borderTop: '1px solid #dde4e0', margin: '0' }
const contactBlock = { padding: '24px 40px 16px', textAlign: 'center' as const }
const contactCompany = { fontSize: '13px', fontWeight: '700' as const, color: '#264a39', margin: '0 0 2px', fontFamily: "'Montserrat', Arial, sans-serif" }
const contactLocation = { fontSize: '12px', color: '#5a7060', margin: '0 0 6px', fontFamily: "'Montserrat', Arial, sans-serif" }
const contactLinks = { fontSize: '12px', color: '#5a7060', margin: '0', fontFamily: "'Montserrat', Arial, sans-serif" }
const linkStyle = { color: '#264a39', textDecoration: 'none' }
const legalFooter = { backgroundColor: '#f9f6f1', borderTop: '1px solid #dde4e0', padding: '20px 40px 28px' }
const legalText = { fontSize: '10px', color: '#8a9e92', lineHeight: '1.7', margin: '0', fontFamily: "'Montserrat', Arial, sans-serif" }

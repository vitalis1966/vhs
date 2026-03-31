import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Section, Hr, Img, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Vitalis Health Strategies'
const LOGO_URL = 'https://www.vitalisstrategies.com/vitalis-logo-email.png'

interface Props {
  full_name?: string
  email?: string
  organization_name?: string
  assessment_purpose?: string
  assessment_title?: string
  session_id?: string
  submitted_at?: string
}

const FieldRow = ({ label, children, isLast }: { label: string; children: React.ReactNode; isLast?: boolean }) => (
  <tr>
    <td style={{ ...fieldLabel, borderBottom: isLast ? 'none' : '1px solid #dde4e0' }}>{label}</td>
    <td style={{ ...fieldValue, borderBottom: isLast ? 'none' : '1px solid #dde4e0' }}>{children}</td>
  </tr>
)

const AssessmentCompletionInternalEmail = ({
  full_name = 'Unknown',
  email = '',
  organization_name,
  assessment_purpose,
  assessment_title = 'Strategic Assessment',
  session_id = '',
  submitted_at,
}: Props) => {
  const submittedDisplay = submitted_at
    ? new Date(submitted_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })

  const fields: Array<{ label: string; value: React.ReactNode }> = [
    { label: 'ASSESSMENT', value: <span style={{ fontWeight: '600' as const }}>{assessment_title}</span> },
    { label: 'NAME', value: <span style={{ fontWeight: '600' as const }}>{full_name}</span> },
    { label: 'EMAIL', value: <Link href={`mailto:${email}`} style={linkStyle}>{email}</Link> },
  ]
  if (organization_name) fields.push({ label: 'ORGANIZATION', value: organization_name })
  if (assessment_purpose) fields.push({ label: 'PURPOSE', value: assessment_purpose })
  fields.push({ label: 'SUBMITTED', value: submittedDisplay })
  fields.push({ label: 'SESSION ID', value: <code style={monoStyle}>{session_id}</code> })

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Montserrat:wght@400;500;600&display=swap');`}</style>
      </Head>
      <Preview>Assessment submitted by {full_name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img src={LOGO_URL} width="216" height="auto" alt={SITE_NAME} style={logoImg} />
          </Section>
          <Section style={goldBar} />

          <Section style={headingBlock}>
            <Heading style={h2}>Assessment Submission Received</Heading>
            <Text style={subtitleText}>{assessment_title} completed</Text>
          </Section>

          <Section style={tableSection}>
            <table width="100%" cellPadding="0" cellSpacing="0" style={table}>
              <tbody>
                {fields.map((field, i) => (
                  <FieldRow key={field.label} label={field.label} isLast={i === fields.length - 1}>
                    {field.value}
                  </FieldRow>
                ))}
              </tbody>
            </table>
          </Section>

          {/* Note box */}
          <Section style={noteBoxSection}>
            <Section style={noteBox}>
              <Text style={noteText}>
                This assessment is ready for review in the admin dashboard.
                The client expects their report within 24 hours.
              </Text>
            </Section>
          </Section>

          <Section style={ctaSection}>
            <Button href="https://vitalisstrategies.com/admin/submissions" style={ctaButton}>
              Review in Admin →
            </Button>
          </Section>

          <Hr style={sageDivider} />

          <Section style={footerBlock}>
            <Text style={footerCompany}>{SITE_NAME} Inc.</Text>
            <Text style={footerLinks}>
              Calgary, Alberta, Canada{'   |   '}
              <Link href="mailto:info@vitalisstrategies.com" style={linkStyle}>info@vitalisstrategies.com</Link>
              {'   |   '}
              <Link href="https://vitalisstrategies.com" style={linkStyle}>vitalisstrategies.com</Link>
            </Text>
            <Text style={legalText}>
              CONFIDENTIAL — This message is intended solely for authorized personnel of {SITE_NAME} Inc.
              It was generated automatically from an assessment submission on vitalisstrategies.com
              and contains personal information submitted by a prospective client. Do not forward, copy,
              or share without authorization. If received in error, delete immediately and contact info@vitalisstrategies.com.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: AssessmentCompletionInternalEmail,
  subject: (data: Record<string, any>) =>
    `Assessment Submitted — ${data.full_name || 'Unknown'} · ${data.assessment_title || 'Strategic Assessment'}`,
  to: 'info@vitalisstrategies.com',
  displayName: 'Assessment Completion — Internal Notification',
  previewData: {
    full_name: 'Dr. Sarah Chen',
    email: 'sarah.chen@example.com',
    organization_name: 'Mountain View Dental',
    assessment_purpose: 'building_new_clinic',
    assessment_title: 'Build Strategy Assessment',
    session_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    submitted_at: new Date().toISOString(),
  },
} satisfies TemplateEntry

/* ─── Styles ─── */
const main = { backgroundColor: '#f9f6f1', fontFamily: "'Montserrat', Arial, sans-serif", margin: '0', padding: '20px 0' }
const container = { maxWidth: '620px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' as const }
const header = { backgroundColor: '#ffffff', borderBottom: '2px solid #A9B1A1', padding: '28px 40px', textAlign: 'center' as const }
const logoImg = { margin: '0 auto', display: 'block' as const, maxWidth: '216px', width: '100%' as const }
const goldBar = { height: '4px', backgroundColor: '#c89741', margin: '0', padding: '0', lineHeight: '0' as const, fontSize: '0' as const }
const headingBlock = { padding: '28px 40px 12px' }
const h2 = { margin: '0 0 6px', color: '#264a39', fontSize: '22px', fontWeight: '600' as const, fontFamily: "'Playfair Display', Georgia, serif", lineHeight: '1.3' }
const subtitleText = { fontSize: '12px', color: '#5a7060', margin: '6px 0 0', fontFamily: "'Montserrat', Arial, sans-serif" }
const tableSection = { padding: '8px 40px 20px' }
const table = { width: '100%' as const, borderCollapse: 'collapse' as const }
const fieldLabel = { padding: '12px 0', fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#5a7060', width: '140px', verticalAlign: 'top' as const, fontWeight: '600' as const, fontFamily: "'Montserrat', Arial, sans-serif" }
const fieldValue = { padding: '12px 0', fontSize: '15px', color: '#172620', verticalAlign: 'top' as const, fontFamily: "'Montserrat', Arial, sans-serif", lineHeight: '1.5' }
const linkStyle = { color: '#264a39', textDecoration: 'none' }
const monoStyle = { fontSize: '12px', fontFamily: "'Courier New', monospace", color: '#5a7060' }
const noteBoxSection = { padding: '0 40px 24px' }
const noteBox = { backgroundColor: '#dde4e0', padding: '16px', borderRadius: '6px' }
const noteText = { fontSize: '14px', color: '#172620', lineHeight: '1.6', margin: '0', fontFamily: "'Montserrat', Arial, sans-serif" }
const ctaSection = { padding: '0 40px 32px', textAlign: 'center' as const }
const ctaButton = { backgroundColor: '#264a39', color: '#ffffff', textDecoration: 'none', padding: '13px 28px', borderRadius: '6px', fontSize: '13px', fontWeight: '600' as const, display: 'inline-block', fontFamily: "'Montserrat', Arial, sans-serif" }
const sageDivider = { border: 'none', borderTop: '1px solid #dde4e0', margin: '0' }
const footerBlock = { backgroundColor: '#f9f6f1', padding: '24px 40px' }
const footerCompany = { fontSize: '12px', fontWeight: '700' as const, color: '#264a39', margin: '0 0 4px', fontFamily: "'Montserrat', Arial, sans-serif" }
const footerLinks = { fontSize: '11px', color: '#5a7060', margin: '0 0 16px', fontFamily: "'Montserrat', Arial, sans-serif" }
const legalText = { fontSize: '10px', color: '#8a9e92', lineHeight: '1.7', margin: '0', fontFamily: "'Montserrat', Arial, sans-serif" }

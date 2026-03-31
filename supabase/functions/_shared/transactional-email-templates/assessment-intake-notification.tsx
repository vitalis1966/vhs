import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Section, Hr, Img, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Vitalis Health Strategies'
const LOGO_URL = 'https://www.vitalisstrategies.com/vitalis-logo-email.png'

const PATH_LABELS: Record<string, string> = {
  'new_clinic_build': 'Build Strategy Assessment',
  'new-build': 'Build Strategy Assessment',
  'existing_clinic': 'Performance Assessment',
  'existing': 'Performance Assessment',
  'healthcare_it': 'Healthcare IT Assessment',
  'healthcare-it': 'Healthcare IT Assessment',
}

interface Props {
  full_name?: string
  email?: string
  phone?: string
  organization_name?: string
  city?: string
  province_state?: string
  specialty?: string
  practice_type?: string
  assessment_purpose?: string
  approximate_timeline?: string
  looking_for?: string
  additional_notes?: string
  assigned_track?: string
}

const FieldRow = ({ label, children, isLast }: { label: string; children: React.ReactNode; isLast?: boolean }) => (
  <tr>
    <td style={{ ...fieldLabel, borderBottom: isLast ? 'none' : '1px solid #dde4e0' }}>{label}</td>
    <td style={{ ...fieldValue, borderBottom: isLast ? 'none' : '1px solid #dde4e0' }}>{children}</td>
  </tr>
)

const AssessmentIntakeNotificationEmail = ({
  full_name = 'Unknown',
  email = '',
  phone,
  organization_name,
  city,
  province_state,
  specialty,
  practice_type,
  assessment_purpose = '',
  approximate_timeline,
  looking_for,
  additional_notes,
  assigned_track,
}: Props) => {
  const pathLabel = PATH_LABELS[assigned_track || ''] || 'General (not specified)'
  const cityProvince = [city, province_state].filter(Boolean).join(', ') || null

  const fields: Array<{ label: string; value: React.ReactNode }> = [
    { label: 'ASSESSMENT PATH', value: <span style={sageBadge}>{pathLabel}</span> },
    { label: 'NAME', value: <span style={{ fontWeight: '600' as const }}>{full_name}</span> },
    { label: 'EMAIL', value: <Link href={`mailto:${email}`} style={linkStyle}>{email}</Link> },
  ]
  if (phone) fields.push({ label: 'PHONE', value: phone })
  if (organization_name) fields.push({ label: 'ORGANIZATION', value: organization_name })
  if (cityProvince) fields.push({ label: 'CITY / PROVINCE', value: cityProvince })
  if (specialty) fields.push({ label: 'SPECIALTY', value: specialty })
  if (practice_type) fields.push({ label: 'PRACTICE TYPE', value: practice_type })
  fields.push({ label: 'PURPOSE', value: assessment_purpose })
  if (approximate_timeline) fields.push({ label: 'TIMELINE', value: approximate_timeline })
  if (looking_for) fields.push({ label: 'LOOKING FOR', value: looking_for })
  if (additional_notes) fields.push({ label: 'NOTES', value: <span style={{ whiteSpace: 'pre-wrap' as const }}>{additional_notes}</span> })

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Montserrat:wght@400;500;600&display=swap');`}</style>
      </Head>
      <Preview>New assessment intake from {full_name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img src={LOGO_URL} width="216" height="auto" alt={SITE_NAME} style={logoImg} />
          </Section>
          <Section style={goldBar} />

          <Section style={headingBlock}>
            <Heading style={h2}>New Strategic Assessment Intake</Heading>
            <Text style={subtitleText}>Submitted via vitalisstrategies.com</Text>
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

          <Section style={ctaSection}>
            <Button
              href={`mailto:${email}?subject=${encodeURIComponent('Re: Your Strategic Assessment Intake')}`}
              style={ctaButton}
            >
              Reply to {full_name} →
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
              It was generated automatically from a strategic assessment intake submission on vitalisstrategies.com
              and contains personal information submitted by a prospective client. Do not forward, copy, or share
              without authorization. If received in error, delete immediately and contact info@vitalisstrategies.com.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: AssessmentIntakeNotificationEmail,
  subject: (data: Record<string, any>) =>
    `New Assessment Intake — ${data.full_name || 'Unknown'} · ${data.assessment_purpose || 'Strategic Assessment'}`,
  to: 'info@vitalisstrategies.com',
  displayName: 'Assessment Intake — Internal Notification',
  previewData: {
    full_name: 'Dr. Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '+1 (403) 555-0199',
    organization_name: 'Mountain View Dental',
    city: 'Calgary',
    province_state: 'Alberta',
    specialty: 'Dental',
    practice_type: 'Group practice',
    assessment_purpose: 'building_new_clinic',
    approximate_timeline: 'Within 3 months',
    looking_for: 'Help planning our second location',
    assigned_track: 'new_clinic_build',
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
const tableSection = { padding: '8px 40px 28px' }
const table = { width: '100%' as const, borderCollapse: 'collapse' as const }
const fieldLabel = { padding: '12px 0', fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#5a7060', width: '140px', verticalAlign: 'top' as const, fontWeight: '600' as const, fontFamily: "'Montserrat', Arial, sans-serif" }
const fieldValue = { padding: '12px 0', fontSize: '15px', color: '#172620', verticalAlign: 'top' as const, fontFamily: "'Montserrat', Arial, sans-serif", lineHeight: '1.5' }
const linkStyle = { color: '#264a39', textDecoration: 'none' }
const sageBadge = { display: 'inline-block' as const, backgroundColor: '#A9B1A1', color: '#ffffff', fontSize: '12px', fontWeight: '600' as const, padding: '4px 12px', borderRadius: '20px' }
const ctaSection = { padding: '0 40px 32px', textAlign: 'center' as const }
const ctaButton = { backgroundColor: '#264a39', color: '#ffffff', textDecoration: 'none', padding: '13px 28px', borderRadius: '6px', fontSize: '13px', fontWeight: '600' as const, display: 'inline-block', fontFamily: "'Montserrat', Arial, sans-serif" }
const sageDivider = { border: 'none', borderTop: '1px solid #dde4e0', margin: '0' }
const footerBlock = { backgroundColor: '#f9f6f1', padding: '24px 40px' }
const footerCompany = { fontSize: '12px', fontWeight: '700' as const, color: '#264a39', margin: '0 0 4px', fontFamily: "'Montserrat', Arial, sans-serif" }
const footerLinks = { fontSize: '11px', color: '#5a7060', margin: '0 0 16px', fontFamily: "'Montserrat', Arial, sans-serif" }
const legalText = { fontSize: '10px', color: '#8a9e92', lineHeight: '1.7', margin: '0', fontFamily: "'Montserrat', Arial, sans-serif" }

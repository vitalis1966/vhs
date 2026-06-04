import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Html, Preview, Text, Section, Hr } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const LOGO_URL = 'https://www.vitalisstrategies.com/vitalis-logo-email.png'

interface BreakdownRow { activity: string; allocated: string; used: string; remaining: string }

interface Props {
  client_name?: string
  threshold?: number
  scope?: string // 'Total' or activity-type name
  used_hours?: string
  contracted_hours?: string
  decimal_used?: string
  decimal_contracted?: string
  breakdown?: BreakdownRow[]
}

const BudgetAlertEmail = ({
  client_name = 'Client',
  threshold = 75,
  scope = 'Total',
  used_hours = '0h',
  contracted_hours = '0h',
  decimal_used = '0.00',
  decimal_contracted = '0.00',
  breakdown,
}: Props) => {
  const isCritical = threshold >= 100
  const heading = isCritical
    ? `Contracted hours reached — ${client_name}`
    : `Heads up — ${client_name} approaching contracted hours limit`
  const intro = isCritical
    ? `The contracted hours for ${client_name} have been reached and additional work may be out of scope.`
    : `${client_name} has used ${threshold}% of contracted ${scope.toLowerCase()} hours. ${used_hours} used of ${contracted_hours} contracted. Please review.`

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{heading}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <img src={LOGO_URL} alt="Vitalis" width="140" style={{ display: 'block' }} />
          </Section>
          <Section style={accent} />
          <Section style={content}>
            <Heading style={h1}>{heading}</Heading>
            <Text style={p}>{intro}</Text>

            <Section style={statBox}>
              <Text style={statLabel}>Total contracted</Text>
              <Text style={statValue}>{contracted_hours} <span style={dim}>({decimal_contracted})</span></Text>
              <Text style={statLabel}>Total used</Text>
              <Text style={statValue}>{used_hours} <span style={dim}>({decimal_used})</span></Text>
            </Section>

            {breakdown && breakdown.length > 0 && (
              <>
                <Hr style={hr} />
                <Text style={sectionLabel}>Activity breakdown</Text>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={th}>Activity</th>
                      <th style={th}>Allocated</th>
                      <th style={th}>Used</th>
                      <th style={th}>Remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.map((r, i) => (
                      <tr key={i}>
                        <td style={td}>{r.activity}</td>
                        <td style={td}>{r.allocated}</td>
                        <td style={td}>{r.used}</td>
                        <td style={td}>{r.remaining}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            <Hr style={hr} />
            <Text style={pSmall}>Please review the engagement scope and contact the client to discuss next steps.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: BudgetAlertEmail,
  subject: (data: Record<string, any>) => {
    const t = Number(data?.threshold ?? 75)
    const name = data?.client_name ?? 'Client'
    if (t >= 100) return `Contracted hours reached — ${name}`
    return `Heads up — ${name} approaching contracted hours limit`
  },
  displayName: 'Budget Alert',
  previewData: {
    client_name: 'Elante Rejuvenation',
    threshold: 90,
    scope: 'Total',
    used_hours: '90h 0m',
    contracted_hours: '100h 0m',
    decimal_used: '90.00h',
    decimal_contracted: '100.00h',
    breakdown: [
      { activity: 'Strategy & Advisory', allocated: '40h 0m', used: '38h 0m', remaining: '2h 0m' },
      { activity: 'Operations', allocated: '30h 0m', used: '28h 0m', remaining: '2h 0m' },
    ],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }
const container = { maxWidth: '560px', margin: '0 auto', backgroundColor: '#ffffff' }
const header = { padding: '24px 32px 16px', borderBottom: '2px solid #dde4e0' }
const accent = { height: '4px', backgroundColor: '#C89741' }
const content = { padding: '28px 32px 32px' }
const h1 = { color: '#172620', fontSize: '22px', margin: '0 0 12px', fontWeight: 600 }
const p = { color: '#3a4541', fontSize: '14px', lineHeight: '22px', margin: '0 0 12px' }
const pSmall = { color: '#6b7370', fontSize: '12px', lineHeight: '18px', margin: '12px 0 0' }
const sectionLabel = { color: '#172620', fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '12px 0 6px', fontWeight: 600 }
const statBox = { background: '#f5f8f6', borderLeft: '3px solid #60766B', padding: '12px 16px', margin: '16px 0' }
const statLabel = { color: '#6b7370', fontSize: '11px', margin: '4px 0 0', textTransform: 'uppercase' as const }
const statValue = { color: '#172620', fontSize: '16px', margin: '2px 0 6px', fontWeight: 600 }
const dim = { color: '#6b7370', fontSize: '13px', fontWeight: 400 }
const hr = { borderColor: '#dde4e0', margin: '16px 0' }
const th = { textAlign: 'left' as const, padding: '6px 8px', borderBottom: '1px solid #dde4e0', fontSize: '11px', color: '#6b7370', textTransform: 'uppercase' as const }
const td = { padding: '6px 8px', borderBottom: '1px solid #f0f3f1', fontSize: '13px', color: '#3a4541' }

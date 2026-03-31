import { createClient } from 'npm:@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('VHS_Website')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const FROM = 'Vitalis Health Strategies <info@mail.vitalisstrategies.com>'
const REPLY_TO = 'info@vitalisstrategies.com'
const INTERNAL_TO = 'info@vitalisstrategies.com'
const LOGO_URL = 'https://vitalisstrategies.com/vitalis-logo-email.png'

const PATH_LABELS: Record<string, string> = {
  'new_clinic_build': 'Build Strategy Assessment',
  'new-build': 'Build Strategy Assessment',
  'existing_clinic': 'Performance Assessment',
  'existing': 'Performance Assessment',
  'healthcare_it': 'Healthcare IT Assessment',
  'healthcare-it': 'Healthcare IT Assessment',
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function nl2br(s: string): string {
  return esc(s).replace(/\n/g, '<br/>')
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: REPLY_TO, subject, html }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Resend error: ${res.status} ${err}`)
  }
  return res.json()
}

function fieldRow(label: string, value: string | null | undefined, isLink = false): string {
  if (!value) return ''
  const cellStyle = 'padding:12px 0;font-size:15px;color:#172620;vertical-align:top;font-family:\'Montserrat\',Arial,sans-serif;line-height:1.5;border-bottom:1px solid #dde4e0;'
  const labelStyle = 'padding:12px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#5a7060;width:140px;vertical-align:top;font-weight:600;font-family:\'Montserrat\',Arial,sans-serif;border-bottom:1px solid #dde4e0;'
  const content = isLink
    ? `<a href="mailto:${esc(value)}" style="color:#264a39;text-decoration:none;">${esc(value)}</a>`
    : esc(value)
  return `<tr><td style="${labelStyle}">${label}</td><td style="${cellStyle}">${content}</td></tr>`
}

function badgeRow(label: string, value: string): string {
  const labelStyle = 'padding:12px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#5a7060;width:140px;vertical-align:top;font-weight:600;font-family:\'Montserrat\',Arial,sans-serif;border-bottom:1px solid #dde4e0;'
  const cellStyle = 'padding:12px 0;font-size:15px;color:#172620;vertical-align:top;font-family:\'Montserrat\',Arial,sans-serif;line-height:1.5;border-bottom:1px solid #dde4e0;'
  return `<tr><td style="${labelStyle}">${label}</td><td style="${cellStyle}"><span style="display:inline-block;background-color:#A9B1A1;color:#ffffff;font-size:12px;font-weight:600;padding:4px 12px;border-radius:20px;">${value}</span></td></tr>`
}

function buildHtml(d: Record<string, any>): string {
  const pathLabel = PATH_LABELS[d.assigned_track] || PATH_LABELS[d.assessment_path] || 'General (not specified)'
  const cityProvince = [d.city, d.province_state].filter(Boolean).join(', ') || null
  const replySubject = encodeURIComponent('Re: Your Strategic Assessment Intake')

  let rows = ''
  rows += badgeRow('ASSESSMENT PATH', pathLabel)
  rows += fieldRow('NAME', d.full_name)
  rows += fieldRow('EMAIL', d.email, true)
  rows += fieldRow('PHONE', d.phone)
  rows += fieldRow('ORGANIZATION', d.organization_name)
  rows += fieldRow('CITY / PROVINCE', cityProvince)
  rows += fieldRow('SPECIALTY', d.specialty)
  rows += fieldRow('PRACTICE TYPE', d.practice_type)
  rows += fieldRow('PURPOSE', d.assessment_purpose)
  rows += fieldRow('TIMELINE', d.approximate_timeline)
  rows += fieldRow('LOOKING FOR', d.looking_for)
  if (d.additional_notes) {
    rows += `<tr><td style="padding:16px 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#5a7060;width:140px;vertical-align:top;font-weight:600;font-family:'Montserrat',Arial,sans-serif;">NOTES</td><td style="padding:16px 0 12px;font-size:15px;color:#172620;vertical-align:top;font-family:'Montserrat',Arial,sans-serif;line-height:1.75;white-space:pre-wrap;">${nl2br(d.additional_notes)}</td></tr>`
  }

  return [
    '<!DOCTYPE html><html lang="en" dir="ltr"><head><meta charset="utf-8"/>',
    '<meta name="viewport" content="width=device-width,initial-scale=1"/>',
    "<style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Montserrat:wght@400;500;600&display=swap');</style>",
    "</head><body style=\"margin:0;padding:20px 0;background-color:#f9f6f1;font-family:'Montserrat',Arial,sans-serif;\">",
    `<div style="display:none;overflow:hidden;max-height:0;">New assessment intake from ${esc(d.full_name)}</div>`,
    '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f6f1;"><tr><td align="center">',
    '<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">',
    // Header
    '<tr><td style="background-color:#ffffff;border-bottom:2px solid #A9B1A1;padding:28px 40px;text-align:center;">',
    `<img src="${LOGO_URL}" alt="Vitalis Health Strategies" width="216" height="auto" style="display:block;margin:0 auto;max-width:216px;border:0;outline:none;text-decoration:none;"/>`,
    '</td></tr>',
    // Gold bar
    '<tr><td style="height:4px;background-color:#c89741;font-size:0;line-height:0;">&nbsp;</td></tr>',
    // Heading
    '<tr><td style="padding:28px 40px 12px;">',
    `<h2 style="margin:0 0 6px;color:#264a39;font-size:22px;font-weight:600;font-family:'Playfair Display',Georgia,serif;line-height:1.3;">New Strategic Assessment Intake</h2>`,
    `<p style="font-size:12px;color:#5a7060;margin:6px 0 0;font-family:'Montserrat',Arial,sans-serif;">Submitted via vitalisstrategies.com</p>`,
    '</td></tr>',
    // Fields
    '<tr><td style="padding:8px 40px 28px;">',
    `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>`,
    '</td></tr>',
    // CTA
    '<tr><td style="padding:0 40px 32px;text-align:center;">',
    `<a href="mailto:${esc(d.email)}?subject=${replySubject}" style="background-color:#264a39;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:6px;font-size:13px;font-weight:600;display:inline-block;font-family:'Montserrat',Arial,sans-serif;">Reply to ${esc(d.full_name)} →</a>`,
    '</td></tr>',
    // Divider
    '<tr><td><hr style="border:none;border-top:1px solid #dde4e0;margin:0;"/></td></tr>',
    // Footer
    '<tr><td style="background-color:#f9f6f1;padding:24px 40px;">',
    `<p style="font-size:12px;font-weight:700;color:#264a39;margin:0 0 4px;font-family:'Montserrat',Arial,sans-serif;">Vitalis Health Strategies Inc.</p>`,
    `<p style="font-size:11px;color:#5a7060;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">Calgary, Alberta, Canada&nbsp;&nbsp;|&nbsp;&nbsp;<a href="mailto:info@vitalisstrategies.com" style="color:#264a39;text-decoration:none;">info@vitalisstrategies.com</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="https://vitalisstrategies.com" style="color:#264a39;text-decoration:none;">vitalisstrategies.com</a></p>`,
    `<p style="font-size:10px;color:#8a9e92;line-height:1.7;margin:0;font-family:'Montserrat',Arial,sans-serif;">CONFIDENTIAL — This message is intended solely for authorized personnel of Vitalis Health Strategies Inc. It was generated automatically from a strategic assessment intake submission on vitalisstrategies.com and contains personal information submitted by a prospective client. Do not forward, copy, or share without authorization. If received in error, delete immediately and contact info@vitalisstrategies.com.</p>`,
    '</td></tr>',
    '</table></td></tr></table></body></html>',
  ].join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json()
    const { full_name, email, assessment_purpose } = body

    if (!full_name || !email) {
      return new Response(JSON.stringify({ error: 'full_name and email are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const purposeLabel = assessment_purpose || 'Strategic Assessment'
    await sendEmail(
      INTERNAL_TO,
      `New Assessment Intake — ${full_name} · ${purposeLabel}`,
      buildHtml(body),
    )

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('send-assessment-intake-notification error:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

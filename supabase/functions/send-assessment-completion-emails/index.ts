import { createClient } from 'npm:@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('VHS_Website')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const FROM = 'Vitalis Health Strategies <info@vitalisstrategies.com>'
const REPLY_TO = 'info@vitalisstrategies.com'
const INTERNAL_TO = 'info@vitalisstrategies.com'
const LOGO_URL = 'https://vitalisstrategies.com/vitalis-logo-email.png'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
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

function wrapEmail(previewText: string, bodyContent: string): string {
  return [
    '<!DOCTYPE html><html lang="en" dir="ltr"><head><meta charset="utf-8"/>',
    '<meta name="viewport" content="width=device-width,initial-scale=1"/>',
    "<style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Montserrat:wght@400;500;600&display=swap');</style>",
    "</head><body style=\"margin:0;padding:20px 0;background-color:#f9f6f1;font-family:'Montserrat',Arial,sans-serif;\">",
    `<div style="display:none;overflow:hidden;max-height:0;">${esc(previewText)}</div>`,
    '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f6f1;"><tr><td align="center">',
    '<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">',
    '<tr><td style="background-color:#ffffff;border-bottom:2px solid #A9B1A1;padding:28px 40px;text-align:center;">',
    `<img src="${LOGO_URL}" alt="Vitalis Health Strategies" width="216" height="auto" style="display:block;margin:0 auto;max-width:216px;border:0;outline:none;text-decoration:none;"/>`,
    '</td></tr>',
    '<tr><td style="height:4px;background-color:#c89741;font-size:0;line-height:0;">&nbsp;</td></tr>',
    bodyContent,
    '</table></td></tr></table></body></html>',
  ].join('')
}

function buildClientHtml(intake: { full_name: string; email: string }, assessmentTitle: string): string {
  const body = `
<!-- Body -->
<tr><td style="padding:36px 40px;">
  <h2 style="margin:0 0 20px;color:#264a39;font-size:24px;font-weight:600;font-family:'Playfair Display',Georgia,serif;line-height:1.3;">Your assessment is complete.</h2>
  <p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">Hi ${esc(intake.full_name)},</p>
  <p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">Thank you for completing your ${esc(assessmentTitle)}. We have received your full responses and our advisory team will now conduct a structured review of your results.</p>
  <p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 8px;font-family:'Montserrat',Arial,sans-serif;">Here is what happens next:</p>
  <p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 6px;font-family:'Montserrat',Arial,sans-serif;">① Our team reviews your assessment responses across all dimensions, identifying patterns, gaps, and priority areas.</p>
  <p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 6px;font-family:'Montserrat',Arial,sans-serif;">② We prepare a personalized practice health summary tailored to your responses — not a generic report.</p>
  <p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">③ You will receive your Strategic Assessment Report within 24 hours. If we have any questions or need clarification, a member of our team will reach out directly.</p>
  <p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 20px;font-family:'Montserrat',Arial,sans-serif;">In the meantime, if you have anything to add or questions, simply reply to this email.</p>
  <!-- Sage divider -->
  <hr style="border:none;border-top:2px solid #A9B1A1;margin:0 0 20px;"/>
  <!-- What to expect box -->
  <div style="border-left:4px solid #A9B1A1;background-color:#f9f6f1;padding:16px 20px;border-radius:0 6px 6px 0;margin:0 0 20px;">
    <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#5a7060;margin:0 0 10px;font-weight:600;font-family:'Montserrat',Arial,sans-serif;">WHAT TO EXPECT</p>
    <p style="font-size:14px;color:#172620;line-height:1.75;margin:0 0 4px;font-family:'Montserrat',Arial,sans-serif;">• Your report will arrive within 24 hours</p>
    <p style="font-size:14px;color:#172620;line-height:1.75;margin:0 0 4px;font-family:'Montserrat',Arial,sans-serif;">• Review will cover operations, revenue, growth, and strategic direction</p>
    <p style="font-size:14px;color:#172620;line-height:1.75;margin:0 0 4px;font-family:'Montserrat',Arial,sans-serif;">• You may be contacted if we need clarification</p>
    <p style="font-size:14px;color:#172620;line-height:1.75;margin:0;font-family:'Montserrat',Arial,sans-serif;">• All responses are kept strictly confidential</p>
  </div>
</td></tr>
<!-- Divider -->
<tr><td><hr style="border:none;border-top:1px solid #dde4e0;margin:0;"/></td></tr>
<!-- Contact block -->
<tr><td style="padding:24px 40px 16px;text-align:center;">
  <p style="font-size:13px;font-weight:700;color:#264a39;margin:0 0 2px;font-family:'Montserrat',Arial,sans-serif;">Vitalis Health Strategies</p>
  <p style="font-size:12px;color:#5a7060;margin:0 0 6px;font-family:'Montserrat',Arial,sans-serif;">Calgary, Alberta, Canada</p>
  <p style="font-size:12px;color:#5a7060;margin:0;font-family:'Montserrat',Arial,sans-serif;"><a href="mailto:info@vitalisstrategies.com" style="color:#264a39;text-decoration:none;">info@vitalisstrategies.com</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="https://vitalisstrategies.com" style="color:#264a39;text-decoration:none;">vitalisstrategies.com</a></p>
</td></tr>
<!-- Legal footer -->
<tr><td style="background-color:#f9f6f1;border-top:1px solid #dde4e0;padding:20px 40px 28px;">
  <p style="font-size:10px;color:#8a9e92;line-height:1.7;margin:0;font-family:'Montserrat',Arial,sans-serif;">This message and any information contained herein are confidential and intended solely for the use of the named recipient. It was sent in response to a strategic assessment completed at vitalisstrategies.com. If you did not complete this assessment or believe you received this email in error, please disregard it and contact us at info@vitalisstrategies.com.</p>
  <p style="font-size:10px;color:#8a9e92;line-height:1.7;margin:10px 0 0;font-family:'Montserrat',Arial,sans-serif;">Vitalis Health Strategies Inc. is committed to protecting your privacy. We do not share, sell, or disclose your personal information to third parties. Your submission is stored securely and used solely to respond to your inquiry. View our <a href="https://vitalisstrategies.com/privacy" style="color:#264a39;text-decoration:none;">Privacy Policy</a></p>
  <p style="font-size:10px;color:#8a9e92;line-height:1.7;margin:8px 0 0;font-family:'Montserrat',Arial,sans-serif;">&copy; 2026 Vitalis Health Strategies Inc. All rights reserved. Calgary, Alberta, Canada</p>
</td></tr>`

  return wrapEmail('Thank you for completing your Vitalis Strategic Assessment', body)
}

function buildInternalHtml(intake: Record<string, any>, assessmentTitle: string, sessionId: string): string {
  const now = new Date()
  const submitted = now.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Edmonton',
    timeZoneName: 'short',
  })

  const labelStyle = "padding:12px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#5a7060;width:140px;vertical-align:top;font-weight:600;font-family:'Montserrat',Arial,sans-serif;border-bottom:1px solid #dde4e0;"
  const cellStyle = "padding:12px 0;font-size:15px;color:#172620;vertical-align:top;font-family:'Montserrat',Arial,sans-serif;line-height:1.5;border-bottom:1px solid #dde4e0;"

  let rows = ''
  rows += `<tr><td style="${labelStyle}">ASSESSMENT</td><td style="${cellStyle};font-weight:600;">${esc(assessmentTitle)}</td></tr>`
  rows += `<tr><td style="${labelStyle}">NAME</td><td style="${cellStyle};font-weight:600;">${esc(intake.full_name)}</td></tr>`
  rows += `<tr><td style="${labelStyle}">EMAIL</td><td style="${cellStyle}"><a href="mailto:${esc(intake.email)}" style="color:#264a39;text-decoration:none;">${esc(intake.email)}</a></td></tr>`
  if (intake.organization_name) {
    rows += `<tr><td style="${labelStyle}">ORGANIZATION</td><td style="${cellStyle}">${esc(intake.organization_name)}</td></tr>`
  }
  if (intake.assessment_purpose) {
    rows += `<tr><td style="${labelStyle}">PURPOSE</td><td style="${cellStyle}">${esc(intake.assessment_purpose)}</td></tr>`
  }
  rows += `<tr><td style="${labelStyle}">SUBMITTED</td><td style="${cellStyle}">${esc(submitted)}</td></tr>`
  rows += `<tr><td style="${labelStyle}">SESSION ID</td><td style="${cellStyle}"><code style="font-size:12px;font-family:'Courier New',monospace;color:#5a7060;">${esc(sessionId)}</code></td></tr>`

  const body = `
<tr><td style="padding:28px 40px 12px;">
  <h2 style="margin:0 0 6px;color:#264a39;font-size:22px;font-weight:600;font-family:'Playfair Display',Georgia,serif;line-height:1.3;">Assessment Submission Received</h2>
  <p style="font-size:12px;color:#5a7060;margin:6px 0 0;font-family:'Montserrat',Arial,sans-serif;">${esc(assessmentTitle)} completed</p>
</td></tr>
<tr><td style="padding:8px 40px 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>
</td></tr>
<!-- Note box -->
<tr><td style="padding:0 40px 24px;">
  <div style="background-color:#dde4e0;padding:16px;border-radius:6px;">
    <p style="font-size:14px;color:#172620;line-height:1.6;margin:0;font-family:'Montserrat',Arial,sans-serif;">This assessment is ready for review in the admin dashboard. The client expects their report within 24 hours.</p>
  </div>
</td></tr>
<!-- CTA -->
<tr><td style="padding:0 40px 32px;text-align:center;">
  <a href="https://vitalisstrategies.com/admin/submissions" style="background-color:#264a39;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:6px;font-size:13px;font-weight:600;display:inline-block;font-family:'Montserrat',Arial,sans-serif;">Review in Admin →</a>
</td></tr>
<tr><td><hr style="border:none;border-top:1px solid #dde4e0;margin:0;"/></td></tr>
<tr><td style="background-color:#f9f6f1;padding:24px 40px;">
  <p style="font-size:12px;font-weight:700;color:#264a39;margin:0 0 4px;font-family:'Montserrat',Arial,sans-serif;">Vitalis Health Strategies Inc.</p>
  <p style="font-size:11px;color:#5a7060;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">Calgary, Alberta, Canada&nbsp;&nbsp;|&nbsp;&nbsp;<a href="mailto:info@vitalisstrategies.com" style="color:#264a39;text-decoration:none;">info@vitalisstrategies.com</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="https://vitalisstrategies.com" style="color:#264a39;text-decoration:none;">vitalisstrategies.com</a></p>
  <p style="font-size:10px;color:#8a9e92;line-height:1.7;margin:0;font-family:'Montserrat',Arial,sans-serif;">CONFIDENTIAL — This message is intended solely for authorized personnel of Vitalis Health Strategies Inc. It was generated automatically from an assessment submission on vitalisstrategies.com and contains personal information submitted by a prospective client. Do not forward, copy, or share without authorization. If received in error, delete immediately and contact info@vitalisstrategies.com.</p>
</td></tr>`

  return wrapEmail(`Assessment submitted by ${intake.full_name}`, body)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { session_id, intake_id, assessment_title, assessment_slug } = await req.json()

    if (!session_id || !intake_id) {
      return new Response(JSON.stringify({ error: 'session_id and intake_id are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Fetch intake details
    const { data: intake, error: intakeErr } = await supabase
      .from('assessment_intakes')
      .select('full_name, email, organization_name, assessment_purpose')
      .eq('id', intake_id)
      .single()

    if (intakeErr || !intake) {
      return new Response(JSON.stringify({ error: 'Intake not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const title = assessment_title || 'Strategic Assessment'

    // EMAIL A — Client thank-you
    await sendEmail(
      intake.email,
      'Your Vitalis Strategic Assessment — Thank You',
      buildClientHtml(intake, title),
    )

    // EMAIL B — Internal notification
    await sendEmail(
      INTERNAL_TO,
      `Assessment Submitted — ${intake.full_name} · ${title}`,
      buildInternalHtml(intake, title, session_id),
    )

    // Log to email_events
    await supabase.from('email_events').insert([
      {
        session_id,
        intake_id,
        email_type: 'completion_client_thankyou',
        recipient_email: intake.email,
        status: 'sent',
        sent_at: new Date().toISOString(),
      },
      {
        session_id,
        intake_id,
        email_type: 'completion_internal_notification',
        recipient_email: INTERNAL_TO,
        status: 'sent',
        sent_at: new Date().toISOString(),
      },
    ])

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('send-assessment-completion-emails error:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('VHS_Website') || Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const FROM = 'Vitalis Health Strategies <info@mail.vitalisstrategies.com>'
const REPLY_TO = 'info@vitalisstrategies.com'
const LOGO_URL = 'https://vitalisstrategies.com/vitalis-logo-email.png'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

async function sendViaResend(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    throw new Error('No Resend API key found (checked VHS_Website and RESEND_API_KEY)')
  }
  console.log('sendViaResend: calling Resend API', { to, subject: subject.substring(0, 60), apiKeyPresent: !!RESEND_API_KEY })
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: REPLY_TO, subject, html }),
  })
  const data = await res.json()
  console.log('Resend response:', JSON.stringify({ status: res.status, ok: res.ok, data }))
  if (!res.ok) {
    throw new Error(`Resend error ${res.status}: ${data?.message || JSON.stringify(data)}`)
  }
  return data
}

// ─── Email templates ───

function buildClientReportHtml(data: { client_name: string; organization?: string; message_body: string; report_url: string; report_sections?: string[] }): string {
  const clientName = esc(data.client_name)
  const org = data.organization ? esc(data.organization) : ''
  const messageHtml = esc(data.message_body).replace(/\n/g, '<br/>')

  const sections = data.report_sections || [
    'Executive Summary',
    'Detailed Findings',
    'Key Findings',
    'Financial Overview',
    'Priority Focus Areas',
    'Opportunities',
    'Recommended Next Steps',
  ]
  const sectionsHtml = sections.map(s => `&middot; ${esc(s)}`).join('<br/>\n')

  return `<!DOCTYPE html><html lang="en" dir="ltr"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Montserrat:wght@400;500;600&display=swap');</style></head><body style="margin:0;padding:20px 0;background-color:#f9f6f1;font-family:'Montserrat',Arial,sans-serif;">
<div style="display:none;overflow:hidden;max-height:0;">Your Strategic Assessment Report is ready for review</div>
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f6f1;"><tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">

<!-- Header -->
<tr><td style="background-color:#ffffff;border-bottom:2px solid #A9B1A1;padding:28px 40px;text-align:center;">
<img src="${LOGO_URL}" alt="Vitalis Health Strategies" width="216" height="auto" style="display:block;margin:0 auto;max-width:216px;border:0;outline:none;text-decoration:none;"/>
</td></tr>

<!-- Gold bar -->
<tr><td style="height:4px;background-color:#c89741;font-size:0;line-height:0;">&nbsp;</td></tr>

<!-- Confidential banner -->
<tr><td style="padding:20px 40px 0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f6f1;border-radius:6px;border:1px solid #dde4e0;">
<tr><td style="padding:16px 20px;">
<p style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#c89741;margin:0 0 6px;font-weight:700;font-family:'Montserrat',Arial,sans-serif;">CONFIDENTIAL</p>
<p style="font-size:12px;color:#5a7060;margin:0;line-height:1.6;font-family:'Montserrat',Arial,sans-serif;">This report has been prepared exclusively for <strong style="color:#264a39;">${clientName}</strong>${org ? ` / <strong style="color:#264a39;">${org}</strong>` : ''} by Vitalis Health Strategies Inc. Do not distribute or share without written authorization.</p>
</td></tr>
</table>
</td></tr>

<!-- Main heading & body -->
<tr><td style="padding:28px 40px 0;">
<h2 style="margin:0 0 20px;color:#264a39;font-size:24px;font-weight:600;font-family:'Playfair Display',Georgia,serif;line-height:1.3;">Your Strategic Assessment Report is Ready</h2>
<p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 20px;font-family:'Montserrat',Arial,sans-serif;">${messageHtml}</p>
</td></tr>

<!-- What's in your report -->
<tr><td style="padding:0 40px 20px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f6f1;border-radius:6px;border:1px solid #dde4e0;">
<tr><td style="padding:20px 24px;">
<p style="font-size:13px;font-weight:700;color:#264a39;margin:0 0 12px;font-family:'Montserrat',Arial,sans-serif;">What's in your report</p>
<p style="font-size:13px;color:#172620;line-height:2;margin:0;font-family:'Montserrat',Arial,sans-serif;">
${sectionsHtml}
</p>
</td></tr>
</table>
</td></tr>

<!-- CTA & consultation -->
<tr><td style="padding:0 40px 12px;">
${data.report_url ? `<div style="text-align:center;margin-bottom:20px;">
<a href="${data.report_url}" style="display:inline-block;background-color:#264a39;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:600;font-family:'Montserrat',Arial,sans-serif;">View Your Strategic Assessment Report →</a>
</div>
<p style="font-size:11px;color:#5a7060;text-align:center;margin:0 0 20px;line-height:1.5;font-family:'Montserrat',Arial,sans-serif;">This link is private and prepared exclusively for you. Do not share it. Link expires in 90 days.</p>` : ''}
<p style="font-size:14px;color:#172620;line-height:1.75;margin:0 0 20px;font-family:'Montserrat',Arial,sans-serif;">To discuss your report and explore how Vitalis can support your next steps, reply to this email or book a complimentary consultation with our team.</p>
<div style="text-align:center;">
<a href="https://vitalisstrategies.com/contact" style="display:inline-block;background-color:transparent;color:#264a39;text-decoration:none;padding:11px 24px;border-radius:6px;font-size:13px;font-weight:600;font-family:'Montserrat',Arial,sans-serif;border:2px solid #264a39;">Book a Consultation →</a>
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
<p style="font-size:10px;color:#8a9e92;line-height:1.7;margin:0;font-family:'Montserrat',Arial,sans-serif;">This Strategic Assessment Report has been prepared exclusively for ${clientName}${org ? ` and ${org}` : ''} by Vitalis Health Strategies Inc. The contents of this report, including all findings, analysis, and recommendations, are strictly confidential and constitute proprietary work product of Vitalis Health Strategies Inc. This report may not be reproduced, distributed, disclosed, or used for any purpose other than the recipient's internal strategic planning without the prior written consent of Vitalis Health Strategies Inc.</p>
<p style="font-size:10px;color:#8a9e92;line-height:1.7;margin:10px 0 0;font-family:'Montserrat',Arial,sans-serif;">Vitalis Health Strategies Inc. makes no representations or warranties regarding the completeness or accuracy of third-party data referenced herein. Recommendations are based on information provided at the time of assessment and are subject to change as circumstances evolve.</p>
<p style="font-size:10px;color:#8a9e92;line-height:1.7;margin:10px 0 0;font-family:'Montserrat',Arial,sans-serif;">&copy; 2026 Vitalis Health Strategies Inc. All rights reserved. Calgary, Alberta, Canada &middot; vitalisstrategies.com</p>
</td></tr>

</table></td></tr></table>
</body></html>`
}

function buildSimpleHtml(data: { client_name: string; body_html: string; cta_url?: string; cta_label?: string }): string {
  const clientName = esc(data.client_name)
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Montserrat:wght@400;500;600&display=swap');</style></head><body style="margin:0;padding:20px 0;background-color:#f9f6f1;font-family:'Montserrat',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f6f1;"><tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">
<tr><td style="background-color:#ffffff;border-bottom:2px solid #A9B1A1;padding:28px 40px;text-align:center;">
<img src="${LOGO_URL}" alt="Vitalis Health Strategies" width="216" height="auto" style="display:block;margin:0 auto;max-width:216px;"/>
</td></tr>
<tr><td style="height:4px;background-color:#c89741;font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:36px 40px;">
<p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">Dear ${clientName},</p>
${data.body_html}
${data.cta_url ? `<div style="text-align:center;margin:32px 0;"><a href="${data.cta_url}" style="display:inline-block;background-color:#264a39;color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;font-family:'Montserrat',Arial,sans-serif;">${esc(data.cta_label || 'Continue')}</a></div>` : ''}
</td></tr>
<tr><td><hr style="border:none;border-top:1px solid #dde4e0;margin:0;"/></td></tr>
<tr><td style="padding:24px 40px;text-align:center;">
<p style="font-size:13px;font-weight:700;color:#264a39;margin:0 0 2px;font-family:'Montserrat',Arial,sans-serif;">Vitalis Health Strategies</p>
<p style="font-size:12px;color:#5a7060;margin:0;font-family:'Montserrat',Arial,sans-serif;">Calgary, Alberta, Canada</p>
</td></tr>
</table></td></tr></table></body></html>`
}

// ─── Template registry ───

const templates: Record<string, (data: any) => { subject: string; html: string }> = {
  intake_confirmation: (data) => ({
    subject: 'Your Strategic Assessment Request Has Been Received',
    html: buildSimpleHtml({
      client_name: data.client_name,
      body_html: `<p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">Thank you for requesting a Strategic Assessment with Vitalis Health Strategies.</p><p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">We are preparing the most relevant assessment for your situation. You will receive secure access shortly to begin the assessment process.</p><p style="font-size:15px;color:#172620;line-height:1.75;margin:0;font-family:'Montserrat',Arial,sans-serif;">If you have any questions in the meantime, please feel free to reach out.</p><p style="color:#5a7060;font-size:14px;margin-top:28px;font-family:'Montserrat',Arial,sans-serif;">Warm regards,<br/><strong>Vitalis Health Strategies</strong></p>`,
    }),
  }),

  assessment_access: (data) => ({
    subject: 'Your Strategic Assessment Is Ready',
    html: buildSimpleHtml({
      client_name: data.client_name,
      body_html: `<p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">Your Strategic Assessment is ready to begin.</p><p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">You may start the assessment using the secure link below. Your progress will be saved automatically, and you may return at any time to continue.</p><p style="color:#666;font-size:14px;line-height:1.6;font-family:'Montserrat',Arial,sans-serif;">This is a secure, private link. Please do not share it with others.</p><p style="color:#5a7060;font-size:14px;margin-top:28px;font-family:'Montserrat',Arial,sans-serif;">Warm regards,<br/><strong>Vitalis Health Strategies</strong></p>`,
      cta_url: data.assessment_url,
      cta_label: 'Start Assessment',
    }),
  }),

  incomplete_reminder: (data) => ({
    subject: 'Continue Your Strategic Assessment',
    html: buildSimpleHtml({
      client_name: data.client_name,
      body_html: `<p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">We noticed that your Strategic Assessment is still in progress.</p><p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">You can continue where you left off using the secure link below. All of your previous responses have been saved.</p><p style="color:#5a7060;font-size:14px;margin-top:28px;font-family:'Montserrat',Arial,sans-serif;">Warm regards,<br/><strong>Vitalis Health Strategies</strong></p>`,
      cta_url: data.assessment_url,
      cta_label: 'Resume Assessment',
    }),
  }),

  completion_confirmation: (data) => ({
    subject: 'Your Strategic Assessment Has Been Submitted',
    html: buildSimpleHtml({
      client_name: data.client_name,
      body_html: `<p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">Thank you for completing your Strategic Assessment.</p><p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">Our team will review your submission and prepare the next step in the process. You may be contacted for follow-up discussion or additional clarification if needed.</p><p style="color:#5a7060;font-size:14px;margin-top:28px;font-family:'Montserrat',Arial,sans-serif;">Warm regards,<br/><strong>Vitalis Health Strategies</strong></p>`,
      cta_url: data.report_url,
      cta_label: 'View Response Summary',
    }),
  }),

  client_report: (data) => ({
    subject: data.subject_line || `Your Strategic Assessment Report — ${data.organization || data.client_name}`,
    html: buildClientReportHtml(data),
  }),

  admin_notification: (data) => ({
    subject: `New Strategic Assessment Submitted — ${data.client_name}`,
    html: buildSimpleHtml({
      client_name: 'Team',
      body_html: `<p style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#c89741;margin:0 0 12px;font-weight:700;font-family:'Montserrat',Arial,sans-serif;">Internal Notification</p><p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">A Strategic Assessment has been submitted and is ready for review.</p><table style="width:100%;border-collapse:collapse;margin:16px 0;"><tr><td style="padding:8px 0;color:#5a7060;font-size:14px;font-family:'Montserrat',Arial,sans-serif;">Client</td><td style="padding:8px 0;color:#172620;font-size:14px;font-weight:600;font-family:'Montserrat',Arial,sans-serif;">${esc(data.client_name)}</td></tr><tr><td style="padding:8px 0;color:#5a7060;font-size:14px;font-family:'Montserrat',Arial,sans-serif;">Organization</td><td style="padding:8px 0;color:#172620;font-size:14px;font-weight:600;font-family:'Montserrat',Arial,sans-serif;">${esc(data.organization || '—')}</td></tr><tr><td style="padding:8px 0;color:#5a7060;font-size:14px;font-family:'Montserrat',Arial,sans-serif;">Assessment</td><td style="padding:8px 0;color:#172620;font-size:14px;font-weight:600;font-family:'Montserrat',Arial,sans-serif;">${esc(data.assessment_type || '—')}</td></tr><tr><td style="padding:8px 0;color:#5a7060;font-size:14px;font-family:'Montserrat',Arial,sans-serif;">Submitted</td><td style="padding:8px 0;color:#172620;font-size:14px;font-weight:600;font-family:'Montserrat',Arial,sans-serif;">${esc(data.submitted_at || '—')}</td></tr></table>`,
      cta_url: data.admin_url,
      cta_label: 'View Submission',
    }),
  }),
}

// ─── Handler ───

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { email_type, recipient_email, template_data, session_id, intake_id } = await req.json()

    console.log('send-assessment-email called:', JSON.stringify({
      email_type, recipient_email, session_id, intake_id,
      has_template_data: !!template_data,
    }))

    if (!email_type || !recipient_email) {
      console.log('Missing required fields:', { email_type, recipient_email })
      return new Response(JSON.stringify({ error: 'email_type and recipient_email are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const templateFn = templates[email_type]
    if (!templateFn) {
      console.log('Unknown email_type:', email_type)
      return new Response(JSON.stringify({ error: `Unknown email_type: ${email_type}` }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Duplicate prevention: only block if Resend confirmed delivery (provider_response has an id)
    if (session_id && email_type === 'client_report') {
      const { data: existing } = await supabase
        .from('email_events')
        .select('id, provider_response')
        .eq('session_id', session_id)
        .eq('email_type', 'client_report')
        .eq('status', 'sent')
        .not('provider_response', 'is', null)
        .limit(1)

      const hasResendId = existing?.some((e: any) => e.provider_response?.id)
      if (hasResendId) {
        console.log('Duplicate prevention: already sent with confirmed Resend ID', { session_id })
        return new Response(JSON.stringify({ success: true, skipped: true, reason: 'already_sent' }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    // For client_report emails, generate a secure report token and include it
    let enrichedTemplateData = { ...(template_data || {}) }
    if (email_type === 'client_report' && session_id) {
      const reportToken = crypto.randomUUID() + '-' + crypto.randomUUID().replace(/-/g, '')
      console.log('Generating client report token for session:', session_id)
      
      const { error: tokenErr } = await supabase
        .from('client_report_tokens')
        .insert({
          session_id,
          token: reportToken,
          expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        })
      
      if (tokenErr) {
        console.error('Failed to create report token:', tokenErr)
      } else {
        const reportUrl = `https://vitalisstrategies.com/report/${reportToken}`
        enrichedTemplateData.report_url = reportUrl
        enrichedTemplateData.report_token = reportToken
        console.log('Report token created, URL:', reportUrl)
      }
    }

    const { subject, html } = templateFn(enrichedTemplateData)
    console.log('Template resolved, sending via Resend:', { email_type, subject, to: recipient_email })

    // Send via Resend
    const resendResult = await sendViaResend(recipient_email, subject, html)
    console.log(`[EMAIL] Sent ${email_type} to ${recipient_email} via Resend`, { id: resendResult.id })

    // Log to email_events AFTER successful send
    await supabase.from('email_events').insert({
      email_type,
      recipient_email,
      subject,
      status: 'sent',
      sent_at: new Date().toISOString(),
      session_id: session_id || null,
      intake_id: intake_id || null,
      provider_response: resendResult,
    })

    // Update lifecycle status if applicable
    if (intake_id && email_type === 'intake_confirmation') {
      await supabase.from('assessment_intakes').update({ lifecycle_status: 'intake_submitted', last_activity_at: new Date().toISOString() }).eq('id', intake_id)
    }
    if (intake_id && email_type === 'assessment_access') {
      await supabase.from('assessment_intakes').update({ lifecycle_status: 'assessment_assigned', last_activity_at: new Date().toISOString() }).eq('id', intake_id)
    }
    if (intake_id && email_type === 'completion_confirmation') {
      await supabase.from('assessment_intakes').update({ lifecycle_status: 'assessment_completed', assessment_completion_date: new Date().toISOString(), last_activity_at: new Date().toISOString() }).eq('id', intake_id)
    }

    return new Response(JSON.stringify({ success: true, sent: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('send-assessment-email error:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

import { createClient } from 'npm:@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('VHS_Website')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const FROM = 'Vitalis Health Strategies <noreply@mail.vitalisstrategies.com>'
const REPLY_TO = 'info@vitalisstrategies.com'
const INTERNAL_TO = 'info@vitalisstrategies.com'
const LOGO_URL = 'https://vitalisstrategies.com/vitalis-logo-email.png'

const INTEREST_LABELS: Record<string, string> = {
  'new-practice': 'New Practice Build',
  'operations': 'Operational Excellence',
  'revenue': 'Revenue &amp; Finance',
  'growth': 'Growth Strategy',
  'recruitment': 'Practitioner Recruitment',
  'ma': 'M&amp;A / Transition',
  'healthcare-it': 'Healthcare IT &amp; Technology',
  'people': 'People Management',
  'assessment': 'Strategic Assessment',
  'general': 'General Inquiry',
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
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: REPLY_TO, subject, html }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Resend error: ${res.status} ${err}`)
  }
  return res.json()
}

/* ─── HTML builders ─── */

function wrapEmail(previewText: string, bodyContent: string): string {
  return [
    '<!DOCTYPE html><html lang="en" dir="ltr"><head><meta charset="utf-8"/>',
    '<meta name="viewport" content="width=device-width,initial-scale=1"/>',
    "<style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Montserrat:wght@400;500;600&display=swap');</style>",
    "</head><body style=\"margin:0;padding:20px 0;background-color:#f9f6f1;font-family:'Montserrat',Arial,sans-serif;\">",
    `<div style="display:none;overflow:hidden;max-height:0;">${esc(previewText)}</div>`,
    '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f6f1;"><tr><td align="center">',
    '<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">',
    '<!-- Header --><tr><td style="background-color:#ffffff;border-bottom:2px solid #A9B1A1;padding:28px 40px;text-align:center;">',
    `<img src="${LOGO_URL}" alt="Vitalis Health Strategies" width="216" height="auto" style="display:block;margin:0 auto;max-width:216px;border:0;outline:none;text-decoration:none;"/>`,
    '</td></tr>',
    '<!-- Gold bar --><tr><td style="height:4px;background-color:#c89741;font-size:0;line-height:0;">&nbsp;</td></tr>',
    bodyContent,
    '</table></td></tr></table></body></html>',
  ].join('')
}

function buildInternalHtml(data: { name: string; email: string; phone?: string; organization?: string; area_of_interest?: string; message: string }): string {
  const interest = data.area_of_interest ? (INTEREST_LABELS[data.area_of_interest] || esc(data.area_of_interest)) : null

  let rows = ''
  rows += `<tr><td style="padding:12px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#5a7060;width:140px;vertical-align:top;font-weight:600;font-family:'Montserrat',Arial,sans-serif;border-bottom:1px solid #dde4e0;">NAME</td><td style="padding:12px 0;font-size:15px;color:#172620;vertical-align:top;font-family:'Montserrat',Arial,sans-serif;line-height:1.5;font-weight:600;border-bottom:1px solid #dde4e0;">${esc(data.name)}</td></tr>`
  rows += `<tr><td style="padding:12px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#5a7060;width:140px;vertical-align:top;font-weight:600;font-family:'Montserrat',Arial,sans-serif;border-bottom:1px solid #dde4e0;">EMAIL</td><td style="padding:12px 0;font-size:15px;color:#172620;vertical-align:top;font-family:'Montserrat',Arial,sans-serif;line-height:1.5;border-bottom:1px solid #dde4e0;"><a href="mailto:${esc(data.email)}" style="color:#264a39;text-decoration:none;">${esc(data.email)}</a></td></tr>`
  if (data.phone) {
    rows += `<tr><td style="padding:12px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#5a7060;width:140px;vertical-align:top;font-weight:600;font-family:'Montserrat',Arial,sans-serif;border-bottom:1px solid #dde4e0;">PHONE</td><td style="padding:12px 0;font-size:15px;color:#172620;vertical-align:top;font-family:'Montserrat',Arial,sans-serif;line-height:1.5;border-bottom:1px solid #dde4e0;">${esc(data.phone)}</td></tr>`
  }
  if (data.organization) {
    rows += `<tr><td style="padding:12px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#5a7060;width:140px;vertical-align:top;font-weight:600;font-family:'Montserrat',Arial,sans-serif;border-bottom:1px solid #dde4e0;">ORG</td><td style="padding:12px 0;font-size:15px;color:#172620;vertical-align:top;font-family:'Montserrat',Arial,sans-serif;line-height:1.5;border-bottom:1px solid #dde4e0;">${esc(data.organization)}</td></tr>`
  }
  if (interest) {
    rows += `<tr><td style="padding:12px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#5a7060;width:140px;vertical-align:top;font-weight:600;font-family:'Montserrat',Arial,sans-serif;border-bottom:1px solid #dde4e0;">INTEREST</td><td style="padding:12px 0;font-size:15px;color:#172620;vertical-align:top;font-family:'Montserrat',Arial,sans-serif;line-height:1.5;border-bottom:1px solid #dde4e0;"><span style="display:inline-block;background-color:#A9B1A1;color:#ffffff;font-size:12px;font-weight:600;padding:4px 12px;border-radius:20px;">${interest}</span></td></tr>`
  }
  rows += `<tr><td style="padding:16px 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#5a7060;width:140px;vertical-align:top;font-weight:600;font-family:'Montserrat',Arial,sans-serif;">MESSAGE</td><td style="padding:16px 0 12px;font-size:15px;color:#172620;vertical-align:top;font-family:'Montserrat',Arial,sans-serif;line-height:1.75;white-space:pre-wrap;">${nl2br(data.message)}</td></tr>`

  const replySubject = encodeURIComponent('Re: Your inquiry to Vitalis Health Strategies')

  const body = `
<!-- Heading -->
<tr><td style="padding:28px 40px 12px;">
  <h2 style="margin:0 0 6px;color:#264a39;font-size:22px;font-weight:600;font-family:'Playfair Display',Georgia,serif;line-height:1.3;">New Contact Form Submission</h2>
  <p style="font-size:12px;color:#5a7060;margin:6px 0 0;font-family:'Montserrat',Arial,sans-serif;">Submitted via vitalisstrategies.com/contact</p>
</td></tr>
<!-- Fields -->
<tr><td style="padding:8px 40px 28px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>
</td></tr>
<!-- CTA -->
<tr><td style="padding:0 40px 32px;text-align:center;">
  <a href="mailto:${esc(data.email)}?subject=${replySubject}" style="background-color:#264a39;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:6px;font-size:13px;font-weight:600;display:inline-block;font-family:'Montserrat',Arial,sans-serif;">Reply to ${esc(data.name)} →</a>
</td></tr>
<!-- Divider -->
<tr><td><hr style="border:none;border-top:1px solid #dde4e0;margin:0;"/></td></tr>
<!-- Footer -->
<tr><td style="background-color:#f9f6f1;padding:24px 40px;">
  <p style="font-size:12px;font-weight:700;color:#264a39;margin:0 0 4px;font-family:'Montserrat',Arial,sans-serif;">Vitalis Health Strategies Inc.</p>
  <p style="font-size:11px;color:#5a7060;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">Calgary, Alberta, Canada&nbsp;&nbsp;|&nbsp;&nbsp;<a href="mailto:info@vitalisstrategies.com" style="color:#264a39;text-decoration:none;">info@vitalisstrategies.com</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="https://vitalisstrategies.com" style="color:#264a39;text-decoration:none;">vitalisstrategies.com</a></p>
  <p style="font-size:10px;color:#8a9e92;line-height:1.7;margin:0;font-family:'Montserrat',Arial,sans-serif;">CONFIDENTIAL — This message is intended solely for authorized personnel of Vitalis Health Strategies Inc. It was generated automatically from a contact form submission on vitalisstrategies.com and contains personal information submitted by a prospective client. Do not forward, copy, or share without authorization. If received in error, delete immediately and contact info@vitalisstrategies.com.</p>
</td></tr>`

  return wrapEmail(`New contact form submission from ${data.name}`, body)
}

function buildClientHtml(data: { name: string; area_of_interest?: string; message: string }): string {
  const interest = data.area_of_interest ? (INTEREST_LABELS[data.area_of_interest] || esc(data.area_of_interest)) : null

  const interestLine = interest
    ? `<p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">You indicated interest in: <span style="display:inline-block;background-color:#A9B1A1;color:#ffffff;font-size:12px;font-weight:600;padding:4px 12px;border-radius:20px;vertical-align:middle;">${interest}</span></p>`
    : ''

  const body = `
<!-- Body -->
<tr><td style="padding:36px 40px;">
  <h2 style="margin:0 0 20px;color:#264a39;font-size:24px;font-weight:600;font-family:'Playfair Display',Georgia,serif;line-height:1.3;">We received your message.</h2>
  <p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">Hi ${esc(data.name)},</p>
  <p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">Thank you for reaching out to Vitalis Health Strategies. We have received your message and a member of our team will be in touch within one business day.</p>
  ${interestLine}
  <!-- Message echo -->
  <div style="border-left:4px solid #A9B1A1;background-color:#f9f6f1;padding:16px 20px;border-radius:0 6px 6px 0;margin:0 0 20px;">
    <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#5a7060;margin:0 0 8px;font-weight:600;font-family:'Montserrat',Arial,sans-serif;">YOUR MESSAGE</p>
    <p style="font-size:14px;color:#172620;line-height:1.75;margin:0;white-space:pre-wrap;font-family:'Montserrat',Arial,sans-serif;">${nl2br(data.message)}</p>
  </div>
  <p style="font-size:15px;color:#172620;line-height:1.75;margin:20px 0 0;font-family:'Montserrat',Arial,sans-serif;">If you have anything to add or questions in the meantime, simply reply to this email and it will reach our team directly.</p>
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
  <p style="font-size:10px;color:#8a9e92;line-height:1.7;margin:0;font-family:'Montserrat',Arial,sans-serif;">This message and any information contained herein are confidential and intended solely for the use of the named recipient. It was sent in response to a contact form submission made at vitalisstrategies.com. If you did not submit this form or believe you received this email in error, please disregard it and contact us at info@vitalisstrategies.com.</p>
  <p style="font-size:10px;color:#8a9e92;line-height:1.7;margin:10px 0 0;font-family:'Montserrat',Arial,sans-serif;">Vitalis Health Strategies Inc. is committed to protecting your privacy. We do not share, sell, or disclose your personal information to third parties. Your submission is stored securely and used solely to respond to your inquiry. View our <a href="https://vitalisstrategies.com/privacy" style="color:#264a39;text-decoration:none;">Privacy Policy</a></p>
  <p style="font-size:10px;color:#8a9e92;line-height:1.7;margin:8px 0 0;font-family:'Montserrat',Arial,sans-serif;">&copy; 2026 Vitalis Health Strategies Inc. All rights reserved. Calgary, Alberta, Canada</p>
</td></tr>`

  return wrapEmail('Thank you for reaching out to Vitalis Health Strategies', body)
}

/* ─── Handler ─── */

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json()
    const { name, email, phone, organization, area_of_interest, message } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (!email || typeof email !== 'string' || !email.trim() || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Save to contact_submissions
    const { error: dbError } = await supabase.from('contact_submissions').insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      organization: organization?.trim() || null,
      area_of_interest: area_of_interest || null,
      message: message.trim(),
      status: 'new',
    })

    if (dbError) {
      console.error('Database insert error:', dbError)
      return new Response(JSON.stringify({ error: 'Failed to save submission' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const templateData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || undefined,
      organization: organization?.trim() || undefined,
      area_of_interest: area_of_interest || undefined,
      message: message.trim(),
    }

    // Send internal notification
    const interestLabel = area_of_interest ? (INTEREST_LABELS[area_of_interest] || area_of_interest) : 'General'
    await sendEmail(
      INTERNAL_TO,
      `New Contact Submission — ${name.trim()} · ${interestLabel}`,
      buildInternalHtml(templateData as any),
    )

    // Send client confirmation
    await sendEmail(
      email.trim(),
      'We received your message — Vitalis Health Strategies',
      buildClientHtml(templateData as any),
    )

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('send-contact-email error:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

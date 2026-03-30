import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const SITE_NAME = 'Vitalis Health Strategies'
const SENDER_DOMAIN = 'notify.vitalisstrategies.com'
const FROM_DOMAIN = 'vitalisstrategies.com'

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

function buildInternalEmailHtml(data: {
  name: string
  email: string
  phone?: string
  organization?: string
  area_of_interest?: string
  message: string
}): string {
  const interestLabel = data.area_of_interest ? (INTEREST_LABELS[data.area_of_interest] || data.area_of_interest) : null

  const fieldRow = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 16px;font-weight:600;color:#1C3D2E;border-bottom:1px solid #e8e4de;width:160px;vertical-align:top;font-size:14px;">${label}</td>
      <td style="padding:10px 16px;color:#333;border-bottom:1px solid #e8e4de;font-size:14px;">${value}</td>
    </tr>`

  let rows = fieldRow('Name', data.name)
  rows += fieldRow('Email', `<a href="mailto:${data.email}" style="color:#B8860B;">${data.email}</a>`)
  if (data.phone) rows += fieldRow('Phone', data.phone)
  if (data.organization) rows += fieldRow('Organization', data.organization)
  if (interestLabel) rows += fieldRow('Area of Interest', interestLabel)
  rows += fieldRow('Message', data.message.replace(/\n/g, '<br/>'))

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background-color:#F5F2EC;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F2EC;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
        <tr><td style="background-color:#1C3D2E;padding:28px 32px;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.5px;">New Contact Form Submission</h1>
          <p style="margin:6px 0 0;color:#B8860B;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Vitalis Health Strategies</p>
        </td></tr>
        <tr><td style="padding:24px 32px 8px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e4de;border-radius:8px;overflow:hidden;">
            ${rows}
          </table>
        </td></tr>
        <tr><td align="center" style="padding:24px 32px 32px;">
          <a href="mailto:${data.email}" style="display:inline-block;background-color:#B8860B;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:600;">Reply to ${data.name}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildClientConfirmationHtml(data: {
  name: string
  area_of_interest?: string
  message: string
}): string {
  const interestLabel = data.area_of_interest ? (INTEREST_LABELS[data.area_of_interest] || data.area_of_interest) : null

  const interestBlock = interestLabel
    ? `<p style="font-size:14px;color:#333;line-height:1.6;margin:0 0 20px;">You indicated interest in: <strong style="color:#1C3D2E;">${interestLabel}</strong></p>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background-color:#F5F2EC;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F2EC;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
        <tr><td style="background-color:#1C3D2E;padding:28px 32px;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">Thank You for Reaching Out</h1>
          <p style="margin:6px 0 0;color:#B8860B;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Vitalis Health Strategies</p>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 20px;">Hi ${data.name},</p>
          <p style="font-size:14px;color:#333;line-height:1.6;margin:0 0 20px;">Thank you for reaching out to Vitalis Health Strategies. A member of our team will be in touch within one business day.</p>
          ${interestBlock}
          <p style="font-size:13px;color:#666;margin:0 0 8px;font-weight:600;">Your message:</p>
          <div style="border-left:3px solid #B8860B;padding:12px 16px;background-color:#F5F2EC;border-radius:0 6px 6px 0;margin:0 0 24px;">
            <p style="font-size:14px;color:#555;line-height:1.6;margin:0;white-space:pre-wrap;">${data.message.replace(/\n/g, '<br/>')}</p>
          </div>
          <hr style="border:none;border-top:1px solid #e8e4de;margin:24px 0;"/>
          <p style="font-size:13px;color:#888;line-height:1.6;margin:0;">
            <strong style="color:#1C3D2E;">Vitalis Health Strategies</strong><br/>
            Calgary, Alberta, Canada<br/>
            <a href="mailto:info@vitalisstrategies.com" style="color:#B8860B;text-decoration:none;">info@vitalisstrategies.com</a><br/>
            <a href="https://vitalisstrategies.com" style="color:#B8860B;text-decoration:none;">vitalisstrategies.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
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

    // Validate required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (!email || typeof email !== 'string' || !email.trim() || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Save to database
    const { error: dbError } = await supabase.from('contact_submissions').insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      organization: organization?.trim() || null,
      area_of_interest: area_of_interest || null,
      message: message.trim(),
    })

    if (dbError) {
      console.error('Database insert error:', dbError)
      return new Response(JSON.stringify({ error: 'Failed to save submission' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const interestLabel = area_of_interest ? (INTEREST_LABELS[area_of_interest] || area_of_interest) : 'General'

    // Build HTML for both emails
    const internalHtml = buildInternalEmailHtml({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim(),
      organization: organization?.trim(),
      area_of_interest,
      message: message.trim(),
    })

    const clientHtml = buildClientConfirmationHtml({
      name: name.trim(),
      area_of_interest,
      message: message.trim(),
    })

    // Enqueue internal notification email
    const internalMessageId = crypto.randomUUID()
    await supabase.from('email_send_log').insert({
      message_id: internalMessageId,
      template_name: 'contact-internal-notification',
      recipient_email: 'info@vitalisstrategies.com',
      status: 'pending',
    })

    const { error: internalEnqueueErr } = await supabase.rpc('enqueue_email', {
      queue_name: 'transactional_emails',
      payload: {
        message_id: internalMessageId,
        idempotency_key: `contact-internal-${internalMessageId}`,
        to: 'info@vitalisstrategies.com',
        from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
        sender_domain: SENDER_DOMAIN,
        subject: `New Contact Form Submission — ${name.trim()} (${interestLabel})`,
        html: internalHtml,
        text: `New contact form submission from ${name.trim()} (${email.trim()})`,
        purpose: 'transactional',
        label: 'contact-internal-notification',
        queued_at: new Date().toISOString(),
      },
    })

    if (internalEnqueueErr) {
      console.error('Failed to enqueue internal email:', internalEnqueueErr)
    }

    // Enqueue client confirmation email
    const clientMessageId = crypto.randomUUID()
    await supabase.from('email_send_log').insert({
      message_id: clientMessageId,
      template_name: 'contact-client-confirmation',
      recipient_email: email.trim(),
      status: 'pending',
    })

    const { error: clientEnqueueErr } = await supabase.rpc('enqueue_email', {
      queue_name: 'transactional_emails',
      payload: {
        message_id: clientMessageId,
        to: email.trim(),
        from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
        reply_to: 'info@vitalisstrategies.com',
        sender_domain: SENDER_DOMAIN,
        subject: 'We received your message — Vitalis Health Strategies',
        html: clientHtml,
        text: `Hi ${name.trim()}, thank you for reaching out to Vitalis Health Strategies. A member of our team will be in touch within one business day.`,
        purpose: 'transactional',
        label: 'contact-client-confirmation',
        queued_at: new Date().toISOString(),
      },
    })

    if (clientEnqueueErr) {
      console.error('Failed to enqueue client email:', clientEnqueueErr)
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Contact form error:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
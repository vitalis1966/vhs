import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { template as internalTemplate } from '../_shared/transactional-email-templates/contact-internal-notification.tsx'
import { template as clientTemplate } from '../_shared/transactional-email-templates/contact-client-confirmation.tsx'

const SITE_NAME = 'Vitalis Health Strategies'
const SENDER_DOMAIN = 'notify.vitalisstrategies.com'
const FROM_DOMAIN = 'vitalisstrategies.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function getOrCreateUnsubscribeToken(supabase: any, email: string): Promise<string | null> {
  const normalizedEmail = email.toLowerCase()

  const { data: existing } = await supabase
    .from('email_unsubscribe_tokens')
    .select('token, used_at')
    .eq('email', normalizedEmail)
    .maybeSingle()

  if (existing && !existing.used_at) return existing.token
  if (existing && existing.used_at) return null // suppressed

  const newToken = generateToken()
  await supabase.from('email_unsubscribe_tokens')
    .upsert({ token: newToken, email: normalizedEmail }, { onConflict: 'email', ignoreDuplicates: true })

  const { data: stored } = await supabase
    .from('email_unsubscribe_tokens')
    .select('token')
    .eq('email', normalizedEmail)
    .maybeSingle()

  return stored?.token || newToken
}

async function enqueueEmail(supabase: any, opts: {
  to: string
  subject: string
  template: any
  templateData: Record<string, any>
  idempotencyKey: string
  label: string
  replyTo?: string
}) {
  const messageId = crypto.randomUUID()

  // Check suppression
  const { data: suppressed } = await supabase
    .from('suppressed_emails')
    .select('id')
    .eq('email', opts.to.toLowerCase())
    .maybeSingle()

  if (suppressed) {
    console.log('Email suppressed:', opts.to)
    return
  }

  // Get unsubscribe token
  const unsubscribeToken = await getOrCreateUnsubscribeToken(supabase, opts.to)
  if (!unsubscribeToken) {
    console.log('Recipient unsubscribed:', opts.to)
    return
  }

  // Render template
  const html = await renderAsync(React.createElement(opts.template.component, opts.templateData))
  const text = await renderAsync(React.createElement(opts.template.component, opts.templateData), { plainText: true })

  // Resolve subject
  const resolvedSubject = typeof opts.template.subject === 'function'
    ? opts.template.subject(opts.templateData)
    : opts.subject

  // Log pending
  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: opts.label,
    recipient_email: opts.to,
    status: 'pending',
  })

  // Enqueue
  const payload: Record<string, any> = {
    message_id: messageId,
    idempotency_key: opts.idempotencyKey,
    to: opts.to,
    from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
    sender_domain: SENDER_DOMAIN,
    subject: resolvedSubject,
    html,
    text,
    purpose: 'transactional',
    label: opts.label,
    unsubscribe_token: unsubscribeToken,
    queued_at: new Date().toISOString(),
  }
  if (opts.replyTo) payload.reply_to = opts.replyTo

  const { error } = await supabase.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload,
  })

  if (error) {
    console.error(`Failed to enqueue ${opts.label}:`, error)
  }
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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const submissionId = crypto.randomUUID()

    // Save to database
    const { error: dbError } = await supabase.from('contact_submissions').insert({
      id: submissionId,
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
    await enqueueEmail(supabase, {
      to: 'info@vitalisstrategies.com',
      subject: `New Contact Form Submission — ${name.trim()}`,
      template: internalTemplate,
      templateData,
      idempotencyKey: `contact-internal-${submissionId}`,
      label: 'contact-internal-notification',
    })

    // Send client confirmation
    await enqueueEmail(supabase, {
      to: email.trim(),
      subject: 'We received your message — Vitalis Health Strategies',
      template: clientTemplate,
      templateData,
      idempotencyKey: `contact-client-${submissionId}`,
      label: 'contact-client-confirmation',
      replyTo: 'info@vitalisstrategies.com',
    })

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Contact form error:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

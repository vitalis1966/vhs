import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { template } from '../_shared/transactional-email-templates/assessment-intake-notification.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
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
    const { full_name, email } = body

    if (!full_name || !email) {
      return new Response(JSON.stringify({ error: 'full_name and email are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const resendApiKey = Deno.env.get('VHS_Website')
    if (!resendApiKey) {
      console.error('VHS_Website secret not configured')
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Render React Email template
    const html = await renderAsync(React.createElement(template.component, body))

    // Resolve subject
    const resolvedSubject = typeof template.subject === 'function'
      ? template.subject(body)
      : template.subject

    // Send via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Vitalis Health Strategies <noreply@mail.vitalisstrategies.com>',
        to: ['info@vitalisstrategies.com'],
        reply_to: 'info@vitalisstrategies.com',
        subject: resolvedSubject,
        html,
      }),
    })

    const resendData = await res.json()

    if (!res.ok) {
      console.error('Resend error:', resendData)
      return new Response(JSON.stringify({ error: 'Failed to send email', details: resendData }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Assessment intake notification sent via Resend', { id: resendData.id })

    return new Response(JSON.stringify({ success: true, id: resendData.id }), {
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

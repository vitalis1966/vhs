import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
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

    // Generate a submission ID for idempotency
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
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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

    // Send internal notification email via send-transactional-email
    const { error: internalErr } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'contact-internal-notification',
        recipientEmail: 'info@vitalisstrategies.com',
        idempotencyKey: `contact-internal-${submissionId}`,
        templateData,
      },
    })

    if (internalErr) {
      console.error('Failed to send internal notification:', internalErr)
    }

    // Send client confirmation email via send-transactional-email
    const { error: clientErr } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'contact-client-confirmation',
        recipientEmail: email.trim(),
        idempotencyKey: `contact-client-${submissionId}`,
        templateData,
      },
    })

    if (clientErr) {
      console.error('Failed to send client confirmation:', clientErr)
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

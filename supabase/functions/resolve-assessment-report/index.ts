import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
    const { access_token } = await req.json()

    if (!access_token || typeof access_token !== 'string') {
      return new Response(JSON.stringify({ error: 'access_token is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Look up the session by its assessment access_token
    const { data: session, error: sessionErr } = await supabase
      .from('assessment_sessions')
      .select('id')
      .eq('access_token', access_token)
      .limit(1)
      .single()

    if (sessionErr || !session) {
      console.log('resolve-assessment-report: no session for access_token', access_token)
      return new Response(JSON.stringify({ error: 'no_report' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Find the most recent valid report token for this session
    const { data: tokenRecord, error: tokenErr } = await supabase
      .from('client_report_tokens')
      .select('token')
      .eq('session_id', session.id)
      .eq('is_revoked', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (tokenErr || !tokenRecord) {
      console.log('resolve-assessment-report: no valid report token for session', session.id)
      return new Response(JSON.stringify({ error: 'no_report' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ report_token: tokenRecord.token }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('resolve-assessment-report error:', error)
    return new Response(JSON.stringify({ error: 'internal_error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

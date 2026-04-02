import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const REPORT_TOKEN_TTL_MS = 90 * 24 * 60 * 60 * 1000

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

async function runAnalysis(sessionId: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing backend configuration for report preparation')
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/analyze-assessment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
    },
    body: JSON.stringify({ session_id: sessionId }),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    console.error('prepare-assessment-report: analyze-assessment failed', response.status, payload)
    throw new Error(
      payload && typeof payload.error === 'string'
        ? payload.error
        : `analyze-assessment failed with status ${response.status}`
    )
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  try {
    const { access_token } = await req.json()

    if (!access_token || typeof access_token !== 'string') {
      return json({ error: 'access_token is required' }, 400)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: 'internal_error' }, 500)
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data: session, error: sessionErr } = await supabase
      .from('assessment_sessions')
      .select('id, assessment_id, status')
      .eq('access_token', access_token)
      .limit(1)
      .single()

    if (sessionErr || !session) {
      console.log('prepare-assessment-report: no session for access_token', access_token)
      return json({ error: 'no_report' }, 404)
    }

    if (session.status !== 'submitted') {
      console.log('prepare-assessment-report: session not submitted', session.id, session.status)
      return json({ error: 'no_report' }, 409)
    }

    const { data: existingReport, error: reportErr } = await supabase
      .from('internal_assessment_reports')
      .select('id, analysis_status')
      .eq('session_id', session.id)
      .limit(1)
      .maybeSingle()

    if (reportErr) {
      console.error('prepare-assessment-report: failed to load report state', reportErr)
      return json({ error: 'internal_error' }, 500)
    }

    if (existingReport?.analysis_status !== 'complete') {
      console.log('prepare-assessment-report: generating report for session', session.id)
      await runAnalysis(session.id)
    }

    const { data: readyReport, error: readyReportErr } = await supabase
      .from('internal_assessment_reports')
      .select('id, analysis_status')
      .eq('session_id', session.id)
      .limit(1)
      .single()

    if (readyReportErr || !readyReport || readyReport.analysis_status !== 'complete') {
      console.error('prepare-assessment-report: report still unavailable after analysis', readyReportErr)
      return json({ error: 'no_report' }, 404)
    }

    const { data: tokenRecord, error: tokenErr } = await supabase
      .from('client_report_tokens')
      .select('token')
      .eq('session_id', session.id)
      .eq('is_revoked', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (tokenErr) {
      console.error('prepare-assessment-report: failed to load report token', tokenErr)
      return json({ error: 'internal_error' }, 500)
    }

    if (tokenRecord?.token) {
      return json({ report_token: tokenRecord.token })
    }

    const reportToken = crypto.randomUUID()

    const { error: insertErr } = await supabase
      .from('client_report_tokens')
      .insert({
        session_id: session.id,
        token: reportToken,
        expires_at: new Date(Date.now() + REPORT_TOKEN_TTL_MS).toISOString(),
      })

    if (insertErr) {
      console.error('prepare-assessment-report: failed to create report token', insertErr)
      return json({ error: 'internal_error' }, 500)
    }

    return json({ report_token: reportToken })
  } catch (error) {
    console.error('prepare-assessment-report error:', error)
    return json({ error: 'internal_error' }, 500)
  }
})
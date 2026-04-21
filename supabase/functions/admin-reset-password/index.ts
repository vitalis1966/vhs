import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders, requireAdmin, sendEmail, generateTempPassword, buildPasswordResetEmail, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '../_shared/admin-helpers.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const { user: caller } = await requireAdmin(req)
    const { user_id, kind } = await req.json() // kind: 'admin' | 'client'
    if (!user_id || !kind) {
      return new Response(JSON.stringify({ error: 'user_id and kind required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const tempPassword = generateTempPassword()
    const { error: uErr } = await admin.auth.admin.updateUserById(user_id, { password: tempPassword })
    if (uErr) {
      await admin.from('activity_logs').insert({ user_name: caller.email || 'admin', action: 'Password Changed', status: 'Failed' })
      return new Response(JSON.stringify({ error: uErr.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    // Lookup name + email
    const tbl = kind === 'admin' ? 'administrators' : 'client_users'
    const { data: profile } = kind === 'admin'
      ? await admin.from('administrators').select('name,email').eq('email', (await admin.auth.admin.getUserById(user_id)).data.user?.email || '').maybeSingle()
      : await admin.from('client_users').select('name,email').eq('id', user_id).maybeSingle()
    const { data: authUser } = await admin.auth.admin.getUserById(user_id)
    const email = profile?.email || authUser.user?.email || ''
    const name = profile?.name || email
    await sendEmail(email, 'Your Vitalis Strategies password was reset', buildPasswordResetEmail({ name, email, tempPassword, role: kind === 'admin' ? 'Administrator' : 'Client' }))
    await admin.from('activity_logs').insert({ user_name: caller.email || 'admin', action: 'Password Changed', status: 'Success' })
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})

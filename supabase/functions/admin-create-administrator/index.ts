import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders, requireAdmin, sendEmail, generateTempPassword, buildCredentialsEmail, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '../_shared/admin-helpers.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const { user: caller } = await requireAdmin(req)
    const { name, email } = await req.json()
    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'name and email required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const tempPassword = generateTempPassword()
    const { data: created, error: cErr } = await admin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { name },
    })
    if (cErr || !created.user) {
      return new Response(JSON.stringify({ error: cErr?.message || 'Failed to create user' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    await admin.from('administrators').insert({ name, email, is_active: true, is_builtin: false })
    await admin.from('user_roles').insert({ user_id: created.user.id, role: 'admin' })
    await sendEmail(email, 'Your Vitalis Strategies Administrator account', buildCredentialsEmail({ name, email, tempPassword, role: 'Administrator' }))
    await admin.from('activity_logs').insert({ user_name: caller.email || 'admin', action: 'Password Changed', status: 'Success' })
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})

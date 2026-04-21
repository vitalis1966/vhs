import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders, requireAdmin, sendEmail, generateTempPassword, buildCredentialsEmail, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '../_shared/admin-helpers.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    await requireAdmin(req)
    const { name, email, phone, business_name } = await req.json()
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
    await admin.from('client_users').insert({
      id: created.user.id, name, email, phone: phone || null, business_name: business_name || null, is_active: true,
    })
    await admin.from('user_roles').insert({ user_id: created.user.id, role: 'client' })
    await sendEmail(email, 'Your Vitalis Strategies Client account', buildCredentialsEmail({ name, email, tempPassword, role: 'Client' }))
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})

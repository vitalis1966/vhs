import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders, requireAdmin, sendEmail, generateTempPassword, buildPasswordResetEmail, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '../_shared/admin-helpers.ts'

async function findUserIdByEmail(admin: any, email: string): Promise<string | null> {
  // List users (paginated). Admin lists are typically small.
  let page = 1
  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error || !data?.users?.length) return null
    const found = data.users.find((u: any) => (u.email || '').toLowerCase() === email.toLowerCase())
    if (found) return found.id
    if (data.users.length < 200) return null
    page++
  }
  return null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const { user: caller } = await requireAdmin(req)
    const body = await req.json()
    const { kind } = body
    let { user_id } = body
    const { email } = body
    if (!kind || (!user_id && !email)) {
      return new Response(JSON.stringify({ error: 'user_id or email and kind required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    if (!user_id && email) {
      user_id = await findUserIdByEmail(admin, email)
      if (!user_id) {
        return new Response(JSON.stringify({ error: 'User not found in auth' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
    }
    const tempPassword = generateTempPassword()
    const { error: uErr } = await admin.auth.admin.updateUserById(user_id, { password: tempPassword })
    if (uErr) {
      await admin.from('activity_logs').insert({ user_name: caller.email || 'admin', action: 'Password Changed', status: 'Failed' })
      return new Response(JSON.stringify({ error: uErr.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const { data: authUser } = await admin.auth.admin.getUserById(user_id)
    const recipientEmail = email || authUser.user?.email || ''
    const { data: profile } = kind === 'admin'
      ? await admin.from('administrators').select('name,email').eq('email', recipientEmail).maybeSingle()
      : await admin.from('client_users').select('name,email').eq('id', user_id).maybeSingle()
    const name = profile?.name || recipientEmail
    await sendEmail(recipientEmail, 'Your Vitalis Strategies password was reset', buildPasswordResetEmail({ name, email: recipientEmail, tempPassword, role: kind === 'admin' ? 'Administrator' : 'Client' }))
    await admin.from('activity_logs').insert({ user_name: caller.email || 'admin', action: 'Password Changed', status: 'Success' })
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})

import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders, requireAdmin, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '../_shared/admin-helpers.ts'

async function findUserIdByEmail(admin: any, email: string): Promise<string | null> {
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
    await requireAdmin(req)
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
    if (kind === 'admin') {
      const { data: authUser } = await admin.auth.admin.getUserById(user_id)
      const targetEmail = email || authUser.user?.email
      if (targetEmail) {
        const { data: row } = await admin.from('administrators').select('is_builtin').eq('email', targetEmail).maybeSingle()
        if (row?.is_builtin) {
          return new Response(JSON.stringify({ error: 'Cannot delete built-in administrator' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }
        await admin.from('administrators').delete().eq('email', targetEmail)
      }
    } else {
      const { data: docs } = await admin.from('documents').select('storage_path').eq('client_user_id', user_id)
      if (docs && docs.length) {
        await admin.storage.from('client-documents').remove(docs.map((d: any) => d.storage_path))
      }
      await admin.from('client_users').delete().eq('id', user_id)
    }
    await admin.from('user_roles').delete().eq('user_id', user_id)
    const { error: dErr } = await admin.auth.admin.deleteUser(user_id)
    if (dErr) {
      return new Response(JSON.stringify({ error: dErr.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})

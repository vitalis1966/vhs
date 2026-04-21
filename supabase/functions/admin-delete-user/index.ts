import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders, requireAdmin, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '../_shared/admin-helpers.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    await requireAdmin(req)
    const { user_id, kind } = await req.json() // kind: 'admin' | 'client'
    if (!user_id || !kind) {
      return new Response(JSON.stringify({ error: 'user_id and kind required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    if (kind === 'admin') {
      // Check is_builtin via email lookup
      const { data: authUser } = await admin.auth.admin.getUserById(user_id)
      const email = authUser.user?.email
      if (email) {
        const { data: row } = await admin.from('administrators').select('is_builtin').eq('email', email).maybeSingle()
        if (row?.is_builtin) {
          return new Response(JSON.stringify({ error: 'Cannot delete built-in administrator' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }
        await admin.from('administrators').delete().eq('email', email)
      }
    } else {
      // Client: cleanup documents storage paths
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

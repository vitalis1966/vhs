import { createClient } from 'npm:@supabase/supabase-js@2'
import {
  corsHeaders,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  generateTempPassword,
  sendEmail,
  buildTeamInviteEmail,
} from '../_shared/admin-helpers.ts'

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padding = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
    return JSON.parse(atob(padded + padding))
  } catch { return null }
}

const ALLOWED_ROLES = new Set(['admin', 'manager', 'team_member'])

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return json(401, { error: 'Unauthorized' })
    const token = authHeader.replace('Bearer ', '').trim()
    const payload = decodeJwtPayload(token)
    if (!payload || typeof payload.sub !== 'string') return json(401, { error: 'Unauthorized' })
    const exp = typeof payload.exp === 'number' ? payload.exp : 0
    if (exp && exp * 1000 < Date.now()) return json(401, { error: 'Unauthorized' })
    const callerId = payload.sub as string

    const body = await req.json().catch(() => ({}))
    const workspace_id: string | undefined = body.workspace_id
    const email: string | undefined = (body.email || '').toString().trim().toLowerCase()
    const full_name: string = (body.full_name || '').toString().trim()
    const role: string = (body.role || 'team_member').toString()
    const message: string = (body.message || '').toString()
    const login_url: string = (body.login_url || '').toString()

    if (!workspace_id || !email) return json(400, { error: 'workspace_id and email are required' })
    if (!ALLOWED_ROLES.has(role)) return json(400, { error: 'invalid role' })

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Verify caller is workspace admin
    const { data: callerMember, error: callerErr } = await admin
      .from('workspace_members').select('role,status')
      .eq('workspace_id', workspace_id).eq('user_id', callerId).maybeSingle()
    if (callerErr) return json(500, { error: callerErr.message })
    if (!callerMember || callerMember.status !== 'active' || callerMember.role !== 'admin') {
      return json(403, { error: 'Only workspace admins can invite users' })
    }

    // Look up workspace name for email
    const { data: ws } = await admin.from('workspaces').select('name').eq('id', workspace_id).maybeSingle()
    const workspaceName = ws?.name ?? undefined

    // Find existing auth user
    let userId: string | null = null
    let reused = false
    let tempPassword: string | undefined

    // Probe by attempting createUser; if duplicate, look up via admin.listUsers
    tempPassword = generateTempPassword()
    const { data: created, error: cErr } = await admin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name },
    })
    if (cErr) {
      const msg = cErr.message || ''
      const code = (cErr as { code?: string }).code || ''
      const status = (cErr as { status?: number }).status || 0
      const exists = code === 'email_exists'
        || status === 422
        || /already (been )?(registered|exists)/i.test(msg)
        || /duplicate/i.test(msg)
        || /email.*exists/i.test(msg)
      if (!exists) return json(400, { error: msg || 'Failed to create user' })
      // Find existing user
      // Page through users to find by email
      let page = 1
      while (page < 20 && !userId) {
        const { data: list, error: lErr } = await admin.auth.admin.listUsers({ page, perPage: 200 })
        if (lErr) return json(500, { error: lErr.message })
        const match = list.users.find((u) => (u.email || '').toLowerCase() === email)
        if (match) { userId = match.id; break }
        if (list.users.length < 200) break
        page++
      }
      if (!userId) return json(500, { error: 'User exists but could not be located' })
      reused = true
      tempPassword = undefined
    } else {
      userId = created.user!.id
    }

    // Upsert profile
    await admin.from('profiles').upsert({
      id: userId,
      email,
      full_name: full_name || null,
      must_change_password: !reused,
    }, { onConflict: 'id' })

    // Ensure user_roles has team_member role (idempotent)
    await admin.from('user_roles').upsert(
      { user_id: userId, role: 'team_member' },
      { onConflict: 'user_id,role', ignoreDuplicates: true },
    )

    // Upsert workspace_members: link existing pending row if present, else insert active
    const { data: existingMember } = await admin
      .from('workspace_members').select('id,status')
      .eq('workspace_id', workspace_id)
      .or(`user_id.eq.${userId},invited_email.eq.${email}`)
      .maybeSingle()

    if (existingMember) {
      await admin.from('workspace_members').update({
        user_id: userId,
        role,
        status: 'active',
        invited_email: email,
        invited_name: full_name || null,
      }).eq('id', existingMember.id)
    } else {
      await admin.from('workspace_members').insert({
        workspace_id,
        user_id: userId,
        role,
        status: 'active',
        invited_email: email,
        invited_name: full_name || null,
        invited_at: new Date().toISOString(),
        invited_by: callerId,
      })
    }

    // Mark Vitalis OS platform access for this user.
    await admin.from('platform_roles').upsert(
      { user_id: userId, platform: 'vitalis_os', role, is_active: true },
      { onConflict: 'user_id,platform' },
    )

    // Send invite email
    const loginUrl = login_url || 'https://vitalisstrategies.com/employee-login'
    let email_sent = true
    let email_error: string | undefined
    try {
      await sendEmail(
        email,
        reused ? `You've been added to ${workspaceName ?? 'a Vitalis OS workspace'}` : 'Your Vitalis OS account',
        buildTeamInviteEmail({ name: full_name, email, tempPassword, loginUrl, workspaceName, message, reused }),
      )
    } catch (e) {
      email_sent = false
      email_error = e instanceof Error ? e.message : String(e)
      console.error('invite email failed', email_error)
    }

    return json(200, { success: true, user_id: userId, reused, email_sent, email_error })
  } catch (e) {
    console.error('admin-invite-team-member error', e)
    return json(500, { error: e instanceof Error ? e.message : 'Unknown error' })
  }
})

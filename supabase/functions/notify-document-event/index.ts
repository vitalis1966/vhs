import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders, sendEmail, wrapEmail, esc, emailFooter, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '../_shared/admin-helpers.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    const token = authHeader.replace('Bearer ', '')
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { data: { user }, error } = await admin.auth.getUser(token)
    if (error || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const { event, file_name, file_type, file_size, client_user_id } = await req.json()
    if (!event || !file_name) {
      return new Response(JSON.stringify({ error: 'event and file_name required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Resolve client info
    const targetUserId = client_user_id || user.id
    const { data: client } = await admin.from('client_users').select('name,email,business_name').eq('id', targetUserId).maybeSingle()
    const businessName = client?.business_name || 'Unknown Business'
    const clientName = client?.name || client?.email || 'Unknown Client'

    // Get all active admin emails
    const { data: admins } = await admin.from('administrators').select('email').eq('is_active', true)
    const recipients = (admins || []).map((a: any) => a.email).filter(Boolean)
    if (recipients.length === 0) {
      return new Response(JSON.stringify({ success: true, skipped: 'no_admins' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const eventLabel = event === 'upload' ? 'uploaded' : event === 'delete' ? 'deleted' : 'modified'
    const subject = `Document ${eventLabel} — ${businessName}`
    const body = `
<tr><td style="padding:32px 40px;">
  <h2 style="margin:0 0 12px;color:#264a39;font-size:22px;font-weight:600;font-family:'Playfair Display',Georgia,serif;">Document ${esc(eventLabel)}</h2>
  <p style="font-size:14px;color:#5a7060;margin:0 0 20px;font-family:'Montserrat',Arial,sans-serif;">A client document was ${esc(eventLabel)}.</p>
  <table width="100%" style="border-collapse:collapse;font-family:'Montserrat',Arial,sans-serif;">
    <tr><td style="padding:10px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#5a7060;width:160px;font-weight:600;border-bottom:1px solid #dde4e0;">Business</td><td style="padding:10px 0;font-size:14px;color:#172620;border-bottom:1px solid #dde4e0;">${esc(businessName)}</td></tr>
    <tr><td style="padding:10px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#5a7060;font-weight:600;border-bottom:1px solid #dde4e0;">Client</td><td style="padding:10px 0;font-size:14px;color:#172620;border-bottom:1px solid #dde4e0;">${esc(clientName)}</td></tr>
    <tr><td style="padding:10px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#5a7060;font-weight:600;border-bottom:1px solid #dde4e0;">File</td><td style="padding:10px 0;font-size:14px;color:#172620;border-bottom:1px solid #dde4e0;">${esc(file_name)}</td></tr>
    ${file_type ? `<tr><td style="padding:10px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#5a7060;font-weight:600;border-bottom:1px solid #dde4e0;">Type</td><td style="padding:10px 0;font-size:14px;color:#172620;border-bottom:1px solid #dde4e0;">${esc(file_type)}</td></tr>` : ''}
    ${file_size ? `<tr><td style="padding:10px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#5a7060;font-weight:600;">Size</td><td style="padding:10px 0;font-size:14px;color:#172620;">${esc(String(file_size))} bytes</td></tr>` : ''}
  </table>
</td></tr>`
    const html = wrapEmail(subject, body + emailFooter())
    await sendEmail(recipients, subject, html)
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})

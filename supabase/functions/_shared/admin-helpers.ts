// Shared CORS + email shell for admin/client edge functions
import { createClient } from 'npm:@supabase/supabase-js@2'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

export const RESEND_API_KEY = Deno.env.get('VHS_Website')!
export const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
export const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
export const FROM = 'Vitalis Health Strategies <info@mail.vitalisstrategies.com>'
export const REPLY_TO = 'info@vitalisstrategies.com'
export const LOGO_URL = 'https://vitalisstrategies.com/vitalis-logo-email.png'
export const SITE_URL = 'https://vitalisstrategies.com'

export function esc(s: string): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function sendEmail(to: string | string[], subject: string, html: string) {
  const recipients = Array.isArray(to) ? to : [to]
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to: recipients, reply_to: REPLY_TO, subject, html }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Resend error: ${res.status} ${err}`)
  }
  return res.json()
}

export function wrapEmail(previewText: string, bodyContent: string): string {
  return [
    '<!DOCTYPE html><html lang="en" dir="ltr"><head><meta charset="utf-8"/>',
    '<meta name="viewport" content="width=device-width,initial-scale=1"/>',
    "<style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Montserrat:wght@400;500;600&display=swap');</style>",
    "</head><body style=\"margin:0;padding:20px 0;background-color:#f9f6f1;font-family:'Montserrat',Arial,sans-serif;\">",
    `<div style="display:none;overflow:hidden;max-height:0;">${esc(previewText)}</div>`,
    '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f6f1;"><tr><td align="center">',
    '<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">',
    '<tr><td style="background-color:#ffffff;border-bottom:2px solid #A9B1A1;padding:28px 40px;text-align:center;">',
    `<img src="${LOGO_URL}" alt="Vitalis Health Strategies" width="216" height="auto" style="display:block;margin:0 auto;max-width:216px;border:0;outline:none;text-decoration:none;"/>`,
    '</td></tr>',
    '<tr><td style="height:4px;background-color:#c89741;font-size:0;line-height:0;">&nbsp;</td></tr>',
    bodyContent,
    '</table></td></tr></table></body></html>',
  ].join('')
}

export function generateTempPassword(length = 16): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*'
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  let out = ''
  for (let i = 0; i < length; i++) out += chars[bytes[i] % chars.length]
  return out
}

export function emailFooter(): string {
  return `
<tr><td><hr style="border:none;border-top:1px solid #dde4e0;margin:0;"/></td></tr>
<tr><td style="background-color:#f9f6f1;padding:24px 40px;">
  <p style="font-size:12px;font-weight:700;color:#264a39;margin:0 0 4px;font-family:'Montserrat',Arial,sans-serif;">Vitalis Health Strategies Inc.</p>
  <p style="font-size:11px;color:#5a7060;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">Calgary, Alberta, Canada&nbsp;&nbsp;|&nbsp;&nbsp;<a href="mailto:info@vitalisstrategies.com" style="color:#264a39;text-decoration:none;">info@vitalisstrategies.com</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="https://vitalisstrategies.com" style="color:#264a39;text-decoration:none;">vitalisstrategies.com</a></p>
</td></tr>`
}

export async function requireAdmin(req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
  const token = authHeader.replace('Bearer ', '')
  // Use a user-context client so getClaims() works with ES256 signing-keys JWTs
  const userClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authHeader } },
  })
  const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token)
  if (claimsError || !claimsData?.claims?.sub) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
  const userId = claimsData.claims.sub as string
  const userEmail = (claimsData.claims.email as string | undefined) ?? ''
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' })
  if (!isAdmin) {
    throw new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
  return { user: { id: userId, email: userEmail }, supabase }
}

export function buildCredentialsEmail(opts: { name: string; email: string; tempPassword: string; role: 'Administrator' | 'Client' }): string {
  const loginUrl = opts.role === 'Administrator' ? `${SITE_URL}/admin/login` : SITE_URL
  const body = `
<tr><td style="padding:36px 40px;">
  <h2 style="margin:0 0 20px;color:#264a39;font-size:24px;font-weight:600;font-family:'Playfair Display',Georgia,serif;line-height:1.3;">Welcome, ${esc(opts.name)}.</h2>
  <p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">An ${opts.role.toLowerCase()} account has been created for you on Vitalis Health Strategies.</p>
  <div style="border-left:4px solid #A9B1A1;background-color:#f9f6f1;padding:16px 20px;border-radius:0 6px 6px 0;margin:0 0 24px;">
    <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#5a7060;margin:0 0 8px;font-weight:600;font-family:'Montserrat',Arial,sans-serif;">YOUR CREDENTIALS</p>
    <p style="font-size:14px;color:#172620;margin:0 0 6px;font-family:'Montserrat',Arial,sans-serif;"><strong>Username:</strong> ${esc(opts.email)}</p>
    <p style="font-size:14px;color:#172620;margin:0;font-family:'Montserrat',Arial,sans-serif;"><strong>Temporary Password:</strong> <code style="background:#fff;padding:3px 8px;border-radius:4px;border:1px solid #dde4e0;">${esc(opts.tempPassword)}</code></p>
  </div>
  <p style="text-align:center;margin:0 0 24px;">
    <a href="${loginUrl}" style="background-color:#264a39;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:6px;font-size:13px;font-weight:600;display:inline-block;font-family:'Montserrat',Arial,sans-serif;">Sign in →</a>
  </p>
  <p style="font-size:13px;color:#5a7060;line-height:1.6;margin:0;font-family:'Montserrat',Arial,sans-serif;">For security, we recommend changing your password after your first sign-in.</p>
</td></tr>`
  return wrapEmail(`Your ${opts.role} account on Vitalis Health Strategies`, body + emailFooter())
}

export function buildPasswordResetEmail(opts: { name: string; email: string; tempPassword: string; role: 'Administrator' | 'Client' }): string {
  const loginUrl = opts.role === 'Administrator' ? `${SITE_URL}/admin/login` : SITE_URL
  const body = `
<tr><td style="padding:36px 40px;">
  <h2 style="margin:0 0 20px;color:#264a39;font-size:24px;font-weight:600;font-family:'Playfair Display',Georgia,serif;line-height:1.3;">Your password was reset</h2>
  <p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">Hi ${esc(opts.name)},</p>
  <p style="font-size:15px;color:#172620;line-height:1.75;margin:0 0 16px;font-family:'Montserrat',Arial,sans-serif;">An administrator has reset your password. Use the temporary credentials below to sign in.</p>
  <div style="border-left:4px solid #A9B1A1;background-color:#f9f6f1;padding:16px 20px;border-radius:0 6px 6px 0;margin:0 0 24px;">
    <p style="font-size:14px;color:#172620;margin:0 0 6px;font-family:'Montserrat',Arial,sans-serif;"><strong>Username:</strong> ${esc(opts.email)}</p>
    <p style="font-size:14px;color:#172620;margin:0;font-family:'Montserrat',Arial,sans-serif;"><strong>Temporary Password:</strong> <code style="background:#fff;padding:3px 8px;border-radius:4px;border:1px solid #dde4e0;">${esc(opts.tempPassword)}</code></p>
  </div>
  <p style="text-align:center;margin:0 0 24px;">
    <a href="${loginUrl}" style="background-color:#264a39;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:6px;font-size:13px;font-weight:600;display:inline-block;font-family:'Montserrat',Arial,sans-serif;">Sign in →</a>
  </p>
</td></tr>`
  return wrapEmail('Your password was reset', body + emailFooter())
}


UPDATE public.email_templates
SET body_html = REPLACE(
  body_html,
  '<!-- Logo header -->' || E'\n' || '  <div style="background:#ffffff;border-radius:8px 8px 0 0;padding:28px 40px 20px;text-align:center;border-bottom:3px solid #C89741;">' || E'\n' || '    <p style="font-size:15px;font-weight:700;letter-spacing:0.18em;color:#172620;text-transform:uppercase;margin:0 0 2px 0;">Vitalis Health</p>' || E'\n' || '    <p style="font-size:10px;font-weight:600;letter-spacing:0.25em;color:#60766B;text-transform:uppercase;margin:0;">Strategies</p>' || E'\n' || '  </div>',
  '<!-- Logo header -->' || E'\n' || '  <div style="background:#ffffff;border-radius:8px 8px 0 0;padding:28px 40px 20px;text-align:center;border-bottom:3px solid #C89741;">' || E'\n' || '    <img src="https://www.vitalisstrategies.com/vitalis-logo-email.png" alt="Vitalis Health Strategies" style="height:48px;width:auto;display:inline-block;" />' || E'\n' || '  </div>'
),
    updated_at = now()
WHERE id = '05caebaa-035b-4baa-b88c-81850267cbf4';

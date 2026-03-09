import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { email, password } = await req.json();

  // Find existing user
  const { data: users } = await supabase.auth.admin.listUsers();
  const existing = users?.users?.find(u => u.email === email);

  if (existing) {
    const { error } = await supabase.auth.admin.updateUserById(existing.id, { password });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    return new Response(JSON.stringify({ action: "password_updated", user_id: existing.id }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email, password, email_confirm: true,
  });

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify({ action: "created", user_id: data.user.id }), {
    headers: { "Content-Type": "application/json" },
  });
});

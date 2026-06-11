// Manual email paste parser - calls Lovable AI Gateway via shared extraction module
// then matches against existing clients/contacts. Does NOT persist anything.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { composeEmailForExtraction, extractEmailViaGateway, GatewayError } from "../_shared/extract-email-tasks.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData?.user) return json({ error: "Unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));
    const raw_email: string = body?.raw_email ?? "";
    const workspace_id: string | null = body?.workspace_id ?? null;
    const client_id_hint: string | null = body?.client_id ?? null;
    if (!raw_email || raw_email.length < 10) return json({ error: "raw_email is required" }, 400);
    if (!workspace_id) return json({ error: "workspace_id is required" }, 400);
    if (raw_email.length > 200000) return json({ error: "Email too large" }, 400);

    // LOVABLE_API_KEY
    /*const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "LOVABLE_API_KEY not configured" }, 500);*/

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) return json({ error: "ANTHROPIC_API_KEY not configured" }, 500);

    // Raw paste is already a full email blob (headers + body). Run through the
    // shared composer with body_text=raw_email so the composer doesn't double-wrap.
    const composed = composeEmailForExtraction({ body_text: raw_email });

    let parsed: any;
    try {
      //parsed = await extractEmailViaGateway(LOVABLE_API_KEY, composed); 
      parsed = await extractEmailViaGateway(ANTHROPIC_API_KEY, composed);
    } catch (e) {
      if (e instanceof GatewayError) return json({ error: e.message }, e.status);
      throw e;
    }

    // Service-role client for matching across workspace data (RLS bypass for read)
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // Match contact by email
    let matchedContact: any = null;
    let matchedClient: any = null;
    if (client_id_hint) {
      const { data: c } = await admin.from("clients").select("id, name, workspace_id").eq("id", client_id_hint).eq("workspace_id", workspace_id).maybeSingle();
      matchedClient = c;
    } else if (parsed.from_email) {
      const { data: contacts } = await admin
        .from("contacts")
        .select("id, name, email, client_id, clients!inner(id, name, workspace_id)")
        .ilike("email", parsed.from_email)
        .limit(5);
      const hit = (contacts ?? []).find((c: any) => c.clients?.workspace_id === workspace_id);
      if (hit) {
        matchedContact = { id: hit.id, name: hit.name, email: hit.email };
        matchedClient = { id: hit.client_id, name: hit.clients.name };
      } else if (parsed.from_email.includes("@")) {
        const domain = parsed.from_email.split("@")[1].toLowerCase();
        const { data: clients } = await admin
          .from("clients")
          .select("id, name, website")
          .eq("workspace_id", workspace_id);
        const domainMatch = (clients ?? []).find((c: any) => c.website && c.website.toLowerCase().includes(domain));
        if (domainMatch) matchedClient = { id: domainMatch.id, name: domainMatch.name };
      }
    }

    return json({
      parsed,
      matched_contact: matchedContact,
      matched_client: matchedClient,
    });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }

  function json(payload: unknown, status = 200) {
    return new Response(JSON.stringify(payload), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

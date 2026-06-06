// Edge function: issues a short-lived signed URL for a document referenced by a
// client_submission_assignments row, when the caller has access to the client.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userRes } = await userClient.auth.getUser();
    const user = userRes?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const assignmentId: string | undefined = body?.assignment_id;
    if (!assignmentId || typeof assignmentId !== "string") {
      return new Response(JSON.stringify({ error: "assignment_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { data: assignment, error: aErr } = await admin
      .from("client_submission_assignments")
      .select("id, client_id, source_id, source_type, hidden_in_client")
      .eq("id", assignmentId)
      .maybeSingle();
    if (aErr || !assignment) {
      return new Response(JSON.stringify({ error: "Assignment not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (assignment.source_type !== "submission") {
      return new Response(JSON.stringify({ error: "Wrong assignment type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Authorize via can_access_client (security definer in DB)
    const { data: canAccess, error: aclErr } = await userClient.rpc("can_access_client", { cid: assignment.client_id });
    if (aclErr || !canAccess) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: doc, error: dErr } = await admin
      .from("documents")
      .select("storage_path, file_name, file_type")
      .eq("id", assignment.source_id)
      .maybeSingle();
    if (dErr || !doc) {
      return new Response(JSON.stringify({ error: "Document not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const download = body?.download === true ? doc.file_name : undefined;
    const { data: signed, error: sErr } = await admin.storage
      .from("client-documents")
      .createSignedUrl(doc.storage_path, 60, download ? { download } : undefined);
    if (sErr || !signed?.signedUrl) {
      return new Response(JSON.stringify({ error: sErr?.message || "Sign failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ url: signed.signedUrl, file_name: doc.file_name, file_type: doc.file_type }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String((err as Error)?.message ?? err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

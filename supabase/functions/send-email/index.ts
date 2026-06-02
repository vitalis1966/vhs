import { createClient } from "npm:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("VHS_Website")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const FROM = "Vitalis Health Strategies <info@vitalisstrategies.com>";
const BUCKET = "platform-documents";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface AttachmentRef {
  id: string;
  file_name: string;
  storage_path: string;
}

interface SendPayload {
  workspace_id: string;
  client_id?: string | null;
  subject: string;
  body_html: string;
  body_text?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  attachments?: AttachmentRef[]; // already-resolved platform_documents
  attachment_ids?: string[]; // alternative: ids to look up
  is_broadcast?: boolean;
  sent_by?: string | null;
}

async function fetchAttachments(
  admin: ReturnType<typeof createClient>,
  ids: string[],
): Promise<Array<{ filename: string; content: string }>> {
  if (!ids.length) return [];
  const { data: docs } = await admin
    .from("platform_documents")
    .select("id, file_name, storage_path")
    .in("id", ids);
  const out: Array<{ filename: string; content: string }> = [];
  for (const d of docs ?? []) {
    const { data: blob, error } = await admin.storage
      .from(BUCKET)
      .download((d as any).storage_path);
    if (error || !blob) continue;
    const buf = new Uint8Array(await blob.arrayBuffer());
    // base64 encode
    let bin = "";
    for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
    const b64 = btoa(bin);
    out.push({ filename: (d as any).file_name, content: b64 });
  }
  return out;
}

async function resendSend(payload: {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{ filename: string; content: string }>;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: payload.to,
      cc: payload.cc?.length ? payload.cc : undefined,
      bcc: payload.bcc?.length ? payload.bcc : undefined,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      attachments: payload.attachments?.length ? payload.attachments : undefined,
    }),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, json };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const body = (await req.json()) as SendPayload;
    if (!body.workspace_id || !body.subject || !body.to?.length) {
      return new Response(
        JSON.stringify({ error: "workspace_id, subject and to are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Resolve attachments once
    const ids = body.attachment_ids ?? body.attachments?.map((a) => a.id) ?? [];
    const resolvedAttachments = ids.length
      ? await fetchAttachments(admin, ids)
      : [];
    const attachmentMeta = (body.attachments ?? []).map((a) => ({
      id: a.id,
      file_name: a.file_name,
    }));

    const recipients = body.is_broadcast ? body.to : [body.to];
    // For broadcast: each recipient is its own send (string)
    // For single: one send with array of recipients

    const results: Array<{ to: string[]; ok: boolean; id?: string; error?: string }> = [];

    if (body.is_broadcast) {
      for (const r of body.to) {
        const res = await resendSend({
          to: [r],
          subject: body.subject,
          html: body.body_html,
          text: body.body_text,
          attachments: resolvedAttachments,
        });
        const status = res.ok ? "sent" : "failed";
        const msgId = res.ok ? (res.json as any).id : null;
        const errorMsg = res.ok ? null : JSON.stringify(res.json);

        await admin.from("sent_emails").insert({
          workspace_id: body.workspace_id,
          client_id: body.client_id ?? null,
          subject: body.subject,
          body_html: body.body_html,
          body_text: body.body_text ?? null,
          from_address: FROM,
          to_addresses: [r],
          cc_addresses: [],
          bcc_addresses: [],
          attachments: attachmentMeta,
          sent_by: body.sent_by ?? null,
          resend_message_id: msgId,
          status,
          error_message: errorMsg,
          is_broadcast: true,
        });
        results.push({ to: [r], ok: res.ok, id: msgId ?? undefined, error: errorMsg ?? undefined });
      }
    } else {
      const res = await resendSend({
        to: body.to,
        cc: body.cc,
        bcc: body.bcc,
        subject: body.subject,
        html: body.body_html,
        text: body.body_text,
        attachments: resolvedAttachments,
      });
      const status = res.ok ? "sent" : "failed";
      const msgId = res.ok ? (res.json as any).id : null;
      const errorMsg = res.ok ? null : JSON.stringify(res.json);

      const { data: inserted } = await admin
        .from("sent_emails")
        .insert({
          workspace_id: body.workspace_id,
          client_id: body.client_id ?? null,
          subject: body.subject,
          body_html: body.body_html,
          body_text: body.body_text ?? null,
          from_address: FROM,
          to_addresses: body.to,
          cc_addresses: body.cc ?? [],
          bcc_addresses: body.bcc ?? [],
          attachments: attachmentMeta,
          sent_by: body.sent_by ?? null,
          resend_message_id: msgId,
          status,
          error_message: errorMsg,
          is_broadcast: false,
        })
        .select("id")
        .single();

      // Write activity for client send
      if (body.client_id && res.ok) {
        await admin.from("activities").insert({
          workspace_id: body.workspace_id,
          client_id: body.client_id,
          actor_id: body.sent_by ?? null,
          verb: "email_sent",
          target_type: "sent_email",
          target_id: (inserted as any)?.id ?? null,
          metadata: {
            subject: body.subject,
            recipient_count: body.to.length + (body.cc?.length ?? 0) + (body.bcc?.length ?? 0),
          },
        });
      }
      results.push({ to: body.to, ok: res.ok, id: msgId ?? undefined, error: errorMsg ?? undefined });
    }

    // For broadcast: write one workspace-level activity
    if (body.is_broadcast) {
      await admin.from("activities").insert({
        workspace_id: body.workspace_id,
        actor_id: body.sent_by ?? null,
        verb: "broadcast_sent",
        target_type: "broadcast",
        metadata: {
          subject: body.subject,
          recipient_count: body.to.length,
        },
      });
    }

    const successCount = results.filter((r) => r.ok).length;
    return new Response(
      JSON.stringify({
        success: successCount > 0,
        total: results.length,
        succeeded: successCount,
        failed: results.length - successCount,
        results,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("send-email error", e);
    return new Response(
      JSON.stringify({ error: String((e as Error).message ?? e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

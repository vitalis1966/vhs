import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, FileText, AlertCircle, CheckCircle2, ClipboardPaste, Inbox, Paperclip, Download } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { PasteEmailDialog } from "./PasteEmailDialog";
import { Link } from "react-router-dom";

type EmailRow = {
  id: string; subject: string; body_html: string | null; body_text: string | null;
  from_address: string; to_addresses: string[]; cc_addresses: string[]; bcc_addresses: string[];
  attachments: Array<{ id: string; file_name: string }>;
  sent_by: string | null; sent_at: string; status: string;
};

type PastedRow = {
  id: string;
  subject: string | null;
  from_name: string | null;
  from_email: string | null;
  to_addresses: string[];
  raw_body: string;
  ai_summary: string | null;
  ai_category: string | null;
  sent_at: string | null;
  created_at: string;
  imported_by: string | null;
  task_count?: number;
  attachments?: Array<{ id: string; file_name: string; storage_path: string; mime_type: string | null; size_bytes: number | null }>;
};

type ListItem =
  | ({ kind: "sent" } & EmailRow)
  | ({ kind: "pasted" } & PastedRow);

export function EmailsTab({ clientId }: { clientId: string }) {
  const [items, setItems] = useState<ListItem[]>([]);
  const [actors, setActors] = useState<Record<string, { full_name: string | null; email: string | null }>>({});
  const [selected, setSelected] = useState<ListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [pasteOpen, setPasteOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: sent }, { data: pasted }] = await Promise.all([
      (supabase as any).from("sent_emails").select("*").eq("client_id", clientId).order("sent_at", { ascending: false }),
      (supabase as any).from("pasted_emails").select("*").eq("client_id", clientId).order("created_at", { ascending: false }),
    ]);
    const sentRows: ListItem[] = (sent ?? []).map((r: EmailRow) => ({ kind: "sent" as const, ...r }));
    const pastedRows: ListItem[] = (pasted ?? []).map((r: PastedRow) => ({ kind: "pasted" as const, ...r }));

    // Task counts + attachments per pasted email
    const pastedIds = pastedRows.map((r) => (r as any).id);
    if (pastedIds.length) {
      const { data: taskRows } = await (supabase as any)
        .from("tasks").select("id, source_email_id").in("source_email_id", pastedIds);
      const counts: Record<string, number> = {};
      (taskRows ?? []).forEach((t: any) => {
        counts[t.source_email_id] = (counts[t.source_email_id] ?? 0) + 1;
      });
      pastedRows.forEach((r: any) => (r.task_count = counts[r.id] ?? 0));

      const { data: attRows } = await (supabase as any)
        .from("attachments")
        .select("id, attachable_id, platform_documents!inner(id, file_name, storage_path, mime_type, size_bytes)")
        .eq("attachable_type", "pasted_email")
        .in("attachable_id", pastedIds);
      const attMap: Record<string, any[]> = {};
      (attRows ?? []).forEach((a: any) => {
        const arr = attMap[a.attachable_id] ?? (attMap[a.attachable_id] = []);
        arr.push({
          id: a.id,
          file_name: a.platform_documents.file_name,
          storage_path: a.platform_documents.storage_path,
          mime_type: a.platform_documents.mime_type,
          size_bytes: a.platform_documents.size_bytes,
        });
      });
      pastedRows.forEach((r: any) => (r.attachments = attMap[r.id] ?? []));
    }

    const merged = [...sentRows, ...pastedRows].sort((a, b) => {
      const ta = a.kind === "sent" ? a.sent_at : (a.sent_at ?? a.created_at);
      const tb = b.kind === "sent" ? b.sent_at : (b.sent_at ?? b.created_at);
      return new Date(tb).getTime() - new Date(ta).getTime();
    });
    setItems(merged);

    const ids = Array.from(new Set([
      ...sentRows.map((r: any) => r.sent_by).filter(Boolean),
      ...pastedRows.map((r: any) => r.imported_by).filter(Boolean),
    ])) as string[];
    if (ids.length) {
      const { data: profs } = await (supabase as any).from("profiles").select("id, full_name, email").in("id", ids);
      const map: Record<string, any> = {};
      (profs ?? []).forEach((p: any) => (map[p.id] = { full_name: p.full_name, email: p.email }));
      setActors(map);
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [clientId]);

  const header = (
    <div className="flex items-center justify-between mb-3">
      <div className="text-sm font-medium">Communications</div>
      <Button size="sm" variant="secondary" className="gap-1" onClick={() => setPasteOpen(true)}>
        <ClipboardPaste className="h-4 w-4" /> Paste Email
      </Button>
    </div>
  );

  if (loading) return <div>{header}<div className="text-sm text-muted-foreground">Loading…</div></div>;
  if (items.length === 0) {
    return (
      <>
        {header}
        <div className="border border-dashed border-border rounded-lg p-10 text-center text-muted-foreground">
          <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No emails yet.</p>
        </div>
        <PasteEmailDialog open={pasteOpen} onOpenChange={setPasteOpen} defaultClientId={clientId} />
      </>
    );
  }

  return (
    <>
      {header}
      <div className="border border-border rounded-lg divide-y divide-border bg-card">
        {items.map((item) => {
          if (item.kind === "sent") {
            const e = item;
            const actor = e.sent_by ? actors[e.sent_by] : null;
            return (
              <button key={`s-${e.id}`} onClick={() => setSelected(item)}
                className="w-full text-left p-4 hover:bg-muted/40 transition-colors flex items-start gap-3">
                <Mail className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm truncate">{e.subject}</span>
                    {e.status === "failed" ? (
                      <Badge variant="destructive" className="text-[10px] gap-1"><AlertCircle className="h-3 w-3" />Failed</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] gap-1"><CheckCircle2 className="h-3 w-3" />Sent</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">To: {e.to_addresses.join(", ")}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {actor?.full_name ?? actor?.email ?? "—"} · {formatDistanceToNow(new Date(e.sent_at), { addSuffix: true })}
                  </div>
                </div>
              </button>
            );
          }
          const p = item;
          const actor = p.imported_by ? actors[p.imported_by] : null;
          return (
            <button key={`p-${p.id}`} onClick={() => setSelected(item)}
              className="w-full text-left p-4 hover:bg-muted/40 transition-colors flex items-start gap-3">
              <Inbox className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm truncate">{p.subject ?? "(no subject)"}</span>
                  <Badge variant="outline" className="text-[10px] gap-1 border-primary/40 text-primary">
                    <ClipboardPaste className="h-3 w-3" /> Manual import
                  </Badge>
                  {p.ai_category && <Badge variant="secondary" className="text-[10px]">{p.ai_category}</Badge>}
                  {p.task_count ? (
                    <Link to={`/app/tasks?source_email=${p.id}`} onClick={(e) => e.stopPropagation()}>
                      <Badge variant="outline" className="text-[10px]">{p.task_count} task{p.task_count === 1 ? "" : "s"}</Badge>
                    </Link>
                  ) : null}
                  {p.attachments && p.attachments.length > 0 && (
                    <Badge variant="outline" className="text-[10px] gap-1">
                      <Paperclip className="h-3 w-3" />{p.attachments.length}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 truncate">
                  From: {p.from_name ?? "—"}{p.from_email ? ` <${p.from_email}>` : ""}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Imported {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
                  {p.sent_at ? ` · Sent ${format(new Date(p.sent_at), "PP")}` : ""}
                  {actor ? ` · by ${actor.full_name ?? actor.email}` : ""}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected?.kind === "sent" && (
            <>
              <DialogHeader><DialogTitle>{selected.subject}</DialogTitle></DialogHeader>
              <div className="space-y-2 text-sm">
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div><strong>From:</strong> {selected.from_address}</div>
                  <div><strong>To:</strong> {selected.to_addresses.join(", ")}</div>
                  {selected.cc_addresses.length > 0 && <div><strong>Cc:</strong> {selected.cc_addresses.join(", ")}</div>}
                  <div><strong>Sent:</strong> {format(new Date(selected.sent_at), "PPpp")}</div>
                </div>
                <div className="prose prose-sm max-w-none border-t pt-3 mt-3"
                  dangerouslySetInnerHTML={{ __html: selected.body_html ?? selected.body_text ?? "" }} />
                {selected.attachments?.length > 0 && (
                  <div className="border-t pt-3 mt-3">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Attachments</div>
                    <ul className="space-y-1">
                      {selected.attachments.map((a) => (
                        <li key={a.id} className="flex items-center gap-2 text-sm">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{a.file_name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
          {selected?.kind === "pasted" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 flex-wrap">
                  {selected.subject ?? "(no subject)"}
                  <Badge variant="outline" className="text-[10px] gap-1 border-primary/40 text-primary">
                    <ClipboardPaste className="h-3 w-3" /> Manual import
                  </Badge>
                  {selected.ai_category && <Badge variant="secondary" className="text-[10px]">{selected.ai_category}</Badge>}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div><strong>From:</strong> {selected.from_name ?? "—"} {selected.from_email ? `<${selected.from_email}>` : ""}</div>
                  {selected.to_addresses?.length ? <div><strong>To:</strong> {selected.to_addresses.join(", ")}</div> : null}
                  {selected.sent_at && <div><strong>Sent:</strong> {format(new Date(selected.sent_at), "PPpp")}</div>}
                  <div><strong>Imported:</strong> {format(new Date(selected.created_at), "PPpp")}</div>
                </div>
                {selected.ai_summary && (
                  <div className="border border-border rounded-md p-3 bg-muted/30 mt-2">
                    <div className="text-xs font-semibold mb-1">AI summary</div>
                    <p className="text-sm">{selected.ai_summary}</p>
                  </div>
                )}
                <div className="border-t pt-3 mt-3">
                  <div className="text-xs font-medium text-muted-foreground mb-1">Original email</div>
                  <pre className="whitespace-pre-wrap text-xs font-mono bg-muted/30 p-3 rounded-md max-h-96 overflow-y-auto">{selected.raw_body}</pre>
                </div>
                {selected.attachments && selected.attachments.length > 0 && (
                  <div className="border-t pt-3 mt-3">
                    <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <Paperclip className="h-3 w-3" /> Attachments ({selected.attachments.length})
                    </div>
                    <ul className="space-y-1">
                      {selected.attachments.map((a) => (
                        <li key={a.id} className="flex items-center justify-between gap-2 border border-border rounded-md px-2 py-1.5 text-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="truncate">{a.file_name}</span>
                          </div>
                          <button
                            onClick={async () => {
                              const { data, error } = await supabase.storage
                                .from("platform-documents")
                                .createSignedUrl(a.storage_path, 60);
                              if (error || !data?.signedUrl) return;
                              window.open(data.signedUrl, "_blank");
                            }}
                            className="text-xs text-primary hover:underline flex items-center gap-1 shrink-0"
                          >
                            <Download className="h-3 w-3" /> Download
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <PasteEmailDialog open={pasteOpen} onOpenChange={setPasteOpen} defaultClientId={clientId} />
    </>
  );
}

export function RecentEmailsCard({ clientId, onViewAll }: { clientId: string; onViewAll: () => void }) {
  const [emails, setEmails] = useState<Array<{ id: string; subject: string; sent_at: string; status: string }>>([]);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("sent_emails")
        .select("id, subject, sent_at, status")
        .eq("client_id", clientId)
        .order("sent_at", { ascending: false })
        .limit(2);
      setEmails(data ?? []);
    })();
  }, [clientId]);

  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Recent Emails</h3>
        <button onClick={onViewAll} className="text-xs text-muted-foreground hover:text-foreground">View all</button>
      </div>
      {emails.length === 0 ? (
        <p className="text-sm text-muted-foreground">No emails sent yet.</p>
      ) : (
        <ul className="divide-y">
          {emails.map((e) => (
            <li key={e.id} className="py-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium truncate">{e.subject}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(e.sent_at), { addSuffix: true })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

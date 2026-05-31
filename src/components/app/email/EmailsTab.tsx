import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

type EmailRow = {
  id: string; subject: string; body_html: string | null; body_text: string | null;
  from_address: string; to_addresses: string[]; cc_addresses: string[]; bcc_addresses: string[];
  attachments: Array<{ id: string; file_name: string }>;
  sent_by: string | null; sent_at: string; status: string;
};

export function EmailsTab({ clientId }: { clientId: string }) {
  const [emails, setEmails] = useState<EmailRow[]>([]);
  const [actors, setActors] = useState<Record<string, { full_name: string | null; email: string | null }>>({});
  const [selected, setSelected] = useState<EmailRow | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("sent_emails")
      .select("*")
      .eq("client_id", clientId)
      .order("sent_at", { ascending: false });
    const rows = (data ?? []) as EmailRow[];
    setEmails(rows);
    const ids = Array.from(new Set(rows.map((r) => r.sent_by).filter(Boolean))) as string[];
    if (ids.length) {
      const { data: profs } = await (supabase as any).from("profiles").select("id, full_name, email").in("id", ids);
      const map: Record<string, any> = {};
      (profs ?? []).forEach((p: any) => (map[p.id] = { full_name: p.full_name, email: p.email }));
      setActors(map);
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [clientId]);

  if (loading) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (emails.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-lg p-10 text-center text-muted-foreground">
        <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No emails sent yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border border-border rounded-lg divide-y divide-border bg-card">
        {emails.map((e) => {
          const actor = e.sent_by ? actors[e.sent_by] : null;
          return (
            <button
              key={e.id} onClick={() => setSelected(e)}
              className="w-full text-left p-4 hover:bg-muted/40 transition-colors flex items-start gap-3"
            >
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
                <div className="text-xs text-muted-foreground mt-0.5 truncate">
                  To: {e.to_addresses.join(", ")}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {actor?.full_name ?? actor?.email ?? "—"} · {formatDistanceToNow(new Date(e.sent_at), { addSuffix: true })}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.subject}</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div><strong>From:</strong> {selected.from_address}</div>
                  <div><strong>To:</strong> {selected.to_addresses.join(", ")}</div>
                  {selected.cc_addresses.length > 0 && <div><strong>Cc:</strong> {selected.cc_addresses.join(", ")}</div>}
                  {selected.bcc_addresses.length > 0 && <div><strong>Bcc:</strong> {selected.bcc_addresses.join(", ")}</div>}
                  <div><strong>Sent:</strong> {format(new Date(selected.sent_at), "PPpp")}</div>
                </div>
                <div className="prose prose-sm max-w-none border-t pt-3 mt-3"
                  dangerouslySetInnerHTML={{ __html: selected.body_html ?? selected.body_text ?? "" }}
                />
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
        </DialogContent>
      </Dialog>
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

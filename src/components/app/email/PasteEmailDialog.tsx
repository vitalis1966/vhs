import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, Mail, Calendar, ClipboardPaste, UserPlus, Wand2, Paperclip, X } from "lucide-react";
import { toast } from "sonner";

type ClientLite = { id: string; name: string };
type ProjectLite = { id: string; name: string; client_id: string };
type Member = { user_id: string; full_name: string | null; email: string | null };

interface ParsedAction {
  title: string;
  due_date?: string;
  priority?: "High" | "Medium" | "Normal";
  context?: string;
  _enabled?: boolean;
  _assignee?: string;
}
interface ParsedMeeting {
  title?: string;
  starts_at?: string;
  location?: string;
  attendees?: string[];
  agenda?: string;
  _create?: boolean;
}
interface ParsePayload {
  parsed: {
    from_name?: string;
    from_email?: string;
    to?: string[];
    cc?: string[];
    subject?: string;
    sent_at?: string;
    summary?: string;
    category?: string;
    action_items?: ParsedAction[];
    meeting?: ParsedMeeting;
    mentioned_people?: { name: string; role?: string }[];
    financials?: { amount?: string; currency?: string; reference?: string }[];
    sender_signature?: { title?: string; phone?: string; company?: string };
  };
  matched_contact: { id: string; name: string; email: string } | null;
  matched_client: { id: string; name: string } | null;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultClientId?: string | null;
  defaultProjectId?: string | null;
}

function addBusinessDays(d: Date, n: number) {
  const r = new Date(d);
  let added = 0;
  while (added < n) {
    r.setDate(r.getDate() + 1);
    const dow = r.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return r;
}
const defaultDueIso = () => addBusinessDays(new Date(), 3).toISOString().slice(0, 10);

const CATEGORY_COLOR: Record<string, string> = {
  "Urgent": "bg-red-100 text-red-800",
  "Action required": "bg-orange-100 text-orange-800",
  "Meeting request": "bg-blue-100 text-blue-800",
  "Invoice / finance": "bg-emerald-100 text-emerald-800",
  "New enquiry": "bg-violet-100 text-violet-800",
  "Legal / contract": "bg-amber-100 text-amber-800",
  "FYI / document": "bg-slate-100 text-slate-700",
};

export function PasteEmailDialog({ open, onOpenChange, defaultClientId, defaultProjectId }: Props) {
  const { workspaceId, userId } = useWorkspace();
  const [step, setStep] = useState<"input" | "review">("input");
  const [raw, setRaw] = useState("");
  const [clientId, setClientId] = useState<string>(defaultClientId ?? "");
  const [projectId, setProjectId] = useState<string>(defaultProjectId ?? "");
  const [clients, setClients] = useState<ClientLite[]>([]);
  const [projects, setProjects] = useState<ProjectLite[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<ParsePayload | null>(null);
  const [actions, setActions] = useState<ParsedAction[]>([]);
  const [meeting, setMeeting] = useState<ParsedMeeting | null>(null);
  const [createContact, setCreateContact] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setStep("input");
      setRaw("");
      setData(null);
      setActions([]);
      setMeeting(null);
      setFiles([]);
      setClientId(defaultClientId ?? "");
      setProjectId(defaultProjectId ?? "");
    }
  }, [open, defaultClientId, defaultProjectId]);

  useEffect(() => {
    if (!open || !workspaceId) return;
    (async () => {
      const [{ data: cl }, { data: pr }, { data: wm }] = await Promise.all([
        supabase.from("clients").select("id, name").eq("workspace_id", workspaceId).order("name"),
        supabase.from("projects").select("id, name, client_id").eq("workspace_id", workspaceId),
        supabase.from("workspace_members").select("user_id, profiles(full_name, email)").eq("workspace_id", workspaceId).eq("status", "active"),
      ]);
      setClients((cl ?? []) as ClientLite[]);
      setProjects((pr ?? []) as ProjectLite[]);
      setMembers(((wm ?? []) as any[]).map((m) => ({
        user_id: m.user_id, full_name: m.profiles?.full_name ?? null, email: m.profiles?.email ?? null,
      })).filter((m) => !!m.user_id));
    })();
  }, [open, workspaceId]);

  const filteredProjects = useMemo(
    () => projects.filter((p) => !clientId || p.client_id === clientId),
    [projects, clientId],
  );

  const handleParse = async () => {
    if (!raw.trim() || !workspaceId) return;
    setParsing(true);
    try {
      const { data: res, error } = await supabase.functions.invoke("parse-pasted-email", {
        body: { raw_email: raw, workspace_id: workspaceId, client_id: clientId || null },
      });
      if (error) throw error;
      if ((res as any)?.error) throw new Error((res as any).error);
      const payload = res as ParsePayload;
      setData(payload);
      if (!clientId && payload.matched_client?.id) setClientId(payload.matched_client.id);
      const ai = payload.parsed?.action_items ?? [];
      setActions(ai.map((a) => ({
        ...a,
        _enabled: true,
        _assignee: userId ?? undefined,
        due_date: a.due_date || defaultDueIso(),
        priority: a.priority ?? "Medium" as any,
      })));
      const m = payload.parsed?.meeting;
      setMeeting(m && (m.title || m.starts_at) ? { ...m, _create: true } : null);
      setCreateContact(!payload.matched_contact && !!payload.parsed?.from_email);
      setStep("review");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to parse email");
    } finally {
      setParsing(false);
    }
  };

  const handleSave = async (mode: "all" | "email_only") => {
    if (!workspaceId || !data) return;
    if (mode === "all" && !clientId) {
      toast.error("Please select a client before saving tasks and meetings.");
      return;
    }
    setSaving(true);
    try {
      // Upload attachments to storage first
      let uploadedAttachments: { storage_path: string; file_name: string; mime_type: string; size_bytes: number }[] = [];
      if (files.length > 0) {
        setUploading(true);
        for (const f of files) {
          const safeName = f.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const path = `${workspaceId}/pasted-emails/${crypto.randomUUID()}-${safeName}`;
          const { error: upErr } = await supabase.storage
            .from("platform-documents")
            .upload(path, f, { contentType: f.type || "application/octet-stream", upsert: false });
          if (upErr) {
            toast.error(`Failed to upload ${f.name}: ${upErr.message}`);
            setUploading(false);
            setSaving(false);
            return;
          }
          uploadedAttachments.push({
            storage_path: path, file_name: f.name,
            mime_type: f.type || "application/octet-stream", size_bytes: f.size,
          });
        }
        setUploading(false);
      }

      const p = data.parsed;
      const tasksPayload = mode === "all"
        ? actions.filter((a) => a._enabled && a.title.trim()).map((a) => ({
            title: a.title, due_date: a.due_date || null,
            priority: a.priority === "Normal" ? "Medium" : (a.priority ?? "Medium"),
            assignee_user_id: a._assignee || userId,
            description: a.context,
          }))
        : [];
      const meetingPayload = mode === "all" && meeting && meeting._create
        ? {
            title: meeting.title, starts_at: meeting.starts_at, location: meeting.location,
            external_attendees: meeting.attendees ?? [],
            attendees: [], create: true,
          }
        : null;

      const { data: res, error } = await supabase.functions.invoke("save-pasted-email", {
        body: {
          workspace_id: workspaceId,
          client_id: clientId || null,
          project_id: projectId || null,
          raw_body: raw,
          from_name: p.from_name, from_email: p.from_email,
          to_addresses: p.to ?? [], cc_addresses: p.cc ?? [],
          subject: p.subject, sent_at: p.sent_at,
          ai_summary: p.summary, ai_category: p.category, ai_payload: p,
          tasks: tasksPayload,
          meeting: meetingPayload,
          create_contact: mode === "all" && createContact && !data.matched_contact,
          contact_name: p.from_name,
          attachments: uploadedAttachments,
          mode,
        },
      });
      if (error) throw error;
      if ((res as any)?.error) throw new Error((res as any).error);

      const r = res as { task_ids: string[]; meeting_id: string | null; contact_id: string | null; attachment_ids: string[] };
      const parts: string[] = ["Email saved"];
      if (r.attachment_ids?.length) parts.push(`${r.attachment_ids.length} file${r.attachment_ids.length === 1 ? "" : "s"}`);
      if (r.task_ids?.length) parts.push(`${r.task_ids.length} task${r.task_ids.length === 1 ? "" : "s"}`);
      if (r.meeting_id) parts.push("1 meeting");
      if (r.contact_id) parts.push("1 contact");
      toast.success(parts.join(" · "));
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardPaste className="h-5 w-5" /> Quick Import Email
          </DialogTitle>
          <DialogDescription>
            Paste a raw email and let AI parse, file it, and create tasks. Temporary tool until the Outlook integration is live.
          </DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Client (optional)</Label>
                <Select value={clientId} onValueChange={(v) => { setClientId(v); setProjectId(""); }}>
                  <SelectTrigger><SelectValue placeholder="Auto-detect from email" /></SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {clientId && (
                <div>
                  <Label>Project (optional)</Label>
                  <Select value={projectId} onValueChange={setProjectId}>
                    <SelectTrigger><SelectValue placeholder="No project" /></SelectTrigger>
                    <SelectContent>
                      {filteredProjects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div>
              <Label>Pasted email</Label>
              <Textarea
                value={raw} onChange={(e) => setRaw(e.target.value)}
                placeholder={"Paste your email here — copy the full email including From, To, Subject, Date, and body"}
                className="min-h-[280px] font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground mt-1">{raw.length.toLocaleString()} chars</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleParse} disabled={!raw.trim() || parsing}>
                {parsing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {parsing ? "Parsing…" : "Parse & Import"}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "review" && data && (
          <div className="space-y-5">
            {/* Summary */}
            <div className="border border-border rounded-lg p-4 bg-card">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{data.parsed.subject ?? "(no subject)"}</div>
                  <div className="text-xs text-muted-foreground">
                    From: <strong>{data.parsed.from_name ?? "—"}</strong>{data.parsed.from_email ? ` <${data.parsed.from_email}>` : ""}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {data.parsed.sent_at ? new Date(data.parsed.sent_at).toLocaleString() : "Date not detected"}
                  </div>
                </div>
                {data.parsed.category && (
                  <Badge className={CATEGORY_COLOR[data.parsed.category] ?? "bg-muted text-foreground"}>
                    {data.parsed.category}
                  </Badge>
                )}
              </div>
              {data.parsed.summary && (
                <p className="text-sm mt-3 leading-relaxed">{data.parsed.summary}</p>
              )}
            </div>

            {/* Client / Project */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Client</Label>
                <Select value={clientId} onValueChange={(v) => { setClientId(v); setProjectId(""); }}>
                  <SelectTrigger><SelectValue placeholder="Choose client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {data.matched_client && (
                  <p className="text-xs text-muted-foreground mt-1">Suggested: {data.matched_client.name}</p>
                )}
              </div>
              <div>
                <Label>Project</Label>
                <Select value={projectId} onValueChange={setProjectId} disabled={!clientId}>
                  <SelectTrigger><SelectValue placeholder="No project" /></SelectTrigger>
                  <SelectContent>
                    {filteredProjects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* New contact suggestion */}
            {!data.matched_contact && data.parsed.from_email && clientId && (
              <div className="border border-border rounded-lg p-3 bg-muted/30 flex items-start gap-3">
                <UserPlus className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Sender not in contacts</div>
                  <div className="text-xs text-muted-foreground">
                    Create new contact: {data.parsed.from_name ?? data.parsed.from_email} ({data.parsed.from_email})
                  </div>
                </div>
                <Checkbox checked={createContact} onCheckedChange={(v) => setCreateContact(!!v)} />
              </div>
            )}

            {/* Action items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold flex items-center gap-2"><Wand2 className="h-4 w-4" /> Detected action items</h4>
                <span className="text-xs text-muted-foreground">{actions.filter((a) => a._enabled).length} of {actions.length} selected</span>
              </div>
              {actions.length === 0 && <p className="text-sm text-muted-foreground">No action items detected.</p>}
              <div className="space-y-2">
                {actions.map((a, i) => (
                  <div key={i} className="border border-border rounded-lg p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <Checkbox checked={!!a._enabled} onCheckedChange={(v) => {
                        const copy = [...actions]; copy[i] = { ...copy[i], _enabled: !!v }; setActions(copy);
                      }} />
                      <Input
                        value={a.title}
                        onChange={(e) => { const copy = [...actions]; copy[i] = { ...copy[i], title: e.target.value }; setActions(copy); }}
                        className="flex-1"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pl-6">
                      <div>
                        <Label className="text-xs">Assignee</Label>
                        <Select value={a._assignee ?? userId ?? ""} onValueChange={(v) => {
                          const copy = [...actions]; copy[i] = { ...copy[i], _assignee: v }; setActions(copy);
                        }}>
                          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {members.map((m) => (
                              <SelectItem key={m.user_id} value={m.user_id}>
                                {m.full_name ?? m.email ?? m.user_id}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Due date</Label>
                        <Input type="date" className="h-8" value={a.due_date ?? ""}
                          onChange={(e) => { const copy = [...actions]; copy[i] = { ...copy[i], due_date: e.target.value }; setActions(copy); }} />
                      </div>
                      <div>
                        <Label className="text-xs">Priority</Label>
                        <Select value={a.priority ?? "Medium"} onValueChange={(v) => {
                          const copy = [...actions]; copy[i] = { ...copy[i], priority: v as any }; setActions(copy);
                        }}>
                          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Normal">Normal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meeting */}
            {meeting && (
              <div className="border border-border rounded-lg p-3 space-y-2 bg-card">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold flex items-center gap-2"><Calendar className="h-4 w-4" /> Detected meeting</h4>
                  <label className="flex items-center gap-2 text-xs">
                    <Checkbox checked={!!meeting._create} onCheckedChange={(v) => setMeeting({ ...meeting, _create: !!v })} />
                    Create meeting record
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Title</Label>
                    <Input value={meeting.title ?? ""} onChange={(e) => setMeeting({ ...meeting, title: e.target.value })} className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Date & time</Label>
                    <Input type="datetime-local" className="h-8"
                      value={meeting.starts_at ? new Date(meeting.starts_at).toISOString().slice(0, 16) : ""}
                      onChange={(e) => setMeeting({ ...meeting, starts_at: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                    />
                  </div>
                </div>
                {meeting.attendees?.length ? (
                  <div className="text-xs text-muted-foreground">Attendees: {meeting.attendees.join(", ")}</div>
                ) : null}
              </div>
            )}

            <DialogFooter className="gap-2 flex-wrap">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
              <Button variant="secondary" onClick={() => handleSave("email_only")} disabled={saving}>
                <Mail className="h-4 w-4" /> Save email only
              </Button>
              <Button onClick={() => handleSave("all")} disabled={saving || !clientId}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Save all
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

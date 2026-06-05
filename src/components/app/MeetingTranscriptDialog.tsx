import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, FileText, X, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { sendNotification } from "@/lib/notify";

type Priority = "Low" | "Medium" | "High" | "Urgent";

interface Member { id: string; full_name: string | null; email: string | null; }

interface ExtractedAttendee { name: string; role: string; }
interface ExtractedActionItem {
  description: string;
  owner: string;
  due_date: string;
  priority: Priority;
}
interface Extracted {
  title: string;
  meeting_date: string;
  attendees: ExtractedAttendee[];
  summary: string;
  decisions: string[];
  action_items: ExtractedActionItem[];
  topics: string[];
  next_meeting_date: string;
}

interface ReviewActionItem extends ExtractedActionItem {
  ownerUserId: string | null;     // resolved workspace member id
  createAsTask: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  workspaceId: string;
  onSaved?: () => void;
}

function toLocalInput(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function todayLocal() { return toLocalInput(new Date().toISOString()); }

function findMemberMatch(name: string, members: Member[]): string | null {
  if (!name) return null;
  const lc = name.trim().toLowerCase();
  const exact = members.find(
    (m) => (m.full_name ?? "").toLowerCase() === lc || (m.email ?? "").toLowerCase() === lc
  );
  if (exact) return exact.id;
  const partial = members.find((m) => {
    const fn = (m.full_name ?? "").toLowerCase();
    return fn && (fn.includes(lc) || lc.includes(fn));
  });
  return partial?.id ?? null;
}

async function readFileForExtraction(file: File): Promise<{ transcript?: string; file_base64?: string; file_mime?: string }> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "txt" || ext === "vtt" || ext === "md" || file.type.startsWith("text/")) {
    let text = await file.text();
    if (ext === "vtt") {
      // strip WEBVTT header + cue timings
      text = text
        .replace(/^WEBVTT.*\n/i, "")
        .replace(/^\d+\s*\n/gm, "")
        .replace(/^\d{2}:\d{2}:\d{2}.*-->.*\n/gm, "");
    }
    return { transcript: text };
  }
  if (ext === "docx" || ext === "doc") {
    const mammoth = await import("mammoth");
    const buf = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buf });
    return { transcript: result.value };
  }
  if (ext === "pdf") {
    const buf = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
    return { file_base64: base64, file_mime: "application/pdf" };
  }
  throw new Error(`Unsupported file type: .${ext}`);
}

export function MeetingTranscriptDialog({ open, onOpenChange, clientId, workspaceId, onSaved }: Props) {
  const { userId } = useWorkspace();
  const [step, setStep] = useState<"input" | "extracting" | "review">("input");
  const [tab, setTab] = useState<"upload" | "paste">("paste");
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [meetingDate, setMeetingDate] = useState(todayLocal());
  const [members, setMembers] = useState<Member[]>([]);
  const [saving, setSaving] = useState(false);

  // Review state
  const [rTitle, setRTitle] = useState("");
  const [rDate, setRDate] = useState("");
  const [rSummary, setRSummary] = useState("");
  const [rAttendees, setRAttendees] = useState<Array<ExtractedAttendee & { userId: string | null }>>([]);
  const [rDecisions, setRDecisions] = useState<string[]>([]);
  const [rActionItems, setRActionItems] = useState<ReviewActionItem[]>([]);
  const [rTopics, setRTopics] = useState<string[]>([]);
  const [rTopicInput, setRTopicInput] = useState("");
  const [rNextMeeting, setRNextMeeting] = useState("");

  const draftKey = `meeting-draft:${workspaceId}:${clientId}`;

  useEffect(() => {
    if (!open) return;
    if (!workspaceId) return;
    (async () => {
      const { data: wm } = await (supabase as any)
        .from("workspace_members").select("user_id").eq("workspace_id", workspaceId).eq("status", "active");
      const ids = (wm ?? []).map((w: any) => w.user_id).filter(Boolean);
      if (!ids.length) { setMembers([]); return;}
      const { data: profs } = await (supabase as any)
        .from("profiles").select("id, full_name, email").in("id", ids);
      setMembers(profs ?? []);
    })();

    // Restore draft if available
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const d = JSON.parse(raw);
        setStep("review");
        setRTitle(d.rTitle ?? ""); setRDate(d.rDate ?? "");
        setRSummary(d.rSummary ?? ""); setRAttendees(d.rAttendees ?? []);
        setRDecisions(d.rDecisions ?? []); setRActionItems(d.rActionItems ?? []);
        setRTopics(d.rTopics ?? []); setRNextMeeting(d.rNextMeeting ?? "");
        toast.info("Restored unsaved meeting draft");
      }
    } catch {}
  }, [open, workspaceId]);

  const persistDraft = () => {
    try {
      localStorage.setItem(draftKey, JSON.stringify({
        rTitle, rDate, rSummary, rAttendees, rDecisions, rActionItems, rTopics, rNextMeeting,
      }));
    } catch {}
  };

  const clearDraft = () => { try { localStorage.removeItem(draftKey); } catch {} };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      if (step === "review") {
        persistDraft();
        toast.info("Saved as draft — reopen to continue");
      }
      // Reset local state for next open
      setStep("input"); setFile(null); setTranscript("");
      setMeetingDate(todayLocal()); setTab("paste");
    }
    onOpenChange(next);
  };


  const extract = async () => {
    try {
      let payload: any = { workspace_members: members, default_date: new Date(meetingDate).toISOString() };
      if (tab === "paste") {
        if (!transcript.trim()) return toast.error("Paste a transcript first");
        payload.transcript = transcript;
      } else {
        if (!file) return toast.error("Choose a file first");
        const fileData = await readFileForExtraction(file);
        payload = { ...payload, ...fileData };
      }
      setStep("extracting");
      const { data, error } = await supabase.functions.invoke("extract-meeting-transcript", { body: payload });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const ex = data?.extracted as Extracted;
      if (!ex) throw new Error("No data extracted");

      setRTitle(ex.title ?? "Untitled meeting");
      setRDate(ex.meeting_date ? toLocalInput(ex.meeting_date) : meetingDate);
      setRSummary(ex.summary ?? "");
      setRAttendees((ex.attendees ?? []).map((a) => ({ ...a, userId: findMemberMatch(a.name, members) })));
      setRDecisions(ex.decisions ?? []);
      setRActionItems((ex.action_items ?? []).map((a) => ({
        ...a,
        priority: (["Low","Medium","High","Urgent"].includes(a.priority) ? a.priority : "Medium") as Priority,
        ownerUserId: findMemberMatch(a.owner, members),
        createAsTask: true,
      })));
      setRTopics(ex.topics ?? []);
      setRNextMeeting(ex.next_meeting_date ? toLocalInput(ex.next_meeting_date) : "");
      setStep("review");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Extraction failed");
      setStep("input");
    }
  };

  const save = async () => {
    if (!userId) return;
    if (!rTitle.trim()) return toast.error("Title is required");
    if (!rDate) return toast.error("Date is required");
    setSaving(true);
    try {
      // 1. Insert meeting
      const meetingPayload: any = {
        workspace_id: workspaceId,
        client_id: clientId,
        title: rTitle.trim(),
        meeting_date: new Date(rDate).toISOString(),
        summary: { type: "doc", content: rSummary.split(/\n\n+/).map((p) => ({
          type: "paragraph", content: p.trim() ? [{ type: "text", text: p.trim() }] : [],
        })) },
        summary_text: rSummary,
        external_attendees: rAttendees.filter((a) => !a.userId).map((a) => a.role ? `${a.name} (${a.role})` : a.name),
        topics: rTopics,
        next_meeting_date: rNextMeeting ? new Date(rNextMeeting).toISOString() : null,
        created_by: userId,
      };
      const { data: mIns, error: mErr } = await (supabase as any)
        .from("meetings").insert(meetingPayload).select("id").single();
      if (mErr) throw mErr;
      const meetingId = mIns.id;

      // 2. Internal attendees
      const internal = Array.from(new Set(rAttendees.filter((a) => a.userId).map((a) => a.userId!)));
      if (internal.length) {
        await (supabase as any).from("meeting_attendees").insert(
          internal.map((uid) => ({ meeting_id: meetingId, user_id: uid }))
        );
      }

      // 3. Decisions
      const decs = rDecisions.filter((d) => d.trim());
      if (decs.length) {
        await (supabase as any).from("meeting_decisions").insert(
          decs.map((content, i) => ({ meeting_id: meetingId, content: content.trim(), position: i }))
        );
      }

      // 4. Action items + optional task creation
      // fetch first status for new tasks
      const { data: statuses } = await (supabase as any)
        .from("task_statuses").select("id").eq("workspace_id", workspaceId).order("position").limit(1);
      const firstStatus = statuses?.[0]?.id ?? null;

      const validAI = rActionItems.filter((a) => a.description.trim());
      // Build a lookup of attendee names → external/internal for context
      const externalAttendeeNames = rAttendees.filter((a) => !a.userId).map((a) => a.name.trim()).filter(Boolean);
      const meetingDateLabel = rDate ? new Date(rDate).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";

      for (let i = 0; i < validAI.length; i++) {
        const a = validAI[i];
        let convertedTaskId: string | null = null;

        if (a.createAsTask) {
          // Resolve assignee: prefer matched internal owner, otherwise fall back
          // to the meeting organizer (current user) and flag for review.
          const externalOwnerRaw = (a.owner ?? "").trim();
          const isExternalOwner =
            !a.ownerUserId &&
            externalOwnerRaw &&
            externalAttendeeNames.some((n) => n.toLowerCase() === externalOwnerRaw.toLowerCase());
          const assigneeUserId = a.ownerUserId ?? (isExternalOwner ? null : userId);
          const assigneeUnconfirmed = !a.ownerUserId && !isExternalOwner;

          // Compose a rich description that captures meeting context.
          const descLines: string[] = [];
          descLines.push(a.description.trim());
          descLines.push("");
          descLines.push(`Source: ${rTitle.trim() || "Meeting"}${meetingDateLabel ? ` — ${meetingDateLabel}` : ""}`);
          if (a.due_date) descLines.push(`Deadline mentioned: ${a.due_date}`);
          if (isExternalOwner) descLines.push(`Assigned to (external): ${externalOwnerRaw}`);
          else if (assigneeUnconfirmed) descLines.push(`Assignee not confirmed in meeting — please reassign if needed${externalOwnerRaw ? ` (transcript referenced: ${externalOwnerRaw})` : ""}.`);
          if (rSummary.trim()) {
            descLines.push("");
            descLines.push("Meeting summary excerpt:");
            descLines.push(rSummary.trim().slice(0, 600) + (rSummary.trim().length > 600 ? "…" : ""));
          }
          const descriptionText = descLines.join("\n");
          const descriptionJson = {
            type: "doc",
            content: descriptionText.split("\n").map((line) => ({
              type: "paragraph",
              content: line.trim() ? [{ type: "text", text: line }] : [],
            })),
          };

          const { data: tData, error: tErr } = await (supabase as any).from("tasks").insert({
            workspace_id: workspaceId, client_id: clientId,
            title: a.description.trim(),
            description: descriptionJson,
            description_text: descriptionText,
            priority: a.priority,
            due_date: a.due_date || null,
            status_id: firstStatus,
            created_by: userId,
            meeting_id: meetingId,
          }).select().single();
          if (tErr) { console.error("task insert failed", tErr); }
          else {
            convertedTaskId = tData.id;
            if (assigneeUserId) {
              await (supabase as any).from("task_assignees").insert({
                task_id: tData.id, user_id: assigneeUserId,
              });
              if (assigneeUserId !== userId) {
                void sendNotification({
                  user_id: assigneeUserId,
                  workspace_id: workspaceId,
                  type: "task_assigned",
                  title: "New task assigned",
                  body: a.description.trim(),
                  link_url: `/app/tasks?taskId=${tData.id}`,
                  entity_type: "task",
                  entity_id: tData.id,
                  actor_id: userId,
                });
              }
            }
            await (supabase as any).from("activities").insert({
              workspace_id: workspaceId, actor_id: userId, verb: "created",
              target_type: "task", target_id: tData.id, client_id: clientId,
              metadata: { title: a.description.trim(), via: "meeting_extraction", meeting_id: meetingId },
            });
          }
        }

        await (supabase as any).from("meeting_action_items").insert({
          meeting_id: meetingId,
          description: a.description.trim(),
          owner_id: a.ownerUserId,
          due_date: a.due_date || null,
          priority: a.priority,
          converted_task_id: convertedTaskId,
          position: i,
        });
      }


      // 5. Activity feed
      await (supabase as any).from("activities").insert({
        workspace_id: workspaceId, actor_id: userId, verb: "meeting_logged",
        target_type: "meeting", target_id: meetingId, client_id: clientId,
        metadata: { title: rTitle.trim(), via: "transcript" },
      });

      toast.success("Meeting saved");
      clearDraft();
      onSaved?.();
      onOpenChange(false);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Failed to save meeting");
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[92vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => { if (step === "extracting") e.preventDefault(); }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            {step === "review" ? "Review extracted meeting" : "Upload meeting transcript"}
          </DialogTitle>
          <DialogDescription>
            {step === "review"
              ? "Every field is editable. Action items checked here will become tasks."
              : "AI will extract the title, attendees, summary, decisions, action items, and topics."}
          </DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="t-date">Meeting Date</Label>
              <Input id="t-date" type="datetime-local" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="paste">Paste text</TabsTrigger>
                <TabsTrigger value="upload">Upload file</TabsTrigger>
              </TabsList>
              <TabsContent value="paste" className="mt-3">
                <Textarea
                  value={transcript} onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Paste the meeting transcript here…"
                  className="min-h-[260px] font-mono text-xs"
                />
              </TabsContent>
              <TabsContent value="upload" className="mt-3">
                <label className="block border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors">
                  <input
                    type="file"
                    accept=".txt,.vtt,.md,.pdf,.doc,.docx,text/plain"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <FileText className="h-5 w-5 text-primary" />
                      {file.name}
                      <span className="text-muted-foreground text-xs">({Math.round(file.size / 1024)} KB)</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm">Click to choose a transcript file</p>
                      <p className="text-xs text-muted-foreground mt-1">.txt, .vtt, .md, .pdf, .doc, .docx</p>
                    </>
                  )}
                </label>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {step === "extracting" && (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            Extracting meeting details…
          </div>
        )}

        {step === "review" && (
          <div className="space-y-5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="r-title">Title</Label>
                <Input id="r-title" value={rTitle} onChange={(e) => setRTitle(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="r-date">Date & Time</Label>
                <Input id="r-date" type="datetime-local" value={rDate} onChange={(e) => setRDate(e.target.value)} />
              </div>
            </div>

            <div>
              <Label>Attendees</Label>
              <div className="space-y-2 mt-1.5">
                {rAttendees.map((a, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-start">
                    <Input
                      className="col-span-4" placeholder="Name" value={a.name}
                      onChange={(e) => setRAttendees((x) => x.map((v, j) => j === i ? { ...v, name: e.target.value } : v))}
                    />
                    <Input
                      className="col-span-4" placeholder="Role" value={a.role}
                      onChange={(e) => setRAttendees((x) => x.map((v, j) => j === i ? { ...v, role: e.target.value } : v))}
                    />
                    <Select
                      value={a.userId ?? "none"}
                      onValueChange={(v) => setRAttendees((x) => x.map((v2, j) => j === i ? { ...v2, userId: v === "none" ? null : v } : v2))}
                    >
                      <SelectTrigger className="col-span-3"><SelectValue placeholder="Link to member" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">External / Not linked</SelectItem>
                        {members.map((m) => <SelectItem key={m.id} value={m.id}>{m.full_name ?? m.email}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button type="button" size="icon" variant="ghost" className="col-span-1"
                      onClick={() => setRAttendees((x) => x.filter((_, j) => j !== i))}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm"
                  onClick={() => setRAttendees((x) => [...x, { name: "", role: "", userId: null }])}>
                  <Plus className="h-4 w-4 mr-1" /> Add attendee
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="r-summary">Summary</Label>
              <Textarea id="r-summary" value={rSummary} onChange={(e) => setRSummary(e.target.value)} className="min-h-[180px]" />
            </div>

            <div>
              <Label>Key Decisions</Label>
              <div className="space-y-2 mt-1.5">
                {rDecisions.map((d, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <Textarea
                      value={d}
                      onChange={(e) => setRDecisions((x) => x.map((v, j) => j === i ? e.target.value : v))}
                      className="min-h-[60px] flex-1"
                    />
                    <Button type="button" size="icon" variant="ghost"
                      onClick={() => setRDecisions((x) => x.filter((_, j) => j !== i))}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm"
                  onClick={() => setRDecisions((x) => [...x, ""])}>
                  <Plus className="h-4 w-4 mr-1" /> Add decision
                </Button>
              </div>
            </div>

            <div>
              <Label>Action Items</Label>
              <div className="space-y-3 mt-1.5">
                {rActionItems.map((a, i) => (
                  <div key={i} className="rounded-md border p-3 space-y-2 bg-card">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        checked={a.createAsTask}
                        onCheckedChange={(v) => setRActionItems((x) => x.map((v2, j) => j === i ? { ...v2, createAsTask: !!v } : v2))}
                        className="mt-1"
                      />
                      <Textarea
                        value={a.description}
                        onChange={(e) => setRActionItems((x) => x.map((v, j) => j === i ? { ...v, description: e.target.value } : v))}
                        className="min-h-[50px] flex-1"
                        placeholder="Description"
                      />
                      <Button type="button" size="icon" variant="ghost"
                        onClick={() => setRActionItems((x) => x.filter((_, j) => j !== i))}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-12 gap-2 pl-7">
                      <Select
                        value={a.ownerUserId ?? "none"}
                        onValueChange={(v) => setRActionItems((x) => x.map((v2, j) => j === i ? { ...v2, ownerUserId: v === "none" ? null : v } : v2))}
                      >
                        <SelectTrigger className="col-span-5"><SelectValue placeholder="Owner" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Unassigned ({a.owner || "—"})</SelectItem>
                          {members.map((m) => <SelectItem key={m.id} value={m.id}>{m.full_name ?? m.email}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input
                        type="date" value={a.due_date}
                        onChange={(e) => setRActionItems((x) => x.map((v, j) => j === i ? { ...v, due_date: e.target.value } : v))}
                        className="col-span-4"
                      />
                      <Select
                        value={a.priority}
                        onValueChange={(v) => setRActionItems((x) => x.map((v2, j) => j === i ? { ...v2, priority: v as Priority } : v2))}
                      >
                        <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["Low","Medium","High","Urgent"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-xs text-muted-foreground pl-7">
                      {a.createAsTask ? "Will be created as a task on this client." : "Saved as action item only."}
                    </p>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm"
                  onClick={() => setRActionItems((x) => [...x, { description: "", owner: "", ownerUserId: null, due_date: "", priority: "Medium", createAsTask: true }])}>
                  <Plus className="h-4 w-4 mr-1" /> Add action item
                </Button>
              </div>
            </div>

            <div>
              <Label>Topics</Label>
              <div className="flex flex-wrap gap-1.5 mt-1.5 mb-2">
                {rTopics.map((t, i) => (
                  <Badge key={i} variant="secondary" className="gap-1">
                    {t}
                    <button onClick={() => setRTopics((x) => x.filter((_, j) => j !== i))}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={rTopicInput} onChange={(e) => setRTopicInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const v = rTopicInput.trim();
                      if (v) { setRTopics((x) => [...x, v]); setRTopicInput(""); }
                    }
                  }}
                  placeholder="Add a topic and press Enter" />
              </div>
            </div>

            <div>
              <Label htmlFor="r-next">Next Meeting</Label>
              <Input id="r-next" type="datetime-local" value={rNextMeeting} onChange={(e) => setRNextMeeting(e.target.value)} />
            </div>
          </div>
        )}

        <DialogFooter>
          {step === "input" && (
            <>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={extract}>
                <Sparkles className="h-4 w-4 mr-1.5" /> Extract Meeting
              </Button>
            </>
          )}
          {step === "review" && (
            <>
              <Button variant="ghost" onClick={() => setStep("input")}>Back</Button>
              <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Meeting"}</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Calendar, ArrowLeft, Pencil, ArrowRight, Check, Sparkles, Trash2, Mail, CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";
import { parseDateOnly } from "@/components/app/taskUtils";
import { MeetingDialog } from "./MeetingDialog";
import { MeetingTranscriptDialog } from "./MeetingTranscriptDialog";
import { TaskFormDialog } from "./TaskFormDialog";
import { ComposeEmailDialog } from "./email/ComposeEmailDialog";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";


interface Meeting {
  id: string;
  title: string;
  meeting_date: string;
  summary_text: string | null;
  external_attendees: string[] | null;
  created_by: string | null;
}

interface ActionItem {
  id: string;
  meeting_id: string;
  description: string;
  owner_id: string | null;
  due_date: string | null;
  priority: string | null;
  converted_task_id: string | null;
  position: number;
}

function initials(s?: string | null) {
  if (!s) return "?";
  return s.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function MeetingsTab({ clientId, workspaceId }: { clientId: string; workspaceId: string }) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [selected, setSelected] = useState<Meeting | null>(null);
  const [editing, setEditing] = useState<Meeting | null>(null);
  const [attendeeCounts, setAttendeeCounts] = useState<Record<string, number>>({});

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("meetings")
      .select("id, title, meeting_date, summary_text, external_attendees, created_by")
      .eq("client_id", clientId)
      .order("meeting_date", { ascending: false });
    const list = (data ?? []) as Meeting[];
    setMeetings(list);
    if (list.length) {
      const { data: att } = await (supabase as any)
        .from("meeting_attendees").select("meeting_id").in("meeting_id", list.map((m) => m.id));
      const counts: Record<string, number> = {};
      for (const m of list) counts[m.id] = (m.external_attendees?.length ?? 0);
      for (const a of (att ?? [])) counts[a.meeting_id] = (counts[a.meeting_id] ?? 0) + 1;
      setAttendeeCounts(counts);
    } else setAttendeeCounts({});
    setLoading(false);
  };

  useEffect(() => { void load(); }, [clientId]);

  if (loading) return <p className="text-muted-foreground text-sm">Loading meetings…</p>;

  if (selected) {
    return (
      <MeetingDetail
        meeting={selected}
        clientId={clientId}
        workspaceId={workspaceId}
        onBack={() => { setSelected(null); void load(); }}
        onEdit={() => { setEditing(selected); setDialogOpen(true); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {meetings.length} meeting{meetings.length === 1 ? "" : "s"} logged
        </p>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setTranscriptOpen(true)}>
            <Sparkles className="h-4 w-4 mr-1.5" /> Upload Transcript
          </Button>
          <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-1.5" /> Log Meeting
          </Button>
        </div>
      </div>

      {meetings.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center">
          <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No meetings logged yet.</p>
        </div>
      ) : (
        <ul className="rounded-lg border bg-card divide-y">
          {meetings.map((m) => (
            <li
              key={m.id}
              onClick={() => setSelected(m)}
              className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium text-sm">{m.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(m.meeting_date), "MMM d, yyyy · h:mm a")}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {attendeeCounts[m.id] ?? 0} attendee{(attendeeCounts[m.id] ?? 0) === 1 ? "" : "s"}
                    </Badge>
                  </div>
                  {m.summary_text && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{m.summary_text}</p>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />
              </div>
            </li>
          ))}
        </ul>
      )}

      <MeetingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        clientId={clientId}
        workspaceId={workspaceId}
        meeting={editing}
        onSaved={() => { void load(); }}
      />
      <MeetingTranscriptDialog
        open={transcriptOpen}
        onOpenChange={setTranscriptOpen}
        clientId={clientId}
        workspaceId={workspaceId}
        onSaved={() => { void load(); }}
      />
    </div>
  );
}

function MeetingDetail({
  meeting, clientId, workspaceId, onBack, onEdit,
}: {
  meeting: Meeting; clientId: string; workspaceId: string; onBack: () => void; onEdit: () => void;
}) {
  const navigate = useNavigate();
  const { userId, role, userFullName } = useWorkspace();
  const [full, setFull] = useState<any>(null);
  const [attendees, setAttendees] = useState<Array<{ id: string; full_name: string | null; email: string | null }>>([]);
  const [decisions, setDecisions] = useState<Array<{ id: string; content: string }>>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [convertOpen, setConvertOpen] = useState(false);
  const [convertingItem, setConvertingItem] = useState<ActionItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composePayload, setComposePayload] = useState<{ to: string[]; subject: string; html: string } | null>(null);
  const canDelete = role === "admin" || meeting.created_by === userId;

  const load = async () => {
    const [m, att, dec, ai] = await Promise.all([
      (supabase as any).from("meetings").select("*").eq("id", meeting.id).single(),
      (supabase as any).from("meeting_attendees").select("user_id").eq("meeting_id", meeting.id),
      (supabase as any).from("meeting_decisions").select("id, content").eq("meeting_id", meeting.id).order("position"),
      (supabase as any).from("meeting_action_items").select("*").eq("meeting_id", meeting.id).order("position"),
    ]);
    setFull(m.data);
    setDecisions(dec.data ?? []);
    setActionItems(ai.data ?? []);
    const ids = (att.data ?? []).map((a: any) => a.user_id);
    if (ids.length) {
      const { data: profs } = await (supabase as any).from("profiles").select("id, full_name, email").in("id", ids);
      setAttendees(profs ?? []);
    } else setAttendees([]);
  };

  useEffect(() => { void load(); /* eslint-disable-next-line */ }, [meeting.id]);

  // Build the owner lookup for action items (used in the summary email)
  const ownerNames = useMemo(() => {
    const m: Record<string, string> = {};
    for (const a of attendees) m[a.id] = a.full_name ?? a.email ?? "Team member";
    return m;
  }, [attendees]);

  const handleConverted = async (createdTask: any) => {
    if (!convertingItem) return;
    await (supabase as any)
      .from("meeting_action_items")
      .update({ converted_task_id: createdTask.id })
      .eq("id", convertingItem.id);
    setConvertingItem(null);
    void load();
  };

  const handleDelete = async () => {
    const { error } = await (supabase as any).from("meetings").delete().eq("id", meeting.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Meeting deleted");
    setDeleteOpen(false);
    onBack();
  };

  const tasksCreatedCount = actionItems.filter((a) => a.converted_task_id).length;
  const hasSummary = !!full?.summary_text;
  const summarySent = !!full?.summary_sent_at;

  const openSendSummary = () => {
    const toList = attendees.map((a) => a.email).filter((e): e is string => !!e);
    if (!toList.length) {
      toast.error("No attendees with email addresses found");
      return;
    }
    const meetingDateLabel = format(new Date(meeting.meeting_date), "MMMM d, yyyy");
    const subject = `Meeting Summary — ${meeting.title} — ${meetingDateLabel}`;
    const organizer = userFullName ?? "Vitalis Health Strategies";

    // Action items HTML
    const actionItemsHtml = actionItems.length === 0 ? "" : `
      <h3 style="font-family:Georgia,serif;color:#172620;font-size:16px;margin:28px 0 12px 0;letter-spacing:0.5px;text-transform:uppercase;">Action Items</h3>
      <div style="border-left:3px solid #60766B;padding:4px 0 4px 16px;margin-bottom:8px;">
        ${actionItems.map((a) => {
          const owner = a.owner_id ? (ownerNames[a.owner_id] ?? "Team") : "Unassigned";
          const due = a.due_date ? format(new Date(a.due_date), "MMM d, yyyy") : "No due date";
          return `
            <div style="margin-bottom:14px;">
              <div style="font-weight:600;color:#172620;font-size:14px;line-height:1.5;">${escapeHtml(a.description)}</div>
              <div style="color:#60766B;font-size:13px;margin-top:2px;">Assigned to: ${escapeHtml(owner)} · Due: ${escapeHtml(due)}</div>
            </div>`;
        }).join("")}
      </div>
    `;

    const nextMeetingHtml = full?.next_meeting_date
      ? `<p style="font-family:Georgia,serif;color:#172620;font-size:15px;line-height:1.7;margin:24px 0 0 0;">Our next meeting is scheduled for <strong>${escapeHtml(format(new Date(full.next_meeting_date), "EEEE, MMMM d, yyyy · h:mm a"))}</strong>.</p>`
      : "";

    const summaryParagraphs = (full?.summary_text ?? "")
      .split(/\n\n+/)
      .map((p: string) => p.trim())
      .filter(Boolean)
      .map((p: string) => `<p style="font-family:Georgia,serif;color:#172620;font-size:15px;line-height:1.7;margin:0 0 14px 0;">${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
      .join("");

    const html = `
<div style="background:#FAF8F5;padding:40px 16px;font-family:Georgia,serif;">
  <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(23,38,32,0.06);">
    <div style="background:#ffffff;border-radius:8px 8px 0 0;padding:28px 40px 20px;text-align:center;border-bottom:3px solid #C89741;">
      <img src="https://www.vitalisstrategies.com/vitalis-logo-email.png" alt="Vitalis Health Strategies" style="height:48px;width:auto;display:inline-block;" />
    </div>
    <div style="padding:32px 40px 8px;">
      <p style="font-family:Georgia,serif;color:#172620;font-size:15px;line-height:1.7;margin:0 0 18px 0;">Hello team,</p>
      <p style="font-family:Georgia,serif;color:#172620;font-size:15px;line-height:1.7;margin:0 0 22px 0;">
        Thank you for joining <strong>${escapeHtml(meeting.title)}</strong> on <strong>${escapeHtml(meetingDateLabel)}</strong>.
        Below is a summary of what was discussed and the action items coming out of our conversation.
      </p>

      <h3 style="font-family:Georgia,serif;color:#172620;font-size:16px;margin:28px 0 12px 0;letter-spacing:0.5px;text-transform:uppercase;">Meeting Summary</h3>
      <div style="border-left:3px solid #60766B;padding:4px 0 4px 16px;">
        ${summaryParagraphs || '<p style="font-family:Georgia,serif;color:#60766B;font-size:14px;margin:0;">(No summary recorded.)</p>'}
      </div>

      ${actionItemsHtml}

      ${nextMeetingHtml}

      <p style="font-family:Georgia,serif;color:#172620;font-size:15px;line-height:1.7;margin:28px 0 8px 0;">
        If you have any questions about the above, please don't hesitate to reach out.
      </p>

      <div style="margin-top:32px;padding-top:20px;border-top:1px solid #EFEAE2;">
        <p style="font-family:Georgia,serif;color:#172620;font-size:15px;line-height:1.5;margin:0;font-weight:600;">${escapeHtml(organizer)}</p>
        <p style="font-family:Georgia,serif;color:#60766B;font-size:13px;line-height:1.5;margin:2px 0 0 0;">Vitalis Health Strategies</p>
      </div>
    </div>
    <div style="background:#FAF8F5;padding:18px 40px;text-align:center;border-top:1px solid #EFEAE2;">
      <p style="font-family:Georgia,serif;color:#60766B;font-size:12px;line-height:1.5;margin:0;">
        Vitalis Health Strategies Inc. &nbsp;|&nbsp; Calgary, Alberta, Canada &nbsp;|&nbsp;
        <a href="mailto:info@vitalisstrategies.com" style="color:#60766B;text-decoration:underline;">info@vitalisstrategies.com</a> &nbsp;|&nbsp;
        <a href="https://vitalisstrategies.com" style="color:#60766B;text-decoration:underline;">vitalisstrategies.com</a>
      </p>
    </div>
  </div>
</div>`.trim();

    setComposePayload({ to: toList, subject, html });
    setComposeOpen(true);
  };

  const handleSummarySent = async () => {
    await (supabase as any)
      .from("meetings")
      .update({ summary_sent_at: new Date().toISOString(), summary_sent_by: userId })
      .eq("id", meeting.id);
    toast.success("Meeting marked as summary sent");
    void load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back to meetings
        </Button>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={openSendSummary} disabled={!hasSummary}>
            <Mail className="h-4 w-4 mr-1.5" /> Send Summary
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-1.5" /> Edit
          </Button>
          {canDelete && (
            <Button size="sm" variant="outline" onClick={() => setDeleteOpen(true)}
              className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-1.5" /> Delete
            </Button>
          )}
        </div>
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold">{meeting.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {format(new Date(meeting.meeting_date), "EEEE, MMMM d, yyyy · h:mm a")}
        </p>
      </div>

      <ProgressTrail
        steps={[
          { label: "Transcribed", done: true },
          { label: "Summarised", done: hasSummary },
          { label: "Tasks Created", done: tasksCreatedCount > 0, hint: tasksCreatedCount ? `${tasksCreatedCount} task${tasksCreatedCount === 1 ? "" : "s"}` : undefined },
          { label: "Summary Sent", done: summarySent, hint: summarySent ? format(new Date(full.summary_sent_at), "MMM d, h:mm a") : undefined },
        ]}
      />



      <Section title="Attendees">
        {attendees.length === 0 && (!full?.external_attendees || full.external_attendees.length === 0) ? (
          <p className="text-sm text-muted-foreground">No attendees recorded.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {attendees.map((a) => (
              <Badge key={a.id} variant="secondary" className="gap-1.5 py-1">
                <Avatar className="h-4 w-4"><AvatarFallback className="text-[8px]">{initials(a.full_name ?? a.email)}</AvatarFallback></Avatar>
                {a.full_name ?? a.email}
              </Badge>
            ))}
            {(full?.external_attendees ?? []).map((name: string, i: number) => (
              <Badge key={`ext-${i}`} variant="outline">{name}</Badge>
            ))}
          </div>
        )}
      </Section>

      {full?.summary_text && (
        <Section title="Summary">
          <p className="text-sm whitespace-pre-wrap text-foreground">{full.summary_text}</p>
        </Section>
      )}

      <Section title="Decisions">
        {decisions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No decisions recorded.</p>
        ) : (
          <ul className="space-y-1.5">
            {decisions.map((d) => (
              <li key={d.id} className="text-sm flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{d.content}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Action Items">
        {actionItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No action items.</p>
        ) : (
          <ul className="space-y-2">
            {actionItems.map((a) => (
              <li key={a.id} className="rounded-md border p-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{a.description}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <p className="text-xs text-muted-foreground">
                      {a.due_date ? `Due ${format(new Date(a.due_date), "MMM d, yyyy")}` : "No due date"}
                    </p>
                    {a.priority && a.priority !== "Medium" && (
                      <Badge variant="outline" className="text-[10px]">{a.priority}</Badge>
                    )}
                  </div>
                </div>
                {a.converted_task_id ? (
                  <Button size="sm" variant="outline" onClick={() => navigate(`/app/tasks?taskId=${a.converted_task_id}`)}>
                    View Task
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => { setConvertingItem(a); setConvertOpen(true); }}>
                    Convert to Task
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      {full?.topics && full.topics.length > 0 && (
        <Section title="Topics">
          <div className="flex flex-wrap gap-1.5">
            {full.topics.map((t: string, i: number) => (
              <Badge key={i} variant="secondary">{t}</Badge>
            ))}
          </div>
        </Section>
      )}

      {full?.next_meeting_date && (
        <Section title="Next Meeting">
          <p className="text-sm">{format(new Date(full.next_meeting_date), "EEEE, MMMM d, yyyy · h:mm a")}</p>
        </Section>
      )}

      <TaskFormDialog
        open={convertOpen}
        onOpenChange={(v) => { setConvertOpen(v); if (!v) setConvertingItem(null); }}
        defaultClientId={clientId}
        defaultTitle={convertingItem?.description ?? ""}
        defaultDueDate={convertingItem?.due_date ?? ""}
        defaultAssigneeId={convertingItem?.owner_id ?? null}
        onCreated={handleConverted}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this meeting?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the meeting, its attendees, decisions, and action items. Tasks already converted from action items will remain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ComposeEmailDialog
        open={composeOpen}
        onOpenChange={(v) => { setComposeOpen(v); if (!v) setComposePayload(null); }}
        clientId={clientId}
        lockClient
        initialTo={composePayload?.to}
        initialSubject={composePayload?.subject}
        initialHtml={composePayload?.html}
        onSent={() => { void handleSummarySent(); }}
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-3">{title}</h3>
      {children}
    </div>
  );
}

function ProgressTrail({ steps }: { steps: Array<{ label: string; done: boolean; hint?: string }> }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 flex-wrap">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {s.done ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground/50" />
              )}
              <div className="text-xs">
                <span className={s.done ? "font-medium text-foreground" : "text-muted-foreground"}>{s.label}</span>
                {s.hint && <span className="text-muted-foreground ml-1">· {s.hint}</span>}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px w-6 ${s.done ? "bg-primary/50" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function escapeHtml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Calendar, ArrowLeft, Pencil, ArrowRight, Check, Sparkles, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { MeetingDialog } from "./MeetingDialog";
import { MeetingTranscriptDialog } from "./MeetingTranscriptDialog";
import { TaskFormDialog } from "./TaskFormDialog";
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
  const { userId, role } = useWorkspace();
  const [full, setFull] = useState<any>(null);
  const [attendees, setAttendees] = useState<Array<{ id: string; full_name: string | null; email: string | null }>>([]);
  const [decisions, setDecisions] = useState<Array<{ id: string; content: string }>>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [convertOpen, setConvertOpen] = useState(false);
  const [convertingItem, setConvertingItem] = useState<ActionItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
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

  const handleConverted = async (createdTask: any) => {
    if (!convertingItem) return;
    await (supabase as any)
      .from("meeting_action_items")
      .update({ converted_task_id: createdTask.id })
      .eq("id", convertingItem.id);
    setConvertingItem(null);
    void load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back to meetings
        </Button>
        <Button size="sm" variant="outline" onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-1.5" /> Edit
        </Button>
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold">{meeting.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {format(new Date(meeting.meeting_date), "EEEE, MMMM d, yyyy · h:mm a")}
        </p>
      </div>

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
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {a.due_date ? `Due ${format(new Date(a.due_date), "MMM d, yyyy")}` : "No due date"}
                  </p>
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

      <TaskFormDialog
        open={convertOpen}
        onOpenChange={(v) => { setConvertOpen(v); if (!v) setConvertingItem(null); }}
        defaultClientId={clientId}
        defaultTitle={convertingItem?.description ?? ""}
        defaultDueDate={convertingItem?.due_date ?? ""}
        defaultAssigneeId={convertingItem?.owner_id ?? null}
        onCreated={handleConverted}
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

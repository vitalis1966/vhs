import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

interface ActionItemDraft {
  description: string;
  owner_id: string | null;
  due_date: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  workspaceId: string;
  meeting?: any | null;
  onSaved?: () => void;
}

export function MeetingDialog({ open, onOpenChange, clientId, workspaceId, meeting, onSaved }: Props) {
  const { userId } = useWorkspace();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [members, setMembers] = useState<Array<{ id: string; full_name: string | null; email: string | null }>>([]);
  const [internalAttendees, setInternalAttendees] = useState<string[]>([]);
  const [externalInput, setExternalInput] = useState("");
  const [externalAttendees, setExternalAttendees] = useState<string[]>([]);
  const [decisions, setDecisions] = useState<string[]>([]);
  const [decisionInput, setDecisionInput] = useState("");
  const [actionItems, setActionItems] = useState<ActionItemDraft[]>([]);

  const editor = useEditor({
    extensions: [StarterKit, TaskList, TaskItem.configure({ nested: true })],
    content: { type: "doc", content: [{ type: "paragraph" }] },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[120px] focus:outline-none px-3 py-2",
      },
    },
  });

  useEffect(() => {
    if (!open || !workspaceId) return;
    (async () => {
      const { data: wm } = await (supabase as any)
        .from("workspace_members").select("user_id").eq("workspace_id", workspaceId).eq("status", "active");
      const ids = (wm ?? []).map((w: any) => w.user_id).filter(Boolean);
      if (ids.length) {
        const { data: profs } = await (supabase as any)
          .from("profiles").select("id, full_name, email").in("id", ids);
        setMembers(profs ?? []);
      } else setMembers([]);
    })();
  }, [open, workspaceId]);

  useEffect(() => {
    if (!open || !editor || editor.isDestroyed) return;
    if (meeting) {
      setTitle(meeting.title ?? "");
      setMeetingDate(meeting.meeting_date ? toLocalInput(meeting.meeting_date) : toLocalInput(new Date().toISOString()));
      setExternalAttendees(meeting.external_attendees ?? []);
      editor.commands.setContent(meeting.summary ?? { type: "doc", content: [{ type: "paragraph" }] });
      (async () => {
        const [att, dec, ai] = await Promise.all([
          (supabase as any).from("meeting_attendees").select("user_id").eq("meeting_id", meeting.id),
          (supabase as any).from("meeting_decisions").select("content").eq("meeting_id", meeting.id).order("position"),
          (supabase as any).from("meeting_action_items").select("description, owner_id, due_date").eq("meeting_id", meeting.id).order("position"),
        ]);
        setInternalAttendees((att.data ?? []).map((a: any) => a.user_id));
        setDecisions((dec.data ?? []).map((d: any) => d.content));
        setActionItems((ai.data ?? []).map((a: any) => ({ description: a.description, owner_id: a.owner_id, due_date: a.due_date ?? "" })));
      })();
    } else {
      setTitle("");
      setMeetingDate(toLocalInput(new Date().toISOString()));
      setInternalAttendees(userId ? [userId] : []);
      setExternalAttendees([]);
      setExternalInput("");
      setDecisions([]);
      setDecisionInput("");
      setActionItems([]);
      editor.commands.setContent({ type: "doc", content: [{ type: "paragraph" }] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, meeting, editor]);

  const addExternal = () => {
    const v = externalInput.trim();
    if (!v) return;
    setExternalAttendees((x) => [...x, v]);
    setExternalInput("");
  };

  const addDecision = () => {
    const v = decisionInput.trim();
    if (!v) return;
    setDecisions((x) => [...x, v]);
    setDecisionInput("");
  };

  const addActionItem = () => setActionItems((x) => [...x, { description: "", owner_id: null, due_date: "" }]);

  const save = async () => {
    if (!userId) return;
    if (!title.trim()) return toast.error("Title is required");
    if (!meetingDate) return toast.error("Date is required");
    setSaving(true);
    try {
      const summary = editor?.getJSON() ?? null;
      const summary_text = editor?.getText() ?? null;
      const payload: any = {
        workspace_id: workspaceId,
        client_id: clientId,
        title: title.trim(),
        meeting_date: new Date(meetingDate).toISOString(),
        summary,
        summary_text,
        external_attendees: externalAttendees,
      };
      let meetingId: string;
      if (meeting?.id) {
        const { error } = await (supabase as any).from("meetings").update(payload).eq("id", meeting.id);
        if (error) throw error;
        meetingId = meeting.id;
        await (supabase as any).from("meeting_attendees").delete().eq("meeting_id", meetingId);
        await (supabase as any).from("meeting_decisions").delete().eq("meeting_id", meetingId);
        // Preserve already-converted action items; replace the rest
        const { data: existingAI } = await (supabase as any)
          .from("meeting_action_items").select("id, converted_task_id").eq("meeting_id", meetingId);
        const keepIds = (existingAI ?? []).filter((a: any) => a.converted_task_id).map((a: any) => a.id);
        if (keepIds.length) {
          await (supabase as any).from("meeting_action_items").delete().eq("meeting_id", meetingId).not("id", "in", `(${keepIds.join(",")})`);
        } else {
          await (supabase as any).from("meeting_action_items").delete().eq("meeting_id", meetingId);
        }
      } else {
        payload.created_by = userId;
        const { data, error } = await (supabase as any).from("meetings").insert(payload).select("id").single();
        if (error) throw error;
        meetingId = data.id;
      }

      if (internalAttendees.length) {
        await (supabase as any).from("meeting_attendees").insert(
          internalAttendees.map((uid) => ({ meeting_id: meetingId, user_id: uid }))
        );
      }
      if (decisions.length) {
        await (supabase as any).from("meeting_decisions").insert(
          decisions.map((content, i) => ({ meeting_id: meetingId, content, position: i }))
        );
      }
      const validAI = actionItems.filter((a) => a.description.trim());
      if (validAI.length) {
        await (supabase as any).from("meeting_action_items").insert(
          validAI.map((a, i) => ({
            meeting_id: meetingId,
            description: a.description.trim(),
            owner_id: a.owner_id || null,
            due_date: a.due_date || null,
            position: i,
          }))
        );
      }

      if (!meeting?.id) {
        await (supabase as any).from("activities").insert({
          workspace_id: workspaceId, actor_id: userId, verb: "meeting_logged",
          target_type: "meeting", target_id: meetingId, client_id: clientId,
          metadata: { title: payload.title },
        });
      }

      toast.success(meeting?.id ? "Meeting updated" : "Meeting logged");
      onSaved?.();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save meeting");
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{meeting?.id ? "Edit Meeting" : "Log Meeting"}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="m-date">Date & Time *</Label>
              <Input id="m-date" type="datetime-local" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="m-title">Title *</Label>
              <Input id="m-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Weekly sync" />
            </div>
          </div>

          <div>
            <Label>Internal Attendees</Label>
            <div className="flex flex-wrap gap-1.5 mt-1.5 mb-2">
              {internalAttendees.map((uid) => {
                const m = members.find((x) => x.id === uid);
                return (
                  <Badge key={uid} variant="secondary" className="gap-1">
                    {m?.full_name ?? m?.email ?? "Member"}
                    <button onClick={() => setInternalAttendees((x) => x.filter((y) => y !== uid))}><X className="h-3 w-3" /></button>
                  </Badge>
                );
              })}
            </div>
            <Select value="" onValueChange={(v) => { if (v && !internalAttendees.includes(v)) setInternalAttendees((x) => [...x, v]); }}>
              <SelectTrigger><SelectValue placeholder="Add internal attendee" /></SelectTrigger>
              <SelectContent>
                {members.filter((m) => !internalAttendees.includes(m.id)).map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.full_name ?? m.email}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>External Attendees</Label>
            <div className="flex flex-wrap gap-1.5 mt-1.5 mb-2">
              {externalAttendees.map((name, i) => (
                <Badge key={i} variant="outline" className="gap-1">
                  {name}
                  <button onClick={() => setExternalAttendees((x) => x.filter((_, j) => j !== i))}><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={externalInput} onChange={(e) => setExternalInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addExternal(); } }}
                placeholder="Name and press Enter"
              />
              <Button type="button" variant="outline" onClick={addExternal}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>

          <div>
            <Label>Summary</Label>
            <div className="border border-border rounded-md bg-card mt-1.5">
              <EditorContent editor={editor} />
            </div>
          </div>

          <div>
            <Label>Decisions</Label>
            <ul className="space-y-1.5 mt-1.5 mb-2">
              {decisions.map((d, i) => (
                <li key={i} className="flex items-center gap-2 text-sm bg-muted/40 px-2 py-1.5 rounded">
                  <span className="flex-1">{d}</span>
                  <button onClick={() => setDecisions((x) => x.filter((_, j) => j !== i))}><X className="h-3.5 w-3.5 text-muted-foreground" /></button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Input
                value={decisionInput} onChange={(e) => setDecisionInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addDecision(); } }}
                placeholder="Add a decision and press Enter"
              />
              <Button type="button" variant="outline" onClick={addDecision}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label>Action Items</Label>
              <Button type="button" size="sm" variant="outline" onClick={addActionItem}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
            <div className="space-y-2 mt-2">
              {actionItems.map((a, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-start">
                  <Input
                    className="col-span-6" placeholder="Description"
                    value={a.description}
                    onChange={(e) => setActionItems((x) => x.map((v, j) => j === i ? { ...v, description: e.target.value } : v))}
                  />
                  <Select
                    value={a.owner_id ?? "none"}
                    onValueChange={(v) => setActionItems((x) => x.map((v2, j) => j === i ? { ...v2, owner_id: v === "none" ? null : v } : v2))}
                  >
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Owner" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Unassigned</SelectItem>
                      {members.map((m) => <SelectItem key={m.id} value={m.id}>{m.full_name ?? m.email}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input
                    className="col-span-2" type="date" value={a.due_date}
                    onChange={(e) => setActionItems((x) => x.map((v, j) => j === i ? { ...v, due_date: e.target.value } : v))}
                  />
                  <Button
                    type="button" size="icon" variant="ghost" className="col-span-1"
                    onClick={() => setActionItems((x) => x.filter((_, j) => j !== i))}
                  ><X className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : (meeting?.id ? "Save Changes" : "Log Meeting")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

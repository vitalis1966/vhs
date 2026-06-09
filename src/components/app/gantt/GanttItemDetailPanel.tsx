import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { addComment, deleteComment, listActivity, listComments, updateItem } from "@/lib/gantt/api";
import type { GanttItem, GanttItemStatus } from "@/lib/gantt/types";
import { STATUS_LABEL } from "@/lib/gantt/types";
import { toDate, addDays, toISO } from "@/lib/gantt/dates";
import { Trash2, Paperclip, Clock, Lock, X } from "lucide-react";
import { toast } from "sonner";

const COLOURS = ["#3b82f6","#6366f1","#a855f7","#ec4899","#f43f5e","#f59e0b","#22c55e","#14b8a6","#06b6d4","#94a3b8"];

interface Props {
  item: GanttItem | null;
  members: Record<string, { full_name: string | null; email: string | null }>;
  allItems: GanttItem[];
  tasksOfProject: { id: string; title: string }[];
  meetingsOfProject: { id: string; title: string; meeting_date: string | null }[];
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onChanged: () => void;
  onDelete: (id: string) => void;
}

export function GanttItemDetailPanel({ item, members, allItems, tasksOfProject, meetingsOfProject, open, onOpenChange, onChanged, onDelete }: Props) {
  const [local, setLocal] = useState<GanttItem | null>(item);
  const [comments, setComments] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [timeLogged, setTimeLogged] = useState<number>(0); // hours
  const [attachments, setAttachments] = useState<Array<{ id: string; file_name: string; storage_path: string }>>([]);
  const [clientDocs, setClientDocs] = useState<Array<{ id: string; file_name: string }>>([]);

  useEffect(() => { setLocal(item); }, [item?.id]);
  useEffect(() => {
    if (!item) return;
    listComments(item.id).then(setComments);
    listActivity(item.id).then(setActivity);
  }, [item?.id]);

  // Time logged on linked task
  useEffect(() => {
    if (!local?.linked_task_id) { setTimeLogged(0); return; }
    (async () => {
      const { data } = await (supabase as any).from("time_entries")
        .select("duration_seconds").eq("task_id", local.linked_task_id);
      const sec = (data ?? []).reduce((a: number, b: any) => a + (b.duration_seconds || 0), 0);
      setTimeLogged(sec / 3600);
    })();
  }, [local?.linked_task_id]);

  // Attachments + client docs for picker
  useEffect(() => {
    if (!local) return;
    (async () => {
      const ids = local.attachment_document_ids ?? [];
      if (ids.length) {
        const { data } = await (supabase as any).from("documents").select("id, file_name, storage_path").in("id", ids);
        setAttachments(data ?? []);
      } else setAttachments([]);
      // Client docs available for attaching (best-effort: same client_id via assignments)
      const { data: assigns } = await (supabase as any).rpc("list_client_submission_assignments", { p_client_id: local.client_id });
      setClientDocs((assigns ?? []).map((a: any) => ({ id: a.document_id, file_name: a.file_name })));
    })();
  }, [local?.id, local?.attachment_document_ids?.length]);

  if (!local) return null;
  const isMilestone = local.type === "milestone";

  const save = async (patch: Partial<GanttItem>) => {
    setLocal({ ...local, ...patch });
    try { await updateItem(local.id, patch); onChanged(); }
    catch (e: any) { toast.error(e.message); }
  };

  const onDurationChange = (n: number) => {
    const s = toDate(local.start_date);
    if (!s || !n) return;
    save({ end_date: toISO(addDays(s, Math.max(0, n - 1))) });
  };

  const memberOptions = Object.entries(members).map(([id, m]) => ({ id, label: m.full_name?.trim() || m.email || "Unknown" }));

  const submitComment = async () => {
    if (!newComment.trim() || !local) return;
    try {
      await addComment(local.id, local.workspace_id, newComment.trim());
      setNewComment("");
      setComments(await listComments(local.id));
    } catch (e: any) { toast.error(e.message); }
  };

  const toggleDep = (otherId: string) => {
    const deps = (local.dependencies ?? []).slice();
    const idx = deps.findIndex((d) => d.from === otherId);
    if (idx >= 0) deps.splice(idx, 1);
    else deps.push({ from: otherId, type: "FS" });
    save({ dependencies: deps });
  };

  const attachDoc = (docId: string) => {
    const ids = Array.from(new Set([...(local.attachment_document_ids ?? []), docId]));
    save({ attachment_document_ids: ids });
  };
  const detachDoc = (docId: string) => {
    save({ attachment_document_ids: (local.attachment_document_ids ?? []).filter((x) => x !== docId) });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">{local.type.replace("_"," ")}</Badge>
            {local.is_critical_path && <Badge variant="destructive">Critical</Badge>}
            {local.is_internal && <Badge variant="secondary"><Lock className="h-3 w-3 mr-1" />Internal</Badge>}
          </div>
          <SheetTitle>
            <Input value={local.title} onChange={(e) => setLocal({ ...local, title: e.target.value })}
              onBlur={() => save({ title: local.title })} className="text-base font-semibold" />
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-xs">Description</Label>
            <Textarea rows={3} value={local.description ?? ""}
              onChange={(e) => setLocal({ ...local, description: e.target.value })}
              onBlur={() => save({ description: local.description })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Assignee</Label>
              <Select value={local.assignee_id ?? "none"} onValueChange={(v) => save({ assignee_id: v === "none" ? null : v })}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Unassigned" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {memberOptions.map((o) => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={local.status} onValueChange={(v) => save({ status: v as GanttItemStatus })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">{isMilestone ? "Date" : "Start"}</Label>
              <Input type="date" value={local.start_date ?? ""} onChange={(e) => save({ start_date: e.target.value || null })} />
            </div>
            {!isMilestone && (
              <div>
                <Label className="text-xs">End</Label>
                <Input type="date" value={local.end_date ?? ""} onChange={(e) => save({ end_date: e.target.value || null })} />
              </div>
            )}
            {!isMilestone && (
              <div>
                <Label className="text-xs">Duration (days)</Label>
                <Input type="number" min={1} value={local.duration_days ?? ""} onChange={(e) => onDurationChange(Number(e.target.value))} />
              </div>
            )}
            {!isMilestone && (
              <div>
                <Label className="text-xs">Estimated hours</Label>
                <Input type="number" min={0} step="0.5" value={local.estimated_hours ?? ""}
                  onChange={(e) => save({ estimated_hours: e.target.value ? Number(e.target.value) : null })} />
              </div>
            )}
          </div>

          <div>
            <Label className="text-xs">Progress: {local.progress}%</Label>
            <Slider value={[local.progress]} max={100} step={1}
              onValueChange={(v) => setLocal({ ...local, progress: v[0] })}
              onValueCommit={(v) => save({ progress: v[0] })} />
          </div>

          <div>
            <Label className="text-xs">Colour</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {COLOURS.map((c) => (
                <button key={c} onClick={() => save({ colour: c })}
                  className={`h-6 w-6 rounded-full border-2 ${local.colour === c ? "border-foreground" : "border-transparent"}`}
                  style={{ background: c }} />
              ))}
              <button onClick={() => save({ colour: null })} className="h-6 px-2 text-[10px] border rounded">Reset</button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs">Mark as critical path</Label>
            <Switch checked={local.is_critical_path} onCheckedChange={(v) => save({ is_critical_path: v })} />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs flex items-center gap-1"><Lock className="h-3 w-3" />Internal only (hidden from client portal)</Label>
            <Switch checked={local.is_internal} onCheckedChange={(v) => save({ is_internal: v })} />
          </div>

          {isMilestone && (
            <div className="flex items-center justify-between">
              <Label className="text-xs">Milestone complete</Label>
              <Switch checked={local.is_complete} onCheckedChange={(v) => save({ is_complete: v })} />
            </div>
          )}

          <div>
            <Label className="text-xs">Linked project task (two-way sync)</Label>
            <Select value={local.linked_task_id ?? "none"} onValueChange={(v) => save({ linked_task_id: v === "none" ? null : v })}>
              <SelectTrigger className="h-9"><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {tasksOfProject.map((t) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
              </SelectContent>
            </Select>
            {local.linked_task_id && (
              <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeLogged.toFixed(1)}h logged{local.estimated_hours ? ` / ${local.estimated_hours}h estimated` : ""}
              </div>
            )}
          </div>

          {isMilestone && (
            <div>
              <Label className="text-xs">Linked meeting (auto-complete when meeting summary sent)</Label>
              <Select value={local.linked_meeting_id ?? "none"} onValueChange={(v) => save({ linked_meeting_id: v === "none" ? null : v })}>
                <SelectTrigger className="h-9"><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {meetingsOfProject.map((m) => <SelectItem key={m.id} value={m.id}>{m.title}{m.meeting_date ? ` — ${new Date(m.meeting_date).toLocaleDateString()}` : ""}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          <div>
            <Label className="text-xs flex items-center gap-1"><Paperclip className="h-3 w-3" />Attachments</Label>
            <div className="space-y-1 mt-1">
              {attachments.map((a) => (
                <div key={a.id} className="flex items-center justify-between text-xs border rounded px-2 py-1">
                  <span className="truncate">{a.file_name}</span>
                  <button onClick={() => detachDoc(a.id)}><X className="h-3 w-3" /></button>
                </div>
              ))}
              {!attachments.length && <div className="text-[11px] text-muted-foreground italic">No attachments.</div>}
            </div>
            {clientDocs.filter((d) => !(local.attachment_document_ids ?? []).includes(d.id)).length > 0 && (
              <Select value="" onValueChange={(v) => v && attachDoc(v)}>
                <SelectTrigger className="h-8 text-xs mt-2"><SelectValue placeholder="Attach from client files…" /></SelectTrigger>
                <SelectContent>
                  {clientDocs.filter((d) => !(local.attachment_document_ids ?? []).includes(d.id)).map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.file_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Separator />

          <div>
            <Label className="text-xs">Dependencies (this item depends on)</Label>
            <div className="border rounded-md max-h-40 overflow-y-auto mt-1">
              {allItems.filter((i) => i.id !== local.id && i.type !== "section").map((i) => {
                const checked = (local.dependencies ?? []).some((d) => d.from === i.id);
                return (
                  <label key={i.id} className="flex items-center gap-2 px-2 py-1 text-xs hover:bg-muted cursor-pointer">
                    <input type="checkbox" checked={checked} onChange={() => toggleDep(i.id)} />
                    <span className="truncate">{i.title}</span>
                  </label>
                );
              })}
            </div>
            <ConflictWarnings item={local} allItems={allItems} onResolve={(newStart) => save({ start_date: newStart, end_date: extendEnd(local, newStart) })} />
          </div>

          <Separator />

          <div>
            <Label className="text-xs">Comments</Label>
            <div className="space-y-2 mt-2 max-h-56 overflow-y-auto">
              {comments.map((c) => (
                <div key={c.id} className="rounded border p-2 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground text-[10px]">
                    <span>{(members[c.author_id]?.full_name ?? members[c.author_id]?.email) ?? "User"}</span>
                    <button onClick={async () => { await deleteComment(c.id); setComments(await listComments(local.id)); }}><Trash2 className="h-3 w-3" /></button>
                  </div>
                  <div className="mt-1 whitespace-pre-wrap">{c.body}</div>
                </div>
              ))}
              {!comments.length && <div className="text-[11px] text-muted-foreground italic">No comments yet.</div>}
            </div>
            <div className="flex gap-2 mt-2">
              <Textarea rows={2} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment…" />
              <Button size="sm" onClick={submitComment}>Post</Button>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-xs">Activity</Label>
            <div className="space-y-1 mt-1 max-h-40 overflow-y-auto text-[11px] text-muted-foreground">
              {activity.map((a) => (
                <div key={a.id} className="flex items-center justify-between">
                  <span>{a.action}</span>
                  <span>{new Date(a.created_at).toLocaleString()}</span>
                </div>
              ))}
              {!activity.length && <div className="italic">No activity yet.</div>}
            </div>
          </div>

          <Separator />

          <Button variant="destructive" size="sm" onClick={() => { onDelete(local.id); onOpenChange(false); }}>
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete item
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function extendEnd(item: GanttItem, newStart: string): string | null {
  if (!item.end_date) return item.end_date;
  const s = toDate(item.start_date); const e = toDate(item.end_date); const ns = toDate(newStart);
  if (!s || !e || !ns) return item.end_date;
  const span = (e.getTime() - s.getTime());
  return toISO(new Date(ns.getTime() + span));
}

function ConflictWarnings({ item, allItems, onResolve }: { item: GanttItem; allItems: GanttItem[]; onResolve: (newStart: string) => void }) {
  const conflicts: { dep: GanttItem; suggested: string }[] = [];
  const myStart = toDate(item.start_date);
  if (!myStart) return null;
  for (const dep of item.dependencies ?? []) {
    const d = allItems.find((x) => x.id === dep.from); if (!d) continue;
    const depEnd = toDate(d.end_date ?? d.start_date); if (!depEnd) continue;
    if (depEnd >= myStart) {
      conflicts.push({ dep: d, suggested: toISO(addDays(depEnd, 1)) });
    }
  }
  if (!conflicts.length) return null;
  return (
    <div className="mt-2 space-y-1">
      {conflicts.map((c, i) => (
        <div key={i} className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center justify-between gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded p-2">
          <span className="truncate">Conflict: <strong>{c.dep.title}</strong> ends after this item starts.</span>
          <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => onResolve(c.suggested)}>Auto-resolve</Button>
        </div>
      ))}
    </div>
  );
}

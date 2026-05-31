import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { TagPicker, persistPendingTags } from "./TagPicker";

export const PROJECT_STATUSES = ["Planned", "Active", "On Hold", "Complete", "Cancelled"] as const;

export type ProjectFormValues = {
  id?: string;
  name: string;
  description: string | null;
  status: string;
  start_date: string | null;
  target_date: string | null;
  owner_id: string | null;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  initial?: Partial<ProjectFormValues> & { id?: string };
  onSaved?: (project: any) => void;
}

export function ProjectFormDialog({ open, onOpenChange, clientId, initial, onSaved }: Props) {
  const { workspaceId, userId } = useWorkspace();
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState<Array<{ id: string; full_name: string | null; email: string | null }>>([]);
  const [form, setForm] = useState<ProjectFormValues>({
    name: "", description: null, status: "Active",
    start_date: null, target_date: null, owner_id: null,
  });
  const [initialStatus, setInitialStatus] = useState<string | null>(null);
  const [pendingTagIds, setPendingTagIds] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    const next = {
      name: initial?.name ?? "",
      description: initial?.description ?? null,
      status: initial?.status ?? "Active",
      start_date: initial?.start_date ?? null,
      target_date: initial?.target_date ?? null,
      owner_id: initial?.owner_id ?? null,
    };
    setForm(next);
    setInitialStatus(initial?.id ? next.status : null);
    setPendingTagIds([]);
  }, [open, initial]);

  useEffect(() => {
    if (!open || !workspaceId) return;
    (async () => {
      const { data: wm } = await (supabase as any)
        .from("workspace_members").select("user_id")
        .eq("workspace_id", workspaceId).eq("status", "active")
        .not("user_id", "is", null);
      const ids = (wm ?? []).map((m: any) => m.user_id);
      if (!ids.length) { setMembers([]); return; }
      const { data: profs } = await (supabase as any)
        .from("profiles").select("id, full_name, email").in("id", ids);
      setMembers(profs ?? []);
    })();
  }, [open, workspaceId]);

  const save = async () => {
    if (!workspaceId || !userId) return;
    if (!form.name.trim()) { toast.error("Project name is required"); return; }
    setSaving(true);
    try {
      const payload: any = {
        name: form.name.trim(),
        description: form.description?.trim() || null,
        status: form.status,
        start_date: form.start_date || null,
        target_date: form.target_date || null,
        owner_id: form.owner_id,
      };
      if (initial?.id) {
        const { data, error } = await (supabase as any)
          .from("projects").update(payload).eq("id", initial.id).select().single();
        if (error) throw error;
        if (initialStatus && initialStatus !== form.status) {
          await (supabase as any).from("activities").insert({
            workspace_id: workspaceId, actor_id: userId, verb: "status_changed",
            target_type: "project", target_id: data.id, client_id: clientId,
            metadata: { name: data.name, old_status: initialStatus, new_status: form.status },
          });
        }
        toast.success("Project updated");
        onSaved?.(data);
      } else {
        const { data, error } = await (supabase as any)
          .from("projects").insert({ ...payload, workspace_id: workspaceId, client_id: clientId })
          .select().single();
        if (error) throw error;
        await (supabase as any).from("activities").insert({
          workspace_id: workspaceId, actor_id: userId, verb: "created",
          target_type: "project", target_id: data.id, client_id: clientId,
          metadata: { name: data.name },
        });
        toast.success("Project created");
        onSaved?.(data);
      }
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial?.id ? "Edit Project" : "New Project"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="pname">Name *</Label>
            <Input id="pname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="pdesc">Description</Label>
            <Textarea id="pdesc" rows={3} value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Owner</Label>
              <Select value={form.owner_id ?? "none"}
                onValueChange={(v) => setForm({ ...form, owner_id: v === "none" ? null : v })}>
                <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.full_name ?? m.email ?? "Unknown"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="pstart">Start Date</Label>
              <Input id="pstart" type="date" value={form.start_date ?? ""}
                onChange={(e) => setForm({ ...form, start_date: e.target.value || null })} />
            </div>
            <div>
              <Label htmlFor="ptarget">Target Date</Label>
              <Input id="ptarget" type="date" value={form.target_date ?? ""}
                onChange={(e) => setForm({ ...form, target_date: e.target.value || null })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : initial?.id ? "Save Changes" : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const PROJECT_STATUS_COLOR: Record<string, string> = {
  Planned: "bg-blue-100 text-blue-800 border-blue-200",
  Active: "bg-green-100 text-green-800 border-green-200",
  "On Hold": "bg-amber-100 text-amber-800 border-amber-200",
  Complete: "bg-slate-100 text-slate-700 border-slate-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

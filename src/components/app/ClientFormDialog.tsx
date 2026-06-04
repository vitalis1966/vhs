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
import { Label as UILabel } from "@/components/ui/label";

export const CLIENT_STATUSES = ["Prospect", "Active", "On Hold", "Closed"] as const;
export const CLIENT_INDUSTRIES = [
  "Family Medicine",
  "Internal Medicine",
  "Pediatrics",
  "Obstetrics & Gynecology",
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Oncology",
  "Ophthalmology",
  "Orthopaedics",
  "Otolaryngology (ENT)",
  "Psychiatry",
  "Pulmonology",
  "Rheumatology",
  "Urology",
  "Nephrology",
  "Anesthesiology",
  "Radiology",
  "Pathology",
  "Emergency Medicine",
  "Physical Medicine & Rehabilitation",
  "Pain Management",
  "Sports Medicine",
  "Plastic & Reconstructive Surgery",
  "General Surgery",
  "Vascular Surgery",
  "Cosmetic & Aesthetic",
  "Dental",
  "Orthodontics",
  "Oral & Maxillofacial Surgery",
  "Periodontics",
  "Endodontics",
  "Veterinary",
  "Chiropractic",
  "Physiotherapy",
  "Occupational Therapy",
  "Massage Therapy",
  "Naturopathy",
  "Acupuncture",
  "Optometry",
  "Audiology",
  "Podiatry",
  "Counselling & Psychology",
  "Mental Health & Addictions",
  "Nutrition & Dietetics",
  "Fertility & Reproductive Health",
  "Sleep Medicine",
  "Surgical Facility",
  "Diagnostic Imaging",
  "Laboratory Services",
  "Pharmacy",
  "Medical Aesthetics & MedSpa",
  "Wellness & Longevity",
  "Home Health",
  "Long-term Care",
  "Multi-specialty Clinic",
  "Other",
] as const;

export type ClientRecord = {
  id?: string;
  name: string;
  status: string;
  industry: string | null;
  account_owner_id: string | null;
  start_date: string | null;
  website: string | null;
  summary: string | null;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<ClientRecord> & { id?: string };
  onSaved?: (client: any) => void;
}

export function ClientFormDialog({ open, onOpenChange, initial, onSaved }: Props) {
  const { workspaceId, userId } = useWorkspace();
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState<Array<{ id: string; full_name: string | null; email: string | null }>>([]);
  const [pendingTagIds, setPendingTagIds] = useState<string[]>([]);
  const [form, setForm] = useState<ClientRecord>({
    name: "", status: "Active", industry: null, account_owner_id: null,
    start_date: null, website: null, summary: null,
  });

  useEffect(() => {
    if (!open) return;
    setPendingTagIds([]);
    setForm({
      name: initial?.name ?? "",
      status: initial?.status ?? "Active",
      industry: initial?.industry ?? null,
      account_owner_id: initial?.account_owner_id ?? null,
      start_date: initial?.start_date ?? null,
      website: initial?.website ?? null,
      summary: initial?.summary ?? null,
    });
  }, [open, initial]);

  useEffect(() => {
    if (!open || !workspaceId) return;
    (async () => {
      const { data: wm } = await (supabase as any)
        .from("workspace_members")
        .select("user_id")
        .eq("workspace_id", workspaceId)
        .eq("status", "active")
        .not("user_id", "is", null);
      const ids = (wm ?? []).map((m: any) => m.user_id);
      if (ids.length === 0) { setMembers([]); return; }
      const { data: profiles } = await (supabase as any)
        .from("profiles").select("id, full_name, email").in("id", ids);
      setMembers(profiles ?? []);
    })();
  }, [open, workspaceId]);

  const handleSave = async () => {
    if (!workspaceId || !userId) return;
    if (!form.name.trim()) { toast.error("Company name is required"); return; }
    setSaving(true);
    try {
      const payload: any = {
        name: form.name.trim(),
        status: form.status,
        industry: form.industry,
        account_owner_id: form.account_owner_id,
        start_date: form.start_date || null,
        website: form.website?.trim() || null,
        summary: form.summary?.trim() || null,
      };

      if (initial?.id) {
        const { data, error } = await (supabase as any)
          .from("clients").update(payload).eq("id", initial.id).select().single();
        if (error) throw error;
        toast.success("Client updated");
        onSaved?.(data);
      } else {
        const { data, error } = await (supabase as any)
          .from("clients").insert({ ...payload, workspace_id: workspaceId, created_by: userId })
          .select().single();
        if (error) throw error;
        await persistPendingTags("client", data.id, pendingTagIds);
        // Log activity (non-blocking)
        await (supabase as any).from("activities").insert({
          workspace_id: workspaceId, actor_id: userId, verb: "created",
          target_type: "client", target_id: data.id, client_id: data.id,
          metadata: { name: data.name },
        });
        toast.success("Client created");
        onSaved?.(data);
      }
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save client");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial?.id ? "Edit Client" : "New Client"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="name">Company Name *</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CLIENT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Industry</Label>
              <Select value={form.industry ?? ""} onValueChange={(v) => setForm({ ...form, industry: v })}>
                <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  {CLIENT_INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Account Owner</Label>
              <Select
                value={form.account_owner_id ?? "none"}
                onValueChange={(v) => setForm({ ...form, account_owner_id: v === "none" ? null : v })}
              >
                <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.full_name ?? m.email ?? "Unknown"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input id="start_date" type="date" value={form.start_date ?? ""}
                onChange={(e) => setForm({ ...form, start_date: e.target.value || null })} />
            </div>
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" placeholder="https://" value={form.website ?? ""}
              onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea id="summary" rows={3} value={form.summary ?? ""}
              onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          </div>
          <div>
            <UILabel>Service Lines</UILabel>
            <div className="mt-1.5 p-2 rounded-md border border-input min-h-[40px]">
              <TagPicker
                taggableType="client"
                taggableId={initial?.id}
                value={initial?.id ? undefined : pendingTagIds}
                onValueChange={initial?.id ? undefined : setPendingTagIds}
                categoryFilter="service_line"
                triggerLabel="Add service line"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : initial?.id ? "Save Changes" : "Create Client"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

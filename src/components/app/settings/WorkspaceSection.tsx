import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";

const INDUSTRIES = ["Healthcare", "Dental", "Veterinary", "Wellness", "Surgical", "Other"];
const DATE_FORMATS = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];
const TIME_ZONES = [
  "America/Edmonton", "America/Vancouver", "America/Toronto", "America/New_York",
  "America/Los_Angeles", "America/Chicago", "America/Denver", "America/Halifax",
  "UTC", "Europe/London", "Europe/Paris", "Asia/Tokyo", "Australia/Sydney",
];

export function WorkspaceSection() {
  const { workspace, workspaceId, refresh } = useWorkspace();
  const { toast } = useToast();
  const [members, setMembers] = useState<Array<{ id: string; full_name: string | null; email: string | null }>>([]);
  const [form, setForm] = useState({
    name: "", logo_url: "", primary_color: "#1C3D2E",
    date_format: "MM/DD/YYYY", time_zone: "America/Edmonton",
    default_industry: "", default_account_owner_id: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!workspace) return;
    setForm({
      name: workspace.name ?? "",
      logo_url: workspace.logo_url ?? "",
      primary_color: workspace.primary_color ?? "#1C3D2E",
      date_format: workspace.date_format ?? "MM/DD/YYYY",
      time_zone: workspace.time_zone ?? "America/Edmonton",
      default_industry: workspace.default_industry ?? "",
      default_account_owner_id: workspace.default_account_owner_id ?? "",
    });
  }, [workspace]);

  useEffect(() => {
    if (!workspaceId) return;
    (async () => {
      const { data } = await (supabase as any)
        .from("workspace_members")
        .select("user_id, profiles!inner(id, full_name, email)")
        .eq("workspace_id", workspaceId)
        .eq("status", "active");
      setMembers((data ?? []).map((r: any) => r.profiles).filter(Boolean));
    })();
  }, [workspaceId]);

  const handleUpload = async (file: File) => {
    if (!workspaceId) return;
    setUploading(true);
    const path = `${workspaceId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("workspace-logos").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("workspace-logos").getPublicUrl(path);
    setForm((f) => ({ ...f, logo_url: publicUrl }));
    setUploading(false);
  };

  const save = async () => {
    if (!workspaceId) return;
    setSaving(true);
    const { error } = await (supabase as any).from("workspaces").update({
      name: form.name,
      logo_url: form.logo_url || null,
      primary_color: form.primary_color,
      date_format: form.date_format,
      time_zone: form.time_zone,
      default_industry: form.default_industry || null,
      default_account_owner_id: form.default_account_owner_id || null,
    }).eq("id", workspaceId);
    setSaving(false);
    if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Workspace updated" });
    await refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace</CardTitle>
        <CardDescription>General workspace settings, branding, and defaults.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Workspace Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Workspace Slug</Label>
            <Input value={workspace?.slug ?? ""} readOnly className="bg-muted" />
          </div>
          <div>
            <Label>Default Industry</Label>
            <Select value={form.default_industry || "none"} onValueChange={(v) => setForm({ ...form, default_industry: v === "none" ? "" : v })}>
              <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— None —</SelectItem>
                {INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Default Account Owner</Label>
            <Select value={form.default_account_owner_id || "none"} onValueChange={(v) => setForm({ ...form, default_account_owner_id: v === "none" ? "" : v })}>
              <SelectTrigger><SelectValue placeholder="Select default owner" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— None —</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.full_name || m.email}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date Format</Label>
            <Select value={form.date_format} onValueChange={(v) => setForm({ ...form, date_format: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DATE_FORMATS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Time Zone</Label>
            <Select value={form.time_zone} onValueChange={(v) => setForm({ ...form, time_zone: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TIME_ZONES.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Primary Color Accent</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={form.primary_color}
                onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                className="h-10 w-14 rounded border border-input" />
              <Input value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Workspace Logo</Label>
            <div className="flex items-center gap-3">
              {form.logo_url && <img src={form.logo_url} alt="logo" className="h-10 w-10 rounded object-cover border" />}
              <label className="inline-flex items-center gap-2 cursor-pointer px-3 py-2 rounded border border-input text-sm hover:bg-muted">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
              </label>
              {form.logo_url && (
                <Button variant="ghost" size="sm" onClick={() => setForm({ ...form, logo_url: "" })}>Remove</Button>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, FileText, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import { BUILTIN_TEMPLATES, type GanttTemplate, listTemplates, saveTemplate, deleteTemplate, applyTemplate } from "@/lib/gantt/templates";
import type { GanttItem } from "@/lib/gantt/types";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  workspaceId: string;
  projectId: string;
  clientId: string;
  currentItems: GanttItem[];
  hasExisting: boolean;
  mode: "apply" | "save";
  onApplied: () => void;
}

export function GanttTemplatesDialog({ open, onOpenChange, workspaceId, projectId, clientId, currentItems, hasExisting, mode, onApplied }: Props) {
  const [tab, setTab] = useState<"apply" | "save">(mode);
  const [templates, setTemplates] = useState<GanttTemplate[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [startDate, setStartDate] = useState<string>("");

  useEffect(() => { setTab(mode); }, [mode]);
  useEffect(() => {
    if (!open) return;
    (async () => {
      try { setTemplates([...BUILTIN_TEMPLATES, ...await listTemplates(workspaceId)]); }
      catch (e: any) { toast.error(e.message); }
    })();
  }, [open, workspaceId]);

  const handleApply = async (t: GanttTemplate) => {
    if (hasExisting && !confirm(`This will add ${t.items.length} item(s) to the existing Gantt. Continue?`)) return;
    setBusy(true);
    try {
      await applyTemplate(t, { workspaceId, projectId, clientId, startDate: startDate || null });
      toast.success(`Applied template "${t.name}"`);
      onApplied(); onOpenChange(false);
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Name required"); return; }
    if (!currentItems.length) { toast.error("Nothing to save"); return; }
    setBusy(true);
    try {
      await saveTemplate(workspaceId, name.trim(), description.trim() || null, currentItems);
      toast.success("Template saved");
      setName(""); setDescription("");
      setTemplates([...BUILTIN_TEMPLATES, ...await listTemplates(workspaceId)]);
      setTab("apply");
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    try { await deleteTemplate(id); setTemplates([...BUILTIN_TEMPLATES, ...await listTemplates(workspaceId)]); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Gantt templates</DialogTitle></DialogHeader>
        <div className="flex gap-2 border-b">
          <button className={`px-3 py-2 text-sm ${tab === "apply" ? "border-b-2 border-primary font-semibold" : "text-muted-foreground"}`} onClick={() => setTab("apply")}>Use template</button>
          <button className={`px-3 py-2 text-sm ${tab === "save" ? "border-b-2 border-primary font-semibold" : "text-muted-foreground"}`} onClick={() => setTab("save")}>Save current as template</button>
        </div>
        {tab === "apply" ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-xs">Project start date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-44" />
              <span className="text-xs text-muted-foreground">Items will be created relative to this date (default: today)</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {templates.map((t) => (
                <div key={t.id} className="border rounded-md p-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="font-semibold text-sm truncate">{t.name}</div>
                      {t.is_builtin && <Badge variant="secondary" className="text-[10px]">Built-in</Badge>}
                    </div>
                    {t.description && <div className="text-xs text-muted-foreground mt-1">{t.description}</div>}
                    <div className="text-[11px] text-muted-foreground mt-1">{t.items.length} items</div>
                  </div>
                  <div className="flex gap-2">
                    {!t.is_builtin && <Button size="icon" variant="ghost" onClick={() => handleDelete(t.id)}><Trash2 className="h-4 w-4" /></Button>}
                    <Button size="sm" disabled={busy} onClick={() => handleApply(t)}><Plus className="h-3.5 w-3.5 mr-1" />Apply</Button>
                  </div>
                </div>
              ))}
              {!templates.length && <div className="text-sm text-muted-foreground py-6 text-center">No templates yet.</div>}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. NHSF New Build" />
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
            </div>
            <div className="text-xs text-muted-foreground bg-muted/40 rounded p-2">
              {currentItems.length} item(s) will be saved. Assignees are stripped and dates stored as offsets from project start.
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button disabled={busy} onClick={handleSave}><Save className="h-3.5 w-3.5 mr-1" />Save template</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

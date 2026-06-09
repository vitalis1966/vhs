import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Upload, FileDown, X } from "lucide-react";
import { toast } from "sonner";
import { parseImportFile, downloadTemplateCsv, downloadTemplateXlsx, type PreviewRow } from "@/lib/gantt/importExport";

export interface GanttImportResult {
  rows: PreviewRow[];
  mode: "replace" | "append";
}

interface MemberLite { id: string; full_name: string | null; email: string | null }

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  hasExisting: boolean;
  members: MemberLite[];
  onConfirm: (result: GanttImportResult) => Promise<void> | void;
}

export function GanttImportDialog({ open, onOpenChange, hasExisting, members, onConfirm }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [mode, setMode] = useState<"replace" | "append">("append");
  const [parsing, setParsing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) { setFile(null); setRows([]); setMode("append"); }
  }, [open]);

  async function handleFile(f: File | null) {
    setFile(f);
    if (!f) { setRows([]); return; }
    setParsing(true);
    try {
      const parsed = await parseImportFile(f, members);
      setRows(parsed);
    } catch (e: any) {
      toast.error(`Could not read file: ${e.message ?? e}`);
      setRows([]);
    } finally { setParsing(false); }
  }

  function updateRow(idx: number, patch: Partial<PreviewRow>) {
    setRows((prev) => prev.map((r, i) => i === idx ? revalidate({ ...r, ...patch }) : r));
  }

  const summary = useMemo(() => {
    const sections = rows.filter((r) => r.type === "section").length;
    const milestones = rows.filter((r) => r.type === "milestone").length;
    const tasks = rows.length - sections - milestones;
    const errors = rows.filter((r) => r.errors.length > 0).length;
    return { sections, milestones, tasks, errors, total: rows.length };
  }, [rows]);

  const canConfirm = rows.length > 0 && summary.errors === 0 && !submitting;

  async function confirm() {
    setSubmitting(true);
    try {
      await onConfirm({ rows, mode });
      onOpenChange(false);
    } finally { setSubmitting(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Import Gantt items</DialogTitle>
        </DialogHeader>

        {/* Step 1: pick file */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Input type="file" accept=".csv,.xlsx,.xls"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              className="max-w-sm" />
            <span className="text-xs text-muted-foreground">Accepted: .csv, .xlsx</span>
            <div className="flex-1" />
            <Button size="sm" variant="outline" onClick={downloadTemplateCsv}>
              <FileDown className="h-3.5 w-3.5 mr-1" /> CSV template
            </Button>
            <Button size="sm" variant="outline" onClick={downloadTemplateXlsx}>
              <FileDown className="h-3.5 w-3.5 mr-1" /> Excel template
            </Button>
          </div>

          {hasExisting && rows.length > 0 && (
            <div className="rounded-md border bg-muted/30 p-3">
              <div className="text-xs font-semibold mb-2">A Gantt already exists for this project</div>
              <RadioGroup value={mode} onValueChange={(v) => setMode(v as any)} className="flex gap-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="append" id="m-append" />
                  <Label htmlFor="m-append" className="text-xs">Append to existing</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="replace" id="m-replace" />
                  <Label htmlFor="m-replace" className="text-xs">Replace existing</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {parsing && <div className="text-sm text-muted-foreground">Parsing file…</div>}

          {!parsing && rows.length > 0 && (
            <>
              <div className="flex items-center gap-3 text-xs">
                <span><b>{summary.total}</b> rows</span>
                <span>{summary.sections} sections · {summary.tasks} tasks · {summary.milestones} milestones</span>
                {summary.errors > 0 && (
                  <span className="text-destructive flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> {summary.errors} row{summary.errors > 1 ? "s" : ""} with errors
                  </span>
                )}
              </div>

              <div className="max-h-[420px] overflow-auto border rounded-md">
                <table className="w-full text-[11px]">
                  <thead className="bg-muted/40 sticky top-0 z-10">
                    <tr className="text-left">
                      <th className="px-2 py-1.5 w-8">#</th>
                      <th className="px-2 py-1.5">Title</th>
                      <th className="px-2 py-1.5 w-24">Type</th>
                      <th className="px-2 py-1.5 w-32">Section</th>
                      <th className="px-2 py-1.5 w-28">Start</th>
                      <th className="px-2 py-1.5 w-28">End</th>
                      <th className="px-2 py-1.5 w-16">Prog.</th>
                      <th className="px-2 py-1.5 w-40">Assignee</th>
                      <th className="px-2 py-1.5 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => {
                      const bad = r.errors.length > 0;
                      return (
                        <tr key={i} className={`border-t ${bad ? "bg-destructive/5" : ""}`} title={bad ? r.errors.join("\n") : undefined}>
                          <td className="px-2 py-1 text-muted-foreground tabular-nums">{i + 1}</td>
                          <td className="px-2 py-1">
                            <input value={r.title} onChange={(e) => updateRow(i, { title: e.target.value })}
                              className={`bg-transparent w-full outline-none rounded px-1 py-0.5 hover:bg-muted/50 ${!r.title ? "ring-1 ring-destructive" : ""}`} />
                          </td>
                          <td className="px-2 py-1">
                            <Select value={r.type} onValueChange={(v) => updateRow(i, { type: v as any })}>
                              <SelectTrigger className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="section">Section</SelectItem>
                                <SelectItem value="task">Task</SelectItem>
                                <SelectItem value="milestone">Milestone</SelectItem>
                                <SelectItem value="sub_item">Sub-item</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-2 py-1 truncate text-muted-foreground">{r.sectionTitle || r.parentTitle || "—"}</td>
                          <td className="px-2 py-1">
                            <input type="date" value={r.startDate ?? ""} onChange={(e) => updateRow(i, { startDate: e.target.value || null })}
                              className="bg-transparent w-full outline-none rounded px-1 py-0.5 hover:bg-muted/50" />
                          </td>
                          <td className="px-2 py-1">
                            <input type="date" value={r.endDate ?? ""} onChange={(e) => updateRow(i, { endDate: e.target.value || null })}
                              disabled={r.type === "milestone"}
                              className="bg-transparent w-full outline-none rounded px-1 py-0.5 hover:bg-muted/50 disabled:opacity-50" />
                          </td>
                          <td className="px-2 py-1">
                            <input type="number" min={0} max={100} value={r.progress}
                              onChange={(e) => updateRow(i, { progress: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
                              className="bg-transparent w-14 outline-none rounded px-1 py-0.5 hover:bg-muted/50 tabular-nums" />
                          </td>
                          <td className="px-2 py-1">
                            <Select
                              value={r.assigneeId ?? "__unassigned"}
                              onValueChange={(v) => updateRow(i, { assigneeId: v === "__unassigned" ? null : v, assigneeUnresolved: false })}>
                              <SelectTrigger className={`h-7 text-[11px] ${r.assigneeUnresolved ? "ring-1 ring-destructive" : ""}`}>
                                <SelectValue>
                                  {r.assigneeId
                                    ? (members.find((m) => m.id === r.assigneeId)?.full_name || members.find((m) => m.id === r.assigneeId)?.email)
                                    : r.assigneeUnresolved ? `Unmatched: ${r.assigneeInput}` : "Unassigned"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__unassigned">Unassigned</SelectItem>
                                {members.map((m) => (
                                  <SelectItem key={m.id} value={m.id}>{m.full_name || m.email}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-2 py-1">
                            <button onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))} title="Remove">
                              <X className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!canConfirm} onClick={confirm}>
            <Upload className="h-3.5 w-3.5 mr-1" />
            {submitting ? "Importing…" : `Import ${rows.length} item${rows.length === 1 ? "" : "s"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function revalidate(r: PreviewRow): PreviewRow {
  const errors: string[] = [];
  if (!r.title?.trim()) errors.push("Title is required");
  if (r.type !== "milestone" && !r.startDate) errors.push("Start date required");
  if (r.type !== "milestone" && !r.endDate && !r.duration) errors.push("End date or duration required");
  if (r.startDate && r.endDate && r.endDate < r.startDate) errors.push("End date is before start date");
  if (r.assigneeUnresolved) errors.push(`Unrecognised assignee: ${r.assigneeInput}`);
  return { ...r, errors };
}

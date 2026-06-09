import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PdfExportOptions } from "@/lib/gantt/pdfExport";
import type { ZoomLevel } from "@/lib/gantt/types";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: (opts: PdfExportOptions) => void;
  defaultStart?: string | null;
  defaultEnd?: string | null;
}

export function GanttPdfExportDialog({ open, onOpenChange, onConfirm, defaultStart, defaultEnd }: Props) {
  const [opts, setOpts] = useState<PdfExportOptions>({
    paperSize: "A4", orientation: "landscape", zoom: "week",
    includeCompleted: true, includeDependencies: true, includeCriticalPath: false, includeBaseline: false,
    greyscale: false, startDate: defaultStart ?? null, endDate: defaultEnd ?? null,
  });
  const set = <K extends keyof PdfExportOptions>(k: K, v: PdfExportOptions[K]) => setOpts((p) => ({ ...p, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Export Gantt to PDF</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">From</Label>
              <Input type="date" value={opts.startDate ?? ""} onChange={(e) => set("startDate", e.target.value || null)} />
            </div>
            <div>
              <Label className="text-xs">To</Label>
              <Input type="date" value={opts.endDate ?? ""} onChange={(e) => set("endDate", e.target.value || null)} />
            </div>
            <div>
              <Label className="text-xs">Zoom</Label>
              <Select value={opts.zoom} onValueChange={(v) => set("zoom", v as ZoomLevel)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Paper size</Label>
              <Select value={opts.paperSize} onValueChange={(v) => set("paperSize", v as PdfExportOptions["paperSize"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A4">A4</SelectItem>
                  <SelectItem value="Letter">Letter</SelectItem>
                  <SelectItem value="A3">A3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Orientation</Label>
              <Select value={opts.orientation} onValueChange={(v) => set("orientation", v as PdfExportOptions["orientation"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="landscape">Landscape</SelectItem>
                  <SelectItem value="portrait">Portrait</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Colour scheme</Label>
              <Select value={opts.greyscale ? "grey" : "colour"} onValueChange={(v) => set("greyscale", v === "grey")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="colour">Full colour</SelectItem>
                  <SelectItem value="grey">Greyscale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2 border-t pt-3">
            {[
              ["includeCompleted","Include completed items"],
              ["includeDependencies","Show dependencies"],
              ["includeCriticalPath","Highlight critical path"],
              ["includeBaseline","Show baseline ghosts"],
            ].map(([k, label]) => (
              <div key={k} className="flex items-center justify-between text-sm">
                <span>{label}</span>
                <Switch checked={(opts as any)[k]} onCheckedChange={(v) => set(k as any, v as any)} />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { onConfirm(opts); onOpenChange(false); }}>Generate PDF</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

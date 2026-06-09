import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus, Diamond, Download, Upload, Maximize2, Minimize2, EyeOff,
  Zap, CheckCircle2, CloudSun, Crosshair, CalendarRange, CalendarPlus, GitBranch, Flag,
} from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { ColourBy, ZoomLevel } from "@/lib/gantt/types";

interface Props {
  zoom: ZoomLevel; setZoom: (z: ZoomLevel) => void;
  showDeps: boolean; setShowDeps: (v: boolean) => void;
  critical: boolean; setCritical: (v: boolean) => void;
  showCompleted: boolean; setShowCompleted: (v: boolean) => void;
  showWeekends: boolean; setShowWeekends: (v: boolean) => void;
  showBaseline: boolean; setShowBaseline: (v: boolean) => void;
  colourBy: ColourBy; setColourBy: (c: ColourBy) => void;
  onAddSection: () => void;
  onAddMilestone: () => void;
  onJumpToday: () => void;
  onJumpStart: () => void;
  onFit: () => void;
  onImport: () => void;
  onExportCsv: () => void;
  onExportXlsx: () => void;
  onExportPdf: () => void;
  onSetBaseline: () => void;
  hasBaseline: boolean;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  // Top-of-chart stats
  overallProgress: number;
  projectEndDate: string | null;
  criticalCount: number;
}

export function GanttToolbar(p: Props) {
  return (
    <div className="border-b bg-muted/30 rounded-t-lg">
      <div className="flex flex-wrap items-center gap-2 p-2">
        <div className="flex rounded-md border bg-background">
          {(["day","week","month","quarter"] as ZoomLevel[]).map((z) => (
            <button key={z}
              onClick={() => p.setZoom(z)}
              className={`px-2.5 py-1 text-xs capitalize ${p.zoom === z ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
              {z}
            </button>
          ))}
        </div>
        <Button size="sm" variant="ghost" onClick={p.onFit} title="Fit"><CalendarRange className="h-4 w-4" /></Button>
        <Button size="sm" variant="ghost" onClick={p.onJumpToday} title="Today"><Crosshair className="h-4 w-4" /></Button>
        <Button size="sm" variant="ghost" onClick={p.onJumpStart} title="Project start"><CalendarPlus className="h-4 w-4" /></Button>
        <div className="h-5 w-px bg-border mx-1" />
        <Toggle size="sm" pressed={p.showDeps} onPressedChange={p.setShowDeps} title="Dependencies"><Zap className="h-3.5 w-3.5" /></Toggle>
        <Toggle size="sm" pressed={p.critical} onPressedChange={p.setCritical} title="Critical path"><GitBranch className="h-3.5 w-3.5" /></Toggle>
        <Toggle size="sm" pressed={p.showCompleted} onPressedChange={p.setShowCompleted} title="Completed"><CheckCircle2 className="h-3.5 w-3.5" /></Toggle>
        <Toggle size="sm" pressed={p.showWeekends} onPressedChange={p.setShowWeekends} title="Weekends"><CloudSun className="h-3.5 w-3.5" /></Toggle>
        <Toggle size="sm" pressed={p.showBaseline} onPressedChange={p.setShowBaseline} title="Baseline" disabled={!p.hasBaseline}><Flag className="h-3.5 w-3.5" /></Toggle>
        <div className="h-5 w-px bg-border mx-1" />
        <Select value={p.colourBy} onValueChange={(v) => p.setColourBy(v as ColourBy)}>
          <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="status">Colour by status</SelectItem>
            <SelectItem value="assignee">Colour by assignee</SelectItem>
            <SelectItem value="section">Colour by section</SelectItem>
            <SelectItem value="custom">Custom colours</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <Button size="sm" variant="outline" onClick={p.onSetBaseline} title={p.hasBaseline ? "Replace baseline with current dates" : "Snapshot current dates as baseline"}>
          <Flag className="h-3.5 w-3.5 mr-1" />{p.hasBaseline ? "Update baseline" : "Set baseline"}
        </Button>
        <Button size="sm" variant="outline" onClick={p.onAddSection}><Plus className="h-3.5 w-3.5 mr-1" />Section</Button>
        <Button size="sm" variant="outline" onClick={p.onAddMilestone}><Diamond className="h-3.5 w-3.5 mr-1" />Milestone</Button>
        <Button size="sm" variant="outline" onClick={p.onImport}><Upload className="h-3.5 w-3.5 mr-1" />Import</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline"><Download className="h-3.5 w-3.5 mr-1" />Export</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={p.onExportCsv}>CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={p.onExportXlsx}>Excel (.xlsx)</DropdownMenuItem>
            <DropdownMenuItem onClick={p.onExportPdf}>PDF (timeline)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" variant="ghost" onClick={p.onToggleFullscreen} title="Fullscreen">
          {p.fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Project metrics row */}
      <div className="flex items-center gap-4 px-3 py-1.5 border-t bg-background/50 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Overall progress</span>
          <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${p.overallProgress}%` }} />
          </div>
          <span className="font-semibold tabular-nums">{p.overallProgress}%</span>
        </div>
        <div className="h-3 w-px bg-border" />
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Projected end</span>
          <span className="font-semibold">{p.projectEndDate ?? "—"}</span>
        </div>
        {p.critical && (
          <>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1 text-red-600">
              <GitBranch className="h-3 w-3" />
              <span className="font-semibold">{p.criticalCount}</span>
              <span className="text-muted-foreground">items on critical path</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

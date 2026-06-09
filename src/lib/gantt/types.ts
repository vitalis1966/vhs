export type GanttItemType = "section" | "task" | "milestone" | "sub_item";
export type GanttItemStatus = "not_started" | "in_progress" | "complete" | "blocked" | "on_hold";
export type DependencyKind = "FS" | "SS" | "FF";

export interface GanttDependency {
  from: string; // item id this item depends on
  type?: DependencyKind;
}

export interface GanttItem {
  id: string;
  workspace_id: string;
  project_id: string;
  client_id: string;
  parent_id: string | null;
  type: GanttItemType;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  duration_days: number | null;
  progress: number;
  status: GanttItemStatus;
  assignee_id: string | null;
  colour: string | null;
  is_critical_path: boolean;
  is_collapsed: boolean;
  is_complete: boolean;
  dependencies: GanttDependency[];
  linked_task_id: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export type ZoomLevel = "day" | "week" | "month" | "quarter";
export type ColourBy = "assignee" | "status" | "section" | "custom";

export const STATUS_LABEL: Record<GanttItemStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  complete: "Complete",
  blocked: "Blocked",
  on_hold: "On hold",
};

export const STATUS_COLOUR: Record<GanttItemStatus, string> = {
  not_started: "#94a3b8",
  in_progress: "#3b82f6",
  complete: "#22c55e",
  blocked: "#ef4444",
  on_hold: "#f59e0b",
};

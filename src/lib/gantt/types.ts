export type GanttItemType = "section" | "task" | "milestone" | "sub_item";
export type GanttItemStatus = "not_started" | "in_progress" | "complete" | "blocked" | "on_hold";
export type DependencyKind = "FS" | "SS" | "FF";

export interface GanttDependency {
  from: string;
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
  linked_meeting_id: string | null;
  linked_milestone_id: string | null;
  is_internal: boolean;
  estimated_hours: number | null;
  attachment_document_ids: string[];
  position: number;
  baseline_start: string | null;
  baseline_end: string | null;
  baseline_set_at: string | null;
  due_reminder_3d_sent_at: string | null;
  due_reminder_1d_sent_at: string | null;
  due_reminder_0d_sent_at: string | null;
  overdue_notified_at: string | null;
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

// Vitalis brand
export const VITALIS = {
  green: "#172620",
  gold: "#C89741",
  sage: "#60766B",
  cream: "#FAF8F5",
  sageLight: "#DAE2DD",
};

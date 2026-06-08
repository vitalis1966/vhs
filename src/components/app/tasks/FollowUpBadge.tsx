import { Badge } from "@/components/ui/badge";

export type FollowUpStatus = "not_started" | "recurring" | "completed";

const LABELS: Record<FollowUpStatus, string> = {
  not_started: "Not Started",
  recurring: "Recurring",
  completed: "Completed",
};

const CLASSES: Record<FollowUpStatus, string> = {
  not_started: "bg-muted text-muted-foreground border-transparent",
  recurring: "bg-blue-100 text-blue-700 border-transparent dark:bg-blue-950 dark:text-blue-300",
  completed: "bg-emerald-100 text-emerald-700 border-transparent dark:bg-emerald-950 dark:text-emerald-300",
};

export function FollowUpBadge({ status }: { status: FollowUpStatus | null | undefined }) {
  const s: FollowUpStatus = status ?? "not_started";
  return <Badge variant="outline" className={CLASSES[s]}>{LABELS[s]}</Badge>;
}

export const FOLLOW_UP_STATUS_OPTIONS = (Object.keys(LABELS) as FollowUpStatus[]).map((v) => ({
  value: v, label: LABELS[v],
}));

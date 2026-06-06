export const PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const PRIORITY_CLASS: Record<string, string> = {
  Low: "bg-slate-100 text-slate-700 border-slate-200",
  Medium: "bg-blue-100 text-blue-800 border-blue-200",
  High: "bg-orange-100 text-orange-800 border-orange-200",
  Urgent: "bg-red-100 text-red-800 border-red-200",
};

export const CLIENT_COLORS = [
  "bg-indigo-100 text-indigo-800",
  "bg-emerald-100 text-emerald-800",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-800",
  "bg-cyan-100 text-cyan-800",
  "bg-violet-100 text-violet-800",
  "bg-lime-100 text-lime-800",
  "bg-pink-100 text-pink-800",
];

export function clientColor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return CLIENT_COLORS[h % CLIENT_COLORS.length];
}

export function initials(s?: string | null) {
  if (!s) return "?";
  return s.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

/**
 * Parse a YYYY-MM-DD date string as a local-time Date (midnight local).
 * Avoids the UTC-shift bug where new Date("2026-06-10") becomes June 9 in negative timezones.
 */
export function parseDateOnly(s: string | null | undefined): Date | null {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export function isOverdue(due: string | null | undefined, completedAt: string | null | undefined) {
  if (!due || completedAt) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = parseDateOnly(due); if (!d) return false;
  d.setHours(0, 0, 0, 0);
  return d < today;
}

/**
 * True if the due date is between today (inclusive) and 3 days from now (inclusive),
 * and the task is not completed.
 */
export function isApproachingDue(due: string | null | undefined, completedAt: string | null | undefined) {
  if (!due || completedAt) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dueDate = parseDateOnly(due); if (!dueDate) return false;
  dueDate.setHours(0, 0, 0, 0);
  if (dueDate < today) return false; // overdue handled separately
  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(today.getDate() + 3);
  return dueDate <= threeDaysFromNow;
}

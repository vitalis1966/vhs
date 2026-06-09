import { supabase } from "@/integrations/supabase/client";
import type { GanttItem } from "./types";
import { addDays, toDate, toISO, diffDays, today } from "./dates";

const sb = supabase as any;

export interface GanttTemplate {
  id: string;
  workspace_id: string | null;
  name: string;
  description: string | null;
  is_builtin: boolean;
  items: GanttTemplateItem[];
}
export interface GanttTemplateItem {
  item_key: string;
  parent_key: string | null;
  type: GanttItem["type"];
  title: string;
  description: string | null;
  start_offset_days: number;
  duration_days: number;
  colour: string | null;
  position: number;
  is_internal: boolean;
  dependencies_keys: string[];
}

// ---------- Built-in templates ----------
function mk(items: Array<Omit<GanttTemplateItem, "is_internal"> & { is_internal?: boolean }>): GanttTemplateItem[] {
  return items.map((i) => ({ ...i, is_internal: i.is_internal ?? false, description: i.description ?? null }));
}

export const BUILTIN_TEMPLATES: GanttTemplate[] = [
  {
    id: "builtin-new-clinic",
    workspace_id: null,
    name: "New Clinic Build",
    description: "End-to-end clinic build: pre-planning through opening.",
    is_builtin: true,
    items: mk([
      { item_key: "s1", parent_key: null, type: "section", title: "Pre-Planning", start_offset_days: 0, duration_days: 21, colour: "#60766B", position: 0 },
      { item_key: "t1", parent_key: "s1", type: "task", title: "Market & site analysis", start_offset_days: 0, duration_days: 10, colour: null, position: 0, dependencies_keys: [] },
      { item_key: "t2", parent_key: "s1", type: "task", title: "Business plan & financials", start_offset_days: 7, duration_days: 14, colour: null, position: 1, dependencies_keys: [] },
      { item_key: "s2", parent_key: null, type: "section", title: "Design & Approvals", start_offset_days: 21, duration_days: 60, colour: "#C89741", position: 1 },
      { item_key: "t3", parent_key: "s2", type: "task", title: "Architect & layout", start_offset_days: 21, duration_days: 30, colour: null, position: 0, dependencies_keys: ["t2"] },
      { item_key: "t4", parent_key: "s2", type: "task", title: "Permits & approvals", start_offset_days: 45, duration_days: 35, colour: null, position: 1, dependencies_keys: ["t3"] },
      { item_key: "s3", parent_key: null, type: "section", title: "Construction", start_offset_days: 81, duration_days: 90, colour: "#172620", position: 2 },
      { item_key: "t5", parent_key: "s3", type: "task", title: "Site works", start_offset_days: 81, duration_days: 90, colour: null, position: 0, dependencies_keys: ["t4"] },
      { item_key: "s4", parent_key: null, type: "section", title: "Fit-Out", start_offset_days: 161, duration_days: 45, colour: "#60766B", position: 3 },
      { item_key: "t6", parent_key: "s4", type: "task", title: "Equipment & fit-out", start_offset_days: 161, duration_days: 45, colour: null, position: 0, dependencies_keys: ["t5"] },
      { item_key: "s5", parent_key: null, type: "section", title: "Regulatory & Accreditation", start_offset_days: 180, duration_days: 30, colour: "#C89741", position: 4 },
      { item_key: "t7", parent_key: "s5", type: "task", title: "Accreditation submission", start_offset_days: 180, duration_days: 30, colour: null, position: 0, dependencies_keys: [] },
      { item_key: "s6", parent_key: null, type: "section", title: "Recruitment", start_offset_days: 150, duration_days: 60, colour: "#172620", position: 5 },
      { item_key: "t8", parent_key: "s6", type: "task", title: "Hire clinical & support team", start_offset_days: 150, duration_days: 60, colour: null, position: 0, dependencies_keys: [] },
      { item_key: "s7", parent_key: null, type: "section", title: "Soft Launch", start_offset_days: 206, duration_days: 14, colour: "#60766B", position: 6 },
      { item_key: "m1", parent_key: "s7", type: "milestone", title: "Soft launch", start_offset_days: 210, duration_days: 0, colour: "#C89741", position: 0, dependencies_keys: ["t6","t7","t8"] },
      { item_key: "s8", parent_key: null, type: "section", title: "Opening", start_offset_days: 220, duration_days: 14, colour: "#C89741", position: 7 },
      { item_key: "m2", parent_key: "s8", type: "milestone", title: "Grand opening", start_offset_days: 230, duration_days: 0, colour: "#C89741", position: 0, dependencies_keys: ["m1"] },
    ]),
  },
  {
    id: "builtin-practice-review",
    workspace_id: null,
    name: "Practice Operational Review",
    description: "Assessment, analysis, recommendations, implementation, review.",
    is_builtin: true,
    items: mk([
      { item_key: "s1", parent_key: null, type: "section", title: "Assessment", start_offset_days: 0, duration_days: 14, colour: "#60766B", position: 0 },
      { item_key: "t1", parent_key: "s1", type: "task", title: "Document review & interviews", start_offset_days: 0, duration_days: 14, colour: null, position: 0, dependencies_keys: [] },
      { item_key: "s2", parent_key: null, type: "section", title: "Analysis", start_offset_days: 14, duration_days: 14, colour: "#C89741", position: 1 },
      { item_key: "t2", parent_key: "s2", type: "task", title: "Benchmarking & gap analysis", start_offset_days: 14, duration_days: 14, colour: null, position: 0, dependencies_keys: ["t1"] },
      { item_key: "s3", parent_key: null, type: "section", title: "Recommendations", start_offset_days: 28, duration_days: 10, colour: "#172620", position: 2 },
      { item_key: "t3", parent_key: "s3", type: "task", title: "Draft recommendations report", start_offset_days: 28, duration_days: 10, colour: null, position: 0, dependencies_keys: ["t2"] },
      { item_key: "m1", parent_key: "s3", type: "milestone", title: "Report delivered", start_offset_days: 38, duration_days: 0, colour: "#C89741", position: 1, dependencies_keys: ["t3"] },
      { item_key: "s4", parent_key: null, type: "section", title: "Implementation", start_offset_days: 38, duration_days: 60, colour: "#60766B", position: 3 },
      { item_key: "t4", parent_key: "s4", type: "task", title: "Implement priority changes", start_offset_days: 38, duration_days: 60, colour: null, position: 0, dependencies_keys: ["m1"] },
      { item_key: "s5", parent_key: null, type: "section", title: "Review", start_offset_days: 98, duration_days: 14, colour: "#C89741", position: 4 },
      { item_key: "t5", parent_key: "s5", type: "task", title: "Post-implementation review", start_offset_days: 98, duration_days: 14, colour: null, position: 0, dependencies_keys: ["t4"] },
    ]),
  },
  {
    id: "builtin-ma",
    workspace_id: null,
    name: "M&A Transaction",
    description: "Initial assessment through integration.",
    is_builtin: true,
    items: mk([
      { item_key: "s1", parent_key: null, type: "section", title: "Initial Assessment", start_offset_days: 0, duration_days: 14, colour: "#60766B", position: 0 },
      { item_key: "t1", parent_key: "s1", type: "task", title: "Target screening & NDA", start_offset_days: 0, duration_days: 14, colour: null, position: 0, dependencies_keys: [] },
      { item_key: "s2", parent_key: null, type: "section", title: "Due Diligence", start_offset_days: 14, duration_days: 28, colour: "#C89741", position: 1 },
      { item_key: "t2", parent_key: "s2", type: "task", title: "Financial DD", start_offset_days: 14, duration_days: 21, colour: null, position: 0, dependencies_keys: ["t1"] },
      { item_key: "t3", parent_key: "s2", type: "task", title: "Operational & clinical DD", start_offset_days: 14, duration_days: 28, colour: null, position: 1, dependencies_keys: ["t1"] },
      { item_key: "s3", parent_key: null, type: "section", title: "Valuation", start_offset_days: 35, duration_days: 14, colour: "#172620", position: 2 },
      { item_key: "t4", parent_key: "s3", type: "task", title: "Valuation model", start_offset_days: 35, duration_days: 14, colour: null, position: 0, dependencies_keys: ["t2","t3"] },
      { item_key: "s4", parent_key: null, type: "section", title: "Negotiation", start_offset_days: 49, duration_days: 21, colour: "#60766B", position: 3 },
      { item_key: "t5", parent_key: "s4", type: "task", title: "LOI & term sheet", start_offset_days: 49, duration_days: 21, colour: null, position: 0, dependencies_keys: ["t4"] },
      { item_key: "s5", parent_key: null, type: "section", title: "Legal", start_offset_days: 70, duration_days: 28, colour: "#C89741", position: 4 },
      { item_key: "t6", parent_key: "s5", type: "task", title: "SPA drafting & legal review", start_offset_days: 70, duration_days: 28, colour: null, position: 0, dependencies_keys: ["t5"] },
      { item_key: "s6", parent_key: null, type: "section", title: "Closing", start_offset_days: 98, duration_days: 7, colour: "#172620", position: 5 },
      { item_key: "m1", parent_key: "s6", type: "milestone", title: "Deal closed", start_offset_days: 105, duration_days: 0, colour: "#C89741", position: 0, dependencies_keys: ["t6"] },
      { item_key: "s7", parent_key: null, type: "section", title: "Integration", start_offset_days: 105, duration_days: 90, colour: "#60766B", position: 6 },
      { item_key: "t7", parent_key: "s7", type: "task", title: "Operational integration", start_offset_days: 105, duration_days: 90, colour: null, position: 0, dependencies_keys: ["m1"] },
    ]),
  },
  {
    id: "builtin-nhsf",
    workspace_id: null,
    name: "NHSF Accreditation",
    description: "Gap assessment through post-inspection.",
    is_builtin: true,
    items: mk([
      { item_key: "s1", parent_key: null, type: "section", title: "Gap Assessment", start_offset_days: 0, duration_days: 14, colour: "#60766B", position: 0 },
      { item_key: "t1", parent_key: "s1", type: "task", title: "Standards gap analysis", start_offset_days: 0, duration_days: 14, colour: null, position: 0, dependencies_keys: [] },
      { item_key: "s2", parent_key: null, type: "section", title: "Policy Development", start_offset_days: 14, duration_days: 42, colour: "#C89741", position: 1 },
      { item_key: "t2", parent_key: "s2", type: "task", title: "Draft & approve policies", start_offset_days: 14, duration_days: 42, colour: null, position: 0, dependencies_keys: ["t1"] },
      { item_key: "s3", parent_key: null, type: "section", title: "Facility Preparation", start_offset_days: 35, duration_days: 35, colour: "#172620", position: 2 },
      { item_key: "t3", parent_key: "s3", type: "task", title: "Facility readiness works", start_offset_days: 35, duration_days: 35, colour: null, position: 0, dependencies_keys: [] },
      { item_key: "s4", parent_key: null, type: "section", title: "Pre-Inspection", start_offset_days: 70, duration_days: 14, colour: "#60766B", position: 3 },
      { item_key: "t4", parent_key: "s4", type: "task", title: "Mock inspection & remediation", start_offset_days: 70, duration_days: 14, colour: null, position: 0, dependencies_keys: ["t2","t3"] },
      { item_key: "s5", parent_key: null, type: "section", title: "Inspection", start_offset_days: 84, duration_days: 7, colour: "#C89741", position: 4 },
      { item_key: "m1", parent_key: "s5", type: "milestone", title: "Inspection visit", start_offset_days: 88, duration_days: 0, colour: "#C89741", position: 0, dependencies_keys: ["t4"] },
      { item_key: "s6", parent_key: null, type: "section", title: "Post-Inspection", start_offset_days: 91, duration_days: 21, colour: "#172620", position: 5 },
      { item_key: "t5", parent_key: "s6", type: "task", title: "Response & corrective actions", start_offset_days: 91, duration_days: 21, colour: null, position: 0, dependencies_keys: ["m1"] },
      { item_key: "m2", parent_key: "s6", type: "milestone", title: "Accreditation awarded", start_offset_days: 112, duration_days: 0, colour: "#C89741", position: 1, dependencies_keys: ["t5"] },
    ]),
  },
];

// ---------- API ----------
export async function listTemplates(workspaceId: string): Promise<GanttTemplate[]> {
  const { data: tpls } = await sb.from("gantt_templates").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false });
  const list: GanttTemplate[] = [];
  for (const t of tpls ?? []) {
    const { data: items } = await sb.from("gantt_template_items").select("*").eq("template_id", t.id).order("position");
    list.push({ ...t, items: items ?? [] });
  }
  return list;
}

export async function saveTemplate(workspaceId: string, name: string, description: string | null, items: GanttItem[]): Promise<string> {
  const projectStart = items.reduce<Date | null>((acc, i) => {
    const d = toDate(i.start_date);
    return d && (!acc || d < acc) ? d : acc;
  }, null);
  const { data: tpl, error } = await sb.from("gantt_templates").insert({
    workspace_id: workspaceId, name, description,
  }).select().single();
  if (error) throw error;
  // Stable keys
  const keyById = new Map<string, string>();
  items.forEach((i, idx) => keyById.set(i.id, `k${idx}`));
  const rows = items.map((i) => {
    const s = toDate(i.start_date), e = toDate(i.end_date) ?? s;
    const offset = s && projectStart ? diffDays(projectStart, s) : 0;
    const dur = s && e ? Math.max(0, diffDays(s, e)) : 0;
    return {
      template_id: tpl.id,
      item_key: keyById.get(i.id)!,
      parent_key: i.parent_id ? keyById.get(i.parent_id) ?? null : null,
      type: i.type,
      title: i.title,
      description: i.description,
      start_offset_days: offset,
      duration_days: dur,
      colour: i.colour,
      position: i.position,
      is_internal: i.is_internal,
      dependencies_keys: (i.dependencies ?? []).map((d) => keyById.get(d.from) ?? "").filter(Boolean),
    };
  });
  if (rows.length) {
    const { error: e2 } = await sb.from("gantt_template_items").insert(rows);
    if (e2) throw e2;
  }
  return tpl.id;
}

export async function deleteTemplate(id: string): Promise<void> {
  await sb.from("gantt_templates").delete().eq("id", id);
}

export async function applyTemplate(
  template: GanttTemplate,
  ctx: { workspaceId: string; projectId: string; clientId: string; startDate?: string | null },
): Promise<void> {
  const start = toDate(ctx.startDate) ?? today();
  // Pass 1: create all items, build key -> id
  const keyToId = new Map<string, string>();
  for (const ti of template.items) {
    const sd = addDays(start, ti.start_offset_days);
    const ed = ti.type === "milestone" ? sd : addDays(sd, ti.duration_days);
    const parentId = ti.parent_key ? keyToId.get(ti.parent_key) ?? null : null;
    const { data, error } = await sb.from("gantt_items").insert({
      workspace_id: ctx.workspaceId,
      project_id: ctx.projectId,
      client_id: ctx.clientId,
      parent_id: parentId,
      type: ti.type,
      title: ti.title,
      description: ti.description,
      start_date: toISO(sd),
      end_date: ti.type === "milestone" ? toISO(sd) : toISO(ed),
      progress: 0,
      status: "not_started",
      colour: ti.colour,
      position: ti.position,
      is_internal: ti.is_internal,
    }).select().single();
    if (error) throw error;
    keyToId.set(ti.item_key, data.id);
  }
  // Pass 2: dependencies
  for (const ti of template.items) {
    if (!ti.dependencies_keys?.length) continue;
    const id = keyToId.get(ti.item_key); if (!id) continue;
    const deps = ti.dependencies_keys.map((k) => keyToId.get(k)).filter((x): x is string => !!x).map((from) => ({ from, type: "FS" as const }));
    if (deps.length) await sb.from("gantt_items").update({ dependencies: deps }).eq("id", id);
  }
}

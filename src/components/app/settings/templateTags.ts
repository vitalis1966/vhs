// Template tag definitions, substitution + counting helpers.
// Tags use the {{snake_case}} placeholder format.

export type TagKey =
  | "first_name" | "last_name" | "full_name" | "email" | "phone"
  | "practice_name" | "practice_type" | "practice_city" | "practice_province"
  | "engagement_type" | "start_date" | "lead_consultant"
  | "today_date" | "current_year";

export interface TagDef {
  key: TagKey;
  label: string;
  description: string;
}

export interface TagCategory {
  name: string;
  tags: TagDef[];
}

export const TAG_CATEGORIES: TagCategory[] = [
  {
    name: "Contact",
    tags: [
      { key: "first_name", label: "First name", description: "Contact first name" },
      { key: "last_name", label: "Last name", description: "Contact last name" },
      { key: "full_name", label: "Full name", description: "Contact full name" },
      { key: "email", label: "Email", description: "Contact email" },
      { key: "phone", label: "Phone", description: "Contact phone" },
    ],
  },
  {
    name: "Practice",
    tags: [
      { key: "practice_name", label: "Practice name", description: "Practice / clinic name" },
      { key: "practice_type", label: "Practice type", description: "Medical, dental, veterinary…" },
      { key: "practice_city", label: "City", description: "Practice city" },
      { key: "practice_province", label: "Province", description: "Practice province" },
    ],
  },
  {
    name: "Engagement",
    tags: [
      { key: "engagement_type", label: "Engagement type", description: "e.g. New Build, Operations, M&A" },
      { key: "start_date", label: "Start date", description: "Engagement start date" },
      { key: "lead_consultant", label: "Lead consultant", description: "Assigned consultant name" },
    ],
  },
  {
    name: "Date & Time",
    tags: [
      { key: "today_date", label: "Today's date", description: "Today's date" },
      { key: "current_year", label: "Current year", description: "Current year" },
    ],
  },
];

export const TAG_LABELS: Record<string, string> = Object.fromEntries(
  TAG_CATEGORIES.flatMap((c) => c.tags.map((t) => [t.key, t.label])),
);

const FALLBACKS: Partial<Record<TagKey, string>> = {
  first_name: "there",
  full_name: "there",
};

export interface TagContext {
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  practice_name?: string | null;
  practice_type?: string | null;
  practice_city?: string | null;
  practice_province?: string | null;
  engagement_type?: string | null;
  start_date?: string | null;
  lead_consultant?: string | null;
}

const PLACEHOLDER_RE = /\{\{\s*([a-z_][a-z0-9_]*)\s*\}\}/gi;

function defaults(): Record<string, string> {
  const now = new Date();
  return {
    today_date: now.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }),
    current_year: String(now.getFullYear()),
  };
}

export function substitute(input: string, ctx: TagContext = {}): string {
  if (!input) return input;
  const auto = defaults();
  return input.replace(PLACEHOLDER_RE, (_match, raw) => {
    const key = String(raw).toLowerCase() as TagKey;
    const val =
      (ctx as Record<string, unknown>)[key] != null && (ctx as Record<string, unknown>)[key] !== ""
        ? String((ctx as Record<string, unknown>)[key])
        : auto[key] ?? FALLBACKS[key] ?? "";
    return val;
  });
}

export function extractTagKeys(html: string): string[] {
  if (!html) return [];
  const found = new Set<string>();
  for (const m of html.matchAll(PLACEHOLDER_RE)) {
    found.add(m[1].toLowerCase());
  }
  return Array.from(found);
}

export function countTags(html: string): number {
  return extractTagKeys(html).length;
}

// Build a TagContext from a row joining contacts + clients + owner profile.
export interface RawContactRow {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  client?: {
    name?: string | null;
    industry?: string | null;
    start_date?: string | null;
    account_owner_full_name?: string | null;
  } | null;
}

export function buildContext(row: RawContactRow | null | undefined): TagContext {
  if (!row) return {};
  const fullName = (row.name ?? "").trim();
  const [firstName, ...rest] = fullName.split(/\s+/);
  const lastName = rest.join(" ");
  const startDate = row.client?.start_date
    ? new Date(row.client.start_date).toLocaleDateString(undefined, {
        year: "numeric", month: "long", day: "numeric",
      })
    : "";
  return {
    first_name: firstName || "",
    last_name: lastName || "",
    full_name: fullName,
    email: row.email ?? "",
    phone: row.phone ?? "",
    practice_name: row.client?.name ?? "",
    practice_type: row.client?.industry ?? "",
    practice_city: "",
    practice_province: "",
    engagement_type: "",
    start_date: startDate,
    lead_consultant: row.client?.account_owner_full_name ?? "",
  };
}

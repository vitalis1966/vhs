// Workspace permission matrix. Stored on workspaces.role_permissions as JSONB
// keyed by action → { admin, manager, team_member }.

export type WorkspaceRoleKey = "admin" | "manager" | "team_member";

export interface PermissionEntry {
  key: string;
  label: string;
  section?: string;
}

export const PERMISSION_ACTIONS: ReadonlyArray<PermissionEntry> = [
  { key: "clients.view_all",   label: "View all clients" },
  { key: "clients.create",     label: "Create clients" },
  { key: "clients.edit",       label: "Edit clients" },
  { key: "clients.delete",     label: "Delete clients" },
  { key: "projects.view_all",  label: "View all projects" },
  { key: "projects.create",    label: "Create projects" },
  { key: "projects.edit",      label: "Edit projects" },
  { key: "projects.delete",    label: "Delete projects" },
  { key: "tasks.view_all",     label: "View all tasks" },
  { key: "tasks.create",       label: "Create tasks" },
  { key: "tasks.assign",       label: "Assign tasks to others" },
  { key: "tasks.edit_any",     label: "Edit any task" },
  { key: "tasks.delete",       label: "Delete tasks" },
  { key: "notes.view_all",     label: "View all notes" },
  { key: "notes.create",       label: "Create notes" },
  { key: "notes.edit_any",     label: "Edit any note" },
  { key: "notes.delete",       label: "Delete notes" },
  { key: "files.upload",       label: "Upload files" },
  { key: "files.delete_any",   label: "Delete any file" },
  { key: "meetings.log",       label: "Log meetings" },
  { key: "meetings.delete",    label: "Delete meetings" },
  { key: "users.invite",       label: "Invite users" },
  { key: "users.manage_roles", label: "Manage user roles" },
  { key: "users.manage_access",label: "Manage client access" },
  { key: "settings.view",      label: "View company settings" },
  { key: "settings.edit",      label: "Edit company settings" },
  { key: "dashboard.view",     label: "View dashboard" },
  { key: "data.export",        label: "Export data" },
  { key: "reports.view_internal",   label: "View Internal Reports",                section: "Reports & Documents" },
  { key: "reports.view_client",     label: "View Client Reports",                  section: "Reports & Documents" },
  { key: "reports.delete_internal", label: "Delete Internal Report (Vitalis OS only)", section: "Reports & Documents" },
  { key: "reports.delete_client",   label: "Delete Client Report (Vitalis OS only)",   section: "Reports & Documents" },
  { key: "documents.view",          label: "View Documents",                       section: "Reports & Documents" },
  { key: "documents.delete",        label: "Delete Documents (Vitalis OS only)",   section: "Reports & Documents" },
] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number]["key"];
export type PermissionsMatrix = Record<string, Record<WorkspaceRoleKey, boolean>>;

const ALL = { admin: true, manager: true, team_member: true };
const MGRPLUS = { admin: true, manager: true, team_member: false };
const ADMIN = { admin: true, manager: false, team_member: false };

export const DEFAULT_PERMISSIONS: PermissionsMatrix = {
  "clients.view_all":  ALL,
  "clients.create":    MGRPLUS,
  "clients.edit":      MGRPLUS,
  "clients.delete":    ADMIN,
  "projects.view_all": ALL,
  "projects.create":   MGRPLUS,
  "projects.edit":     MGRPLUS,
  "projects.delete":   ADMIN,
  "tasks.view_all":    MGRPLUS,
  "tasks.create":      ALL,
  "tasks.assign":      MGRPLUS,
  "tasks.edit_any":    MGRPLUS,
  "tasks.delete":      MGRPLUS,
  "notes.view_all":    ALL,
  "notes.create":      ALL,
  "notes.edit_any":    MGRPLUS,
  "notes.delete":      MGRPLUS,
  "files.upload":      ALL,
  "files.delete_any":  MGRPLUS,
  "meetings.log":      ALL,
  "meetings.delete":   MGRPLUS,
  "users.invite":      ADMIN,
  "users.manage_roles":ADMIN,
  "users.manage_access":ADMIN,
  "settings.view":     ADMIN,
  "settings.edit":     ADMIN,
  "dashboard.view":    MGRPLUS,
  "data.export":       MGRPLUS,
  "reports.view_internal":   ALL,
  "reports.view_client":     ALL,
  "reports.delete_internal": MGRPLUS,
  "reports.delete_client":   MGRPLUS,
  "documents.view":          ALL,
  "documents.delete":        MGRPLUS,
};

export function resolveMatrix(stored: any): PermissionsMatrix {
  const out: PermissionsMatrix = { ...DEFAULT_PERMISSIONS };
  if (stored && typeof stored === "object") {
    for (const k of Object.keys(stored)) {
      const v = stored[k];
      if (v && typeof v === "object") out[k] = { ...DEFAULT_PERMISSIONS[k], ...v };
    }
  }
  return out;
}

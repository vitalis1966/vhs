import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2, RotateCcw } from "lucide-react";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DEFAULT_PERMISSIONS, PERMISSION_ACTIONS, PermissionsMatrix, resolveMatrix,
} from "@/lib/permissions";

const ROLES = ["admin", "manager", "team_member"] as const;
const ROLE_LABEL = { admin: "Admin", manager: "Manager", team_member: "Team Member" };

export function RolesSection() {
  const { workspace, workspaceId, refresh } = useWorkspace();
  const { toast } = useToast();
  const [matrix, setMatrix] = useState<PermissionsMatrix>(DEFAULT_PERMISSIONS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMatrix(resolveMatrix(workspace?.role_permissions));
  }, [workspace]);

  const toggle = (action: string, role: "admin" | "manager" | "team_member") => {
    setMatrix((m) => ({ ...m, [action]: { ...m[action], [role]: !m[action]?.[role] } }));
  };

  const save = async () => {
    if (!workspaceId) return;
    setSaving(true);
    const { error } = await (supabase as any).from("workspaces").update({ role_permissions: matrix }).eq("id", workspaceId);
    setSaving(false);
    if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Permissions saved" });
    await refresh();
  };

  const reset = () => setMatrix({ ...DEFAULT_PERMISSIONS });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Roles & Permissions</CardTitle>
          <CardDescription>Fine-tune what each role can do. Changes take effect after saving.</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="h-4 w-4 mr-2" />Reset to Defaults</Button>
          <Button size="sm" onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Save
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                <th className="text-left py-2 pr-3">Action</th>
                {ROLES.map((r) => <th key={r} className="text-center py-2 px-3">{ROLE_LABEL[r]}</th>)}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_ACTIONS.map((a) => (
                <tr key={a.key} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="py-2 pr-3">{a.label}</td>
                  {ROLES.map((r) => {
                    const on = !!matrix[a.key]?.[r];
                    return (
                      <td key={r} className="text-center py-2 px-3">
                        <button
                          onClick={() => toggle(a.key, r)}
                          className={`inline-flex h-7 w-7 items-center justify-center rounded transition-colors ${
                            on ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                               : "bg-rose-50 text-rose-500 hover:bg-rose-100"
                          }`}
                          aria-label={on ? "allowed" : "denied"}
                        >
                          {on ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

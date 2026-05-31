import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type Channels = { email: boolean; in_app: boolean };
type TypePrefs = Record<string, { email?: boolean; in_app?: boolean }>;

const NOTIFICATION_TYPES: Array<{ key: string; label: string; description: string }> = [
  { key: "task_assigned", label: "Task Assigned", description: "When a task is assigned to you." },
  { key: "task_overdue", label: "Task Overdue", description: "Daily summary of tasks past their due date." },
  { key: "due_soon", label: "Due Tomorrow", description: "Daily reminder of tasks due the next day." },
  { key: "status_changed", label: "Status Changed", description: "When a task on a client you own changes status." },
  { key: "mention", label: "Mentioned in Note", description: "When someone @mentions you in a note or comment." },
];

export default function NotificationSettings() {
  const { userId } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [channels, setChannels] = useState<Channels>({ email: true, in_app: true });
  const [prefs, setPrefs] = useState<TypePrefs>({});

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data } = await (supabase as any)
        .from("profiles")
        .select("notification_preferences, notification_channels")
        .eq("id", userId)
        .maybeSingle();
      setChannels({ email: true, in_app: true, ...(data?.notification_channels ?? {}) });
      setPrefs((data?.notification_preferences ?? {}) as TypePrefs);
      setLoading(false);
    })();
  }, [userId]);

  const saveChannels = async (next: Channels) => {
    setChannels(next);
    const { error } = await (supabase as any).from("profiles").update({ notification_channels: next }).eq("id", userId);
    if (error) toast.error("Failed to save");
  };

  const savePrefs = async (next: TypePrefs) => {
    setPrefs(next);
    const { error } = await (supabase as any).from("profiles").update({ notification_preferences: next }).eq("id", userId);
    if (error) toast.error("Failed to save");
  };

  const togglePref = (key: string, channel: "email" | "in_app", value: boolean) => {
    const next = { ...prefs, [key]: { ...(prefs[key] ?? {}), [channel]: value } };
    void savePrefs(next);
  };

  const effective = (key: string, channel: "email" | "in_app") => (prefs[key]?.[channel] ?? true);

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-40" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Notification Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Changes apply to future notifications only.</p>
      </div>

      <Card className="p-6">
        <h2 className="font-display text-lg font-semibold mb-4">Delivery Channels</h2>
        <div className="space-y-4">
          <RowToggle
            label="In-App Notifications"
            description="Show notifications in the bell menu inside Vitalis."
            checked={channels.in_app}
            onChange={(v) => saveChannels({ ...channels, in_app: v })}
          />
          <RowToggle
            label="Email Notifications"
            description="Receive notifications at the email address on your account."
            checked={channels.email}
            onChange={(v) => saveChannels({ ...channels, email: v })}
          />
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-display text-lg font-semibold">Notification Types</h2>
          <p className="text-xs text-muted-foreground mt-1">Fine-tune which events reach you on each channel.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-semibold px-6 py-3">Notification</th>
                <th className="text-left font-semibold px-6 py-3 hidden md:table-cell">Description</th>
                <th className="text-center font-semibold px-4 py-3 w-24">Email</th>
                <th className="text-center font-semibold px-4 py-3 w-24">In-App</th>
              </tr>
            </thead>
            <tbody>
              {NOTIFICATION_TYPES.map((t) => (
                <tr key={t.key} className="border-t">
                  <td className="px-6 py-4">
                    <div className="font-medium">{t.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 md:hidden">{t.description}</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">{t.description}</td>
                  <td className="px-4 py-4 text-center">
                    <Switch checked={effective(t.key, "email")} onCheckedChange={(v) => togglePref(t.key, "email", v)} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Switch checked={effective(t.key, "in_app")} onCheckedChange={(v) => togglePref(t.key, "in_app", v)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function RowToggle({ label, description, checked, onChange }: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

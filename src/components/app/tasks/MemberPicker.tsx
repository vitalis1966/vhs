import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/components/app/taskUtils";

interface Member { id: string; full_name: string | null; email: string | null; }

interface Props {
  workspaceId: string;
  value: string[];
  onChange: (ids: string[]) => void;
  trigger: React.ReactNode;
}

export function MemberPicker({ workspaceId, value, onChange, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [q, setQ] = useState("");
  const [local, setLocal] = useState<string[]>(value);

  useEffect(() => { setLocal(value); }, [value, open]);

  useEffect(() => {
    if (!open || !workspaceId) return;
    (async () => {
      const { data: wm } = await (supabase as any)
        .from("workspace_members")
        .select("user_id")
        .eq("workspace_id", workspaceId)
        .eq("status", "active")
        .not("user_id", "is", null);
      const ids = (wm ?? []).map((r: any) => r.user_id);
      if (!ids.length) { setMembers([]); return; }
      const { data: profs } = await (supabase as any)
        .from("profiles").select("id, full_name, email").in("id", ids);
      setMembers(profs ?? []);
    })();
  }, [open, workspaceId]);

  const label = (m: Member) => m.full_name?.trim() || m.email || "Unknown";
  const filtered = members.filter((m) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (m.full_name ?? "").toLowerCase().includes(s) || (m.email ?? "").toLowerCase().includes(s);
  });

  const toggle = (id: string) => {
    setLocal((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const apply = () => { onChange(local); setOpen(false); };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-72 p-0 pointer-events-auto" align="start">
        <div className="p-2 border-b">
          <Input placeholder="Search team…" value={q} onChange={(e) => setQ(e.target.value)} className="h-8" />
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          {filtered.length === 0 && (
            <div className="px-3 py-4 text-xs text-muted-foreground text-center">No members</div>
          )}
          {filtered.map((m) => {
            const checked = local.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => toggle(m.id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted text-left"
              >
                <Checkbox checked={checked} className="pointer-events-none" />
                <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{initials(label(m))}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{label(m)}</div>
                  {m.email && m.full_name && <div className="text-[10px] text-muted-foreground truncate">{m.email}</div>}
                </div>
              </button>
            );
          })}
        </div>
        <div className="p-2 border-t flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={apply}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

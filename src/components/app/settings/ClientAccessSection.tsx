import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Member = { user_id: string; role: string; profile: { full_name: string | null; email: string | null } | null };
type Client = { id: string; name: string; status: string | null };

export function ClientAccessSection() {
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [memberships, setMemberships] = useState<Set<string>>(new Set()); // key: userId::clientId
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<string>("");

  const load = async () => {
    if (!workspaceId) return;
    const [{ data: mrows }, { data: crows }] = await Promise.all([
      (supabase as any).from("workspace_members")
        .select("user_id, role, profile:profiles!workspace_members_user_id_fkey(full_name, email)")
        .eq("workspace_id", workspaceId).eq("status", "active").not("user_id", "is", null),
      (supabase as any).from("clients").select("id, name, status").eq("workspace_id", workspaceId).order("name"),
    ]);
    setMembers((mrows ?? []).filter((m: any) => m.user_id));
    setClients(crows ?? []);
    const clientIds = (crows ?? []).map((c: any) => c.id);
    if (clientIds.length) {
      const { data: cm } = await (supabase as any).from("client_members").select("user_id, client_id").in("client_id", clientIds);
      setMemberships(new Set((cm ?? []).map((r: any) => `${r.user_id}::${r.client_id}`)));
    }
  };
  useEffect(() => { void load(); }, [workspaceId]);

  const toggle = async (userId: string, clientId: string) => {
    const key = `${userId}::${clientId}`;
    if (memberships.has(key)) {
      await (supabase as any).from("client_members").delete().eq("user_id", userId).eq("client_id", clientId);
      const n = new Set(memberships); n.delete(key); setMemberships(n);
    } else {
      await (supabase as any).from("client_members").insert({ user_id: userId, client_id: clientId, role_on_account: "contributor" });
      const n = new Set(memberships); n.add(key); setMemberships(n);
    }
    toast({ title: "Access updated" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Access</CardTitle>
        <CardDescription>Manage which team members can access which clients.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="by_user">
          <TabsList>
            <TabsTrigger value="by_user">By User</TabsTrigger>
            <TabsTrigger value="by_client">By Client</TabsTrigger>
          </TabsList>

          <TabsContent value="by_user" className="space-y-4 pt-4">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="max-w-md"><SelectValue placeholder="Select a user" /></SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.user_id} value={m.user_id}>
                    {m.profile?.full_name || m.profile?.email} — {m.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedUser && (
              <div className="border rounded-md divide-y">
                {clients.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{c.name}</span>
                      {c.status && <Badge variant="outline" className="text-xs">{c.status}</Badge>}
                    </div>
                    <Switch
                      checked={memberships.has(`${selectedUser}::${c.id}`)}
                      onCheckedChange={() => toggle(selectedUser, c.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="by_client" className="space-y-4 pt-4">
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="max-w-md"><SelectValue placeholder="Select a client" /></SelectTrigger>
              <SelectContent>
                {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {selectedClient && (
              <div className="border rounded-md divide-y">
                {members.map((m) => (
                  <div key={m.user_id} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{m.profile?.full_name || m.profile?.email}</span>
                      <Badge variant="outline" className="text-xs">{m.role}</Badge>
                    </div>
                    <Switch
                      checked={memberships.has(`${m.user_id}::${selectedClient}`)}
                      onCheckedChange={() => toggle(m.user_id, selectedClient)}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

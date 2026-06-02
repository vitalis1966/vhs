import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MoreVertical, UserPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

type Member = {
  id: string;
  workspace_id: string;
  user_id: string | null;
  invited_email: string | null;
  invited_name: string | null;
  invited_at: string | null;
  role: "admin" | "manager" | "team_member" | "client";
  status: "active" | "pending" | "inactive";
  created_at: string;
  profile?: { full_name: string | null; email: string | null; avatar_url: string | null; last_active_at: string | null } | null;
  client_count?: number;
};

const ROLE_LABEL = { admin: "Admin", manager: "Manager", team_member: "Team Member", client: "Client" } as const;
const ROLE_COLOR: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800",
  manager: "bg-blue-100 text-blue-800",
  team_member: "bg-slate-100 text-slate-800",
  client: "bg-amber-100 text-amber-800",
};

export function UsersSection() {
  const { workspaceId, userId } = useWorkspace();
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [roleDialog, setRoleDialog] = useState<Member | null>(null);
  const [accessDialog, setAccessDialog] = useState<Member | null>(null);
  const [removeDialog, setRemoveDialog] = useState<Member | null>(null);

  const load = async () => {
    if (!workspaceId) return;
    setLoading(true);
    const { data: rows, error: rowsErr } = await (supabase as any)
      .from("workspace_members")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: true });
    if (rowsErr) console.error("workspace_members load failed", rowsErr);

    const userIds = (rows ?? []).map((r: any) => r.user_id).filter(Boolean);
    let profilesById: Record<string, any> = {};
    if (userIds.length) {
      const { data: profs } = await (supabase as any)
        .from("profiles")
        .select("id, full_name, email, avatar_url, last_active_at")
        .in("id", userIds);
      (profs ?? []).forEach((p: any) => { profilesById[p.id] = p; });
    }

    const { data: cm } = await (supabase as any)
      .from("client_members")
      .select("user_id, clients!inner(workspace_id)")
      .eq("clients.workspace_id", workspaceId);
    const counts: Record<string, number> = {};
    (cm ?? []).forEach((r: any) => { if (r.user_id) counts[r.user_id] = (counts[r.user_id] ?? 0) + 1; });

    const merged: Member[] = (rows ?? []).map((m: any) => ({
      ...m,
      profile: m.user_id ? profilesById[m.user_id] ?? null : null,
      client_count: m.user_id ? counts[m.user_id] ?? 0 : 0,
    }));
    merged.sort((a, b) => {
      const an = (a.profile?.full_name ?? a.invited_name ?? a.invited_email ?? "").toLowerCase();
      const bn = (b.profile?.full_name ?? b.invited_name ?? b.invited_email ?? "").toLowerCase();
      return an.localeCompare(bn);
    });
    setMembers(merged);

    const { data: cs } = await (supabase as any).from("clients").select("id, name").eq("workspace_id", workspaceId).order("name");
    setClients(cs ?? []);
    setLoading(false);
  };

  useEffect(() => { void load(); }, [workspaceId]);

  const active = members.filter((m) => m.status === "active");
  const pending = members.filter((m) => m.status === "pending");
  const inactive = members.filter((m) => m.status === "inactive");

  const setStatus = async (m: Member, status: "active" | "inactive") => {
    await (supabase as any).from("workspace_members").update({ status }).eq("id", m.id);
    toast({ title: status === "active" ? "User reactivated" : "User deactivated" });
    void load();
  };

  const removeMember = async (m: Member) => {
    if (m.user_id === userId) { toast({ title: "Cannot remove yourself", variant: "destructive" }); return; }
    await (supabase as any).from("workspace_members").delete().eq("id", m.id);
    setRemoveDialog(null);
    toast({ title: "User removed" });
    void load();
  };

  const resendInvite = async (m: Member) => {
    const res = await sendInviteEmail({ email: m.invited_email!, name: m.invited_name ?? "", message: "", workspaceId });
    toast({
      title: res.ok ? "Invite resent" : "Invite email failed to send",
      description: res.ok ? undefined : res.error,
      variant: res.ok ? undefined : "destructive",
    });
  };

  const cancelInvite = async (m: Member) => {
    await (supabase as any).from("workspace_members").delete().eq("id", m.id);
    toast({ title: "Invite cancelled" });
    void load();
  };

  const renderRow = (m: Member) => {
    const name = m.profile?.full_name ?? m.invited_name ?? m.invited_email ?? "Unknown";
    const email = m.profile?.email ?? m.invited_email ?? "";
    return (
      <tr key={m.id} className="border-b last:border-0">
        <td className="py-3 pr-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={m.profile?.avatar_url ?? undefined} />
              <AvatarFallback>{(name || "?").charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">{name}</div>
              <div className="text-xs text-muted-foreground">{email}</div>
            </div>
          </div>
        </td>
        <td className="py-3 pr-3"><Badge className={ROLE_COLOR[m.role]}>{ROLE_LABEL[m.role]}</Badge></td>
        <td className="py-3 pr-3">
          <Badge variant={m.status === "active" ? "default" : m.status === "pending" ? "secondary" : "outline"}>
            {m.status}
          </Badge>
        </td>
        <td className="py-3 pr-3 text-sm">{m.client_count ?? 0}</td>
        <td className="py-3 pr-3 text-xs text-muted-foreground">
          {m.profile?.last_active_at ? formatDistanceToNow(new Date(m.profile.last_active_at), { addSuffix: true }) : "—"}
        </td>
        <td className="py-3 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {m.status === "pending" ? (
                <>
                  <DropdownMenuItem onClick={() => resendInvite(m)}>Resend Invite</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => cancelInvite(m)} className="text-destructive">Cancel Invite</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => setRoleDialog(m)}>Edit Role</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setAccessDialog(m)}>Manage Client Access</DropdownMenuItem>
                  {m.status === "active" ? (
                    <DropdownMenuItem onClick={() => setStatus(m, "inactive")} className="text-destructive">Deactivate</DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => setStatus(m, "active")}>Reactivate</DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => setRemoveDialog(m)} className="text-destructive">Remove</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
    );
  };

  const Table = ({ rows }: { rows: Member[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
            <th className="py-2 pr-3">User</th><th className="py-2 pr-3">Role</th><th className="py-2 pr-3">Status</th>
            <th className="py-2 pr-3">Clients</th><th className="py-2 pr-3">Last Active</th><th></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No users in this view.</td></tr>
          ) : rows.map(renderRow)}
        </tbody>
      </table>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Users & Permissions</CardTitle>
          <CardDescription>Manage workspace members and invitations.</CardDescription>
        </div>
        <Button onClick={() => setInviteOpen(true)}><UserPlus className="h-4 w-4 mr-2" />Invite User</Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({inactive.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active"><Table rows={active} /></TabsContent>
            <TabsContent value="pending"><Table rows={pending} /></TabsContent>
            <TabsContent value="inactive"><Table rows={inactive} /></TabsContent>
          </Tabs>
        )}
      </CardContent>

      <InviteDialog open={inviteOpen} onClose={() => setInviteOpen(false)}
        clients={clients} onInvited={() => { setInviteOpen(false); void load(); }} />
      {roleDialog && (
        <RoleDialog member={roleDialog} onClose={() => setRoleDialog(null)} onSaved={() => { setRoleDialog(null); void load(); }} />
      )}
      {accessDialog && (
        <ClientAccessDialog member={accessDialog} clients={clients} onClose={() => setAccessDialog(null)} onSaved={() => { setAccessDialog(null); void load(); }} />
      )}
      <AlertDialog open={!!removeDialog} onOpenChange={(o) => !o && setRemoveDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes their workspace membership entirely. They will lose access to all platform data immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => removeDialog && removeMember(removeDialog)} className="bg-destructive">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

async function sendInviteEmail(p: { email: string; name: string; message: string; workspaceId: string | null }): Promise<{ ok: boolean; error?: string }> {
  if (!p.workspaceId) return { ok: false, error: "Missing workspace" };
  const signInUrl = `${window.location.origin}/employee-login`;
  const greeting = p.name ? `Hi ${p.name},` : "Hello,";
  const messageBlock = p.message
    ? `<p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 16px;white-space:pre-wrap;">${escapeHtml(p.message)}</p>`
    : "";
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f5f3ee;font-family:Helvetica,Arial,sans-serif;color:#1f2937;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e6e1d6;">
    <div style="background:#ffffff;border-bottom:2px solid #4a6741;padding:20px 28px;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:700;color:#1C3D2E;letter-spacing:0.5px;">Vitalis Health Strategies</div>
    </div>
    <div style="height:4px;background:#c9a84c;"></div>
    <div style="padding:32px 28px;">
      <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;margin:0 0 16px;color:#1C3D2E;">You've been invited to Vitalis OS</h1>
      <p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 16px;">${escapeHtml(greeting)}</p>
      <p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 16px;">You've been invited to join the Vitalis OS workspace. Sign in with this email address (<strong>${escapeHtml(p.email)}</strong>) to accept and get started.</p>
      ${messageBlock}
      <a href="${signInUrl}" style="display:inline-block;background:#1C3D2E;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:4px;font-weight:600;font-size:14px;margin-top:8px;">Sign in to Vitalis OS</a>
      <p style="font-size:12px;color:#9ca3af;margin:24px 0 0;">If the button doesn't work, paste this URL into your browser: ${signInUrl}</p>
    </div>
    <div style="padding:20px 28px;border-top:1px solid #e6e1d6;font-size:11px;color:#9ca3af;">
      You're receiving this because you were invited to a Vitalis Health Strategies workspace.
    </div>
  </div></body></html>`;
  const text = `${greeting}\n\nYou've been invited to join the Vitalis OS workspace. Sign in with ${p.email} at ${signInUrl} to accept.${p.message ? `\n\nMessage: ${p.message}` : ""}`;
  try {
    const { data, error } = await (supabase as any).functions.invoke("send-email", {
      body: {
        workspace_id: p.workspaceId,
        subject: "You have been invited to Vitalis OS",
        body_html: html,
        body_text: text,
        to: [p.email],
      },
    });
    if (error) {
      console.error("sendInviteEmail invoke error", error);
      return { ok: false, error: error.message ?? "Email request failed" };
    }
    if (data && data.success === false) {
      const first = Array.isArray(data.results) ? data.results.find((r: any) => !r.ok) : null;
      let msg = first?.error ?? "Email provider rejected the send";
      try {
        const parsed = JSON.parse(msg);
        if (parsed?.message) msg = parsed.message;
      } catch { /* ignore */ }
      console.error("sendInviteEmail provider error", msg);
      return { ok: false, error: msg };
    }
    return { ok: true };
  } catch (e: any) {
    console.error("sendInviteEmail exception", e);
    return { ok: false, error: e?.message ?? "Unexpected error sending invite email" };
  }
}

function escapeHtml(s: string) {
  return (s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function InviteDialog({ open, onClose, clients, onInvited }:
  { open: boolean; onClose: () => void; clients: Array<{ id: string; name: string }>; onInvited: () => void }) {
  const { workspaceId, userId } = useWorkspace();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", role: "team_member", message: "" });
  const [clientIds, setClientIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.email || !workspaceId) return;
    setSaving(true);
    const { data: row, error } = await (supabase as any).from("workspace_members").insert({
      workspace_id: workspaceId,
      user_id: null,
      invited_email: form.email.toLowerCase().trim(),
      invited_name: form.name,
      role: form.role,
      status: "pending",
      invited_at: new Date().toISOString(),
      invited_by: userId,
    }).select("id").single();
    if (error) { toast({ title: "Invite failed", description: error.message, variant: "destructive" }); setSaving(false); return; }
    // pre-link clients via invited_email by waiting until user accepts is complex; for now skip pre-link until they activate.
    const res = await sendInviteEmail({ email: form.email, name: form.name, message: form.message, workspaceId });
    toast({
      title: res.ok ? "Invitation sent" : "Invite created, but email failed to send",
      description: res.ok ? undefined : res.error,
      variant: res.ok ? undefined : "destructive",
    });
    setSaving(false);
    onInvited();
    setForm({ name: "", email: "", role: "team_member", message: "" });
    setClientIds([]);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Invite a User</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Full Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Email Address</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div>
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="team_member">Team Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Initial Client Access (optional)</Label>
            <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
              {clients.length === 0 ? <p className="text-xs text-muted-foreground">No clients yet</p> : clients.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={clientIds.includes(c.id)}
                    onChange={(e) => setClientIds(e.target.checked ? [...clientIds, c.id] : clientIds.filter(x => x !== c.id))} />
                  {c.name}
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Client access is applied once the user accepts the invite.</p>
          </div>
          <div><Label>Personal Message (optional)</Label><Textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={saving || !form.email}>{saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Send Invitation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RoleDialog({ member, onClose, onSaved }: { member: Member; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast();
  const [role, setRole] = useState(member.role);
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    const { error } = await (supabase as any).from("workspace_members").update({ role }).eq("id", member.id);
    setSaving(false);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Role updated" });
    onSaved();
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Change Role</DialogTitle></DialogHeader>
        <Select value={role} onValueChange={(v) => setRole(v as any)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="team_member">Team Member</SelectItem>
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ClientAccessDialog({ member, clients, onClose, onSaved }:
  { member: Member; clients: Array<{ id: string; name: string }>; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast();
  const [linked, setLinked] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (!member.user_id) return;
    (async () => {
      const { data } = await (supabase as any).from("client_members").select("client_id").eq("user_id", member.user_id);
      setLinked(new Set((data ?? []).map((r: any) => r.client_id)));
    })();
  }, [member.user_id]);
  const toggle = async (clientId: string) => {
    if (!member.user_id) return;
    if (linked.has(clientId)) {
      await (supabase as any).from("client_members").delete().eq("client_id", clientId).eq("user_id", member.user_id);
      const n = new Set(linked); n.delete(clientId); setLinked(n);
    } else {
      await (supabase as any).from("client_members").insert({ client_id: clientId, user_id: member.user_id, role_on_account: "contributor" });
      const n = new Set(linked); n.add(clientId); setLinked(n);
    }
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Client Access</DialogTitle></DialogHeader>
        <div className="max-h-80 overflow-y-auto space-y-1">
          {clients.map((c) => (
            <label key={c.id} className="flex items-center justify-between p-2 rounded hover:bg-muted text-sm">
              <span>{c.name}</span>
              <input type="checkbox" checked={linked.has(c.id)} onChange={() => toggle(c.id)} />
            </label>
          ))}
        </div>
        <DialogFooter><Button onClick={() => { onSaved(); toast({ title: "Access updated" }); }}>Done</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

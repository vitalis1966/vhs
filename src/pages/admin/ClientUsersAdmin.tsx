import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdminGuard } from "@/components/AdminGuard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ColumnDef, SortableFilterableTable } from "@/components/admin/SortableFilterableTable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Download, Upload, KeyRound, Pencil, Trash2, Loader2, ArrowLeft, Wand2, Eye, EyeOff, Copy } from "lucide-react";
import { downloadCsv, parseCsv, toCsv } from "@/lib/csv";
import { Link } from "react-router-dom";

type ClientRow = {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  phone: string | null;
  business_name: string | null;
  created_at: string;
  updated_at: string;
};

function Inner() {
  const [rows, setRows] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editRow, setEditRow] = useState<ClientRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<ClientRow | null>(null);
  const [resetRow, setResetRow] = useState<ClientRow | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetting, setResetting] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", business_name: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from("client_users").select("*").order("created_at", { ascending: false });
    setRows(data || []);
    setLoading(false);
  };
  useEffect(() => { fetchRows(); }, []);

  const handleAdd = async () => {
    setSubmitting(true);
    const { error } = await (supabase as any).functions.invoke("admin-create-client-user", { body: form });
    setSubmitting(false);
    if (error) { toast({ title: "Failed to add client", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Client added", description: "Welcome email sent." });
    setAddOpen(false);
    setForm({ name: "", email: "", phone: "", business_name: "" });
    fetchRows();
  };

  const handleEdit = async () => {
    if (!editRow) return;
    setSubmitting(true);
    const { error } = await (supabase as any).from("client_users").update({
      name: editRow.name, phone: editRow.phone, business_name: editRow.business_name,
    }).eq("id", editRow.id);
    setSubmitting(false);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Updated" });
    setEditRow(null);
    fetchRows();
  };

  const handleToggle = async (row: ClientRow, value: boolean) => {
    const { error } = await (supabase as any).from("client_users").update({ is_active: value }).eq("id", row.id);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    fetchRows();
  };

  const openResetPassword = (row: ClientRow) => {
    setResetRow(row);
    setResetPassword("");
    setResetConfirm("");
    setShowResetPassword(false);
    setGenerated(false);
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*";
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    let out = "";
    for (let i = 0; i < bytes.length; i++) out += chars[bytes[i] % chars.length];
    setResetPassword(out);
    setResetConfirm(out);
    setShowResetPassword(true);
    setGenerated(true);
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(resetPassword);
      toast({ title: "Password copied" });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  const confirmResetPassword = async () => {
    if (!resetRow) return;
    if (resetPassword.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }
    if (resetPassword !== resetConfirm) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setResetting(true);
    const { error } = await (supabase as any).functions.invoke("admin-reset-password", {
      body: { user_id: resetRow.id, kind: "client", password: resetPassword },
    });
    setResetting(false);
    if (error) { toast({ title: "Reset failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Password reset", description: `New password emailed to ${resetRow.email}.` });
    setResetRow(null);
    setResetPassword("");
    setResetConfirm("");
  };

  const handleDelete = async () => {
    if (!deleteRow) return;
    const { error } = await (supabase as any).functions.invoke("admin-delete-user", { body: { user_id: deleteRow.id, kind: "client" } });
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Deleted" });
    setDeleteRow(null);
    fetchRows();
  };

  const exportCsv = () => {
    downloadCsv(`client-users-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows.map((r) => ({
      name: r.name, email: r.email, phone: r.phone, business_name: r.business_name,
      is_active: r.is_active, created_at: r.created_at, updated_at: r.updated_at,
    }))));
  };

  const importCsv = async (file: File) => {
    const text = await file.text();
    const records = parseCsv(text);
    let ok = 0, fail = 0;
    for (const rec of records) {
      if (!rec.name || !rec.email) { fail++; continue; }
      const { error } = await (supabase as any).functions.invoke("admin-create-client-user", { body: {
        name: rec.name, email: rec.email, phone: rec.phone || "", business_name: rec.business_name || "",
      }});
      if (error) fail++; else ok++;
    }
    toast({ title: "Import complete", description: `${ok} created, ${fail} failed.` });
    fetchRows();
  };

  const columns: ColumnDef<ClientRow>[] = [
    { key: "name", header: "Name", accessor: (r) => r.name },
    { key: "email", header: "Username (Email)", accessor: (r) => r.email },
    {
      key: "is_active", header: "Active",
      accessor: (r) => (r.is_active ? "Active" : "Inactive"),
      cell: (r) => <Switch checked={r.is_active} onCheckedChange={(v) => handleToggle(r, v)} />,
      filterable: false,
    },
    {
      key: "created_at", header: "Created",
      accessor: (r) => new Date(r.created_at),
      cell: (r) => <span className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>,
    },
    {
      key: "updated_at", header: "Modified",
      accessor: (r) => new Date(r.updated_at),
      cell: (r) => <span className="text-sm text-muted-foreground">{new Date(r.updated_at).toLocaleDateString()}</span>,
    },
    { key: "phone", header: "Phone", accessor: (r) => r.phone || "—" },
    { key: "business_name", header: "Business", accessor: (r) => r.business_name || "—" },
    {
      key: "actions", header: "Actions", sortable: false, filterable: false,
      cell: (r) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setEditRow(r)} title="Edit"><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => openResetPassword(r)} title="Reset Password"><KeyRound className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteRow(r)} title="Delete user"><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="pt-32 pb-10 lg:pt-40 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <Link to="/admin/client-management" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Client Management
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Internal Admin</span>
          </div>
          <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">Client Access Management</h1>
        </div>
      </section>

      <section className="py-12 bg-background flex-1">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex flex-wrap items-center justify-end gap-2 mb-4">
            <label className="inline-flex">
              <input type="file" accept=".csv" hidden onChange={(e) => e.target.files?.[0] && importCsv(e.target.files[0])} />
              <Button variant="outline" size="sm" asChild><span><Upload className="h-4 w-4 mr-2" />Import CSV</span></Button>
            </label>
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-2" />Export CSV</Button>
            <Button variant="hero" size="sm" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4 mr-2" />Add User</Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <SortableFilterableTable<ClientRow> data={rows} columns={columns} rowKey={(r) => r.id} />
          )}
        </div>
      </section>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Client User</DialogTitle>
            <DialogDescription>A welcome email with a temporary password will be sent.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="space-y-2"><Label>Business Name</Label><Input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button variant="hero" onClick={handleAdd} disabled={!form.name || !form.email || submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Client</DialogTitle></DialogHeader>
          {editRow && (
            <div className="space-y-3">
              <div className="space-y-2"><Label>Name</Label><Input value={editRow.name} onChange={(e) => setEditRow({ ...editRow, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Email</Label><Input value={editRow.email} disabled /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={editRow.phone || ""} onChange={(e) => setEditRow({ ...editRow, phone: e.target.value })} /></div>
              <div className="space-y-2"><Label>Business Name</Label><Input value={editRow.business_name || ""} onChange={(e) => setEditRow({ ...editRow, business_name: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRow(null)}>Cancel</Button>
            <Button variant="hero" onClick={handleEdit} disabled={submitting}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteRow} onOpenChange={(o) => !o && setDeleteRow(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete client user?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove {deleteRow?.email}, all their documents, and revoke access.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Footer />
    </div>
  );
}

export default function ClientUsersAdmin() {
  return <AdminGuard><Inner /></AdminGuard>;
}

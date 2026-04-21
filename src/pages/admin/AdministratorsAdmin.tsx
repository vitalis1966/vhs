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
import { Plus, Download, Upload, KeyRound, Pencil, Trash2, Loader2, ArrowLeft } from "lucide-react";
import { downloadCsv, parseCsv, toCsv } from "@/lib/csv";
import { Link } from "react-router-dom";

type AdminRow = {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  is_builtin: boolean;
  created_at: string;
  updated_at: string;
};

function AdministratorsAdminInner() {
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editRow, setEditRow] = useState<AdminRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<AdminRow | null>(null);
  const [resetRow, setResetRow] = useState<AdminRow | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetting, setResetting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from("administrators").select("*").order("created_at", { ascending: false });
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchRows(); }, []);

  const handleAdd = async () => {
    setSubmitting(true);
    const { error } = await (supabase as any).functions.invoke("admin-create-administrator", { body: { name, email } });
    setSubmitting(false);
    if (error) {
      toast({ title: "Failed to add administrator", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Administrator added", description: "Welcome email sent." });
    setAddOpen(false);
    setName(""); setEmail("");
    fetchRows();
  };

  const handleEdit = async () => {
    if (!editRow) return;
    setSubmitting(true);
    const { error } = await (supabase as any).from("administrators").update({ name: editRow.name }).eq("id", editRow.id);
    setSubmitting(false);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Updated" });
    setEditRow(null);
    fetchRows();
  };

  const handleToggle = async (row: AdminRow, value: boolean) => {
    const { error } = await (supabase as any).from("administrators").update({ is_active: value }).eq("id", row.id);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    fetchRows();
  };

  const handleResetPassword = async (row: AdminRow) => {
    const { data: users } = await (supabase as any).from("user_roles").select("user_id, role");
    // Find auth user id by email via list
    const { data: authList } = await (supabase as any).auth.admin?.listUsers?.() || { data: null };
    let userId: string | null = null;
    if (!authList) {
      // We don't have admin from client. Use edge function. Lookup user_id by querying user_roles + admin email mapping is complex; pass email to a helper.
    }
    // Use the email to find user id via a helper RPC isn't built; use admin function with email lookup
    const { error } = await (supabase as any).functions.invoke("admin-reset-password", { body: { email: row.email, kind: "admin" } });
    if (error) { toast({ title: "Reset failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Password reset", description: `New temp password emailed to ${row.email}.` });
  };

  const handleDelete = async () => {
    if (!deleteRow) return;
    const { error } = await (supabase as any).functions.invoke("admin-delete-user", { body: { email: deleteRow.email, kind: "admin" } });
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Deleted" });
    setDeleteRow(null);
    fetchRows();
  };

  const exportCsv = () => {
    const data = rows.map((r) => ({
      name: r.name, email: r.email, is_active: r.is_active, is_builtin: r.is_builtin,
      created_at: r.created_at, updated_at: r.updated_at,
    }));
    downloadCsv(`administrators-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(data));
  };

  const importCsv = async (file: File) => {
    const text = await file.text();
    const records = parseCsv(text);
    let ok = 0, fail = 0;
    for (const rec of records) {
      if (!rec.name || !rec.email) { fail++; continue; }
      const { error } = await (supabase as any).functions.invoke("admin-create-administrator", { body: { name: rec.name, email: rec.email } });
      if (error) fail++; else ok++;
    }
    toast({ title: "Import complete", description: `${ok} created, ${fail} failed.` });
    fetchRows();
  };

  const columns: ColumnDef<AdminRow>[] = [
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
    {
      key: "actions", header: "Actions",
      sortable: false, filterable: false,
      cell: (r) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setEditRow(r)} title="Edit"><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleResetPassword(r)} title="Reset Password"><KeyRound className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteRow(r)} disabled={r.is_builtin} title={r.is_builtin ? "Built-in admin cannot be deleted" : "Delete"}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="pt-32 pb-10 lg:pt-40 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Internal Admin</span>
          </div>
          <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">Administrators</h1>
        </div>
      </section>

      <section className="py-12 bg-background flex-1">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="flex flex-wrap items-center justify-end gap-2 mb-4">
            <label className="inline-flex">
              <input type="file" accept=".csv" hidden onChange={(e) => e.target.files?.[0] && importCsv(e.target.files[0])} />
              <Button variant="outline" size="sm" asChild><span><Upload className="h-4 w-4 mr-2" />Import CSV</span></Button>
            </label>
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-2" />Export CSV</Button>
            <Button variant="hero" size="sm" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4 mr-2" />Add Administrator</Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <SortableFilterableTable<AdminRow> data={rows} columns={columns} rowKey={(r) => r.id} />
          )}
        </div>
      </section>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Administrator</DialogTitle>
            <DialogDescription>A welcome email with a temporary password will be sent.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button variant="hero" onClick={handleAdd} disabled={!name || !email || submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Administrator</DialogTitle></DialogHeader>
          {editRow && (
            <div className="space-y-3">
              <div className="space-y-2"><Label>Name</Label><Input value={editRow.name} onChange={(e) => setEditRow({ ...editRow, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Email</Label><Input value={editRow.email} disabled /></div>
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
            <AlertDialogTitle>Delete administrator?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove {deleteRow?.email} and revoke their access.</AlertDialogDescription>
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

export default function AdministratorsAdmin() {
  return <AdminGuard><AdministratorsAdminInner /></AdminGuard>;
}

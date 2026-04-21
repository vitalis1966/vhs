import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClientGuard } from "@/components/ClientGuard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ColumnDef, SortableFilterableTable } from "@/components/admin/SortableFilterableTable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, LogOut, Download } from "lucide-react";
import { mimeLabel } from "@/lib/mimeLabel";
import { formatBytes, MAX_FILE_SIZE } from "@/lib/formatBytes";
import { useNavigate } from "react-router-dom";
import JSZip from "jszip";

type DocRow = {
  id: string;
  client_user_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  created_at: string;
  updated_at: string;
};

function Inner() {
  const [rows, setRows] = useState<DocRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteRow, setDeleteRow] = useState<DocRow | null>(null);
  const [businessName, setBusinessName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    setUserEmail(user.email || "");
    const { data: profile } = await (supabase as any).from("client_users").select("business_name").eq("id", user.id).maybeSingle();
    setBusinessName(profile?.business_name || "");
    const { data: docs } = await (supabase as any).from("documents").select("*").eq("client_user_id", user.id).order("created_at", { ascending: false });
    setRows(docs || []);
    setSelected(new Set());
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const logActivity = async (action: string, status: "Success" | "Failed") => {
    try {
      await (supabase as any).from("activity_logs").insert({ user_name: userEmail, action, status });
    } catch (e) { /* */ }
  };

  const handleUpload = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: `Maximum file size is 50 MB. This file is ${formatBytes(file.size)}.`, variant: "destructive" });
      return;
    }
    setUploading(true);
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${userId}/${crypto.randomUUID()}-${safe}`;
    const { error: upErr } = await (supabase as any).storage.from("client-documents").upload(path, file, {
      cacheControl: "3600", upsert: false, contentType: file.type || "application/octet-stream",
    });
    if (upErr) {
      await logActivity("File Upload", "Failed");
      toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { error: insErr } = await (supabase as any).from("documents").insert({
      client_user_id: userId,
      file_name: file.name,
      file_type: file.type || "application/octet-stream",
      file_size: file.size,
      storage_path: path,
    });
    if (insErr) {
      await (supabase as any).storage.from("client-documents").remove([path]);
      await logActivity("File Upload", "Failed");
      toast({ title: "Upload failed", description: insErr.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    await logActivity("File Upload", "Success");
    await (supabase as any).functions.invoke("notify-document-event", {
      body: { event: "upload", file_name: file.name, file_type: file.type, file_size: file.size, client_user_id: userId },
    });
    toast({ title: "Document uploaded" });
    setUploading(false);
    fetchData();
  };

  const downloadBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadOne = async (row: DocRow) => {
    const { data, error } = await (supabase as any).storage.from("client-documents").download(row.storage_path);
    if (error || !data) {
      await logActivity("File Download", "Failed");
      toast({ title: "Download failed", description: error?.message, variant: "destructive" });
      return;
    }
    downloadBlob(data, row.file_name);
    await logActivity("File Download", "Success");
  };

  const handleDownloadMany = async (target: DocRow[]) => {
    if (target.length === 0) return;
    if (target.length === 1) { await handleDownloadOne(target[0]); return; }
    setDownloading(true);
    try {
      const zip = new JSZip();
      const used = new Map<string, number>();
      const results = await Promise.all(
        target.map(async (r) => {
          const { data, error } = await (supabase as any).storage.from("client-documents").download(r.storage_path);
          return { r, data, error };
        })
      );
      let failed = 0;
      for (const { r, data, error } of results) {
        if (error || !data) { failed++; continue; }
        let name = r.file_name;
        const count = used.get(name) || 0;
        if (count > 0) {
          const dot = name.lastIndexOf(".");
          name = dot > 0 ? `${name.slice(0, dot)} (${count})${name.slice(dot)}` : `${name} (${count})`;
        }
        used.set(r.file_name, count + 1);
        zip.file(name, data);
      }
      if (failed === target.length) {
        await logActivity("File Download", "Failed");
        toast({ title: "Download failed", description: "Could not retrieve any files.", variant: "destructive" });
        return;
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const stamp = new Date().toISOString().slice(0, 10);
      const prefix = businessName ? businessName.replace(/[^a-zA-Z0-9._-]/g, "_") : "documents";
      downloadBlob(blob, `${prefix}-${stamp}.zip`);
      await logActivity("File Download", "Success");
      if (failed > 0) toast({ title: "Partial download", description: `${failed} file(s) could not be included.` });
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteRow) return;
    const { error: rmErr } = await (supabase as any).storage.from("client-documents").remove([deleteRow.storage_path]);
    const { error: delErr } = await (supabase as any).from("documents").delete().eq("id", deleteRow.id);
    if (rmErr || delErr) {
      await logActivity("File Deletion", "Failed");
      toast({ title: "Delete failed", description: (rmErr || delErr)?.message, variant: "destructive" });
      return;
    }
    await logActivity("File Deletion", "Success");
    await (supabase as any).functions.invoke("notify-document-event", {
      body: { event: "delete", file_name: deleteRow.file_name, file_type: deleteRow.file_type, file_size: deleteRow.file_size, client_user_id: userId },
    });
    toast({ title: "Document deleted" });
    setDeleteRow(null);
    fetchData();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(rows.map((r) => r.id)) : new Set());
  };
  const toggleOne = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  };

  const allChecked = rows.length > 0 && selected.size === rows.length;
  const someChecked = selected.size > 0 && selected.size < rows.length;

  const columns: ColumnDef<DocRow>[] = [
    {
      key: "select", header: "", sortable: false, filterable: false,
      cell: (r) => (
        <Checkbox
          checked={selected.has(r.id)}
          onCheckedChange={(c) => toggleOne(r.id, !!c)}
          aria-label={`Select ${r.file_name}`}
        />
      ),
    },
    { key: "file_name", header: "Document Name", accessor: (r) => r.file_name },
    {
      key: "created_at", header: "Created",
      accessor: (r) => new Date(r.created_at),
      cell: (r) => <span className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>,
    },
    {
      key: "updated_at", header: "Modified",
      accessor: (r) => new Date(r.updated_at),
      cell: (r) => <span className="text-sm text-muted-foreground">{new Date(r.updated_at).toLocaleString()}</span>,
    },
    { key: "file_type", header: "Type", accessor: (r) => mimeLabel(r.file_type) },
    {
      key: "file_size", header: "Size",
      accessor: (r) => r.file_size,
      cell: (r) => <span className="text-sm">{formatBytes(r.file_size)}</span>,
    },
    {
      key: "actions", header: "", sortable: false, filterable: false,
      cell: (r) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => handleDownloadOne(r)} title="Download"><Download className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteRow(r)} title="Delete"><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];

  const title = businessName ? `${businessName} Documentation Submissions` : "Documentation Submissions";
  const selectedRows = rows.filter((r) => selected.has(r.id));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="pt-32 pb-10 lg:pt-40 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-px w-12 bg-accent" />
                <span className="text-accent font-semibold tracking-widest uppercase text-sm">Client Portal</span>
              </div>
              <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">{title}</h1>
              {userEmail && <p className="text-sm text-muted-foreground mt-2">Signed in as {userEmail}</p>}
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}><LogOut className="h-4 w-4 mr-2" />Sign Out</Button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background flex-1">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="bg-card rounded-2xl shadow-soft border border-border/40 p-6 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <p className="text-sm text-muted-foreground">Maximum file size: 50 MB. Any file type accepted.</p>
              <div className="flex flex-wrap items-center gap-2">
                {rows.length > 0 && (
                  <div className="flex items-center gap-2 mr-2 pl-2 border-l border-border/60">
                    <Checkbox
                      id="select-all-docs"
                      checked={allChecked ? true : someChecked ? "indeterminate" : false}
                      onCheckedChange={(c) => toggleAll(!!c)}
                    />
                    <label htmlFor="select-all-docs" className="text-sm text-muted-foreground cursor-pointer select-none">
                      {selected.size > 0 ? `${selected.size} selected` : "Select all"}
                    </label>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadMany(selected.size > 0 ? selectedRows : rows)}
                  disabled={downloading || rows.length === 0}
                  title={selected.size > 0 ? "Download selected" : "Download all"}
                >
                  {downloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                  {selected.size > 0 ? `Download Selected (${selected.size})` : "Download All"}
                </Button>
                <input ref={fileInputRef} type="file" hidden onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }} />
                <Button variant="hero" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                  Add Document
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <SortableFilterableTable<DocRow> data={rows} columns={columns} rowKey={(r) => r.id} emptyMessage="No documents yet. Upload your first one above." />
            )}
          </div>
        </div>
      </section>

      <AlertDialog open={!!deleteRow} onOpenChange={(o) => !o && setDeleteRow(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete document?</AlertDialogTitle>
            <AlertDialogDescription>{deleteRow?.file_name} will be permanently removed.</AlertDialogDescription>
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

export default function ClientDocuments() {
  return <ClientGuard><Inner /></ClientGuard>;
}

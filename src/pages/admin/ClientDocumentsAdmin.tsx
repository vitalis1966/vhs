import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdminGuard } from "@/components/AdminGuard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ColumnDef, SortableFilterableTable } from "@/components/admin/SortableFilterableTable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Trash2, Loader2, ArrowLeft, Download, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AssignToClientDialog } from "@/components/admin/AssignToClientDialog";
import { Link } from "react-router-dom";
import { mimeLabel } from "@/lib/mimeLabel";
import { formatBytes } from "@/lib/formatBytes";
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
  business_name?: string | null;
};

function Inner() {
  const [rows, setRows] = useState<DocRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteOne, setDeleteOne] = useState<DocRow | null>(null);
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());
  const [assignTarget, setAssignTarget] = useState<DocRow | null>(null);

  const fetchRows = async () => {
    setLoading(true);
    const { data: docs } = await (supabase as any).from("documents").select("*").order("created_at", { ascending: false });
    const { data: clients } = await (supabase as any).from("client_users").select("id, business_name");
    const map = new Map((clients || []).map((c: any) => [c.id, c.business_name]));
    const mapped = (docs || []).map((d: any) => ({ ...d, business_name: map.get(d.client_user_id) || null }));
    setRows(mapped);
    setSelected(new Set());

    const docIds = mapped.map((d: any) => d.id);
    if (docIds.length > 0) {
      const { data: assigned } = await (supabase as any)
        .from("client_submission_assignments")
        .select("source_id")
        .eq("source_type", "submission")
        .in("source_id", docIds);
      setAssignedIds(new Set((assigned ?? []).map((a: any) => a.source_id as string)));
    } else {
      setAssignedIds(new Set());
    }

    setLoading(false);
  };
  useEffect(() => { fetchRows(); }, []);

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

  const handleOpen = async (row: DocRow) => {
    const { data, error } = await (supabase as any).storage.from("client-documents").createSignedUrl(row.storage_path, 60);
    if (error || !data?.signedUrl) {
      toast({ title: "Could not open document", description: error?.message, variant: "destructive" });
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener");
  };

  const handleDownloadOne = async (row: DocRow) => {
    const { data, error } = await (supabase as any).storage.from("client-documents").download(row.storage_path);
    if (error || !data) {
      toast({ title: "Download failed", description: error?.message, variant: "destructive" });
      return;
    }
    downloadBlob(data, row.file_name);
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
        const folder = (r.business_name || "Unassigned").replace(/[^a-zA-Z0-9._ -]/g, "_");
        const key = `${folder}/${r.file_name}`;
        let name = r.file_name;
        const count = used.get(key) || 0;
        if (count > 0) {
          const dot = name.lastIndexOf(".");
          name = dot > 0 ? `${name.slice(0, dot)} (${count})${name.slice(dot)}` : `${name} (${count})`;
        }
        used.set(key, count + 1);
        zip.folder(folder)!.file(name, data);
      }
      if (failed === target.length) {
        toast({ title: "Download failed", description: "Could not retrieve any files.", variant: "destructive" });
        return;
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const stamp = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `client-documents-${stamp}.zip`);
      if (failed > 0) toast({ title: "Partial download", description: `${failed} file(s) could not be included.` });
    } finally {
      setDownloading(false);
    }
  };

  const removeDocs = async (toDelete: DocRow[]) => {
    if (toDelete.length === 0) return;
    const paths = toDelete.map((d) => d.storage_path);
    await (supabase as any).storage.from("client-documents").remove(paths);
    await (supabase as any).from("documents").delete().in("id", toDelete.map((d) => d.id));
    for (const d of toDelete) {
      await (supabase as any).functions.invoke("notify-document-event", {
        body: { event: "delete", file_name: d.file_name, file_type: d.file_type, file_size: d.file_size, client_user_id: d.client_user_id },
      });
    }
    toast({ title: `Deleted ${toDelete.length} document${toDelete.length === 1 ? "" : "s"}` });
    fetchRows();
  };

  const handleBulkDelete = async () => {
    setDeleteOpen(false);
    const toDelete = rows.filter((r) => selected.has(r.id));
    await removeDocs(toDelete);
  };

  const allSelected = rows.length > 0 && selected.size === rows.length;

  const columns: ColumnDef<DocRow>[] = [
    {
      key: "_select", header: "", sortable: false, filterable: false,
      cell: (r) => (
        <Checkbox checked={selected.has(r.id)} onCheckedChange={(v) => {
          setSelected((s) => { const n = new Set(s); if (v) n.add(r.id); else n.delete(r.id); return n; });
        }} />
      ),
      headerClassName: "w-12",
    },
    {
      key: "file_name", header: "Document Name", accessor: (r) => r.file_name,
      cell: (r) => (
        <button
          type="button"
          onClick={() => handleOpen(r)}
          className="text-primary hover:underline text-left"
        >
          {r.file_name}
        </button>
      ),
    },
    { key: "business_name", header: "Business", accessor: (r) => r.business_name || "—" },
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
          <Button variant="ghost" size="icon" onClick={() => setDeleteOne(r)} title="Delete"><Trash2 className="h-4 w-4" /></Button>
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
          <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">Documentation Submissions</h1>
        </div>
      </section>

      <section className="py-12 bg-background flex-1">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-3">
              <Checkbox checked={allSelected} onCheckedChange={(v) => setSelected(v ? new Set(rows.map((r) => r.id)) : new Set())} />
              <span className="text-sm text-muted-foreground">{selected.size} selected</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadMany(selected.size > 0 ? rows.filter((r) => selected.has(r.id)) : rows)}
                disabled={downloading || rows.length === 0}
              >
                {downloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                {selected.size > 0 ? `Download Selected (${selected.size})` : "Download All"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDeleteOpen(true)} disabled={selected.size === 0}>
                <Trash2 className="h-4 w-4 mr-2" />Delete Selected
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <SortableFilterableTable<DocRow> data={rows} columns={columns} rowKey={(r) => r.id} />
          )}
        </div>
      </section>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selected.size} document{selected.size === 1 ? "" : "s"}?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the selected documents and notify all administrators.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteOne} onOpenChange={(o) => !o && setDeleteOne(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete document?</AlertDialogTitle>
            <AlertDialogDescription>{deleteOne?.file_name} will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => { if (deleteOne) await removeDocs([deleteOne]); setDeleteOne(null); }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Footer />
    </div>
  );
}

export default function ClientDocumentsAdmin() {
  return <AdminGuard><Inner /></AdminGuard>;
}

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ColumnDef, SortableFilterableTable } from "@/components/admin/SortableFilterableTable";
import { FileSearch, Loader2, MoreVertical } from "lucide-react";
import { usePermission } from "@/hooks/usePermission";
import { useToast } from "@/hooks/use-toast";
import { mimeLabel } from "@/lib/mimeLabel";
import { formatBytes } from "@/lib/formatBytes";
import { openAssignmentDocument, downloadAssignmentDocument } from "@/lib/clientDocuments";

interface Props { clientId: string }

interface Row {
  assignment_id: string;
  assigned_at: string;
  document_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  created_at: string;
  updated_at: string;
  business_name: string | null;
}

export function SubmissionsTab({ clientId }: Props) {
  const { toast } = useToast();
  const canView = usePermission("documents.view");
  const canDelete = usePermission("documents.delete");

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).rpc("list_client_submission_assignments", {
      p_client_id: clientId,
    });
    if (error) {
      toast({ title: "Failed to load submissions", description: error.message, variant: "destructive" });
      setRows([]);
    } else {
      setRows((data ?? []) as Row[]);
    }
    setLoading(false);
  }, [clientId, toast]);

  useEffect(() => { void load(); }, [load]);

  const handleOpen = async (r: Row) => {
    const res = await openAssignmentDocument(r.assignment_id);
    if ("error" in res) toast({ title: "Could not open document", description: res.error, variant: "destructive" });
  };

  const handleDownload = async (r: Row) => {
    const res = await downloadAssignmentDocument(r.assignment_id);
    if ("error" in res) toast({ title: "Download failed", description: res.error, variant: "destructive" });
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const { error } = await (supabase as any).rpc("set_assignment_hidden", {
      p_id: pendingDelete.assignment_id, p_hidden: true,
    });
    setDeleting(false);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Removed from this client" });
    setPendingDelete(null);
    void load();
  };

  const columns: ColumnDef<Row>[] = [
    {
      key: "file_name", header: "Document Name", accessor: (r) => r.file_name,
      cell: (r) => canView ? (
        <button type="button" onClick={() => handleOpen(r)} className="text-primary hover:underline text-left">
          {r.file_name}
        </button>
      ) : <span>{r.file_name}</span>,
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canView && <DropdownMenuItem onClick={() => handleOpen(r)}>View</DropdownMenuItem>}
              {canView && <DropdownMenuItem onClick={() => handleDownload(r)}>Download</DropdownMenuItem>}
              {canDelete && (
                <DropdownMenuItem onClick={() => setPendingDelete(r)} className="text-destructive focus:text-destructive">
                  Remove from client
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 rounded-lg border bg-card">
          <FileSearch className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No submissions assigned to this client yet.</p>
        </div>
      ) : (
        <SortableFilterableTable<Row> data={rows} columns={columns} rowKey={(r) => r.assignment_id} />
      )}

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from this client?</AlertDialogTitle>
            <AlertDialogDescription>
              This hides the document from the client record. The original file is preserved in VHS Administration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

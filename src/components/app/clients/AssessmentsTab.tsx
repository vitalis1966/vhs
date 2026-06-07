import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileSearch, Loader2, MoreVertical } from "lucide-react";
import { usePermission } from "@/hooks/usePermission";
import { useToast } from "@/hooks/use-toast";

interface Props { clientId: string }

interface Row {
  assignment_id: string;
  assigned_at: string;
  session_id: string;
  submitted_at: string | null;
  status: string | null;
  client_name: string | null;
  client_email: string | null;
  organization: string | null;
  assessment_purpose: string | null;
  assessment_title: string | null;
  assessment_slug: string | null;
  analysis_status: string | null;
  has_internal_report: boolean;
  has_client_report: boolean;
  meeting_booked: boolean;
  meeting_booked_by: string | null;
}

const cellClass = "text-sm px-3 py-3 align-middle";
const headClass = "text-sm px-3 py-3 align-middle font-medium text-left text-muted-foreground";

function getStatusInfo(purpose: string | null) {
  const val = (purpose || "").trim().toLowerCase();
  if (
    val.includes("building_new") || val.includes("planning_new") || val.includes("exploring_new") ||
    val.includes("building a new") || val.includes("planning a new") || val.includes("exploring a new")
  ) return { label: "New Practice", color: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100" };
  if (val.includes("healthcare_it") || val.includes("healthcare it"))
    return { label: "Healthcare IT", color: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100" };
  return { label: "Existing Practice", color: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100" };
}

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function AssessmentsTab({ clientId }: Props) {
  const { toast } = useToast();
  const canViewInternal = usePermission("reports.view_internal");
  const canViewClient = usePermission("reports.view_client");
  const canDeleteInternal = usePermission("reports.delete_internal");
  const canDeleteClient = usePermission("reports.delete_client");

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [internalOpen, setInternalOpen] = useState(false);
  const [clientOpen, setClientOpen] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).rpc("list_client_assessment_assignments", {
      p_client_id: clientId,
    });
    if (error) {
      toast({ title: "Failed to load assessments", description: error.message, variant: "destructive" });
      setRows([]);
    } else {
      setRows((data ?? []) as Row[]);
    }
    setLoading(false);
  }, [clientId, toast]);

  useEffect(() => { void load(); }, [load]);

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

  const showRowMenu = (r: Row) =>
    (canViewInternal && r.has_internal_report) ||
    (canViewClient && r.has_client_report) ||
    canDeleteInternal || canDeleteClient;

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 rounded-lg border bg-card">
          <FileSearch className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No assessments assigned to this client yet.</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border overflow-hidden">
          <Table style={{ tableLayout: "fixed", width: "100%" }}>
            <TableHeader>
              <TableRow>
                <TableHead className={headClass} style={{ width: "10%" }}>Client</TableHead>
                <TableHead className={headClass} style={{ width: "14%" }}>Organization</TableHead>
                <TableHead className={headClass} style={{ width: "9%" }}>Submitted</TableHead>
                <TableHead className={headClass} style={{ width: "10%" }}>Status</TableHead>
                <TableHead className={headClass} style={{ width: "7%" }}>Email</TableHead>
                <TableHead className={headClass} style={{ width: "8%" }}>Meeting</TableHead>
                <TableHead className={headClass} style={{ width: "8%" }}>Internal</TableHead>
                <TableHead className={`${headClass} pl-6`} style={{ width: "8%" }}>Client</TableHead>
                <TableHead className={`${headClass} pl-4`} style={{ width: "8%" }}>Analysis</TableHead>
                <TableHead className={`${headClass} pl-4`} style={{ width: "4%" }}></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const status = getStatusInfo(r.assessment_purpose);
                return (
                  <TableRow key={r.assignment_id}>
                    <TableCell className={`${cellClass} font-medium`}>{r.client_name ?? "—"}</TableCell>
                    <TableCell className={`${cellClass} text-muted-foreground`}>{r.organization ?? "—"}</TableCell>
                    <TableCell className={`${cellClass} text-muted-foreground`}>{formatDate(r.submitted_at)}</TableCell>
                    <TableCell className={cellClass}><Badge className={status.color}>{status.label}</Badge></TableCell>
                    <TableCell className={`${cellClass} text-center`}>
                      <span className="text-xs text-muted-foreground">—</span>
                    </TableCell>
                    <TableCell className={`${cellClass} text-center`}>
                      {r.meeting_booked ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Booked</Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100">Not Booked</Badge>
                      )}
                    </TableCell>
                    <TableCell className={cellClass}>
                      {canViewInternal && r.has_internal_report ? (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white text-xs h-8 px-2"
                          onClick={() => { setActiveAssignment(r.assignment_id); setInternalOpen(true); }}
                        >
                          Internal Report
                        </Button>
                      ) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className={`${cellClass} pl-6`}>
                      {canViewClient && r.has_client_report ? (
                        <Button
                          size="sm"
                          className="bg-teal-600 hover:bg-teal-700 text-white text-xs h-8 px-2"
                          onClick={() => { setActiveAssignment(r.assignment_id); setClientOpen(true); }}
                        >
                          Client Report
                        </Button>
                      ) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className={`${cellClass} pl-4 text-muted-foreground text-xs`}>
                      {r.analysis_status ?? "—"}
                    </TableCell>
                    <TableCell className={`${cellClass} pl-4`}>
                      {showRowMenu(r) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {(canDeleteInternal || canDeleteClient) && (
                              <DropdownMenuItem
                                onClick={() => setPendingDelete(r)}
                                className="text-destructive focus:text-destructive"
                              >
                                Remove from client
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <InternalReportViewer open={internalOpen} onOpenChange={setInternalOpen} assignmentId={activeAssignment} />
      <ClientReportViewer open={clientOpen} onOpenChange={setClientOpen} assignmentId={activeAssignment} />

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from this client?</AlertDialogTitle>
            <AlertDialogDescription>
              This hides the assessment from the client record. The original submission is preserved in VHS Administration.
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

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Loader2,
  ArrowLeft,
  FileSearch,
  RefreshCw,
  BarChart3,
  MoreVertical,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AssignToClientDialog } from "@/components/admin/AssignToClientDialog";

interface SubmissionRow {
  session_id: string;
  access_token: string;
  submitted_at: string;
  assessment_title: string;
  assessment_slug: string;
  client_name: string;
  client_email: string;
  organization: string;
  assessment_purpose: string | null;
  report_id: string | null;
  analysis_status: string | null;
  client_report_sent: boolean;
  has_client_report: boolean;
  meeting_booked: boolean;
  meeting_booked_by: string | null;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const cellClass = "text-sm px-3 py-3 align-middle";
const headClass = "text-sm px-3 py-3 align-middle font-medium text-left text-muted-foreground";
const labelClass = "text-xs font-medium text-muted-foreground uppercase tracking-wide";

function getStatusInfo(assessmentPurpose: string | null): { label: string; color: string } {
  const val = (assessmentPurpose || "").trim().toLowerCase();
  console.log("[SubmissionsDashboard] assessment_purpose raw value:", assessmentPurpose);
  // Match slug values stored in DB: building_new_clinic, planning_new_space, exploring_new_venture
  if (val.includes("building_new") || val.includes("planning_new") || val.includes("exploring_new") ||
      val.includes("building a new") || val.includes("planning a new") || val.includes("exploring a new")) {
    return { label: "New Practice", color: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100" };
  }
  // Match: healthcare_it_new, healthcare_it_existing, or human-readable versions
  if (val.includes("healthcare_it") || val.includes("healthcare it")) {
    return { label: "Healthcare IT", color: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100" };
  }
  return { label: "Existing Practice", color: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100" };
}

export default function SubmissionsDashboard() {
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningAnalysis, setRunningAnalysis] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());
  const [assignTarget, setAssignTarget] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);

    const { data: sessions } = await (supabase
      .from("assessment_sessions" as any)
      .select("*")
      .eq("status", "submitted")
      .order("submitted_at", { ascending: false }) as any);

    if (!sessions || sessions.length === 0) {
      setSubmissions([]);
      setLoading(false);
      return;
    }

    const rows: SubmissionRow[] = [];

    for (const sess of sessions) {
      const { data: assess } = await (supabase
        .from("assessments" as any)
        .select("title, slug")
        .eq("id", sess.assessment_id)
        .single() as any);

      let clientName = "Unknown";
      let clientEmail = "";
      let organization = "—";
      let assessmentPurpose: string | null = null;

      if (sess.intake_id) {
        const { data: intake } = await (supabase
          .from("assessment_intakes" as any)
          .select("full_name, email, organization_name, assessment_purpose")
          .eq("id", sess.intake_id)
          .single() as any);
        if (intake) {
          clientName = intake.full_name || "Unknown";
          clientEmail = intake.email || "";
          organization = intake.organization_name || "—";
          assessmentPurpose = intake.assessment_purpose || null;
        }
      }

      const { data: report } = await (supabase
        .from("internal_assessment_reports" as any)
        .select("id, analysis_status")
        .eq("session_id", sess.id)
        .single() as any);

      const { data: clientEmails } = await (supabase
        .from("email_events" as any)
        .select("id, status")
        .eq("session_id", sess.id)
        .eq("email_type", "client_report") as any);

      const clientReportSent = (clientEmails || []).some(
        (e: any) => e.status === "sent"
      );

      rows.push({
        session_id: sess.id,
        access_token: sess.access_token,
        submitted_at: sess.submitted_at,
        assessment_title: assess?.title || "Unknown",
        assessment_slug: assess?.slug || "",
        client_name: clientName,
        client_email: clientEmail,
        organization,
        assessment_purpose: assessmentPurpose,
        report_id: report?.id || null,
        analysis_status: report?.analysis_status || null,
        client_report_sent: clientReportSent,
        has_client_report: report?.analysis_status === "complete",
        meeting_booked: sess.meeting_booked || false,
        meeting_booked_by: sess.meeting_booked_by || null,
      });
    }

    setSubmissions(rows);

    // Load existing assignment links so we can show "Assigned" in the row menu.
    const sessionIds = rows.map((r) => r.session_id);
    if (sessionIds.length > 0) {
      const { data: assigned } = await (supabase as any)
        .from("client_submission_assignments")
        .select("source_id")
        .eq("source_type", "assessment")
        .in("source_id", sessionIds);
      setAssignedIds(new Set((assigned ?? []).map((a: any) => a.source_id as string)));
    } else {
      setAssignedIds(new Set());
    }

    setLoading(false);
  };

  const runAnalysis = async (sessionId: string) => {
    setRunningAnalysis(sessionId);
    try {
      const response = await supabase.functions.invoke("analyze-assessment", {
        body: { session_id: sessionId },
      });
      if (response.error) {
        toast({ title: "Analysis Failed", description: response.error.message, variant: "destructive" });
      } else {
        toast({ title: "Analysis Complete", description: "Internal report has been generated." });
        await loadSubmissions();
      }
    } catch {
      toast({ title: "Error", description: "Failed to run analysis.", variant: "destructive" });
    }
    setRunningAnalysis(null);
  };

  const handleDelete = async (sessionId: string) => {
    setDeletingId(sessionId);
    try {
      const { data, error } = await supabase.functions.invoke("delete-submission", {
        body: { session_id: sessionId },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      setSubmissions((prev) => prev.filter((s) => s.session_id !== sessionId));
      toast({ title: "Assessment deleted" });
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err.message || "Could not delete. Please try again.",
        variant: "destructive",
      });
    }
    setDeletingId(null);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-10 lg:pt-40 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <motion.div {...fadeUp}>
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin
            </Link>
            <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Internal Admin</span>
          </div>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
              Submission Review
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Review submitted assessments and generate internal strategic analysis reports.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-foreground">
              Submitted Assessments
            </h2>
            <Button variant="outline" size="sm" onClick={loadSubmissions} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-20">
              <FileSearch className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">No submitted assessments yet.</p>
            </div>
          ) : (
            <>
              {/* Desktop table view */}
              <div className="hidden lg:block bg-card rounded-2xl shadow-soft border border-border/40 overflow-hidden">
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
                    {submissions.map((sub) => (
                      <TableRow key={sub.session_id}>
                        <TableCell className={`${cellClass} font-medium`}>
                          {sub.client_name}
                        </TableCell>
                        <TableCell className={`${cellClass} text-muted-foreground`}>
                          {sub.organization}
                        </TableCell>
                        <TableCell className={`${cellClass} text-muted-foreground`}>
                          {formatDate(sub.submitted_at)}
                        </TableCell>
                        <TableCell className={cellClass}>
                          {(() => {
                            const status = getStatusInfo(sub.assessment_purpose);
                            return <Badge className={`${status.color}`}>{status.label}</Badge>;
                          })()}
                        </TableCell>
                        <TableCell className={`${cellClass} text-center`}>
                          {sub.client_report_sent ? (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">Sent Out</Badge>
                          ) : (
                            <Badge className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100">Not Sent</Badge>
                          )}
                        </TableCell>
                        <TableCell className={`${cellClass} text-center`}>
                          {sub.meeting_booked ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Booked</Badge>
                          ) : (
                            <Badge className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100">Not Booked</Badge>
                          )}
                        </TableCell>
                        <TableCell className={cellClass}>
                          {sub.analysis_status === "complete" ? (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs h-8 px-2" asChild>
                              <Link to={`/admin/submissions/${sub.session_id}`}>Internal Report</Link>
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className={`${cellClass} pl-6`}>
                          {sub.has_client_report ? (
                            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs h-8 px-2" asChild>
                              <Link to={`/admin/submissions/${sub.session_id}/client-report`}>Client Report</Link>
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className={`${cellClass} pl-4`}>
                          <Button variant="outline" size="sm" className="text-xs h-8 px-2" onClick={() => runAnalysis(sub.session_id)} disabled={runningAnalysis === sub.session_id}>
                            {runningAnalysis === sub.session_id ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <BarChart3 className="mr-1 h-3 w-3" />}
                            {sub.analysis_status === "complete" ? "Rerun" : "Analyze"}
                          </Button>
                        </TableCell>
                        <TableCell className={`${cellClass} pl-4`}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                disabled={deletingId === sub.session_id}
                              >
                                {deletingId === sub.session_id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {assignedIds.has(sub.session_id) ? (
                                <DropdownMenuItem disabled className="text-muted-foreground">Assigned</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => setAssignTarget(sub.session_id)}>
                                  Assign to Client
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setConfirmDeleteId(sub.session_id)}
                                className="text-destructive focus:text-destructive"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile card view */}
              <div className="lg:hidden space-y-4">
                {submissions.map((sub) => (
                  <div key={sub.session_id} className="bg-card rounded-xl shadow-soft border border-border/40 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm text-foreground">{sub.client_name}</p>
                        <p className="text-xs text-muted-foreground">{sub.organization}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {(() => {
                          const status = getStatusInfo(sub.assessment_purpose);
                          return <Badge className={`${status.color} text-xs`}>{status.label}</Badge>;
                        })()}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground" disabled={deletingId === sub.session_id}>
                              {deletingId === sub.session_id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MoreVertical className="h-3.5 w-3.5" />}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {assignedIds.has(sub.session_id) ? (
                              <DropdownMenuItem disabled className="text-muted-foreground">Assigned</DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => setAssignTarget(sub.session_id)}>
                                Assign to Client
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setConfirmDeleteId(sub.session_id)}
                              className="text-destructive focus:text-destructive"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <div>
                        <span className={labelClass}>Submitted</span>
                        <p className="text-foreground">{formatDate(sub.submitted_at)}</p>
                      </div>
                      <div>
                        <span className={labelClass}>Email</span>
                        <p>{sub.client_report_sent ? (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 text-xs">Sent Out</Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100 text-xs">Not Sent</Badge>
                        )}</p>
                      </div>
                      <div>
                        <span className={labelClass}>Meeting</span>
                        <p>{sub.meeting_booked ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 text-xs">Booked</Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100 text-xs">Not Booked</Badge>
                        )}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {sub.analysis_status === "complete" && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-2" asChild>
                          <Link to={`/admin/submissions/${sub.session_id}`}>Internal Report</Link>
                        </Button>
                      )}
                      {sub.has_client_report && (
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs h-7 px-2" asChild>
                          <Link to={`/admin/submissions/${sub.session_id}/client-report`}>Client Report</Link>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="text-xs h-7 px-2" onClick={() => runAnalysis(sub.session_id)} disabled={runningAnalysis === sub.session_id}>
                        {runningAnalysis === sub.session_id ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <BarChart3 className="mr-1 h-3 w-3" />}
                        {sub.analysis_status === "complete" ? "Rerun" : "Analyze"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />

      <AlertDialog open={!!confirmDeleteId} onOpenChange={(o) => !o && setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this assessment? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (confirmDeleteId) { void handleDelete(confirmDeleteId); setConfirmDeleteId(null); } }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {assignTarget && (
        <AssignToClientDialog
          open={!!assignTarget}
          onOpenChange={(o) => !o && setAssignTarget(null)}
          sourceType="assessment"
          sourceId={assignTarget}
          onAssigned={() => { setAssignTarget(null); void loadSubmissions(); }}
        />
      )}
    </div>
  );
}

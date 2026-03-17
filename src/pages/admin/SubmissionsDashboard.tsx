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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  ArrowRight,
  FileSearch,
  RefreshCw,
  BarChart3,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubmissionRow {
  session_id: string;
  access_token: string;
  submitted_at: string;
  assessment_title: string;
  assessment_slug: string;
  client_name: string;
  client_email: string;
  organization: string;
  report_id: string | null;
  analysis_status: string | null;
  lifecycle_status: string | null;
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

export default function SubmissionsDashboard() {
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningAnalysis, setRunningAnalysis] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
      let lifecycleStatus: string | null = null;
      if (sess.intake_id) {
        const { data: intake } = await (supabase
          .from("assessment_intakes" as any)
          .select("full_name, email, organization_name, lifecycle_status")
          .eq("id", sess.intake_id)
          .single() as any);
        if (intake) {
          clientName = intake.full_name || "Unknown";
          clientEmail = intake.email || "";
          organization = intake.organization_name || "—";
          lifecycleStatus = intake.lifecycle_status || null;
        }
      }

      const { data: report } = await (supabase
        .from("internal_assessment_reports" as any)
        .select("id, analysis_status")
        .eq("session_id", sess.id)
        .single() as any);

      // Check if client report email was sent
      const { data: clientEmails } = await (supabase
        .from("email_events" as any)
        .select("id, status")
        .eq("session_id", sess.id)
        .eq("email_type", "client_report") as any);

      const clientReportSent = (clientEmails || []).some(
        (e: any) => e.status !== "failed"
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
        report_id: report?.id || null,
        analysis_status: report?.analysis_status || null,
        lifecycle_status: lifecycleStatus,
        client_report_sent: clientReportSent,
        has_client_report: report?.analysis_status === "complete",
        meeting_booked: sess.meeting_booked || false,
        meeting_booked_by: sess.meeting_booked_by || null,
      });
    }

    setSubmissions(rows);
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
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">
              Internal Admin
            </p>
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
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
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
            <div className="bg-card rounded-2xl shadow-soft border border-border/40 overflow-hidden">
              <Table style={{ tableLayout: "fixed", width: "100%" }}>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: "10%" }}>Client</TableHead>
                    <TableHead style={{ width: "12%" }}>Email</TableHead>
                    <TableHead style={{ width: "9%" }}>Organization</TableHead>
                    <TableHead style={{ width: "8%" }}>Submitted</TableHead>
                    <TableHead style={{ width: "8%" }}>Status</TableHead>
                    <TableHead style={{ width: "9%" }}>Communication</TableHead>
                    <TableHead style={{ width: "9%" }}>Engagement</TableHead>
                    <TableHead style={{ width: "9%" }}>Internal</TableHead>
                    <TableHead style={{ width: "9%" }}>Client</TableHead>
                    <TableHead style={{ width: "9%" }}>Analysis</TableHead>
                    <TableHead style={{ width: "4%" }}></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub) => (
                    <TableRow key={sub.session_id}>
                      {/* Client Name */}
                      <TableCell className="font-medium overflow-hidden text-ellipsis whitespace-nowrap" title={sub.client_name}>
                        {sub.client_name}
                      </TableCell>

                      {/* Client Email */}
                      <TableCell className="overflow-hidden text-ellipsis whitespace-nowrap" title={sub.client_email}>
                        {sub.client_email ? (
                          <a
                            href={`mailto:${sub.client_email}`}
                            className="text-accent hover:underline text-sm"
                          >
                            {sub.client_email}
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      {/* Organization */}
                      <TableCell className="text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap" title={sub.organization}>
                        {sub.organization}
                      </TableCell>

                      {/* Submitted Date */}
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(sub.submitted_at)}
                      </TableCell>

                      {/* Lifecycle Status */}
                      <TableCell>
                        {sub.lifecycle_status ? (
                          <Badge variant="secondary" className="text-[10px] truncate max-w-full">
                            {sub.lifecycle_status.replace(/_/g, " ")}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      {/* Communication */}
                      <TableCell>
                        {sub.analysis_status === "complete" && sub.client_report_sent ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 text-[10px]">
                            Sent Out
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] text-muted-foreground">
                            Not Sent
                          </Badge>
                        )}
                      </TableCell>

                      {/* Engagement */}
                      <TableCell>
                        {sub.meeting_booked ? (
                          <Badge className="bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-100 text-[10px]">
                            Meeting Booked
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      {/* Internal Report */}
                      <TableCell>
                        {sub.analysis_status === "complete" ? (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs h-8 px-2" asChild>
                            <Link to={`/admin/submissions/${sub.session_id}`}>
                              Internal Report
                            </Link>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      {/* Client Report — show if report exists (analysis complete) */}
                      <TableCell>
                        {sub.has_client_report ? (
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs h-8 px-2" asChild>
                            <Link to={`/admin/submissions/${sub.session_id}/client-report`}>
                              Client Report
                            </Link>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      {/* Analyze / Rerun */}
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 px-2"
                          onClick={() => runAnalysis(sub.session_id)}
                          disabled={runningAnalysis === sub.session_id}
                        >
                          {runningAnalysis === sub.session_id ? (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          ) : (
                            <BarChart3 className="mr-1 h-3 w-3" />
                          )}
                          {sub.analysis_status === "complete" ? "Rerun" : "Analyze"}
                        </Button>
                      </TableCell>

                      {/* Delete */}
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              disabled={deletingId === sub.session_id}
                            >
                              {deletingId === sub.session_id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this assessment? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(sub.session_id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

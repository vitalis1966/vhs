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
  Loader2,
  ArrowRight,
  FileSearch,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubmissionRow {
  session_id: string;
  access_token: string;
  submitted_at: string;
  assessment_title: string;
  assessment_slug: string;
  client_name: string;
  organization: string;
  report_id: string | null;
  analysis_status: string | null;
  overall_score: number | null;
  readiness_category: string | null;
  lifecycle_status: string | null;
  email_count: number;
  last_activity_at: string | null;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const severityColors: Record<string, string> = {
  strong: "bg-green-100 text-green-800 border-green-200",
  stable: "bg-blue-100 text-blue-800 border-blue-200",
  needs_attention: "bg-amber-100 text-amber-800 border-amber-200",
  critical: "bg-red-100 text-red-800 border-red-200",
};

export default function SubmissionsDashboard() {
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningAnalysis, setRunningAnalysis] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);

    // Get submitted sessions
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
      // Get assessment info
      const { data: assess } = await (supabase
        .from("assessments" as any)
        .select("title, slug")
        .eq("id", sess.assessment_id)
        .single() as any);

      // Get intake info
      let clientName = "Unknown";
      let organization = "—";
      if (sess.intake_id) {
        const { data: intake } = await (supabase
          .from("assessment_intakes" as any)
          .select("full_name, organization_name")
          .eq("id", sess.intake_id)
          .single() as any);
        if (intake) {
          clientName = intake.full_name || "Unknown";
          organization = intake.organization_name || "—";
        }
      }

      // Get internal report
      const { data: report } = await (supabase
        .from("internal_assessment_reports" as any)
        .select("id, analysis_status, overall_score, readiness_category")
        .eq("session_id", sess.id)
        .single() as any);

      rows.push({
        session_id: sess.id,
        access_token: sess.access_token,
        submitted_at: sess.submitted_at,
        assessment_title: assess?.title || "Unknown",
        assessment_slug: assess?.slug || "",
        client_name: clientName,
        organization,
        report_id: report?.id || null,
        analysis_status: report?.analysis_status || null,
        overall_score: report?.overall_score || null,
        readiness_category: report?.readiness_category || null,
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
    } catch (err) {
      toast({ title: "Error", description: "Failed to run analysis.", variant: "destructive" });
    }
    setRunningAnalysis(null);
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
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
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
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Analysis</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub) => (
                    <TableRow key={sub.session_id}>
                      <TableCell className="font-medium">{sub.client_name}</TableCell>
                      <TableCell className="text-muted-foreground">{sub.organization}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {sub.assessment_slug === "new-clinic-build" ? "New Clinic" : "Existing Clinic"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(sub.submitted_at)}
                      </TableCell>
                      <TableCell>
                        {sub.analysis_status === "complete" ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                            Complete
                          </Badge>
                        ) : sub.analysis_status === "pending" ? (
                          <Badge variant="secondary">Pending</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-muted-foreground">
                            Not Run
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {sub.overall_score != null ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{sub.overall_score}</span>
                            {sub.readiness_category && (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                                  severityColors[sub.readiness_category] || "bg-secondary text-secondary-foreground"
                                }`}
                              >
                                {sub.readiness_category.replace(/_/g, " ")}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
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
                          {sub.analysis_status === "complete" && (
                            <Button variant="hero" size="sm" asChild>
                              <Link to={`/admin/submissions/${sub.session_id}`}>
                                View Report
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </Link>
                            </Button>
                          )}
                        </div>
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

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  ArrowLeft,
  RefreshCw,
  BarChart3,
  AlertTriangle,
  Target,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  FileText,
  User,
  Building2,
  Calendar,
  MapPin,
  Stethoscope,
  Printer,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const severityColors: Record<string, string> = {
  strong: "bg-green-100 text-green-800 border-green-200",
  stable: "bg-blue-100 text-blue-800 border-blue-200",
  needs_attention: "bg-amber-100 text-amber-800 border-amber-200",
  critical: "bg-red-100 text-red-800 border-red-200",
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  low: "bg-blue-100 text-blue-800 border-blue-200",
};

const severityIcons: Record<string, string> = {
  strong: "✓",
  stable: "●",
  needs_attention: "⚠",
  critical: "✕",
};

export default function InternalReport() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [rerunning, setRerunning] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [intake, setIntake] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [responses, setResponses] = useState<Record<string, { value: string; json: any }>>({});

  useEffect(() => {
    if (sessionId) loadAll();
  }, [sessionId]);

  const loadAll = async () => {
    setLoading(true);

    const { data: sess } = await (supabase
      .from("assessment_sessions" as any)
      .select("*")
      .eq("id", sessionId)
      .single() as any);
    setSession(sess);

    if (!sess) { setLoading(false); return; }

    const { data: assess } = await (supabase
      .from("assessments" as any)
      .select("*")
      .eq("id", sess.assessment_id)
      .single() as any);
    setAssessment(assess);

    if (sess.intake_id) {
      const { data: intakeData } = await (supabase
        .from("assessment_intakes" as any)
        .select("*")
        .eq("id", sess.intake_id)
        .single() as any);
      setIntake(intakeData);
    }

    // Load sections + questions
    const { data: secs } = await (supabase
      .from("assessment_sections" as any)
      .select("*")
      .eq("assessment_id", sess.assessment_id)
      .order("sort_order") as any);

    const withQ = [];
    for (const sec of secs || []) {
      const { data: qs } = await (supabase
        .from("assessment_questions" as any)
        .select("*")
        .eq("section_id", sec.id)
        .order("sort_order") as any);
      withQ.push({ ...sec, questions: qs || [] });
    }
    setSections(withQ);

    // Load responses
    const { data: resps } = await (supabase
      .from("assessment_responses" as any)
      .select("*")
      .eq("session_id", sessionId) as any);
    const map: Record<string, { value: string; json: any }> = {};
    for (const r of resps || []) {
      map[r.question_id] = { value: r.response_value || "", json: r.response_json };
    }
    setResponses(map);

    // Load internal report
    const { data: rpt } = await (supabase
      .from("internal_assessment_reports" as any)
      .select("*")
      .eq("session_id", sessionId)
      .single() as any);
    setReport(rpt);

    setLoading(false);
  };

  const rerunAnalysis = async () => {
    setRerunning(true);
    try {
      const response = await supabase.functions.invoke("analyze-assessment", {
        body: { session_id: sessionId },
      });
      if (response.error) {
        toast({ title: "Analysis Failed", description: response.error.message, variant: "destructive" });
      } else {
        toast({ title: "Analysis Updated" });
        await loadAll();
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
    setRerunning(false);
  };

  const analysis = report?.analysis_data || {};

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!session || !report) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-40 pb-20 text-center">
          <p className="text-muted-foreground mb-8">
            {!session ? "Session not found." : "No analysis report found. Run analysis first."}
          </p>
          <Button variant="hero" asChild>
            <Link to="/admin/submissions">Back to Submissions</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="print:hidden">
        <Navbar />
      </div>

      {/* Toolbar */}
      <div className="print:hidden pt-24 lg:pt-28 pb-4 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/submissions">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Submissions
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={rerunAnalysis} disabled={rerunning}>
                {rerunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Rerun Analysis
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="print:pt-8 pb-6 bg-gradient-hero print:bg-transparent">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div {...fadeUp}>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">INTERNAL REPORT</Badge>
              <Badge className={`text-xs border ${severityColors[report.readiness_category || ""] || "bg-secondary"}`}>
                {(report.readiness_category || "pending").replace(/_/g, " ")}
              </Badge>
            </div>
            <h1 className="font-display text-2xl lg:text-4xl font-bold text-foreground tracking-tight mb-2">
              {assessment?.title || "Strategic Assessment"}
            </h1>
            <p className="text-muted-foreground">
              Internal Analysis — {intake?.full_name || "Unknown Client"}
              {intake?.organization_name ? ` · ${intake.organization_name}` : ""}
            </p>
            {report.last_analysis_run && (
              <p className="text-xs text-muted-foreground/60 mt-1">
                Analysis v{report.analysis_version} · Last run {formatDate(report.last_analysis_run)}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <div className="bg-background print:bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl py-8 space-y-10">

          {/* 1. Client Overview */}
          <ReportCard title="Client Overview" icon={<User className="h-5 w-5" />}>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoRow icon={<User className="h-4 w-4" />} label="Client" value={intake?.full_name || "—"} />
              <InfoRow icon={<Building2 className="h-4 w-4" />} label="Organization" value={intake?.organization_name || "—"} />
              <InfoRow icon={<Stethoscope className="h-4 w-4" />} label="Specialty" value={intake?.specialty || "—"} />
              <InfoRow icon={<FileText className="h-4 w-4" />} label="Practice Type" value={intake?.practice_type || "—"} />
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="Location" value={[intake?.city, intake?.province_state, intake?.country].filter(Boolean).join(", ") || "—"} />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="Submitted" value={formatDate(session?.submitted_at)} />
            </div>
          </ReportCard>

          {/* 2. Overall Score */}
          {report.overall_score != null && (
            <ReportCard title="Overall Readiness Score" icon={<BarChart3 className="h-5 w-5" />}>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-foreground">{report.overall_score}</div>
                  <p className="text-xs text-muted-foreground mt-1">out of 100</p>
                </div>
                <div className="flex-1">
                  <Progress value={report.overall_score} className="h-3 mb-2" />
                  <Badge className={`text-xs border ${severityColors[report.readiness_category || ""] || "bg-secondary"}`}>
                    {(report.readiness_category || "—").replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>
            </ReportCard>
          )}

          {/* 3. Executive Summary */}
          {analysis.executive_summary && (
            <ReportCard title="Executive Summary" icon={<FileText className="h-5 w-5" />}>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {analysis.executive_summary}
              </p>
            </ReportCard>
          )}

          {/* 4. Section-by-Section Analysis */}
          {analysis.section_analyses?.length > 0 && (
            <ReportCard title="Section Analysis" icon={<BarChart3 className="h-5 w-5" />}>
              <div className="space-y-6">
                {analysis.section_analyses.map((sa: any, i: number) => (
                  <div key={i} className="border border-border/40 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-display text-base font-bold text-foreground">{sa.section_title}</h4>
                      <div className="flex items-center gap-2">
                        {sa.score != null && <span className="text-sm font-bold">{sa.score}/100</span>}
                        {sa.severity && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${severityColors[sa.severity] || "bg-secondary"}`}>
                            {sa.severity.replace(/_/g, " ")}
                          </span>
                        )}
                      </div>
                    </div>
                    {sa.summary && <p className="text-sm text-muted-foreground mb-3">{sa.summary}</p>}
                    {sa.score != null && <Progress value={sa.score} className="h-2 mb-3" />}
                    <div className="grid sm:grid-cols-2 gap-3 text-xs">
                      {sa.operational_gaps?.length > 0 && (
                        <BulletList title="Operational Gaps" items={sa.operational_gaps} color="text-amber-700" />
                      )}
                      {sa.strategic_gaps?.length > 0 && (
                        <BulletList title="Strategic Gaps" items={sa.strategic_gaps} color="text-red-700" />
                      )}
                      {sa.notable_signals?.length > 0 && (
                        <BulletList title="Notable Signals" items={sa.notable_signals} color="text-blue-700" />
                      )}
                      {sa.improvement_opportunities?.length > 0 && (
                        <BulletList title="Improvement Opportunities" items={sa.improvement_opportunities} color="text-green-700" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ReportCard>
          )}

          {/* 5. Areas of Concern */}
          {analysis.concerns?.length > 0 && (
            <ReportCard title="Areas of Concern" icon={<AlertTriangle className="h-5 w-5" />}>
              <div className="space-y-3">
                {analysis.concerns.map((c: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-secondary/30 rounded-xl p-4">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px]">{c.type}</Badge>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${severityColors[c.severity] || ""}`}>
                          {c.severity}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{c.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ReportCard>
          )}

          {/* 6. Focus Areas */}
          {analysis.focus_areas?.length > 0 && (
            <ReportCard title="Priority Focus Areas" icon={<Target className="h-5 w-5" />}>
              <div className="space-y-3">
                {analysis.focus_areas.map((f: any, i: number) => (
                  <div key={i} className="bg-secondary/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">{f.area}</span>
                      <Badge variant="outline" className="text-[10px]">{f.priority?.replace(/_/g, " ")}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{f.rationale}</p>
                  </div>
                ))}
              </div>
            </ReportCard>
          )}

          {/* 7. Missing Information */}
          {analysis.missing_information?.length > 0 && (
            <ReportCard title="Missing Information" icon={<HelpCircle className="h-5 w-5" />}>
              <div className="space-y-3">
                {analysis.missing_information.map((m: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-secondary/30 rounded-xl p-4">
                    <XCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-foreground">{m.description}</p>
                      {m.impact && <p className="text-xs text-muted-foreground mt-1">Impact: {m.impact}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </ReportCard>
          )}

          {/* 8. Contradictions */}
          {analysis.contradictions?.length > 0 && (
            <ReportCard title="Contradictions & Inconsistencies" icon={<AlertTriangle className="h-5 w-5" />}>
              <div className="space-y-3">
                {analysis.contradictions.map((c: any, i: number) => (
                  <div key={i} className="bg-red-50/50 border border-red-100 rounded-xl p-4">
                    <p className="text-sm font-medium text-foreground">{c.description}</p>
                    {c.details && <p className="text-xs text-muted-foreground mt-1">{c.details}</p>}
                  </div>
                ))}
              </div>
            </ReportCard>
          )}

          {/* 9. Opportunities */}
          {analysis.opportunities?.length > 0 && (
            <ReportCard title="Opportunities" icon={<Lightbulb className="h-5 w-5" />}>
              <div className="space-y-3">
                {analysis.opportunities.map((o: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-green-50/50 border border-green-100 rounded-xl p-4">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{o.description}</span>
                        {o.potential_impact && (
                          <Badge variant="outline" className="text-[10px]">{o.potential_impact} impact</Badge>
                        )}
                      </div>
                      {o.category && <p className="text-xs text-muted-foreground">{o.category.replace(/_/g, " ")}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </ReportCard>
          )}

          {/* 10. Follow-Up Questions */}
          {analysis.follow_up_questions?.length > 0 && (
            <ReportCard title="Suggested Follow-Up Questions" icon={<MessageSquare className="h-5 w-5" />}>
              <div className="space-y-3">
                {analysis.follow_up_questions.map((f: any, i: number) => (
                  <div key={i} className="bg-secondary/30 rounded-xl p-4">
                    <p className="text-sm font-medium text-foreground">"{f.question}"</p>
                    {f.context && <p className="text-xs text-muted-foreground mt-1">{f.context}</p>}
                  </div>
                ))}
              </div>
            </ReportCard>
          )}

          {/* 11. Recommended Next Steps */}
          {analysis.recommended_next_steps?.length > 0 && (
            <ReportCard title="Recommended Next Steps" icon={<ArrowRight className="h-5 w-5" />}>
              <div className="space-y-3">
                {analysis.recommended_next_steps.map((n: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-secondary/30 rounded-xl p-4">
                    <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-accent">{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{n.recommendation}</p>
                      {n.category && (
                        <Badge variant="outline" className="text-[10px] mt-1">{n.category}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ReportCard>
          )}

          {/* 12. Full Client Responses */}
          <ReportCard title="Full Client Responses" icon={<FileText className="h-5 w-5" />}>
            <div className="space-y-6">
              {sections.map((sec: any, sIdx: number) => (
                <div key={sec.id}>
                  <h4 className="font-display text-base font-bold text-foreground mb-3">
                    {sIdx + 1}. {sec.title}
                  </h4>
                  <div className="space-y-3">
                    {sec.questions.map((q: any) => {
                      const r = responses[q.id];
                      const val = r?.json && Array.isArray(r.json) ? r.json.join(", ") : r?.value || "";
                      return (
                        <div key={q.id} className="bg-secondary/20 rounded-lg p-4">
                          <p className="text-xs font-medium text-muted-foreground mb-1">{q.question_text}</p>
                          <p className="text-sm text-foreground">
                            {val || <span className="italic text-muted-foreground/60">No response</span>}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ReportCard>

        </div>
      </div>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}

// --- Helper components ---

function ReportCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-soft border border-border/40 overflow-hidden print:shadow-none print:border print:break-inside-avoid-page"
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border/40 bg-secondary/20">
        <span className="text-accent">{icon}</span>
        <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function BulletList({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div>
      <p className={`font-semibold mb-1 ${color}`}>{title}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-muted-foreground flex items-start gap-1.5">
            <span className="mt-1">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

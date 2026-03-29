import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type {
  Assessment,
  AssessmentSession,
  SectionWithQuestions,
} from "@/types/assessment";
import {
  Loader2,
  AlertCircle,
  Printer,
  ArrowLeft,
  FileText,
  Calendar,
  Building2,
  User,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function AssessmentReport() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [sections, setSections] = useState<SectionWithQuestions[]>([]);
  const [responses, setResponses] = useState<Record<string, { value: string; json: any }>>({});
  const [intakeName, setIntakeName] = useState("");
  const [intakeOrg, setIntakeOrg] = useState("");

  useEffect(() => {
    if (!token) { setError(true); setLoading(false); return; }
    loadReport();
  }, [token]);

  const loadReport = async () => {
    try {
      // Use secure RPC to look up session by token
      const { data: sessResult, error: sessErr } = await supabase.rpc("get_session_by_token", { p_token: token });
      const sess = Array.isArray(sessResult) ? sessResult[0] : sessResult;

      if (sessErr || !sess) { setError(true); setLoading(false); return; }
      if (sess.status !== "submitted") { setError(true); setLoading(false); return; }

      const { data: assess } = await (supabase
        .from("assessments" as any)
        .select("*")
        .eq("id", sess.assessment_id)
        .single() as any);

      // Load intake info via secure RPC
      if (sess.intake_id) {
        const { data: intakeResult } = await supabase.rpc("get_intake_for_session", { p_token: token });
        const intake = Array.isArray(intakeResult) ? intakeResult[0] : intakeResult;
        if (intake) {
          setIntakeName(intake.full_name || "");
          setIntakeOrg(intake.organization_name || "");
        }
      }

      const { data: secs } = await (supabase
        .from("assessment_sections" as any)
        .select("*")
        .eq("assessment_id", sess.assessment_id)
        .order("sort_order") as any);

      const sectionsWithQuestions: SectionWithQuestions[] = [];
      for (const sec of secs || []) {
        const { data: questions } = await (supabase
          .from("assessment_questions" as any)
          .select("*")
          .eq("section_id", sec.id)
          .order("sort_order") as any);
        sectionsWithQuestions.push({ ...sec, questions: questions || [] });
      }

      const { data: existingResponses } = await (supabase
        .from("assessment_responses" as any)
        .select("*")
        .eq("session_id", sess.id) as any);

      const resMap: Record<string, { value: string; json: any }> = {};
      for (const r of existingResponses || []) {
        resMap[r.question_id] = { value: r.response_value || "", json: r.response_json };
      }

      setSession({ ...sess, access_token: "" } as any);
      setAssessment(assess);
      setSections(sectionsWithQuestions);
      setResponses(resMap);
      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const answeredCount = Object.values(responses).filter((r) => r.value || r.json).length;
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-40 pb-20 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Report Not Available</h1>
          <p className="text-muted-foreground mb-8">
            This report is not yet available. Reports are generated after assessment submission.
          </p>
          <Button variant="hero" asChild>
            <Link to="/strategic-assessment">Back to Strategic Assessment</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Screen-only header */}
      <div className="print:hidden">
        <Navbar />
      </div>

      {/* Screen-only toolbar */}
      <div className="print:hidden pt-24 lg:pt-28 pb-6 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/assessment/${token}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
            </div>
            <Button variant="hero" size="sm" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print / Save as PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Report content — print-friendly */}
      <div className="report-printable">
        {/* Cover page */}
        <div className="report-cover-page bg-background print:bg-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl py-12 lg:py-20 print:py-16">
            <motion.div {...fadeUp} className="text-center">
              {/* Brand mark */}
              <div className="mb-8 print:mb-12">
                <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-6 print:w-20 print:h-20">
                  <FileText className="h-8 w-8 text-accent print:h-10 print:w-10" />
                </div>
                <p className="text-accent font-medium tracking-[0.2em] uppercase text-xs mb-4">
                  Vitalis Health Strategies
                </p>
                <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight print:text-4xl">
                  {assessment?.title || "Strategic Assessment"}
                </h1>
                <p className="mt-3 text-lg text-muted-foreground">
                  Response Summary
                </p>
              </div>

              {/* Meta info */}
              <div className="max-w-md mx-auto">
                <div className="bg-card rounded-2xl p-6 lg:p-8 shadow-soft border border-border/40 print:shadow-none print:border print:border-border space-y-4 text-left">
                  {intakeName && (
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Prepared For</p>
                        <p className="text-sm font-semibold text-foreground">{intakeName}</p>
                      </div>
                    </div>
                  )}
                  {intakeOrg && (
                    <div className="flex items-start gap-3">
                      <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Organization</p>
                        <p className="text-sm font-semibold text-foreground">{intakeOrg}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date Completed</p>
                      <p className="text-sm font-semibold text-foreground">{formatDate(session?.submitted_at || null)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Responses</p>
                      <p className="text-sm font-semibold text-foreground">
                        {answeredCount} of {totalQuestions} questions answered across {sections.length} sections
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Section responses */}
        <div className="bg-background print:bg-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl py-12 lg:py-16 print:py-8">
            {sections.map((section, sIdx) => (
              <div key={section.id} className="mb-12 print:mb-10 report-section print:break-inside-avoid-page">
                {/* Section header */}
                <div className="flex items-center gap-3 mb-6 print:mb-4">
                  <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-accent">{sIdx + 1}</span>
                  </div>
                  <div>
                    <h2 className="font-display text-xl lg:text-2xl font-bold text-foreground print:text-lg">
                      {section.title}
                    </h2>
                    {section.description && (
                      <p className="text-sm text-muted-foreground mt-0.5">{section.description}</p>
                    )}
                  </div>
                </div>

                {/* Questions & answers */}
                <div className="space-y-4 print:space-y-3">
                  {section.questions.map((q, qIdx) => {
                    const r = responses[q.id];
                    const displayValue =
                      r?.json && Array.isArray(r.json)
                        ? r.json.join(", ")
                        : r?.value || "";

                    return (
                      <div
                        key={q.id}
                        className="bg-card rounded-xl p-5 border border-border/40 shadow-soft print:shadow-none print:border print:border-border/60 print:p-4 print:break-inside-avoid"
                      >
                        <p className="text-xs font-medium text-muted-foreground/70 mb-1">
                          Question {qIdx + 1}
                        </p>
                        <p className="text-sm font-semibold text-foreground mb-2">
                          {q.question_text}
                        </p>
                        <div className="bg-secondary/40 rounded-lg px-4 py-3 print:bg-secondary/20">
                          {displayValue ? (
                            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                              {displayValue}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground/60 italic">
                              No response provided
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {section.questions.length === 0 && (
                    <p className="text-sm text-muted-foreground italic print:hidden">
                      No questions in this section.
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Footer note */}
            <div className="mt-16 pt-8 border-t border-border/40 text-center print:mt-10 print:pt-6">
              <p className="text-xs text-muted-foreground/70">
                This document contains a summary of responses submitted as part of a Vitalis Health Strategies Strategic Assessment.
              </p>
              <p className="text-xs text-muted-foreground/50 mt-1">
                © {new Date().getFullYear()} Vitalis Health Strategies. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}

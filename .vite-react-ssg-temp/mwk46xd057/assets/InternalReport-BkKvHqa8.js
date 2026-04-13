import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Footer } from "./Footer-DArsv4kV.js";
import { motion } from "framer-motion";
import { s as supabase } from "./client-CxdMKRkw.js";
import { B as Button } from "./button-DnzOxZqg.js";
import { B as Badge } from "./badge-Bd62qPcf.js";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { c as cn } from "./utils-H80jjgLf.js";
import { Loader2, ArrowLeft, FileText, RefreshCw, Printer, User, Building2, Phone, Stethoscope, MapPin, Calendar, BarChart3, AlertTriangle, Target, XCircle, HelpCircle, CheckCircle, Lightbulb, MessageSquare, ArrowRight } from "lucide-react";
import { R as ReadinessGaugeChart, c as RadarScoreChart, S as SectionScoreBar, C as ConcernsPriorityMatrix, e as extractFinancialData, a as FinancialWaterfallChart, b as FocusAreasTimeline } from "./ReportCharts-sqDjxY9B.js";
import { u as useToast } from "./use-toast-B2rUv-Rg.js";
import "@supabase/supabase-js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "recharts";
const Progress = React.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsx(
  ProgressPrimitive.Root,
  {
    ref,
    className: cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className),
    ...props,
    children: /* @__PURE__ */ jsx(
      ProgressPrimitive.Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = ProgressPrimitive.Root.displayName;
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};
const severityColors = {
  strong: "bg-green-100 text-green-800 border-green-200",
  stable: "bg-blue-100 text-blue-800 border-blue-200",
  needs_attention: "bg-amber-100 text-amber-800 border-amber-200",
  critical: "bg-red-100 text-red-800 border-red-200",
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  low: "bg-blue-100 text-blue-800 border-blue-200"
};
function InternalReport() {
  const { sessionId } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [rerunning, setRerunning] = useState(false);
  const [report, setReport] = useState(null);
  const [session, setSession] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [intake, setIntake] = useState(null);
  const [sections, setSections] = useState([]);
  const [responses, setResponses] = useState({});
  useEffect(() => {
    if (sessionId) loadAll();
  }, [sessionId]);
  const loadAll = async () => {
    setLoading(true);
    const { data: sess } = await supabase.from("assessment_sessions").select("*").eq("id", sessionId).single();
    setSession(sess);
    if (!sess) {
      setLoading(false);
      return;
    }
    const { data: assess } = await supabase.from("assessments").select("*").eq("id", sess.assessment_id).single();
    setAssessment(assess);
    if (sess.intake_id) {
      const { data: intakeData } = await supabase.from("assessment_intakes").select("*").eq("id", sess.intake_id).single();
      setIntake(intakeData);
    }
    const { data: secs } = await supabase.from("assessment_sections").select("*").eq("assessment_id", sess.assessment_id).order("sort_order");
    const withQ = [];
    for (const sec of secs || []) {
      const { data: qs } = await supabase.from("assessment_questions").select("*").eq("section_id", sec.id).order("sort_order");
      withQ.push({ ...sec, questions: qs || [] });
    }
    setSections(withQ);
    const { data: resps } = await supabase.from("assessment_responses").select("*").eq("session_id", sessionId);
    const map = {};
    for (const r of resps || []) {
      map[r.question_id] = { value: r.response_value || "", json: r.response_json };
    }
    setResponses(map);
    const { data: rpt } = await supabase.from("internal_assessment_reports").select("*").eq("session_id", sessionId).single();
    setReport(rpt);
    setLoading(false);
  };
  const rerunAnalysis = async () => {
    setRerunning(true);
    try {
      const response = await supabase.functions.invoke("analyze-assessment", {
        body: { session_id: sessionId }
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
  const analysis = (() => {
    let data = report?.analysis_data || {};
    const tryParseJSON = (raw) => {
      try {
        let cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
        return JSON.parse(cleaned);
      } catch (e1) {
        try {
          const first = raw.indexOf("{");
          const last = raw.lastIndexOf("}");
          if (first !== -1 && last > first) {
            return JSON.parse(raw.substring(first, last + 1));
          }
        } catch (e2) {
        }
        return null;
      }
    };
    if (data.executive_summary && typeof data.executive_summary === "string") {
      const es = data.executive_summary.trim();
      if (es.startsWith("```") || es.startsWith("{")) {
        const parsed = tryParseJSON(es);
        if (parsed && typeof parsed === "object") {
          console.log("[InternalReport] Extracted structured data from executive_summary string");
          data = { ...data, ...parsed, executive_summary: parsed.executive_summary || "", parse_error: void 0 };
        } else {
          console.error("[InternalReport] Could not parse executive_summary JSON — will show fallback");
          data = { ...data, executive_summary: "", _malformed: true };
        }
      }
    }
    if (typeof data === "string") {
      const parsed = tryParseJSON(data);
      if (parsed) {
        data = parsed;
      } else {
        console.error("[InternalReport] analysis_data is an unparseable string");
        data = { executive_summary: "", _malformed: true };
      }
    }
    return data;
  })();
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-accent" }) });
  }
  if (!session || !report) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
      /* @__PURE__ */ jsx(Navbar, {}),
      /* @__PURE__ */ jsxs("div", { className: "pt-40 pb-20 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-8", children: !session ? "Session not found." : "No analysis report found. Run analysis first." }),
        /* @__PURE__ */ jsx(Button, { variant: "hero", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/admin/submissions", children: "Back to Submissions" }) })
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx("div", { className: "print:hidden", children: /* @__PURE__ */ jsx(Navbar, {}) }),
    /* @__PURE__ */ jsx("div", { className: "print:hidden pt-24 lg:pt-28 pb-4 bg-gradient-hero", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/admin/submissions", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Back to Submissions"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: `/admin/submissions/${sessionId}/client-report`, children: [
          /* @__PURE__ */ jsx(FileText, { className: "mr-2 h-4 w-4" }),
          "View Client Report"
        ] }) }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: rerunAnalysis, disabled: rerunning, children: [
          rerunning ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(RefreshCw, { className: "mr-2 h-4 w-4" }),
          "Rerun Analysis"
        ] }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: () => window.print(), children: [
          /* @__PURE__ */ jsx(Printer, { className: "mr-2 h-4 w-4" }),
          "Export"
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "print:pt-8 pb-6 bg-gradient-hero print:bg-transparent", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl", children: /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "INTERNAL REPORT" }),
        /* @__PURE__ */ jsx(Badge, { className: `text-xs border ${severityColors[report.readiness_category || ""] || "bg-secondary"}`, children: (report.readiness_category || "pending").replace(/_/g, " ") })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl lg:text-4xl font-bold text-foreground tracking-tight mb-2", children: assessment?.title || "Strategic Assessment" }),
      /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
        "Internal Analysis — ",
        intake?.full_name || "Unknown Client",
        intake?.organization_name ? ` · ${intake.organization_name}` : ""
      ] }),
      report.last_analysis_run && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground/60 mt-1", children: [
        "Analysis v",
        report.analysis_version,
        " · Last run ",
        formatDate(report.last_analysis_run)
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-background print:bg-white", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl py-8 space-y-10", children: [
      /* @__PURE__ */ jsx(ReportCard, { title: "Client Overview", icon: /* @__PURE__ */ jsx(User, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }), label: "Client", value: intake?.full_name || "—" }),
        /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(Building2, { className: "h-4 w-4" }), label: "Organization", value: intake?.organization_name || "—" }),
        /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4" }), label: "Phone", value: formatPhone(intake?.phone) || "—" }),
        /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(Stethoscope, { className: "h-4 w-4" }), label: "Specialty", value: intake?.specialty || "—" }),
        /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }), label: "Email", value: intake?.email || "—" }),
        /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }), label: "Practice Type", value: intake?.practice_type || "—" }),
        /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" }), label: "Location", value: [intake?.city, intake?.province_state, intake?.country].filter(Boolean).join(", ") || "—" }),
        /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }), label: "Submitted", value: formatDate(session?.submitted_at) })
      ] }) }),
      report.overall_score != null && /* @__PURE__ */ jsx(ReportCard, { title: "Overall Readiness Score", icon: /* @__PURE__ */ jsx(BarChart3, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-6", children: [
        /* @__PURE__ */ jsx(ReadinessGaugeChart, { score: report.overall_score, category: report.readiness_category || "" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-2", children: [
            /* @__PURE__ */ jsx("div", { className: "text-4xl font-bold text-foreground", children: report.overall_score }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "/ 100" })
          ] }),
          /* @__PURE__ */ jsx(Progress, { value: report.overall_score, className: "h-3 mb-2" }),
          /* @__PURE__ */ jsx(Badge, { className: `text-xs border ${severityColors[report.readiness_category || ""] || "bg-secondary"}`, children: (report.readiness_category || "—").replace(/_/g, " ") })
        ] })
      ] }) }),
      analysis.executive_summary && /* @__PURE__ */ jsx(ReportCard, { title: "Executive Summary", icon: /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap", children: analysis.executive_summary }) }),
      analysis.section_analyses?.length > 0 && /* @__PURE__ */ jsxs(ReportCard, { title: "Section Analysis", icon: /* @__PURE__ */ jsx(BarChart3, { className: "h-5 w-5" }), children: [
        /* @__PURE__ */ jsx(RadarScoreChart, { sections: analysis.section_analyses.filter((s) => s.score != null) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-6", children: analysis.section_analyses.map((sa, i) => /* @__PURE__ */ jsxs("div", { className: "border border-border/40 rounded-xl p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-display text-base font-bold text-foreground", children: sa.section_title }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              sa.score != null && /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold", children: [
                sa.score,
                "/100"
              ] }),
              sa.severity && /* @__PURE__ */ jsx("span", { className: `text-[10px] px-2 py-0.5 rounded-full border ${severityColors[sa.severity] || "bg-secondary"}`, children: sa.severity.replace(/_/g, " ") })
            ] })
          ] }),
          sa.summary && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-3", children: sa.summary }),
          sa.score != null && /* @__PURE__ */ jsx(SectionScoreBar, { score: sa.score }),
          /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-3 text-xs mt-3", children: [
            sa.operational_gaps?.length > 0 && /* @__PURE__ */ jsx(BulletList, { title: "Operational Gaps", items: sa.operational_gaps, color: "text-amber-700" }),
            sa.strategic_gaps?.length > 0 && /* @__PURE__ */ jsx(BulletList, { title: "Strategic Gaps", items: sa.strategic_gaps, color: "text-red-700" }),
            sa.notable_signals?.length > 0 && /* @__PURE__ */ jsx(BulletList, { title: "Notable Signals", items: sa.notable_signals, color: "text-blue-700" }),
            sa.improvement_opportunities?.length > 0 && /* @__PURE__ */ jsx(BulletList, { title: "Improvement Opportunities", items: sa.improvement_opportunities, color: "text-green-700" })
          ] })
        ] }, i)) })
      ] }),
      analysis.concerns?.length > 0 && /* @__PURE__ */ jsxs(ReportCard, { title: "Areas of Concern", icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5" }), children: [
        /* @__PURE__ */ jsx(ConcernsPriorityMatrix, { concerns: analysis.concerns }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: analysis.concerns.map((c, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 bg-secondary/30 rounded-xl p-4", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px]", children: c.type }),
              /* @__PURE__ */ jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full border ${severityColors[c.severity] || ""}`, children: c.severity })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground", children: c.description })
          ] })
        ] }, i)) })
      ] }),
      extractFinancialData(analysis) && /* @__PURE__ */ jsx(ReportCard, { title: "Financial Overview", icon: /* @__PURE__ */ jsx(BarChart3, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsx(FinancialWaterfallChart, { data: extractFinancialData(analysis) }) }),
      analysis.focus_areas?.length > 0 && /* @__PURE__ */ jsxs(ReportCard, { title: "Priority Focus Areas", icon: /* @__PURE__ */ jsx(Target, { className: "h-5 w-5" }), children: [
        /* @__PURE__ */ jsx(FocusAreasTimeline, { focusAreas: analysis.focus_areas, showLabels: true }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: analysis.focus_areas.map((f, i) => /* @__PURE__ */ jsxs("div", { className: "bg-secondary/30 rounded-xl p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-foreground", children: f.area }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px]", children: f.priority?.replace(/_/g, " ") })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: f.rationale })
        ] }, i)) })
      ] }),
      analysis.missing_information?.length > 0 && /* @__PURE__ */ jsx(ReportCard, { title: "Missing Information", icon: /* @__PURE__ */ jsx(HelpCircle, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: analysis.missing_information.map((m, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 bg-secondary/30 rounded-xl p-4", children: [
        /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground", children: m.description }),
          m.impact && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            "Impact: ",
            m.impact
          ] })
        ] })
      ] }, i)) }) }),
      analysis.contradictions?.length > 0 && /* @__PURE__ */ jsx(ReportCard, { title: "Contradictions & Inconsistencies", icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: analysis.contradictions.map((c, i) => /* @__PURE__ */ jsxs("div", { className: "bg-red-50/50 border border-red-100 rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: c.description }),
        c.details && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: c.details })
      ] }, i)) }) }),
      analysis.opportunities?.length > 0 && /* @__PURE__ */ jsx(ReportCard, { title: "Opportunities", icon: /* @__PURE__ */ jsx(Lightbulb, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: analysis.opportunities.map((o, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 bg-green-50/50 border border-green-100 rounded-xl p-4", children: [
        /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: o.description }),
            o.potential_impact && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px]", children: [
              o.potential_impact,
              " impact"
            ] })
          ] }),
          o.category && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: o.category.replace(/_/g, " ") })
        ] })
      ] }, i)) }) }),
      analysis.follow_up_questions?.length > 0 && /* @__PURE__ */ jsx(ReportCard, { title: "Suggested Follow-Up Questions", icon: /* @__PURE__ */ jsx(MessageSquare, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: analysis.follow_up_questions.map((f, i) => /* @__PURE__ */ jsxs("div", { className: "bg-secondary/30 rounded-xl p-4", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-foreground", children: [
          '"',
          f.question,
          '"'
        ] }),
        f.context && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: f.context })
      ] }, i)) }) }),
      analysis.recommended_next_steps?.length > 0 && /* @__PURE__ */ jsx(ReportCard, { title: "Recommended Next Steps", icon: /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: analysis.recommended_next_steps.map((n, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 bg-secondary/30 rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-accent", children: i + 1 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground", children: n.recommendation }),
          n.category && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] mt-1", children: n.category })
        ] })
      ] }, i)) }) }),
      /* @__PURE__ */ jsx(ReportCard, { title: "Full Client Responses", icon: /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsx("div", { className: "space-y-6", children: sections.map((sec, sIdx) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h4", { className: "font-display text-base font-bold text-foreground mb-3", children: [
          sIdx + 1,
          ". ",
          sec.title
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: sec.questions.map((q) => {
          const r = responses[q.id];
          const val = r?.json && Array.isArray(r.json) ? r.json.join(", ") : r?.value || "";
          return /* @__PURE__ */ jsxs("div", { className: "bg-secondary/20 rounded-lg p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground mb-1", children: q.question_text }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground", children: val || /* @__PURE__ */ jsx("span", { className: "italic text-muted-foreground/60", children: "No response" }) })
          ] }, q.id);
        }) })
      ] }, sec.id)) }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "print:hidden", children: /* @__PURE__ */ jsx(Footer, {}) })
  ] });
}
function formatPhone(phone) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)})${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)})${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}
function ReportCard({ title, icon, children }) {
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "bg-card rounded-2xl shadow-soft border border-border/40 overflow-hidden print:shadow-none print:border print:break-inside-avoid-page",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-6 py-4 border-b border-border/40 bg-secondary/20", children: [
          /* @__PURE__ */ jsx("span", { className: "text-accent", children: icon }),
          /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground", children: title })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "p-6", children })
      ]
    }
  );
}
function InfoRow({ icon, label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground mt-0.5", children: icon }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: label }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground", children: value })
    ] })
  ] });
}
function BulletList({ title, items, color }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("p", { className: `font-semibold mb-1 ${color}`, children: title }),
    /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: items.map((item, i) => /* @__PURE__ */ jsxs("li", { className: "text-muted-foreground flex items-start gap-1.5", children: [
      /* @__PURE__ */ jsx("span", { className: "mt-1", children: "•" }),
      /* @__PURE__ */ jsx("span", { children: item })
    ] }, i)) })
  ] });
}
export {
  InternalReport as default
};

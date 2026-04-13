import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { s as supabase } from "./client-B5yO-kwf.js";
import { B as Badge } from "./badge-Bd62qPcf.js";
import { B as Button } from "./button-DnzOxZqg.js";
import { Loader2, AlertCircle, Clock, Lock, User, Building2, Phone, Stethoscope, FileText, MapPin, Calendar, Target, AlertTriangle, CheckCircle, Lightbulb, ArrowRight, Mail } from "lucide-react";
import { F as FindingsCategoryDonut, e as extractFinancialData, a as FinancialWaterfallChart, b as FocusAreasTimeline } from "./ReportCharts-sqDjxY9B.js";
import { useParams } from "react-router";
import "@supabase/phoenix";
import "iceberg-js";
import "@supabase/auth-js";
import "tslib";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "recharts";
const vitalisLogo = "/vitalis-logo.webp";
const replacements = [
  [/\bthe client\b/gi, "your organization"],
  [/\bcritical failure\b/gi, "opportunity for improvement"],
  [/\bextremely concerning\b/gi, "area requiring attention"],
  [/\bhighly dissatisfied\b/gi, "looking for improvement"],
  [/\bextreme dissatisfaction\b/gi, "looking for improvement"],
  [/\d+\s*\/\s*100/g, ""],
  [/\d+\s+out\s+of\s+100/gi, ""]
];
function capitalizeFirst(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
function transformText(text) {
  if (!text) return text;
  let result = text;
  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }
  result = result.replace(/\s{2,}/g, " ").trim();
  return capitalizeFirst(result);
}
function transformArray(arr) {
  if (!arr) return [];
  return arr.map(transformText);
}
function formatPhone(phone) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `(${digits.slice(0, 3)})${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length === 11 && digits.startsWith("1")) return `(${digits.slice(1, 4)})${digits.slice(4, 7)}-${digits.slice(7)}`;
  return phone;
}
function ReportCard({ title, icon, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl shadow-soft border border-border/40 overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-6 py-4 border-b border-border/40 bg-secondary/10", children: [
      /* @__PURE__ */ jsx("span", { className: "text-accent", children: icon }),
      /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground", children: title })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-6", children })
  ] });
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
function ErrorPage({ icon, title, message }) {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-md mx-auto px-4", children: [
    /* @__PURE__ */ jsx("img", { src: vitalisLogo, alt: "Vitalis Health Strategies", className: "h-10 mx-auto mb-8" }),
    /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5", children: icon }),
    /* @__PURE__ */ jsx("h1", { className: "font-display text-xl font-bold text-foreground mb-3", children: title }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6 leading-relaxed", children: message }),
    /* @__PURE__ */ jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsxs("a", { href: "mailto:info@vitalisstrategies.com", children: [
      /* @__PURE__ */ jsx(Mail, { className: "mr-2 h-4 w-4" }),
      "Contact Us"
    ] }) })
  ] }) });
}
const POLL_INTERVAL_MS = 5e3;
const MAX_POLL_DURATION_MS = 12e4;
function ClientReportView() {
  const { token } = useParams();
  const [phase, setPhase] = useState("loading");
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [intake, setIntake] = useState(null);
  const [report, setReport] = useState(null);
  const [assessment, setAssessment] = useState(null);
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    const startedAt = Date.now();
    const poll = async () => {
      while (!cancelled) {
        try {
          const { data: result, error: rpcErr } = await supabase.rpc(
            "get_report_by_token",
            { p_token: token }
          );
          if (cancelled) return;
          if (rpcErr || !result) {
            console.error("RPC error:", rpcErr);
            setError("invalid");
            return;
          }
          const parsed = typeof result === "string" ? JSON.parse(result) : result;
          if (parsed.error) {
            setError(parsed.error);
            return;
          }
          if (parsed.status === "pending") {
            setPhase("preparing");
            if (Date.now() - startedAt >= MAX_POLL_DURATION_MS) {
              setError("timeout");
              return;
            }
            await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
            continue;
          }
          setSession(parsed.session);
          setAssessment(parsed.assessment);
          setIntake(parsed.intake);
          const reportData = parsed.report;
          if (reportData) {
            reportData._edits = parsed.edits || [];
          }
          setReport(reportData);
          setPhase("loading");
          return;
        } catch (err) {
          console.error("ClientReportView error:", err);
          if (!cancelled) setError("invalid");
          return;
        }
      }
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, [token]);
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";
  if (!error && !report && phase === "loading") {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsx("img", { src: vitalisLogo, alt: "Vitalis Health Strategies", className: "h-10 mb-6" }),
      /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-accent mb-3" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Loading your report…" })
    ] });
  }
  if (!error && !report && phase === "preparing") {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsx("img", { src: vitalisLogo, alt: "Vitalis Health Strategies", className: "h-10 mb-6" }),
      /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-accent mb-3" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Your report is being prepared, please wait…" })
    ] });
  }
  if (error === "invalid") {
    return /* @__PURE__ */ jsx(
      ErrorPage,
      {
        icon: /* @__PURE__ */ jsx(AlertCircle, { className: "h-7 w-7 text-destructive" }),
        title: "This Link Is Not Valid",
        message: "The report link you followed is not valid. Please contact info@vitalisstrategies.com if you believe this is an error."
      }
    );
  }
  if (error === "expired") {
    return /* @__PURE__ */ jsx(
      ErrorPage,
      {
        icon: /* @__PURE__ */ jsx(Clock, { className: "h-7 w-7 text-destructive" }),
        title: "This Link Has Expired",
        message: "This report link has expired (90 days). Please contact info@vitalisstrategies.com to request a new link."
      }
    );
  }
  if (error === "revoked") {
    return /* @__PURE__ */ jsx(
      ErrorPage,
      {
        icon: /* @__PURE__ */ jsx(Lock, { className: "h-7 w-7 text-destructive" }),
        title: "This Link Has Been Deactivated",
        message: "This report link has been deactivated. Please contact info@vitalisstrategies.com for assistance."
      }
    );
  }
  if (error === "timeout" || !report || !session) {
    return /* @__PURE__ */ jsx(
      ErrorPage,
      {
        icon: /* @__PURE__ */ jsx(AlertCircle, { className: "h-7 w-7 text-destructive" }),
        title: "Report Not Available",
        message: "This report is not yet available. Please try again in a few minutes or contact info@vitalisstrategies.com."
      }
    );
  }
  const analysis = (() => {
    let data = report.analysis_data || {};
    const tryParseJSON = (raw) => {
      try {
        let cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
        return JSON.parse(cleaned);
      } catch {
        try {
          const first = raw.indexOf("{");
          const last = raw.lastIndexOf("}");
          if (first !== -1 && last > first) return JSON.parse(raw.substring(first, last + 1));
        } catch {
        }
        return null;
      }
    };
    if (data.executive_summary && typeof data.executive_summary === "string") {
      const es = data.executive_summary.trim();
      if (es.startsWith("```") || es.startsWith("{")) {
        const parsed = tryParseJSON(es);
        if (parsed && typeof parsed === "object") {
          data = { ...data, ...parsed, executive_summary: parsed.executive_summary || "", parse_error: void 0 };
        } else {
          data = { ...data, executive_summary: "", _malformed: true };
        }
      }
    }
    if (typeof data === "string") {
      const parsed = tryParseJSON(data);
      data = parsed || { executive_summary: "", _malformed: true };
    }
    return data;
  })();
  const editMap = {};
  for (const e of report._edits || []) {
    editMap[`${e.section_key}__${e.item_index}`] = e.edited_text;
  }
  const getEditedText = (sectionKey, itemIndex, original) => {
    return editMap[`${sectionKey}__${itemIndex}`] ?? original;
  };
  const orgName = intake?.organization_name || intake?.full_name || "Your Organization";
  const executiveSummary = transformText(analysis.executive_summary || "");
  const sectionAnalyses = (analysis.section_analyses || []).map((sa) => ({
    section_title: sa.section_title,
    summary: transformText(sa.summary || ""),
    operational_gaps: transformArray(sa.operational_gaps),
    improvement_opportunities: transformArray(sa.improvement_opportunities)
  }));
  const keyFindings = (analysis.concerns || []).map((c) => ({
    description: transformText(c.description || ""),
    type: c.type
  }));
  const focusAreas = (analysis.focus_areas || []).map((f) => ({
    area: transformText(f.area || ""),
    rationale: transformText(f.rationale || ""),
    priority: f.priority
  }));
  const opportunities = (analysis.opportunities || []).map((o) => ({
    description: transformText(o.description || ""),
    category: o.category,
    potential_impact: o.potential_impact
  }));
  const nextSteps = (analysis.recommended_next_steps || []).map((n) => ({
    recommendation: transformText(n.recommendation || ""),
    category: n.category
  }));
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-card border-b border-border/40", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl py-10 text-center", children: [
      /* @__PURE__ */ jsx("img", { src: vitalisLogo, alt: "Vitalis Health Strategies", className: "h-12 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl lg:text-3xl font-bold text-foreground tracking-tight mb-2", children: "Strategic Assessment Report" }),
      /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-base", children: [
        "Prepared for: ",
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: orgName })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/60 mt-2", children: formatDate(session?.submitted_at) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl pt-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-secondary/30 border border-border/40 rounded-xl p-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-accent uppercase tracking-[0.15em] mb-1", children: "CONFIDENTIAL" }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
        "This report has been prepared exclusively for ",
        /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: orgName }),
        " by Vitalis Health Strategies Inc. Do not distribute or share without written authorization."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl py-8 space-y-8", children: [
      /* @__PURE__ */ jsx(ReportCard, { title: "Overview", icon: /* @__PURE__ */ jsx(User, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }), label: "Contact", value: intake?.full_name || "—" }),
        /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(Building2, { className: "h-4 w-4" }), label: "Organization", value: intake?.organization_name || "—" }),
        /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4" }), label: "Phone", value: formatPhone(intake?.phone) || "—" }),
        /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(Stethoscope, { className: "h-4 w-4" }), label: "Specialty", value: intake?.specialty || "—" }),
        /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }), label: "Email", value: intake?.email || "—" }),
        /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }), label: "Practice Type", value: intake?.practice_type || "—" }),
        /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" }), label: "Location", value: [intake?.city, intake?.province_state, intake?.country].filter(Boolean).join(", ") || "—" }),
        /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }), label: "Submitted", value: formatDate(session?.submitted_at) })
      ] }) }),
      executiveSummary && /* @__PURE__ */ jsx(ReportCard, { title: "Executive Summary", icon: /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap", children: getEditedText("executive_summary", 0, executiveSummary) }) }),
      sectionAnalyses.length > 0 && /* @__PURE__ */ jsx(ReportCard, { title: "Detailed Findings", icon: /* @__PURE__ */ jsx(Target, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsx("div", { className: "space-y-6", children: sectionAnalyses.map((sa, i) => /* @__PURE__ */ jsxs("div", { className: "border border-border/40 rounded-xl p-5", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-display text-base font-bold text-foreground mb-3", children: sa.section_title }),
        sa.summary && /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap", children: getEditedText(`section_summary_${i}`, 0, sa.summary) }),
        sa.operational_gaps.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Areas for Improvement" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-1.5", children: sa.operational_gaps.map((gap, gi) => /* @__PURE__ */ jsx("li", { className: "text-sm text-foreground leading-relaxed", children: getEditedText(`section_gap_${i}`, gi, gap) }, gi)) })
        ] }),
        sa.improvement_opportunities.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Opportunities" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-1.5", children: sa.improvement_opportunities.map((opp, oi) => /* @__PURE__ */ jsx("li", { className: "text-sm text-foreground leading-relaxed", children: getEditedText(`section_opp_${i}`, oi, opp) }, oi)) })
        ] })
      ] }, i)) }) }),
      keyFindings.length > 0 && /* @__PURE__ */ jsxs(ReportCard, { title: "Key Findings", icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5" }), children: [
        /* @__PURE__ */ jsx(FindingsCategoryDonut, { findings: keyFindings }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: keyFindings.map((c, i) => /* @__PURE__ */ jsxs("div", { className: "bg-secondary/20 rounded-xl p-4", children: [
          c.type && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] mb-2", children: c.type }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap", children: getEditedText("key_finding", i, c.description) })
        ] }, i)) })
      ] }),
      extractFinancialData(analysis) && /* @__PURE__ */ jsx(ReportCard, { title: "Financial Overview", icon: /* @__PURE__ */ jsx(Target, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsx(FinancialWaterfallChart, { data: extractFinancialData(analysis) }) }),
      focusAreas.length > 0 && /* @__PURE__ */ jsxs(ReportCard, { title: "Priority Focus Areas", icon: /* @__PURE__ */ jsx(Target, { className: "h-5 w-5" }), children: [
        /* @__PURE__ */ jsx(FocusAreasTimeline, { focusAreas, showLabels: false }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: focusAreas.map((f, i) => /* @__PURE__ */ jsxs("div", { className: "bg-secondary/20 rounded-xl p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-foreground", children: f.area }),
            f.priority && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px]", children: f.priority.replace(/_/g, " ") })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap", children: getEditedText("focus_area", i, f.rationale) })
        ] }, i)) })
      ] }),
      opportunities.length > 0 && /* @__PURE__ */ jsx(ReportCard, { title: "Opportunities", icon: /* @__PURE__ */ jsx(Lightbulb, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: opportunities.map((o, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 bg-secondary/20 rounded-xl p-4", children: [
        /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-accent mt-0.5 flex-shrink-0" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap", children: getEditedText("opportunity", i, o.description) }),
          o.category && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: o.category.replace(/_/g, " ") })
        ] })
      ] }, i)) }) }),
      nextSteps.length > 0 && /* @__PURE__ */ jsx(ReportCard, { title: "Recommended Next Steps", icon: /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: nextSteps.map((n, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 bg-secondary/20 rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-accent", children: i + 1 }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap", children: getEditedText("next_step", i, n.recommendation) }),
          n.category && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] mt-1", children: n.category })
        ] })
      ] }, i)) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-card border-t border-border/40 mt-8", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl py-10 text-center space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-foreground font-display", children: "Vitalis Health Strategies" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Calgary, Alberta, Canada" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
          /* @__PURE__ */ jsx("a", { href: "mailto:info@vitalisstrategies.com", className: "text-accent hover:underline", children: "info@vitalisstrategies.com" }),
          " · ",
          /* @__PURE__ */ jsx("a", { href: "https://vitalisstrategies.com", className: "text-accent hover:underline", children: "vitalisstrategies.com" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-border/40 pt-4", children: /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground/70 leading-relaxed max-w-2xl mx-auto", children: [
        "This report was prepared exclusively for ",
        intake?.full_name || "the recipient",
        intake?.organization_name && ` and ${intake.organization_name}`,
        " by Vitalis Health Strategies Inc. and is strictly confidential. © ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Vitalis Health Strategies Inc. All rights reserved."
      ] }) })
    ] }) })
  ] });
}
export {
  ClientReportView as default
};

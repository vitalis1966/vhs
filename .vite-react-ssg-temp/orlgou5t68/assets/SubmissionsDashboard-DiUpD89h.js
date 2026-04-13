import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { L as Link } from "./index-CalXArNJ.js";
import { N as Navbar } from "./Navbar-DZHwhlEF.js";
import { Footer } from "./Footer-vLUE6RrN.js";
import { motion } from "framer-motion";
import { s as supabase } from "./client-B5yO-kwf.js";
import { B as Button } from "./button-DnzOxZqg.js";
import { B as Badge } from "./badge-Bd62qPcf.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-B7zeG0fx.js";
import { A as AlertDialog, a as AlertDialogTrigger, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-BqNA8UQx.js";
import { ArrowLeft, RefreshCw, Loader2, FileSearch, BarChart3, Trash2 } from "lucide-react";
import { u as useToast } from "./use-toast-B2rUv-Rg.js";
import "react-dom";
import "react-router";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@supabase/phoenix";
import "iceberg-js";
import "@supabase/auth-js";
import "tslib";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-alert-dialog";
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }
};
const cellClass = "text-sm px-3 py-3 align-middle";
const headClass = "text-sm px-3 py-3 align-middle font-medium text-left text-muted-foreground";
const labelClass = "text-xs font-medium text-muted-foreground uppercase tracking-wide";
function getStatusInfo(assessmentPurpose) {
  const val = (assessmentPurpose || "").trim().toLowerCase();
  console.log("[SubmissionsDashboard] assessment_purpose raw value:", assessmentPurpose);
  if (val.includes("building_new") || val.includes("planning_new") || val.includes("exploring_new") || val.includes("building a new") || val.includes("planning a new") || val.includes("exploring a new")) {
    return { label: "New Practice", color: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100" };
  }
  if (val.includes("healthcare_it") || val.includes("healthcare it")) {
    return { label: "Healthcare IT", color: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100" };
  }
  return { label: "Existing Practice", color: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100" };
}
function SubmissionsDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningAnalysis, setRunningAnalysis] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { toast } = useToast();
  useEffect(() => {
    loadSubmissions();
  }, []);
  const loadSubmissions = async () => {
    setLoading(true);
    const { data: sessions } = await supabase.from("assessment_sessions").select("*").eq("status", "submitted").order("submitted_at", { ascending: false });
    if (!sessions || sessions.length === 0) {
      setSubmissions([]);
      setLoading(false);
      return;
    }
    const rows = [];
    for (const sess of sessions) {
      const { data: assess } = await supabase.from("assessments").select("title, slug").eq("id", sess.assessment_id).single();
      let clientName = "Unknown";
      let clientEmail = "";
      let organization = "—";
      let assessmentPurpose = null;
      if (sess.intake_id) {
        const { data: intake } = await supabase.from("assessment_intakes").select("full_name, email, organization_name, assessment_purpose").eq("id", sess.intake_id).single();
        if (intake) {
          clientName = intake.full_name || "Unknown";
          clientEmail = intake.email || "";
          organization = intake.organization_name || "—";
          assessmentPurpose = intake.assessment_purpose || null;
        }
      }
      const { data: report } = await supabase.from("internal_assessment_reports").select("id, analysis_status").eq("session_id", sess.id).single();
      const { data: clientEmails } = await supabase.from("email_events").select("id, status").eq("session_id", sess.id).eq("email_type", "client_report");
      const clientReportSent = (clientEmails || []).some(
        (e) => e.status === "sent"
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
        meeting_booked_by: sess.meeting_booked_by || null
      });
    }
    setSubmissions(rows);
    setLoading(false);
  };
  const runAnalysis = async (sessionId) => {
    setRunningAnalysis(sessionId);
    try {
      const response = await supabase.functions.invoke("analyze-assessment", {
        body: { session_id: sessionId }
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
  const handleDelete = async (sessionId) => {
    setDeletingId(sessionId);
    try {
      const { data, error } = await supabase.functions.invoke("delete-submission", {
        body: { session_id: sessionId }
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      setSubmissions((prev) => prev.filter((s) => s.session_id !== sessionId));
      toast({ title: "Assessment deleted" });
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: err.message || "Could not delete. Please try again.",
        variant: "destructive"
      });
    }
    setDeletingId(null);
  };
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-10 lg:pt-40 bg-gradient-hero", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-7xl", children: /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, children: [
      /* @__PURE__ */ jsxs(Link, { to: "/admin", className: "text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
        " Back to Admin"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Internal Admin" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight", children: "Submission Review" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground text-lg", children: "Review submitted assessments and generate internal strategic analysis reports." })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-10 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Submitted Assessments" }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: loadSubmissions, disabled: loading, children: [
          /* @__PURE__ */ jsx(RefreshCw, { className: `mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}` }),
          "Refresh"
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-accent" }) }) : submissions.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-20", children: [
        /* @__PURE__ */ jsx(FileSearch, { className: "h-12 w-12 text-muted-foreground/40 mx-auto mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No submitted assessments yet." })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "hidden lg:block bg-card rounded-2xl shadow-soft border border-border/40 overflow-hidden", children: /* @__PURE__ */ jsxs(Table, { style: { tableLayout: "fixed", width: "100%" }, children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { className: headClass, style: { width: "10%" }, children: "Client" }),
            /* @__PURE__ */ jsx(TableHead, { className: headClass, style: { width: "14%" }, children: "Organization" }),
            /* @__PURE__ */ jsx(TableHead, { className: headClass, style: { width: "9%" }, children: "Submitted" }),
            /* @__PURE__ */ jsx(TableHead, { className: headClass, style: { width: "10%" }, children: "Status" }),
            /* @__PURE__ */ jsx(TableHead, { className: headClass, style: { width: "7%" }, children: "Email" }),
            /* @__PURE__ */ jsx(TableHead, { className: headClass, style: { width: "8%" }, children: "Meeting" }),
            /* @__PURE__ */ jsx(TableHead, { className: headClass, style: { width: "8%" }, children: "Internal" }),
            /* @__PURE__ */ jsx(TableHead, { className: `${headClass} pl-6`, style: { width: "8%" }, children: "Client" }),
            /* @__PURE__ */ jsx(TableHead, { className: `${headClass} pl-4`, style: { width: "8%" }, children: "Analysis" }),
            /* @__PURE__ */ jsx(TableHead, { className: `${headClass} pl-4`, style: { width: "4%" } })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: submissions.map((sub) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: `${cellClass} font-medium`, children: sub.client_name }),
            /* @__PURE__ */ jsx(TableCell, { className: `${cellClass} text-muted-foreground`, children: sub.organization }),
            /* @__PURE__ */ jsx(TableCell, { className: `${cellClass} text-muted-foreground`, children: formatDate(sub.submitted_at) }),
            /* @__PURE__ */ jsx(TableCell, { className: cellClass, children: (() => {
              const status = getStatusInfo(sub.assessment_purpose);
              return /* @__PURE__ */ jsx(Badge, { className: `${status.color}`, children: status.label });
            })() }),
            /* @__PURE__ */ jsx(TableCell, { className: `${cellClass} text-center`, children: sub.client_report_sent ? /* @__PURE__ */ jsx(Badge, { className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100", children: "Sent Out" }) : /* @__PURE__ */ jsx(Badge, { className: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100", children: "Not Sent" }) }),
            /* @__PURE__ */ jsx(TableCell, { className: `${cellClass} text-center`, children: sub.meeting_booked ? /* @__PURE__ */ jsx(Badge, { className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100", children: "Booked" }) : /* @__PURE__ */ jsx(Badge, { className: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100", children: "Not Booked" }) }),
            /* @__PURE__ */ jsx(TableCell, { className: cellClass, children: sub.analysis_status === "complete" ? /* @__PURE__ */ jsx(Button, { size: "sm", className: "bg-green-600 hover:bg-green-700 text-white text-xs h-8 px-2", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: `/admin/submissions/${sub.session_id}`, children: "Internal Report" }) }) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "—" }) }),
            /* @__PURE__ */ jsx(TableCell, { className: `${cellClass} pl-6`, children: sub.has_client_report ? /* @__PURE__ */ jsx(Button, { size: "sm", className: "bg-teal-600 hover:bg-teal-700 text-white text-xs h-8 px-2", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: `/admin/submissions/${sub.session_id}/client-report`, children: "Client Report" }) }) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "—" }) }),
            /* @__PURE__ */ jsx(TableCell, { className: `${cellClass} pl-4`, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "text-xs h-8 px-2", onClick: () => runAnalysis(sub.session_id), disabled: runningAnalysis === sub.session_id, children: [
              runningAnalysis === sub.session_id ? /* @__PURE__ */ jsx(Loader2, { className: "mr-1 h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsx(BarChart3, { className: "mr-1 h-3 w-3" }),
              sub.analysis_status === "complete" ? "Rerun" : "Analyze"
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { className: `${cellClass} pl-4`, children: /* @__PURE__ */ jsxs(AlertDialog, { children: [
              /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0 text-muted-foreground hover:text-destructive", disabled: deletingId === sub.session_id, children: deletingId === sub.session_id ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) }) }),
              /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
                /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
                  /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete Assessment" }),
                  /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Are you sure you want to delete this assessment? This action cannot be undone." })
                ] }),
                /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
                  /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
                  /* @__PURE__ */ jsx(AlertDialogAction, { onClick: () => handleDelete(sub.session_id), className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Delete" })
                ] })
              ] })
            ] }) })
          ] }, sub.session_id)) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "lg:hidden space-y-4", children: submissions.map((sub) => /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-xl shadow-soft border border-border/40 p-4 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-sm text-foreground", children: sub.client_name }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: sub.organization })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              (() => {
                const status = getStatusInfo(sub.assessment_purpose);
                return /* @__PURE__ */ jsx(Badge, { className: `${status.color} text-xs`, children: status.label });
              })(),
              /* @__PURE__ */ jsxs(AlertDialog, { children: [
                /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "h-7 w-7 p-0 text-muted-foreground hover:text-destructive", disabled: deletingId === sub.session_id, children: deletingId === sub.session_id ? /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }) }) }),
                /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
                  /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
                    /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete Assessment" }),
                    /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Are you sure you want to delete this assessment? This action cannot be undone." })
                  ] }),
                  /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
                    /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
                    /* @__PURE__ */ jsx(AlertDialogAction, { onClick: () => handleDelete(sub.session_id), className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Delete" })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-x-4 gap-y-2 text-xs", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: labelClass, children: "Submitted" }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground", children: formatDate(sub.submitted_at) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: labelClass, children: "Email" }),
              /* @__PURE__ */ jsx("p", { children: sub.client_report_sent ? /* @__PURE__ */ jsx(Badge, { className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 text-xs", children: "Sent Out" }) : /* @__PURE__ */ jsx(Badge, { className: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100 text-xs", children: "Not Sent" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: labelClass, children: "Meeting" }),
              /* @__PURE__ */ jsx("p", { children: sub.meeting_booked ? /* @__PURE__ */ jsx(Badge, { className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100 text-xs", children: "Booked" }) : /* @__PURE__ */ jsx(Badge, { className: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100 text-xs", children: "Not Booked" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 pt-1", children: [
            sub.analysis_status === "complete" && /* @__PURE__ */ jsx(Button, { size: "sm", className: "bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-2", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: `/admin/submissions/${sub.session_id}`, children: "Internal Report" }) }),
            sub.has_client_report && /* @__PURE__ */ jsx(Button, { size: "sm", className: "bg-teal-600 hover:bg-teal-700 text-white text-xs h-7 px-2", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: `/admin/submissions/${sub.session_id}/client-report`, children: "Client Report" }) }),
            /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "text-xs h-7 px-2", onClick: () => runAnalysis(sub.session_id), disabled: runningAnalysis === sub.session_id, children: [
              runningAnalysis === sub.session_id ? /* @__PURE__ */ jsx(Loader2, { className: "mr-1 h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsx(BarChart3, { className: "mr-1 h-3 w-3" }),
              sub.analysis_status === "complete" ? "Rerun" : "Analyze"
            ] })
          ] })
        ] }, sub.session_id)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  SubmissionsDashboard as default
};

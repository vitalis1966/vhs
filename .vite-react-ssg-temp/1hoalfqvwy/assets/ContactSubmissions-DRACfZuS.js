import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Footer } from "./Footer-DArsv4kV.js";
import { B as Button } from "./button-DnzOxZqg.js";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Trash2, Mail, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { s as supabase } from "./client-CxdMKRkw.js";
import { toast } from "sonner";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-CtjoYuUO.js";
import { A as AlertDialog, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-BqNA8UQx.js";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@supabase/supabase-js";
import "@radix-ui/react-dialog";
import "@radix-ui/react-alert-dialog";
const INTEREST_LABELS = {
  "new-practice": "New Practice Build",
  operations: "Operational Excellence",
  revenue: "Revenue & Finance",
  growth: "Growth Strategy",
  recruitment: "Practitioner Recruitment",
  ma: "M&A / Transition",
  "healthcare-it": "Healthcare IT & Technology",
  people: "People Management",
  assessment: "Strategic Assessment",
  general: "General Inquiry"
};
const STATUS_CYCLE = {
  new: "read",
  read: "replied",
  replied: "new"
};
const statusStyle = (status) => {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "read":
      return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    case "replied":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-200";
  }
};
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}
function ContactSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fetchSubmissions = async () => {
    const { data, error } = await supabase.from("contact_submissions").select("*").order("submitted_at", { ascending: false });
    if (error) {
      toast.error("Failed to load submissions");
      console.error(error);
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchSubmissions();
  }, []);
  const cycleStatus = async (sub) => {
    const nextStatus = STATUS_CYCLE[sub.status] || "new";
    const { error } = await supabase.from("contact_submissions").update({ status: nextStatus }).eq("id", sub.id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      setSubmissions(
        (prev) => prev.map((s) => s.id === sub.id ? { ...s, status: nextStatus } : s)
      );
    }
  };
  const markReplied = async (sub) => {
    const { error } = await supabase.from("contact_submissions").update({ status: "replied" }).eq("id", sub.id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      setSubmissions(
        (prev) => prev.map((s) => s.id === sub.id ? { ...s, status: "replied" } : s)
      );
      if (selected?.id === sub.id) {
        setSelected({ ...sub, status: "replied" });
      }
    }
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from("contact_submissions").delete().eq("id", deleteTarget.id);
    if (error) {
      toast.error("Failed to delete submission");
    } else {
      toast.success("Submission deleted");
      setSubmissions((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      if (selected?.id === deleteTarget.id) setSelected(null);
    }
    setDeleting(false);
    setDeleteTarget(null);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-10 lg:pt-40 bg-gradient-hero", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: [
      /* @__PURE__ */ jsxs(Link, { to: "/admin", className: "text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
        " Back to Admin"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Admin" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight", children: "Contact Submissions" })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-12 bg-background flex-1", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: loading ? /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Loading..." }) : submissions.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No submissions yet." }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-xl border border-border/40 shadow-soft", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/40 bg-muted/30", children: [
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap", children: "Date" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Name" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Email" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Organization" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap", children: "Area of Interest" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: submissions.map((sub) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/20 hover:bg-muted/10 transition-colors", children: [
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 whitespace-nowrap text-muted-foreground", children: formatDate(sub.submitted_at) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: sub.name }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("a", { href: `mailto:${sub.email}`, className: "hover:underline", style: { color: "#B8860B" }, children: sub.email }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-muted-foreground", children: sub.organization || "—" }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: sub.area_of_interest ? INTEREST_LABELS[sub.area_of_interest] || sub.area_of_interest : "—" }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => cycleStatus(sub),
            className: `px-3 py-1 rounded-full text-xs font-semibold capitalize cursor-pointer transition-colors ${statusStyle(sub.status)}`,
            children: sub.status
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelected(sub), children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "text-destructive hover:text-destructive hover:bg-destructive/10", onClick: () => setDeleteTarget(sub), children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
        ] }) })
      ] }, sub.id)) })
    ] }) }) }) }),
    /* @__PURE__ */ jsx(Dialog, { open: !!selected, onOpenChange: () => setSelected(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { className: "font-display text-xl", children: "Submission Details" }) }),
      selected && /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[120px_1fr] gap-y-3", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-muted-foreground", children: "Name" }),
          /* @__PURE__ */ jsx("span", { className: "text-foreground", children: selected.name }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-muted-foreground", children: "Email" }),
          /* @__PURE__ */ jsx("a", { href: `mailto:${selected.email}`, style: { color: "#B8860B" }, children: selected.email }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-muted-foreground", children: "Phone" }),
          /* @__PURE__ */ jsx("span", { className: "text-foreground", children: selected.phone || "—" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-muted-foreground", children: "Organization" }),
          /* @__PURE__ */ jsx("span", { className: "text-foreground", children: selected.organization || "—" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-muted-foreground", children: "Interest" }),
          /* @__PURE__ */ jsx("span", { className: "text-foreground", children: selected.area_of_interest ? INTEREST_LABELS[selected.area_of_interest] || selected.area_of_interest : "—" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-muted-foreground", children: "Date" }),
          /* @__PURE__ */ jsx("span", { className: "text-foreground", children: formatDate(selected.submitted_at) }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-muted-foreground", children: "Status" }),
          /* @__PURE__ */ jsx("span", { className: `inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize w-fit ${statusStyle(selected.status)}`, children: selected.status })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-muted-foreground block mb-2", children: "Message" }),
          /* @__PURE__ */ jsx("div", { className: "bg-muted/30 rounded-lg p-4 text-foreground whitespace-pre-wrap leading-relaxed border border-border/30", children: selected.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsx(Button, { variant: "hero", size: "sm", asChild: true, children: /* @__PURE__ */ jsxs("a", { href: `mailto:${selected.email}?subject=${encodeURIComponent("Re: Your Vitalis inquiry")}`, children: [
            /* @__PURE__ */ jsx(Mail, { className: "mr-2 h-4 w-4" }),
            "Reply by Email"
          ] }) }),
          selected.status !== "replied" && /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: () => markReplied(selected), children: [
            /* @__PURE__ */ jsx(CheckCircle2, { className: "mr-2 h-4 w-4" }),
            "Mark as Replied"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!deleteTarget, onOpenChange: () => setDeleteTarget(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete Submission" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "Are you sure you want to permanently delete the submission from ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: deleteTarget?.name }),
          "? This action cannot be undone."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { disabled: deleting, children: "Cancel" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: handleDelete,
            disabled: deleting,
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            children: deleting ? "Deleting…" : "Delete"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  ContactSubmissions as default
};

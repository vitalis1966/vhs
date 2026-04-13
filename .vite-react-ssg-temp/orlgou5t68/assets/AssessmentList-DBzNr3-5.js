import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { L as Link } from "./index-CalXArNJ.js";
import { N as Navbar } from "./Navbar-DZHwhlEF.js";
import { Footer } from "./Footer-vLUE6RrN.js";
import { motion } from "framer-motion";
import { s as supabase } from "./client-B5yO-kwf.js";
import { B as Button } from "./button-DnzOxZqg.js";
import { B as Badge } from "./badge-Bd62qPcf.js";
import { ArrowLeft, Loader2, ClipboardList, ArrowRight } from "lucide-react";
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
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }
};
function AssessmentList() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadAssessments();
  }, []);
  const loadAssessments = async () => {
    const { data } = await supabase.from("assessments").select("*").order("created_at");
    setAssessments(data || []);
    setLoading(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-20 lg:pt-40 bg-gradient-hero", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, children: [
      /* @__PURE__ */ jsxs(Link, { to: "/admin", className: "text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
        " Back to Admin"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Admin" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight", children: "Assessment Builder" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground text-lg", children: "Create and manage assessment templates, sections, and questions." })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: loading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-accent" }) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      assessments.map((a) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          ...fadeUp,
          className: "bg-card rounded-2xl p-6 shadow-soft border border-border/40 flex items-center justify-between gap-4",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 flex-1", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(ClipboardList, { className: "h-6 w-6 text-primary" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground", children: a.title }),
                  /* @__PURE__ */ jsx(Badge, { variant: a.is_published ? "default" : "secondary", children: a.is_published ? "Published" : "Draft" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: a.description }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground/60 mt-1", children: [
                  "Slug: ",
                  a.slug
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Button, { variant: "hero", size: "sm", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: `/admin/assessments/${a.id}`, children: [
              "Edit",
              /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
            ] }) })
          ]
        },
        a.id
      )),
      assessments.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-center text-muted-foreground py-20", children: "No assessments found." })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  AssessmentList as default
};

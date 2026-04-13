import { jsxs, jsx } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Footer } from "./Footer-DArsv4kV.js";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { B as Button } from "./button-DnzOxZqg.js";
import { ArrowRight, Building, Stethoscope, ClipboardCheck } from "lucide-react";
import { u as usePageMeta } from "./seo-sReVioJD.js";
import "react";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./PageSEOContext-DZ23I7UH.js";
const assessments = [
  {
    icon: Building,
    title: "Build Strategy Assessment",
    description: "Planning a new practice involves dozens of interconnected decisions — from facility design and staffing models to technology infrastructure and long-term financial planning. Our planning assessment helps practitioners evaluate these factors before major commitments are made.",
    includes: ["Concept and market validation", "Facility planning readiness", "Financial model assessment", "Operational setup evaluation", "Launch readiness checklist", "Strategic recommendations"]
  },
  {
    icon: Stethoscope,
    title: "Performance Assessment",
    description: "Our performance assessment helps practice leaders evaluate operational systems, patient flow, staffing structure, technology usage, and financial performance to identify opportunities for improvement.",
    includes: ["Operational efficiency review", "Revenue cycle assessment", "Patient flow analysis", "Compliance and risk review", "Growth opportunity identification", "Prioritized action plan"]
  }
];
const ClinicAudit = () => {
  usePageMeta(
    "Strategic Assessment | Healthcare Consulting | Vitalis Health Strategies",
    "Start with clarity. Our strategic assessment gives you an actionable roadmap for your medical, dental, or veterinary practice.",
    "/og-clinic-audit.jpg"
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "flex items-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Strategic Assessment" })
      ] }),
      /* @__PURE__ */ jsx(motion.h1, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight", children: "Start with clarity." }),
      /* @__PURE__ */ jsx(motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl", children: "Our strategic assessment gives you an actionable roadmap — whether you're building something new or looking for an objective view of what exists." }),
      /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "mt-10 flex flex-col sm:flex-row gap-4", children: /* @__PURE__ */ jsx(Button, { variant: "gold", size: "xl", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment", children: [
        "Start Your Strategic Assessment ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl", children: /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-8", children: assessments.map((audit, i) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.1 }, className: "bg-card rounded-2xl p-8 lg:p-10 shadow-card", children: [
      /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center", children: /* @__PURE__ */ jsx(audit.icon, { className: "h-7 w-7 text-primary" }) }),
      /* @__PURE__ */ jsx("h3", { className: "mt-6 font-display text-2xl font-bold text-foreground", children: audit.title }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-muted-foreground leading-relaxed", children: audit.description }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-foreground uppercase tracking-wider mb-3", children: "Includes" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: audit.includes.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsx(ClipboardCheck, { className: "h-4 w-4 text-accent flex-shrink-0" }),
          item
        ] }, item)) })
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "hero-outline", size: "default", asChild: true, className: "mt-8", children: /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment", children: [
        "Learn About This Assessment ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
      ] }) })
    ] }, audit.title)) }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-section", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-3xl text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "How the assessment works" }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 grid sm:grid-cols-3 gap-8", children: [
        { step: "1", title: "Share", desc: "Tell us about your practice and goals." },
        { step: "2", title: "Assess", desc: "We conduct a thorough strategic diagnostic." },
        { step: "3", title: "Act", desc: "Receive a clear, prioritized roadmap." }
      ].map((s) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-lg font-bold mx-auto", children: s.step }),
        /* @__PURE__ */ jsx("h3", { className: "mt-4 font-display text-lg font-semibold text-foreground", children: s.title }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: s.desc })
      ] }, s.step)) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  ClinicAudit as default
};

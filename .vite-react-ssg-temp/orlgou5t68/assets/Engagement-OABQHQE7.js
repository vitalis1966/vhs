import { jsxs, jsx } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-DZHwhlEF.js";
import { Footer } from "./Footer-vLUE6RrN.js";
import { motion } from "framer-motion";
import { L as Link } from "./index-CalXArNJ.js";
import { B as Button } from "./button-DnzOxZqg.js";
import { ArrowRight, MessageSquare, ClipboardList, Map, FileText, Wrench, TrendingUp } from "lucide-react";
import { u as usePageMeta } from "./seo-sReVioJD.js";
import "react";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "react-router";
import "react-dom";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./PageSEOContext-DZ23I7UH.js";
const phases = [
  { icon: MessageSquare, phase: "Phase 1", title: "Initial Conversation", description: "Practitioners and practice leaders connect with Vitalis to discuss goals, challenges, and opportunities. No commitment required.", details: ["Consultation call", "Initial discovery", "Discussion of goals and priorities"] },
  { icon: ClipboardList, phase: "Phase 2", title: "Strategic Assessment", description: "Clients often begin with a structured assessment to identify strengths, risks, opportunities, and practical priorities.", details: ["Build Strategy Assessment (new practices)", "Performance Assessment (existing practices)", "Gap analysis and strategic priorities"] },
  { icon: Map, phase: "Phase 3", title: "Strategic Roadmap", description: "Vitalis develops a roadmap that aligns operational improvements, technology planning, staffing structure, and growth priorities.", details: ["Operational strategy", "Technology planning", "Staffing structure", "Growth priorities"] },
  { icon: FileText, phase: "Phase 4", title: "Proposal and Engagement", description: "Clients receive a clear proposal outlining scope, timeline, deliverables, and engagement model tailored to their context.", details: ["Defined scope", "Timeline and milestones", "Deliverables", "Engagement structure"] },
  { icon: Wrench, phase: "Phase 5", title: "Implementation Support", description: "Vitalis supports execution through workflow design, technology planning, leadership alignment, and operational improvement.", details: ["Workflow design", "Technology implementation planning", "Leadership support", "Operational refinement"] },
  { icon: TrendingUp, phase: "Phase 6", title: "Growth & Ongoing Advisory", description: "Many engagements continue as long-term advisory relationships supporting expansion strategy, recruitment, and sustained performance.", details: ["Expansion strategy", "Practitioner recruitment", "Strategic transactions", "Ongoing advisory support"] }
];
const Engagement = () => {
  usePageMeta(
    "Fractional Healthcare Leadership & Advisory Consulting | Vitalis Health Strategies",
    "On-demand executive leadership for growing practices. Vitalis provides fractional CMO, COO, and CFO support across healthcare.",
    "/og-engagement.jpg"
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "flex items-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Engagement Model" })
      ] }),
      /* @__PURE__ */ jsx(motion.h1, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight", children: "A structured path with coordinated strategic support." }),
      /* @__PURE__ */ jsxs(motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl", children: [
        "Healthcare ventures often involve multiple advisors — architects, legal counsel, lenders, and technology specialists. Our ",
        /* @__PURE__ */ jsx(Link, { to: "/about", className: "text-primary hover:text-foreground underline underline-offset-2 transition-colors", children: "clinician-led team" }),
        " works alongside you to coordinate these relationships so decisions stay aligned and progress remains focused throughout the engagement. Start with a ",
        /* @__PURE__ */ jsx(Link, { to: "/strategic-assessment", className: "text-primary hover:text-foreground underline underline-offset-2 transition-colors", children: "strategic assessment" }),
        " to identify your priorities."
      ] }),
      /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "mt-10", children: /* @__PURE__ */ jsx(Button, { variant: "hero", size: "xl", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
        "Start the Conversation ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground mb-4", children: "Six-Phase Engagement Journey" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto", children: "Clear phases, clear decisions, and practical guidance from initial planning through ongoing advisory support." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-2 gap-8", children: phases.map((phase, i) => /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.08 }, className: "bg-card rounded-2xl p-8 shadow-soft hover:shadow-card transition-all duration-300 border border-border/40", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(phase.icon, { className: "h-6 w-6 text-primary" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-accent", children: phase.phase }),
          /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground mt-2 mb-3", children: phase.title }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-4", children: phase.description }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-1.5", children: phase.details.map((detail) => /* @__PURE__ */ jsxs("li", { className: "text-sm text-muted-foreground flex items-start gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2" }),
            /* @__PURE__ */ jsx("span", { children: detail })
          ] }, detail)) })
        ] })
      ] }) }, phase.phase)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-section", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground mb-5", children: "Built for long-term partnership" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg leading-relaxed", children: "While some clients engage for specific projects, many retain Vitalis for ongoing strategic advisory. This continuity helps maintain alignment as organizations scale, adapt, and pursue new opportunities across Calgary and Canada." })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 text-center", children: /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground mb-6", children: "Ready to begin?" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg leading-relaxed mb-10", children: "Start with a strategic conversation and determine the right pathway for your organization." }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "hero", size: "xl", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
          "Speak With Our Team ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
        ] }) }),
        /* @__PURE__ */ jsx(Button, { variant: "hero-outline", size: "xl", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/strategic-assessment", children: "Start Your Strategic Assessment" }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  Engagement as default
};

import { jsx, jsxs } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { B as Button } from "./button-DnzOxZqg.js";
import { ArrowRight, Building2, TrendingUp, Brain, Cog, DollarSign, Monitor, Users, Stethoscope, Handshake, BarChart3, Hospital, Landmark, Target } from "lucide-react";
import { Footer } from "./Footer-DArsv4kV.js";
import { u as usePageMeta } from "./seo-sReVioJD.js";
import { J as JsonLd, a as buildServiceSchema, b as buildBreadcrumbSchema } from "./JsonLd-VGPEamnK.js";
import "react";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./PageSEOContext-DZ23I7UH.js";
function MnASection() {
  return /* @__PURE__ */ jsx("section", { className: "py-24 lg:py-32 bg-gradient-section", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
            /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Mergers, Acquisitions & Transitions" })
          ] }),
          /* @__PURE__ */ jsxs("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight", children: [
            "Considering a transition or partnership change?",
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { className: "text-gradient-primary", children: "Let's discuss your opportunities." })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 text-muted-foreground leading-relaxed text-lg", children: "Vitalis Health Strategies supports acquisitions, mergers, and transitions for practice leaders across Canada's medical, dental, and veterinary sectors." }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground leading-relaxed", children: "We help practice owners navigate complex transactions with clarity — preserving what makes your practice strong while providing the strategic and operational support to move forward confidently." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col sm:flex-row gap-4", children: [
            /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
              "Talk to a Transition Advisor",
              /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
            ] }) }),
            /* @__PURE__ */ jsx(Button, { variant: "hero-outline", size: "lg", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Learn About Our M&A Advisory" }) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, delay: 0.15 },
        className: "bg-card rounded-2xl p-8 lg:p-10 shadow-card",
        children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-6", children: "What we deliver" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-4", children: [
            { title: "Valuation & Market Analysis", desc: "Thorough financial analysis and market positioning to support informed decisions." },
            { title: "Due Diligence Support", desc: "Comprehensive operational assessment and risk evaluation for buyers and sellers." },
            { title: "Transaction Structuring", desc: "Deal structuring, negotiation support, and legal coordination." },
            { title: "Post-Merger Integration", desc: "Aligning operations, cultures, and systems to realize full transaction value." },
            { title: "Succession & Transition Planning", desc: "Smooth leadership transitions that protect legacy and continuity." }
          ].map((item) => /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground text-sm", children: item.title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: item.desc })
            ] })
          ] }, item.title)) })
        ]
      }
    )
  ] }) }) });
}
const capabilities = [
  { icon: Brain, title: "Strategic Consulting", description: "Business strategy, market positioning, growth planning, and long-term strategic roadmaps." },
  { icon: Cog, title: "Operations & Workflow", description: "Workflow optimization, patient flow redesign, process improvement, and operational efficiency." },
  { icon: DollarSign, title: "Financial & Revenue Cycle", description: "Revenue cycle performance, financial modeling, cost optimization, and profitability improvement." },
  { icon: Building2, title: "Practice Development", description: "New practice planning, facility design coordination, launch strategy, and development oversight." },
  { icon: Monitor, title: "Technology & Digital", description: "EMR optimization, technology planning, digital transformation, and systems integration." },
  { icon: Users, title: "People Management", description: "Staff structure design, leadership development, team alignment, and organizational culture." },
  { icon: Stethoscope, title: "Practitioner Recruitment", description: "Recruitment strategy, practitioner onboarding, partnership structures, and succession planning." },
  { icon: Handshake, title: "Mergers & Acquisitions", description: "Practice valuation, acquisition strategy, integration planning, and transaction advisory." }
];
const practiceTypes = [
  "Family medicine practices",
  "Specialty practices",
  "Multidisciplinary practices",
  "Dental practices",
  "Veterinary practices",
  "Non-hospital surgical facilities"
];
const organizations = [
  { icon: Building2, title: "Private Practices", description: "Independent practitioner practices, specialist groups, and multi-provider practices requiring strategic planning, operational alignment, and growth support." },
  { icon: Hospital, title: "Public Healthcare Organizations", description: "Healthcare organizations and delivery teams looking to improve system performance, strengthen operations, and design better patient-centered care pathways." },
  { icon: Landmark, title: "Government & Health Authorities", description: "Health authorities and public sector stakeholders seeking practical strategic advisory for healthcare program development, transformation, and execution." }
];
const Solutions = () => {
  usePageMeta(
    "Healthcare Consulting Solutions | Full-Cycle Strategic Advisory | Vitalis Health Strategies",
    "Full-cycle strategic advisory for healthcare organizations. Vitalis supports practices from initial concept through long-term growth.",
    "/og-solutions.jpg"
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(JsonLd, { data: buildServiceSchema("Healthcare Consulting Solutions", "Comprehensive consulting for medical, dental, and veterinary practices across all stages — planning, building, growing, and optimizing.", "/solutions") }),
    /* @__PURE__ */ jsx(JsonLd, { data: buildBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }]) }),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "flex items-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Solutions Overview" })
      ] }),
      /* @__PURE__ */ jsx(motion.h1, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight", children: "Full-cycle strategic advisory for healthcare organizations." }),
      /* @__PURE__ */ jsxs(motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl", children: [
        "Based in Calgary, Vitalis Health Strategies supports practitioners and healthcare organizations across Canada through every stage of growth — from initial concept through long-term strategic advisory. Our ",
        /* @__PURE__ */ jsx(Link, { to: "/about", className: "text-primary hover:text-foreground underline underline-offset-2 transition-colors", children: "clinician-led team" }),
        " brings operational experience to every engagement. Start with a ",
        /* @__PURE__ */ jsx(Link, { to: "/strategic-assessment", className: "text-primary hover:text-foreground underline underline-offset-2 transition-colors", children: "strategic assessment" }),
        " to understand where your practice stands."
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "Where is your practice right now?" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground text-lg max-w-2xl mx-auto", children: "Vitalis provides tailored solutions whether you're planning a new practice or looking for an objective view of an existing one." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "bg-card rounded-2xl p-8 lg:p-10 shadow-card border border-border/40 hover:shadow-elevated transition-shadow duration-300", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-gradient-forest flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx(Building2, { className: "h-7 w-7 text-primary-foreground" }) }),
          /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl lg:text-3xl font-bold text-foreground mb-4", children: "Planning a New Practice" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-6", children: "For practitioners and healthcare entrepreneurs planning a new medical clinic, dental office, or veterinary facility. We guide you from concept through launch." }),
          /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", asChild: true, className: "whitespace-normal h-auto py-3 text-center leading-snug", children: /* @__PURE__ */ jsxs(Link, { to: "/solutions/new-clinics", children: [
            "Explore New Practice Solutions ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4 shrink-0" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: 0.1 }, className: "bg-card rounded-2xl p-8 lg:p-10 shadow-card border border-border/40 hover:shadow-elevated transition-shadow duration-300", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx(TrendingUp, { className: "h-7 w-7 text-primary-foreground" }) }),
          /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl lg:text-3xl font-bold text-foreground mb-4", children: "Growing an Existing Practice" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-6", children: "For practice leaders looking to gain an objective view of operations, improve performance, modernize systems, and position their practice for sustainable growth." }),
          /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", asChild: true, className: "whitespace-normal h-auto py-3 text-center leading-snug", children: /* @__PURE__ */ jsxs(Link, { to: "/solutions/existing-clinics", children: [
            "Explore Existing Practice Solutions ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4 shrink-0" })
          ] }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-section", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Full-Cycle Capabilities" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "Comprehensive expertise across healthcare strategy." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground text-lg leading-relaxed max-w-3xl", children: "Vitalis brings deep capability across the full spectrum of healthcare strategy consulting — supporting organizations through every challenge and opportunity." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6", children: capabilities.map((cap, i) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.05 }, className: "bg-card rounded-2xl p-6 shadow-soft border border-border/40 hover:shadow-card transition-shadow duration-300", children: [
        /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(cap.icon, { className: "h-5 w-5 text-primary" }) }),
        /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground mb-2", children: cap.title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: cap.description })
      ] }, cap.title)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Types of Practices We Work With" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground mb-4", children: "Healthcare practices of all types." }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Vitalis supports practitioners and organizations across a range of practice types and clinical specialties throughout Calgary and across Canada." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: practiceTypes.map((type, i) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, x: 15 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { delay: i * 0.06 }, className: "bg-card rounded-xl px-6 py-4 shadow-soft border border-border/40 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(BarChart3, { className: "h-4 w-4 text-accent flex-shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: type })
      ] }, type)) })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-section", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Organizations We Support" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "From private practices to public systems." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground text-lg leading-relaxed max-w-3xl", children: "Vitalis supports a range of healthcare organizations through practical, coordinated advisory engagements." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-6", children: organizations.map((org, i) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.08 }, className: "bg-card rounded-2xl p-7 shadow-soft border border-border/40", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5", children: /* @__PURE__ */ jsx(org.icon, { className: "h-6 w-6 text-primary" }) }),
        /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-3", children: org.title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: org.description })
      ] }, org.title)) })
    ] }) }),
    /* @__PURE__ */ jsx(MnASection, {}),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl text-center", children: /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx(Target, { className: "h-12 w-12 text-accent mx-auto mb-6" }),
      /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground mb-6", children: "Full-lifecycle advisory partnership." }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto", children: "Many organizations retain Vitalis as a long-term strategic advisor — providing ongoing guidance as their organization grows, evolves, and navigates new challenges." }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
        /* @__PURE__ */ jsx(Button, { variant: "hero", size: "xl", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
          "Speak With Our Team ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
        ] }) }),
        /* @__PURE__ */ jsx(Button, { variant: "hero", size: "xl", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment", children: [
          "Start Your Strategic Assessment ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
        ] }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  Solutions as default
};

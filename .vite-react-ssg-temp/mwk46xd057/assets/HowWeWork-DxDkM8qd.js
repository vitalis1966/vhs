import { jsx, jsxs } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Footer } from "./Footer-DArsv4kV.js";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { B as Button } from "./button-DnzOxZqg.js";
import { Building, TrendingUp, Handshake, ArrowRight } from "lucide-react";
import { u as usePageMeta } from "./seo-sReVioJD.js";
import "react";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./PageSEOContext-DZ23I7UH.js";
const pathways = [
  {
    id: "journey-building",
    icon: Building,
    number: "01",
    eyebrow: "Planning & Building",
    title: "Planning & Building",
    description: "You are preparing to open a new medical clinic, dental office, or veterinary facility. You want experienced guidance on the operational, regulatory, and financial decisions that come before opening day — so you are set up for a strong start, not an expensive learning curve.",
    services: [
      "Practice feasibility analysis and financial planning",
      "Regulatory and compliance navigation for your practice type",
      "Facility design input and equipment procurement guidance",
      "Recruitment support and staffing structure planning",
      "Operational setup and pre-opening staff preparation"
    ],
    cta: "See How We Support New Builds →",
    href: "/solutions/new-clinics"
  },
  {
    id: "journey-operating",
    icon: TrendingUp,
    number: "02",
    eyebrow: "Operating & Growing",
    title: "Operating & Growing",
    description: "You have an established practice and want an objective view of how it is performing. Whether it is a billing gap, an operational bottleneck, or a growth opportunity you have not been able to act on yet — a structured assessment can help you see where to focus.",
    services: [
      "Billing and fee collection review",
      "Workflow and scheduling analysis",
      "Staffing structure and cost review",
      "Growth planning: new service lines, additional practitioners, additional locations",
      "Practice management technology and digital tools review"
    ],
    cta: "Start Performance Assessment →",
    href: "/strategic-assessment"
  },
  {
    id: "journey-transitioning",
    icon: Handshake,
    number: "03",
    eyebrow: "Scaling or Transitioning",
    title: "Scaling or Transitioning",
    description: "You are thinking about adding a location, restructuring a partnership, bringing in new leadership, or navigating a significant operational change. You want a consulting team that understands how these decisions play out inside a real practice.",
    services: [
      "Practice expansion and multi-location strategy",
      "Practitioner recruitment and succession planning",
      "Financial restructuring and long-term planning",
      "Mergers, acquisitions, and partnership strategy",
      "Ongoing strategic advisory support"
    ],
    cta: "Connect With an Advisor →",
    href: "/contact"
  }
];
function HealthcarePathwaysSection() {
  return /* @__PURE__ */ jsx("section", { id: "journey-section", className: "py-24 lg:py-32 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        className: "max-w-3xl mb-16",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
            /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Your Healthcare Journey" })
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight", children: "Where is your practice right now?" }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 text-muted-foreground text-lg leading-relaxed", children: "Based in Calgary, Vitalis Health Strategies works with practitioners and healthcare organizations across Canada at every stage — from planning a first practice to navigating growth, expansion, and long-term advisory." })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-3 gap-8 max-w-6xl", children: pathways.map((pathway, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        id: pathway.id,
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5, delay: i * 0.12 },
        className: "bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col group border border-border/40 border-l-4 border-l-primary",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-6", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors duration-300", children: /* @__PURE__ */ jsx(pathway.icon, { className: "h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" }) }),
            /* @__PURE__ */ jsx("span", { className: "font-display text-5xl font-bold text-muted-foreground/15 select-none", children: pathway.number })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-accent mb-2", children: pathway.eyebrow }),
          /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-4", children: pathway.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-6", children: pathway.description }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2.5 mb-8 flex-1", children: pathway.services.map((service) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2.5 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2" }),
            /* @__PURE__ */ jsx("span", { children: service })
          ] }, service)) }),
          /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", asChild: true, className: "w-full mt-auto whitespace-normal text-center h-auto py-3", children: /* @__PURE__ */ jsx(Link, { to: pathway.href, children: pathway.cta }) })
        ]
      },
      pathway.title
    )) })
  ] }) });
}
const phases = [
  { phase: "Vision & Concept", description: "We help you shape the idea — validating feasibility, defining the model, and aligning vision with market opportunity.", when: "Starting from scratch or pivoting direction." },
  { phase: "Strategic Planning", description: "Deep analysis, competitive positioning, financial modeling, and roadmap development to set the foundation.", when: "Before committing capital or launching." },
  { phase: "Build & Launch", description: "Facility planning, team assembly, operational setup, and go-to-market execution to bring the vision to life.", when: "Ready to build or about to open doors." },
  { phase: "Operations & Optimization", description: "Workflow refinement, systems integration, efficiency gains, and compliance to run at peak performance.", when: "Open and seeking operational excellence." },
  { phase: "Revenue & Growth", description: "Revenue cycle optimization, pricing strategy, market expansion, and sustainable growth acceleration.", when: "Established and ready to scale." },
  { phase: "Team & Recruitment", description: "Practitioner and staff recruitment, culture building, succession planning, and workforce strategy.", when: "Growing the team or planning transitions." },
  { phase: "Scale & Expand", description: "Multi-location strategy, partnerships, geographic expansion, and portfolio development.", when: "Proven model ready for replication." },
  { phase: "Transition & Advisory", description: "M&A preparation, valuation support, deal structuring, buyer/partner identification, and leadership transitions.", when: "Planning a merger, acquisition, or leadership transition." }
];
const HowWeWork = () => {
  usePageMeta(
    "How We Work | Full-Lifecycle Healthcare Consulting | Vitalis Health Strategies",
    "From vision through long-term advisory — Vitalis supports healthcare practices through every stage of growth with structured, accountable consulting.",
    "/og-how-we-work.jpg"
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "flex items-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Our Method" })
      ] }),
      /* @__PURE__ */ jsxs(motion.h1, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight", children: [
        "The full lifecycle,",
        /* @__PURE__ */ jsx("br", {}),
        "one strategic partner."
      ] }),
      /* @__PURE__ */ jsxs(motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl", children: [
        "Most advisory firms see a slice. We see the entire arc of a healthcare practice — and that perspective makes every recommendation sharper, every decision better informed, and every outcome more valuable. Our ",
        /* @__PURE__ */ jsx(Link, { to: "/about", className: "text-primary hover:text-foreground underline underline-offset-2 transition-colors", children: "clinician-led team" }),
        " brings operational experience to every phase. Start with a ",
        /* @__PURE__ */ jsx(Link, { to: "/strategic-assessment", className: "text-primary hover:text-foreground underline underline-offset-2 transition-colors", children: "strategic assessment" }),
        " to find the right starting point."
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(HealthcarePathwaysSection, {}),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: /* @__PURE__ */ jsx("div", { className: "space-y-0", children: phases.map((p, i) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 15 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.4, delay: i * 0.05 }, className: "grid lg:grid-cols-[200px_1fr] gap-6 py-10 border-b border-border last:border-b-0", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("span", { className: "font-display text-sm font-semibold text-accent uppercase tracking-wider", children: [
          "Phase ",
          i + 1
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground mt-1", children: p.phase })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: p.description }),
        /* @__PURE__ */ jsxs("p", { className: "mt-3 text-sm text-muted-foreground/70 italic", children: [
          "Best for: ",
          p.when
        ] })
      ] })
    ] }, p.phase)) }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-section text-center", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "Where is your practice right now?" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground text-lg", children: "Let's find the right starting point — together." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col sm:flex-row justify-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
          "Speak With Our Team ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ] }) }),
        /* @__PURE__ */ jsx(Button, { variant: "hero-outline", size: "lg", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/strategic-assessment", children: "Start Your Strategic Assessment" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  HowWeWork as default
};

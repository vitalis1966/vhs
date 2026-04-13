import { jsxs, jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { L as Link } from "./index-CalXArNJ.js";
import { B as Button } from "./button-DnzOxZqg.js";
import { u as usePageMeta } from "./seo-sReVioJD.js";
import { J as JsonLd, a as buildServiceSchema, b as buildBreadcrumbSchema } from "./JsonLd-VGPEamnK.js";
import { N as Navbar } from "./Navbar-DZHwhlEF.js";
import { Footer } from "./Footer-vLUE6RrN.js";
import { ArrowRight, CheckCircle, DollarSign, Building2, TrendingDown, UserPlus, ClipboardList, CircleDollarSign, Calendar, Users, Monitor, TrendingUp, Handshake, Smile, Scissors, Baby, Settings, Briefcase, Shield, MapPin } from "lucide-react";
import "react";
import "react-dom";
import "react-router";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "./PageSEOContext-DZ23I7UH.js";
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};
const heroStats = [
  { stat: "General & Specialty Dentistry", context: "From solo GPs to multi-location groups" },
  { stat: "New Builds & Established Practices", context: "Every stage of your practice's lifecycle" },
  { stat: "Calgary & Edmonton Markets", context: "Alberta-focused with national reach" },
  { stat: "ADA+C & Provincial Expertise", context: "Regulatory and billing context built in" }
];
const challenges = [
  {
    icon: DollarSign,
    title: "Revenue Is Systematically Under-Captured",
    body: "Dental practices across Canada routinely leave 8–15% of collectible revenue uncaptured — across insurance carriers, fee schedules, and patient billing. The gaps are systematic, not random, and compound quietly until identified by an independent review."
  },
  {
    icon: Building2,
    title: "Corporate Consolidation Is Accelerating",
    body: "DSOs and corporate dental groups are acquiring independent practices across Alberta, BC, and Ontario. Dentists who don't understand what drives their practice's valuation are negotiating from incomplete information."
  },
  {
    icon: TrendingDown,
    title: "Growth Without a Plan Costs More Than It Earns",
    body: "Adding an operatory, associate, or second location without financial modeling and operational preparation is how dental practices create financial strain. Every expansion decision has infrastructure, staffing, and cash flow implications that must be modeled first."
  },
  {
    icon: UserPlus,
    title: "Associate Recruitment Is a Market Problem",
    body: "Alberta's dental associate market is competitive — new graduates have more options than previous generations. Practices that can't clearly articulate their value proposition and compensation structure lose recruiting competitions they could have won."
  }
];
const services = [
  { icon: ClipboardList, title: "Strategic Assessment", body: "Independent review across revenue collection, scheduling utilization, overhead ratios, staffing structure, technology, and growth readiness." },
  { icon: Building2, title: "New Dental Office Builds", body: "Financial modeling, site selection, dental-specific facility planning, ADA+C compliance, practice management software setup, and launch preparation." },
  { icon: CircleDollarSign, title: "Billing & Fee Collection", body: "Systematic review of every revenue stream — insurance carriers, fee guide alignment, coordination of benefits, and patient billing — to find and close collection gaps." },
  { icon: Calendar, title: "Operations & Scheduling", body: "Operatory utilization, hygiene productivity, appointment mix, and patient flow — redesigned to run at capacity without adding space." },
  { icon: Users, title: "Associate Recruitment", body: "Finding the right associates, structuring compensation fairly, and building the partnership track that retains them long term." },
  { icon: Monitor, title: "Practice Technology", body: "Practice management software selection (Dentrix, Eaglesoft, Tracker, ABELDent, Curve), digital X-ray integration, patient communication, and online booking." },
  { icon: TrendingUp, title: "Growth & Multi-Location", body: "Second locations, new service lines, and multi-site operations — planned financially and built operationally before you open." },
  { icon: Handshake, title: "M&A & Transitions", body: "Dental practice valuation, acquisition advisory, DSO negotiation support, partner buyout structuring, and associate buy-in planning." }
];
const practiceTypes = [
  { icon: Smile, title: "General Family Dentistry", body: "Solo and group practices across Canada" },
  { icon: Scissors, title: "Oral Surgery & OMS", body: "Surgical and sedation practices" },
  { icon: Baby, title: "Pediatric Dentistry", body: "Specialized facility, staffing, and patient experience" },
  { icon: Building2, title: "Multi-Location Dental Groups", body: "2–10 location organizations" },
  { icon: Settings, title: "Orthodontics & Specialty", body: "Ortho, endo, perio, prostho practices" },
  { icon: Briefcase, title: "Dental Corporations & DSO-Track", body: "Positioning for corporate structure or acquisition" }
];
const regulatoryFeatures = [
  { icon: Shield, title: "Alberta Dental Association and College (ADA+C)", body: "Regulates dental practice in Alberta, setting standards for facility, equipment, and professional conduct. Vitalis helps practices understand the operational implications — particularly for multi-location and corporate structures." },
  { icon: DollarSign, title: "Alberta Blue Cross & the Fee Guide", body: "Alberta dental practices bill primarily through insurance carriers against the ADA suggested fee guide. Understanding when and how to price above guide — and ensuring claim accuracy — is one of the most direct revenue levers." },
  { icon: MapPin, title: "Calgary & Edmonton Real Estate", body: "Commercial dental space costs have increased significantly in both markets. Newer community developments and growth corridors present strong new-build opportunities with favourable demographics." }
];
const financialStats = [
  { value: "$600K – $1.2M", label: "Typical New Dental Office Buildout", detail: "Varies by operatory count, location, leasehold improvement requirements, and equipment specification. This is the capital commitment before your first patient arrives." },
  { value: "8–15%", label: "Typical Fee Collection Gap", detail: "Across insurance billing errors, missed pre-authorizations, and outdated fee schedules. Most practices don't know this gap exists until an independent review finds it." },
  { value: "18–24 months", label: "Typical Break-Even Timeline", detail: "For a new 6-operatory Calgary dental practice. Influenced by startup patient volume, hygiene utilization, associate productivity, and overhead structure." }
];
const caseStudies = [
  { tag: "NEW BUILD · CALGARY SE", headline: "8-operatory practice opened within timeline", body: "Dentist moving from associate to ownership. Vitalis provided site selection, financial modeling, and buildout coordination. Opened within 14 months." },
  { tag: "REVENUE · EDMONTON", headline: "12% fee collection improvement within 60 days", body: "Billing workflow and fee schedule changes after revenue assessment resulted in 12% net collection improvement within 60 days." },
  { tag: "MULTI-SITE · ALBERTA", headline: "Expansion from 2 to 4 locations — structured for scale", body: "Dental group with two Calgary locations. Vitalis planned expansion including financial modeling, site criteria, and practice management system migration." }
];
const newPracticeServices = [
  "Dental practice feasibility analysis and Calgary/Edmonton market assessment",
  "Financial modeling: buildout costs, equipment procurement, staffing, and break-even timeline",
  "Site selection and lease negotiation for Alberta dental spaces",
  "Dental-specific facility planning: operatory count, sterilization, X-ray, mechanical",
  "ADA+C regulatory awareness and compliance planning",
  "Practice management software selection and setup",
  "Associate dentist recruitment for new practices"
];
const existingDimensions = [
  "Insurance claim accuracy across all carriers",
  "ADA fee schedule alignment and above-guide billing opportunities",
  "Hygiene chair utilization and re-appointment rates",
  "Operatory and dentist productivity analysis",
  "Overhead ratios across labour, lab, and supply costs",
  "Associate compensation model review",
  "Expansion readiness"
];
function Dental() {
  usePageMeta(
    "Dental Practice Consulting Canada | Calgary, Edmonton & Nationwide | Vitalis Health Strategies",
    "Vitalis Health Strategies provides comprehensive consulting for dental practices across Canada — with deep focus on Calgary and Edmonton. New office planning, revenue optimization, operations, technology, recruitment, expansion, and M&A advisory.",
    "/og-dental.jpg"
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(JsonLd, { data: buildServiceSchema("Dental Practice Consulting", "Strategic consulting for dental practices — planning, development, operations, and growth advisory.", "/solutions/dental") }),
    /* @__PURE__ */ jsx(JsonLd, { data: buildBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }, { name: "Dental", path: "/solutions/dental" }]) }),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("section", { className: "relative bg-gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-20 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" }),
      /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 relative z-10 max-w-5xl", children: [
        /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", animate: "visible", variants: fadeUp, transition: { duration: 0.5 }, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
            /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
            /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Dental Practices" })
          ] }),
          /* @__PURE__ */ jsxs("h1", { className: "font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight tracking-tight", children: [
            "Full-cycle consulting for dental practices —",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-gradient-primary italic", children: "from your first office to a multi-location group." })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 text-muted-foreground text-lg max-w-3xl leading-relaxed", children: "Vitalis works with general dentists, specialists, and dental organizations across Calgary, Edmonton, and Canada. We bring operational expertise and structured strategy to every stage of dental practice development — new builds, performance optimization, growth planning, technology, and ownership transitions." })
        ] }),
        /* @__PURE__ */ jsx(motion.div, { initial: "hidden", animate: "visible", variants: fadeUp, transition: { duration: 0.5, delay: 0.1 }, className: "mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3", children: heroStats.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border/30", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-foreground", children: s.stat }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: s.context })
        ] }, i)) }),
        /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", animate: "visible", variants: fadeUp, transition: { duration: 0.5, delay: 0.2 }, className: "mt-8 flex flex-col sm:flex-row gap-4", children: [
          /* @__PURE__ */ jsx(Button, { variant: "hero", size: "xl", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment", children: [
            "Start Your Practice Assessment ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
          ] }) }),
          /* @__PURE__ */ jsx(Button, { variant: "hero-outline", size: "xl", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
            "Speak With Our Team ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Where Are You?" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight", children: "Every engagement starts with one question." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true },
            variants: fadeUp,
            transition: { duration: 0.5 },
            className: "rounded-2xl bg-card border-2 border-border p-8 lg:p-10 flex flex-col shadow-elevated",
            children: [
              /* @__PURE__ */ jsx("span", { className: "inline-block text-xs font-semibold tracking-widest uppercase text-forest bg-forest/10 px-3 py-1 rounded-full w-fit mb-4", children: "Opening a New Practice" }),
              /* @__PURE__ */ jsx("h3", { className: "font-display text-xl lg:text-2xl font-bold text-foreground mb-4", children: "A dental office is one of the most capital-intensive businesses a dentist will ever open. The financial model determines whether it succeeds." }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed mb-6", children: "A 10-operatory general dental office in Calgary or Edmonton typically requires $600,000 to $1.2M in leasehold improvements and equipment before the first patient arrives. The site you choose, the lease terms you sign, and the financial structure you build around that investment set the ceiling for the practice's financial performance for years." }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-2 mb-8 flex-grow", children: newPracticeServices.map((s, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-accent flex-shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsx("span", { children: s })
              ] }, i)) }),
              /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", className: "w-full whitespace-normal h-auto py-3 text-center leading-snug", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment", children: [
                "Start Your Build Strategy Assessment ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5 shrink-0" })
              ] }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true },
            variants: fadeUp,
            transition: { duration: 0.5, delay: 0.1 },
            className: "rounded-2xl bg-card border-2 border-border p-8 lg:p-10 flex flex-col shadow-elevated",
            children: [
              /* @__PURE__ */ jsx("span", { className: "inline-block text-xs font-semibold tracking-widest uppercase text-accent bg-accent/10 px-3 py-1 rounded-full w-fit mb-4", children: "Optimizing an Established Practice" }),
              /* @__PURE__ */ jsx("h3", { className: "font-display text-xl lg:text-2xl font-bold text-foreground mb-4", children: "Revenue per chair. Hygiene utilization. Fee schedule alignment. These are the numbers that tell the real story of your practice." }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed mb-6", children: "Most established dental practices have at least one systematic revenue or operational gap that compounds quietly. An independent performance review identifies exactly where that gap is and what it would take to close it — without disrupting clinical operations or patient relationships." }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-2 mb-8 flex-grow", children: existingDimensions.map((s, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-accent flex-shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsx("span", { children: s })
              ] }, i)) }),
              /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", className: "w-full whitespace-normal h-auto py-3 text-center leading-snug", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment", children: [
                "Start Your Performance Assessment ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5 shrink-0" })
              ] }) })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-gradient-forest", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "The Challenges" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-primary-foreground tracking-tight", children: "The real challenges facing dental practices across Canada right now." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-6", children: challenges.map((c, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          variants: fadeUp,
          transition: { duration: 0.4, delay: i * 0.1 },
          className: "rounded-2xl bg-primary-foreground/95 p-7",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(c.icon, { className: "h-6 w-6 text-accent" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground mb-2", children: c.title }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: c.body })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-gradient-section", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Our Services" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight", children: "What Vitalis does for dental practices." }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-muted-foreground text-lg", children: "Every service is available as part of a full engagement or as a focused standalone advisory." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: services.map((s, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          variants: fadeUp,
          transition: { duration: 0.35, delay: i * 0.04 },
          className: "rounded-xl bg-card p-5 shadow-card hover:shadow-elevated transition-shadow duration-300 flex flex-col",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-3", children: /* @__PURE__ */ jsx(s.icon, { className: "h-5 w-5 text-primary" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-sm font-bold text-foreground mb-1.5", children: s.title }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs leading-relaxed", children: s.body })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-14 lg:py-20 bg-muted/40", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-3xl text-center", children: /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, children: [
      /* @__PURE__ */ jsx("p", { className: "font-display text-2xl lg:text-3xl font-bold text-foreground leading-snug tracking-tight italic", children: '"Your dental practice is a financial asset. Most dentists manage it like a clinical operation."' }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground text-sm", children: "An independent review changes what you can see — and what you can act on." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col sm:flex-row justify-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment", children: [
          "Start Your Practice Assessment ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
        ] }) }),
        /* @__PURE__ */ jsx(Button, { variant: "hero-outline", size: "lg", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Speak With Our Team" }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "The Numbers" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight", children: "Understanding the numbers behind a dental practice." }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground text-xs", children: "Illustrative figures only. Individual results vary significantly." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-6", children: financialStats.map((s, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          variants: fadeUp,
          transition: { duration: 0.4, delay: i * 0.1 },
          className: "rounded-2xl bg-card border border-border/60 p-8 text-center shadow-card",
          children: [
            /* @__PURE__ */ jsx("p", { className: "font-display text-3xl lg:text-4xl font-bold text-accent", children: s.value }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm font-semibold text-foreground uppercase tracking-wider", children: s.label }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground text-xs leading-relaxed", children: s.detail })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-gradient-section", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Dental Practice Engagements" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight", children: "A sample of what we've delivered." }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground text-sm", children: "Client details withheld." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-6", children: caseStudies.map((c, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          variants: fadeUp,
          transition: { duration: 0.4, delay: i * 0.1 },
          className: "rounded-2xl bg-card border-2 border-border p-8 shadow-elevated flex flex-col",
          children: [
            /* @__PURE__ */ jsx("span", { className: "inline-block text-xs font-bold tracking-wider uppercase text-accent mb-4", children: c.tag }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-3", children: c.headline }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: c.body })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-14 lg:py-20 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Dental Specialties" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl lg:text-3xl font-bold text-foreground tracking-tight", children: "Dental practices we work with." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-3 gap-4", children: practiceTypes.map((p, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          variants: fadeUp,
          transition: { duration: 0.3, delay: i * 0.04 },
          className: "flex items-start gap-3 p-4 rounded-lg",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(p.icon, { className: "h-4 w-4 text-primary" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-foreground", children: p.title }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: p.body })
            ] })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-14 lg:py-20 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Billing & Regulatory Context" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl lg:text-3xl font-bold text-foreground tracking-tight", children: "Alberta, BC, Ontario, and across Canada." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-5", children: regulatoryFeatures.map((f, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          variants: fadeUp,
          transition: { duration: 0.4, delay: i * 0.08 },
          className: "rounded-xl bg-card border border-border/60 p-6",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
              /* @__PURE__ */ jsx(f.icon, { className: "h-5 w-5 text-primary" }),
              /* @__PURE__ */ jsx("h3", { className: "font-display text-sm font-bold text-foreground", children: f.title })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs leading-relaxed", children: f.body })
          ]
        },
        i
      )) }),
      /* @__PURE__ */ jsx(
        motion.p,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          variants: fadeUp,
          transition: { duration: 0.5, delay: 0.3 },
          className: "mt-8 text-center text-muted-foreground text-xs italic",
          children: "In BC, CDSBC and the BC Dental Fee Guide apply. In Ontario, RCDSO governs practice standards. Vitalis brings regulatory awareness across all major provincial frameworks."
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-10 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true },
        variants: fadeUp,
        transition: { duration: 0.5 },
        className: "rounded-2xl bg-gradient-forest p-8 lg:p-12 text-center",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
            /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Dental Surgical Facilities" })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl lg:text-3xl font-bold text-primary-foreground mb-3", children: "Operating a dental surgical facility or planning one?" }),
          /* @__PURE__ */ jsx("p", { className: "text-primary-foreground/80 text-sm leading-relaxed max-w-2xl mx-auto mb-6", children: "Oral maxillofacial surgery facilities, dental surgical centres, and practices offering general anesthesia or deep sedation require CPSA NHSF accreditation. Vitalis provides dedicated advisory for dental surgical facility builds and compliance preparation." }),
          /* @__PURE__ */ jsx(Button, { variant: "gold", size: "lg", asChild: true, className: "whitespace-normal h-auto py-3 text-center leading-snug", children: /* @__PURE__ */ jsxs(Link, { to: "/solutions/nhsf", children: [
            "Explore Our Surgical Facility Advisory ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5 shrink-0" })
          ] }) })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-forest text-primary-foreground", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-3xl text-center", children: /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold tracking-tight", children: "Your dental practice is more than a clinical operation. It's a financial asset that deserves professional management." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-col sm:flex-row justify-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "gold", size: "xl", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment", children: [
          "Start Your Practice Assessment ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
        ] }) }),
        /* @__PURE__ */ jsx(Button, { size: "xl", className: "border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Speak With Our Team" }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  Dental as default
};

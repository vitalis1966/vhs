import { jsxs, jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { L as Link } from "./index-CalXArNJ.js";
import { B as Button } from "./button-DnzOxZqg.js";
import { u as usePageMeta } from "./seo-sReVioJD.js";
import { J as JsonLd, a as buildServiceSchema, b as buildBreadcrumbSchema } from "./JsonLd-VGPEamnK.js";
import { N as Navbar } from "./Navbar-DZHwhlEF.js";
import { Footer } from "./Footer-vLUE6RrN.js";
import { ArrowRight, CheckCircle, Building2, CircleDollarSign, UserPlus, TrendingUp, ClipboardList, Settings, Users, Monitor, Handshake, Search, ShieldCheck, ArrowLeftRight, PawPrint, Heart, Activity, Stethoscope, Briefcase, MapPin } from "lucide-react";
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
  { stat: "Small Animal · Mixed · Specialty", context: "Companion, mixed, and specialist practices" },
  { stat: "New Builds & Established Practices", context: "Every stage of your practice's lifecycle" },
  { stat: "Alberta & Western Canada", context: "Alberta-focused with national reach" },
  { stat: "ABVMA & CVBC Expertise", context: "Regulatory context built in" }
];
const challenges = [
  {
    icon: Building2,
    title: "Corporate Consolidation Is Reshaping the Market",
    body: "National consolidators — VCA, BluePearl, National Veterinary Associates — are actively acquiring independent practices across Alberta and BC. Independent owners who don't understand their practice's current valuation are entering these conversations unprepared."
  },
  {
    icon: CircleDollarSign,
    title: "Revenue Is More Complex Than the Invoice",
    body: "Veterinary revenue spans pet insurance, wellness plans, service bundles, specialist referral fees, and pharmacy — each requiring deliberate systems to capture. Most independent practices collect what they invoice without optimizing what or how they invoice."
  },
  {
    icon: UserPlus,
    title: "Veterinarian Shortage Is Real and Structural",
    body: "Canada has a well-documented shortage of veterinarians, particularly in rural and mixed-practice settings. Retention, compensation structure, and workplace culture are now practice management issues, not just HR issues."
  },
  {
    icon: TrendingUp,
    title: "Operational Growth Without Structure Breaks the Practice",
    body: "The jump from solo to multi-veterinarian clinic involves management, scheduling, compensation, and quality systems that weren't needed at smaller scale. Most practices attempt this organically — and discover the problems only after they've accumulated."
  }
];
const services = [
  { icon: ClipboardList, title: "Strategic Assessment", body: "Independent review across revenue, operations, staffing, technology, growth readiness, and competitive positioning." },
  { icon: Building2, title: "New Clinic Builds", body: "Feasibility analysis, financial modeling, site selection, ABVMA facility classification planning, practice management software, and associate recruitment." },
  { icon: CircleDollarSign, title: "Revenue Optimization", body: "Revenue per visit, wellness plan adoption, invoice accuracy, pharmaceutical pricing, and referral fees — reviewed across every stream." },
  { icon: Settings, title: "Operations & Workflow", body: "Scheduling, exam room utilization, patient flow, and technician role design — built to run efficiently as the practice grows." },
  { icon: Users, title: "Associate Recruitment", body: "Finding, compensating, and retaining the right veterinarians and RVTs — from search strategy through partnership structure." },
  { icon: Monitor, title: "Practice Technology", body: "Practice management software selection (ezyVet, Cornerstone, AVImark, Provet Cloud), imaging integration, inventory management, and client communication." },
  { icon: TrendingUp, title: "Growth & Expansion", body: "Second locations and multi-site growth — analyzed demographically, modeled financially, and built operationally." },
  { icon: Handshake, title: "M&A & Transitions", body: "Practice valuation, corporate acquisition advisory, associate buy-in structuring, partnership buyout planning, and transition preparation." }
];
const keyNumbers = [
  { stat: "$500K – $1.5M", label: "Typical New Clinic Capital Requirement", context: "Before opening day, depending on service scope, equipment specification, and facility size. Emergency and specialty facilities are considerably higher." },
  { stat: "8% → 31%", label: "Wellness Plan Adoption Improvement", context: "Achieved by a Vitalis client through restructured offering and front-desk protocols — within six months of engagement." },
  { stat: "40%", label: "EBITDA Improvement", context: "Delivered through a 12-month operational improvement program for a practice owner who had received a corporate acquisition approach." }
];
const acquisitionPoints = [
  { icon: Search, title: "Know Your Practice Value Before They Do", body: "Corporate buyers use EBITDA multiples to value veterinary practices. Understanding your current valuation — and what would improve it — before a buyer approaches changes the conversation entirely." },
  { icon: ShieldCheck, title: "Build Operational Strength Regardless", body: "Practices with strong revenue systems, clean documentation, and structured staffing command higher multiples — whether you intend to sell or not." },
  { icon: Users, title: "Your Team Is Your Asset", body: "Associate retention and culture are central to practice value. Compensation structures that retain your team protect the asset — and the patients." },
  { icon: ArrowLeftRight, title: "You Have More Options Than a Full Sale", body: "Associate buy-ins, partial sales, management service arrangements, and partnership structures are all alternatives. Vitalis helps you understand the financial implications of each." }
];
const caseStudies = [
  { tag: "NEW BUILD · CALGARY", headline: "7-exam-room companion animal clinic opened within budget", body: "Veterinarian transitioning from associate to ownership. Site selection, financial modeling, buildout coordination. Opened within 16 months and within 4% of budget." },
  { tag: "REVENUE · ALBERTA", headline: "Wellness plan adoption increased from 8% to 31%", body: "Restructuring wellness plan offering and front-desk presentation protocols resulted in adoption increasing from 8% to 31% within six months." },
  { tag: "ACQUISITION ADVISORY · WESTERN CANADA", headline: "Independent practice retained; valuation increased 40%", body: "Practice owner approached by corporate acquirer engaged Vitalis. 12-month operational improvement program increased EBITDA by 40%." }
];
const practiceTypes = [
  { icon: PawPrint, title: "Companion Animal General Practice", body: "Solo and group small animal practices across Canada" },
  { icon: Heart, title: "Mixed Practice — Large & Small Animal", body: "Rural and semi-rural Alberta serving companion animals and livestock" },
  { icon: Activity, title: "Emergency & Critical Care", body: "24-hour emergency facilities with surgical capability" },
  { icon: Stethoscope, title: "Specialty & Referral Practices", body: "Internal medicine, oncology, cardiology, ophthalmology, and surgical specialists" },
  { icon: Building2, title: "Multi-Location Veterinary Groups", body: "Independent organizations with multiple locations navigating scale" },
  { icon: Briefcase, title: "Corporate-Track & Acquisition-Ready", body: "Practices preparing for or evaluating acquisition approaches" }
];
const geoCards = [
  { title: "Calgary", body: "Calgary's high pet ownership rate and strong household income create above-average veterinary spending. Growth corridors in SE, SW, and NW Calgary have underpenetrated veterinary supply relative to companion animal population density." },
  { title: "Edmonton & Northern Alberta", body: "Edmonton's veterinary market is supported by large suburban communities and proximity to agricultural regions with mixed-practice demand. South Edmonton, Sherwood Park, and St. Albert remain strong companion animal markets." },
  { title: "Alberta & Western Canada", body: "Vitalis also works with veterinary practices in BC (CVBC), Saskatchewan (SVMA), Manitoba (MVMA), and Ontario (CVO) — with understanding of the specific regulatory and market context of each province." }
];
const newPracticeServices = [
  "Veterinary practice feasibility and market analysis",
  "Financial modeling: equipment, buildout, staffing, startup losses, break-even",
  "Facility planning: surgical suite, isolation ward, imaging, kennel",
  "ABVMA facility classification and standards compliance",
  "Site selection for Calgary, Edmonton, and regional Alberta",
  "Practice management software selection and setup",
  "Associate veterinarian recruitment strategy"
];
const existingDimensions = [
  "Revenue per client visit and average invoice benchmarks",
  "Wellness plan structure, pricing, and client adoption rates",
  "Scheduling utilization by appointment type and veterinarian",
  "RVT and assistant-to-revenue ratios",
  "Inventory and pharmaceutical cost controls",
  "Associate productivity and compensation alignment",
  "Valuation positioning"
];
function Veterinary() {
  usePageMeta(
    "Veterinary Practice Consulting Canada | Calgary, Edmonton & Nationwide | Vitalis Health Strategies",
    "Vitalis Health Strategies provides comprehensive consulting for veterinary practices across Canada — with deep focus on Calgary, Edmonton, and Alberta. New clinic builds, practice optimization, revenue, staffing, technology, expansion, and M&A advisory.",
    "/og-veterinary.jpg"
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(JsonLd, { data: buildServiceSchema("Veterinary Practice Consulting", "Strategic consulting for veterinary clinics — planning, development, operations, and growth advisory.", "/solutions/veterinary") }),
    /* @__PURE__ */ jsx(JsonLd, { data: buildBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }, { name: "Veterinary", path: "/solutions/veterinary" }]) }),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("section", { className: "relative bg-gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-20 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" }),
      /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 relative z-10 max-w-6xl", children: [
        /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", animate: "visible", variants: fadeUp, transition: { duration: 0.5 }, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
            /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Veterinary Practices" })
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight tracking-tight max-w-4xl", children: "Full-cycle strategic consulting for veterinary practices — from your first clinic to your eventual exit." }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 text-muted-foreground text-lg max-w-3xl leading-relaxed", children: "Vitalis works with companion animal practices, mixed practices, specialty clinics, and emergency facilities across Calgary, Edmonton, and western Canada. The same operational and financial expertise we bring to human healthcare practices — applied to the distinct realities of veterinary medicine." })
        ] }),
        /* @__PURE__ */ jsx(motion.div, { initial: "hidden", animate: "visible", variants: fadeUp, transition: { duration: 0.5, delay: 0.15 }, className: "mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3", children: heroStats.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border/30", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-foreground", children: s.stat }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: s.context })
        ] }, i)) }),
        /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", animate: "visible", variants: fadeUp, transition: { duration: 0.5, delay: 0.25 }, className: "mt-8 flex flex-col sm:flex-row gap-4", children: [
          /* @__PURE__ */ jsx(Button, { variant: "hero", size: "xl", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment", children: [
            "Start Your Practice Assessment ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
          ] }) }),
          /* @__PURE__ */ jsx(Button, { variant: "hero-outline", size: "xl", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Speak With Our Team" }) })
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
              /* @__PURE__ */ jsx("h3", { className: "font-display text-xl lg:text-2xl font-bold text-foreground mb-4", children: "The financial and operational decisions made before opening day determine the ceiling of your practice for years." }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed mb-6", children: "A new small animal clinic in Calgary or Edmonton typically requires $500,000 to $1.5M in capital before opening, depending on service scope and equipment specification. Emergency and specialty facilities are considerably higher. Understanding exactly what you are building, what it will cost, and what revenue model will support it — before you commit — is what separates a strong launch from a financial strain." }),
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
              /* @__PURE__ */ jsx("h3", { className: "font-display text-xl lg:text-2xl font-bold text-foreground mb-4", children: "Strong clinical reputation and strong financial performance are not the same thing. Both are achievable." }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed mb-6", children: "Revenue per visit, wellness plan penetration, scheduling utilization, associate productivity, and inventory cost control are the operational metrics that determine whether a veterinary practice is capturing its potential — or leaving it behind. Most practice owners know one or two of these numbers. Very few have a complete, independent view of all of them." }),
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
    /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-forest", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "The Challenges" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-primary-foreground tracking-tight", children: "What veterinary practice owners across Canada are navigating right now." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-6", children: challenges.map((c, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          variants: fadeUp,
          transition: { duration: 0.4, delay: i * 0.1 },
          className: "rounded-2xl bg-primary-foreground/95 p-8",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(c.icon, { className: "h-5 w-5 text-primary" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground mb-3", children: c.title }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: c.body })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Our Services" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight", children: "What Vitalis does for veterinary practices." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground text-lg max-w-3xl mx-auto", children: "The full range of advisory services — each one framed for the specific realities of veterinary medicine." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-5", children: services.map((s, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          variants: fadeUp,
          transition: { duration: 0.4, delay: i * 0.05 },
          className: "rounded-2xl bg-card p-6 shadow-card hover:shadow-elevated transition-shadow duration-300",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(s.icon, { className: "h-5 w-5 text-primary" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-base font-bold text-foreground mb-2", children: s.title }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: s.body })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-20 bg-sage-light", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl text-center", children: /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, children: [
      /* @__PURE__ */ jsx("p", { className: "font-display text-2xl lg:text-3xl font-bold text-foreground leading-snug tracking-tight", children: '"Independent veterinary practices are being acquired at a rate the market has never seen before. The ones that thrive — whether they sell or not — are built on strong operational and financial foundations."' }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground", children: "An independent assessment tells you where you stand." }),
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
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight", children: "Understanding the numbers behind a veterinary practice." }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-muted-foreground text-sm", children: "Illustrative figures only. Individual results vary significantly." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-6", children: keyNumbers.map((n, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          variants: fadeUp,
          transition: { duration: 0.4, delay: i * 0.1 },
          className: "rounded-2xl bg-card border border-border p-8 shadow-card text-center",
          children: [
            /* @__PURE__ */ jsx("p", { className: "font-display text-3xl lg:text-4xl font-bold text-accent mb-2", children: n.stat }),
            /* @__PURE__ */ jsx("p", { className: "font-display text-base font-semibold text-foreground mb-3", children: n.label }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: n.context })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-forest-light", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, className: "text-center mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "The Acquisition Wave" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-primary-foreground tracking-tight", children: "The corporate acquisition wave — what independent veterinary practice owners need to know." })
      ] }),
      /* @__PURE__ */ jsx(
        motion.p,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          variants: fadeUp,
          transition: { duration: 0.5, delay: 0.1 },
          className: "text-center text-primary-foreground/80 text-base mb-12 max-w-3xl mx-auto leading-relaxed",
          children: "Corporate veterinary consolidators have acquired a significant share of independent practices across Canada over the past decade. For independent owners, this creates both risk and opportunity — depending on how your practice is positioned."
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-6", children: acquisitionPoints.map((p, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          variants: fadeUp,
          transition: { duration: 0.4, delay: i * 0.1 },
          className: "rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20 p-8",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-primary-foreground/15 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(p.icon, { className: "h-5 w-5 text-primary-foreground" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-primary-foreground mb-3", children: p.title }),
            /* @__PURE__ */ jsx("p", { className: "text-primary-foreground/80 text-sm leading-relaxed", children: p.body })
          ]
        },
        i
      )) }),
      /* @__PURE__ */ jsx(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5, delay: 0.4 }, className: "mt-10 text-center", children: /* @__PURE__ */ jsx(Button, { variant: "gold", size: "lg", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
        "Speak With Our M&A Team ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Veterinary Practice Engagements" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight", children: "A sample of what we've delivered." }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-muted-foreground text-sm", children: "Client details withheld." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-6", children: caseStudies.map((c, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          variants: fadeUp,
          transition: { duration: 0.4, delay: i * 0.1 },
          className: "rounded-2xl bg-card border-2 border-border p-8 shadow-elevated",
          children: [
            /* @__PURE__ */ jsx("span", { className: "inline-block text-xs font-semibold tracking-wider uppercase text-accent mb-4", children: c.tag }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground mb-3", children: c.headline }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: c.body })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-20 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Veterinary Specialties" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight", children: "Veterinary practices we work with." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: practiceTypes.map((p, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          variants: fadeUp,
          transition: { duration: 0.3, delay: i * 0.05 },
          className: "flex items-start gap-4 p-4",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(p.icon, { className: "h-5 w-5 text-primary" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-display text-sm font-bold text-foreground", children: p.title }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: p.body })
            ] })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-20 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsx(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, className: "text-center mb-12", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Where We Work" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-10", children: geoCards.map((g, i) => /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.4, delay: i * 0.1 }, children: [
        /* @__PURE__ */ jsx(MapPin, { className: "h-6 w-6 text-accent mb-3" }),
        /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground mb-2", children: g.title }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: g.body })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-12 bg-muted/30", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true },
        variants: fadeUp,
        transition: { duration: 0.5 },
        className: "rounded-2xl bg-forest p-8 lg:p-12 text-center",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
            /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Surgical Facilities" })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl lg:text-3xl font-bold text-primary-foreground mb-4", children: "Planning a veterinary surgical or specialty facility?" }),
          /* @__PURE__ */ jsx("p", { className: "text-primary-foreground/80 text-sm leading-relaxed max-w-3xl mx-auto mb-8", children: "Veterinary surgical facilities, specialty referral centres, and emergency facilities with surgical capability involve distinct planning, ABVMA classification requirements, equipment specification, and financial modeling compared to general companion animal practice. Vitalis provides dedicated advisory for veterinary surgical facility development." }),
          /* @__PURE__ */ jsx(Button, { variant: "gold", size: "lg", asChild: true, className: "whitespace-normal h-auto py-3 text-center leading-snug", children: /* @__PURE__ */ jsxs(Link, { to: "/solutions/nhsf", children: [
            "Explore Our Surgical Facility Advisory ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5 shrink-0" })
          ] }) })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-forest", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-3xl text-center", children: /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-primary-foreground tracking-tight", children: "You built your practice around clinical excellence. Vitalis helps you build the business infrastructure that makes it sustainable." }),
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
  Veterinary as default
};

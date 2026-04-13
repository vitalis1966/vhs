import { jsxs, jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { L as Link } from "./index-CalXArNJ.js";
import { B as Button } from "./button-DnzOxZqg.js";
import { u as usePageMeta } from "./seo-sReVioJD.js";
import { J as JsonLd, a as buildServiceSchema, b as buildBreadcrumbSchema } from "./JsonLd-VGPEamnK.js";
import { N as Navbar } from "./Navbar-DZHwhlEF.js";
import { Footer } from "./Footer-vLUE6RrN.js";
import { ArrowRight, CheckCircle, DollarSign, UserPlus, Settings, TrendingUp, ClipboardList, Building2, CircleDollarSign, Users, Monitor, Handshake, Stethoscope, Activity, Eye, Bone, Heart, Brain, Shield, FileText, MapPin } from "lucide-react";
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
  { stat: "Family Medicine to Complex Specialty", context: "GPs, specialists, and surgical groups across Canada" },
  { stat: "New Builds & Established Practices", context: "Every stage of your practice's lifecycle" },
  { stat: "Calgary · Edmonton · Across Canada", context: "Alberta-focused with national reach" },
  { stat: "CPSA & AHS Expertise", context: "Regulatory and billing context built in" }
];
const challenges = [
  {
    icon: DollarSign,
    title: "Revenue Complexity",
    body: "Medical practices in Canada navigate a layered revenue environment — AHCIP, shadow billing, WCB, MVA, and uninsured services each with distinct requirements. Most clinics are under-collecting across one or more streams without knowing where the gap is."
  },
  {
    icon: UserPlus,
    title: "Physician Recruitment",
    body: "Canada's physician shortage hits Alberta hard — even Calgary and Edmonton practices struggle to recruit associates who fit their model. The problem is partly structural, not just market-driven."
  },
  {
    icon: Settings,
    title: "Operational Systems",
    body: "Most clinics were built around clinical expertise, not an operational blueprint. When volume grows or a physician leaves, those informal systems break."
  },
  {
    icon: TrendingUp,
    title: "Growth Planning",
    body: "Adding a physician, service line, or location requires financial modeling, regulatory navigation, and operational redesign — not just clinical capacity. Practices that skip this discover the costs first."
  }
];
const services = [
  { icon: ClipboardList, title: "Strategic Assessment", body: "Independent review across revenue, operations, staffing, growth readiness, and compliance." },
  { icon: Building2, title: "New Practice Builds", body: "Site selection, financial modeling, facility design, CPSA compliance, EMR selection, and operational launch preparation." },
  { icon: CircleDollarSign, title: "Revenue Cycle & Billing", body: "Independent review of every revenue stream — AHS, shadow billing, uninsured services, and third-party billing — to recover what's being left behind." },
  { icon: Settings, title: "Operations & Workflow", body: "Scheduling, patient flow, staff role design, and administrative systems — optimized to run the practice efficiently at any volume." },
  { icon: Users, title: "Physician Recruitment", body: "Finding, structuring, and retaining the right physicians — from search strategy through compensation design and partnership planning." },
  { icon: Monitor, title: "Technology & EMR", body: "EMR selection (Med Access, CHR, OSCAR, PS Suite, Wolf), scheduling systems, practice management software, and digital workflow optimization." },
  { icon: TrendingUp, title: "Growth & Expansion", body: "New service lines, additional locations, and multi-physician growth — modeled financially and built operationally before you commit." },
  { icon: Handshake, title: "M&A & Transitions", body: "Valuations, acquisitions, partnership restructuring, and succession planning — for practices at every stage of ownership change." }
];
const practiceTypes = [
  { icon: Stethoscope, title: "Family Medicine & Primary Care", body: "Solo GPs, group practices, walk-in clinics" },
  { icon: Activity, title: "Internal Medicine", body: "General internists and sub-specialists" },
  { icon: Eye, title: "Dermatology", body: "Medical and cosmetic dermatology, procedural facilities" },
  { icon: Bone, title: "Orthopedics & Musculoskeletal", body: "Orthopedic surgery and musculoskeletal clinics" },
  { icon: Eye, title: "Ophthalmology", body: "Ophthalmology clinics and surgical practices" },
  { icon: Activity, title: "Sports Medicine & Rehab", body: "Multidisciplinary, WCB and MVA billing" },
  { icon: Heart, title: "Women's Health & OB/GYN", body: "Obstetrics, gynecology, women's health" },
  { icon: Brain, title: "Mental Health & Psychiatry", body: "Psychiatric practices and mental health clinics" }
];
const regulatoryFeatures = [
  { icon: Shield, title: "Alberta Health Care Insurance Plan", body: "Physician billing through AHCIP covers insured services via a fee-for-service schedule. Billing accuracy and claim timing directly affect collection rates." },
  { icon: FileText, title: "CPSA Registration & Facility Standards", body: "All Alberta medical clinics must register with CPSA. Facilities performing procedures beyond general practice may require additional accreditation." },
  { icon: DollarSign, title: "Shadow Billing & Uninsured Services", body: "Many Alberta physicians offer both insured and uninsured services. Structuring fee schedules and ensuring billing captures all appropriate revenue is where Vitalis consistently finds significant gaps." }
];
const geoCards = [
  { title: "Calgary", body: "Established inner-city clinics, rapidly growing suburban communities, and specialized surgical centres. Growth corridors in SE, NE, and NW Calgary present strong opportunities." },
  { title: "Edmonton & Northern Alberta", body: "Strong medical practice market anchored by proximity to Alberta's largest hospitals and research institutions. Northern communities face significant physician shortages." },
  { title: "Rural Alberta & Across Canada", body: "Rural practices face unique challenges including physician recruitment and limited specialist access. Vitalis also works with practices in BC, Saskatchewan, Manitoba, and Ontario." }
];
const processSteps = [
  { num: "01", title: "Assessment", body: "Independent strategic review of your practice." },
  { num: "02", title: "Strategic Plan", body: "Custom roadmap built on findings." },
  { num: "03", title: "Implementation", body: "Hands-on execution alongside your team." },
  { num: "04", title: "Ongoing Advisory", body: "Continuous improvement and support." }
];
const caseStudies = [
  { tag: "REVENUE CYCLE · CALGARY", headline: "28% improvement in net collections", body: "Multi-physician primary care clinic. AHS billing gaps and uncaptured uninsured service revenue. 28% net collections improvement without adding patients." },
  { tag: "NEW BUILD · EDMONTON", headline: "Specialist clinic opened on schedule and within budget", body: "Multi-physician clinic, feasibility through opening day within 14-month window." },
  { tag: "OPERATIONS · ALBERTA", headline: "Scheduling redesign recovered 22% of unused OR time", body: "Surgical practice operational assessment. Scheduling redesign recovered 22% unused procedure time within 60 days." }
];
const newPracticeServices = [
  "Practice feasibility analysis and Alberta market positioning",
  "Financial modeling: startup costs, operating expenses, break-even timeline",
  "Site selection and lease negotiation support",
  "CPSA facility registration and compliance planning",
  "EMR and practice technology selection",
  "Billing structure setup: AHS, shadow billing, uninsured services",
  "Staff recruitment and onboarding framework design"
];
const existingDimensions = [
  "AHS billing accuracy and claim performance",
  "Uninsured and third-party billing completeness",
  "Scheduling utilization and patient throughput",
  "Physician and staff productivity ratios",
  "CPSA compliance posture review",
  "Growth opportunity analysis"
];
function Medical() {
  usePageMeta(
    "Medical Clinic Consulting Canada | Calgary, Edmonton & Nationwide | Vitalis Health Strategies",
    "Vitalis Health Strategies provides end-to-end consulting for medical clinics across Canada — with deep focus on Calgary, Edmonton, and Alberta. New builds, revenue cycle, operations, recruitment, technology, and M&A advisory.",
    "/og-medical.jpg"
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(JsonLd, { data: buildServiceSchema("Medical Practice Consulting", "Strategic consulting for medical clinics — from new builds to operational optimization and growth advisory.", "/solutions/medical") }),
    /* @__PURE__ */ jsx(JsonLd, { data: buildBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }, { name: "Medical", path: "/solutions/medical" }]) }),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("section", { className: "relative bg-gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-20 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" }),
      /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 relative z-10 max-w-5xl", children: [
        /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", animate: "visible", variants: fadeUp, transition: { duration: 0.5 }, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
            /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
            /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Medical Practices" })
          ] }),
          /* @__PURE__ */ jsxs("h1", { className: "font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight tracking-tight", children: [
            "Full-cycle strategy for medical practices —",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-gradient-primary italic", children: "from first clinic to exit." })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 text-muted-foreground text-lg max-w-3xl leading-relaxed", children: "Vitalis works with family physicians, specialists, surgical groups, and multi-physician organizations across Calgary, Edmonton, and Canada. Whether you're opening a clinic, navigating a billing problem, trying to grow, or preparing for a transition — we have the operational and strategic experience to help." })
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
              /* @__PURE__ */ jsx("h3", { className: "font-display text-xl lg:text-2xl font-bold text-foreground mb-4", children: "Get the foundation right. It's harder to fix once you've opened." }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed mb-6", children: "Opening a medical clinic or specialist practice in Alberta involves CPSA registration, facility compliance, billing setup, technology selection, staffing, and a financial model — all before you see your first patient. Vitalis works with physicians from the earliest planning stages to opening day." }),
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
              /* @__PURE__ */ jsx("h3", { className: "font-display text-xl lg:text-2xl font-bold text-foreground mb-4", children: "Running well and running at your potential are not the same thing." }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed mb-6", children: "Established medical practices in Alberta typically have significant recoverable revenue and operational efficiency sitting untouched. A structured performance assessment gives you the objective picture your internal view cannot provide." }),
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
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-primary-foreground tracking-tight", children: "The challenges medical practice owners face — and what actually causes them." })
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
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight", children: "What Vitalis does for medical practices." }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-muted-foreground text-lg", children: "Every service is available as a standalone engagement or as part of a broader advisory relationship." })
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
      /* @__PURE__ */ jsx("p", { className: "font-display text-2xl lg:text-3xl font-bold text-foreground leading-snug tracking-tight italic", children: '"Your medical practice is a clinical asset and a business. It deserves strategy that treats it as both."' }),
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
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Medical Practice Engagements" })
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
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Specialties We Work With" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl lg:text-3xl font-bold text-foreground tracking-tight", children: "Medical practices across Canada." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: practiceTypes.map((p, i) => /* @__PURE__ */ jsxs(
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
          children: "Vitalis also works with practices in British Columbia (CPSBC), Ontario (CPSO), Saskatchewan, and Manitoba."
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-14 lg:py-20 bg-gradient-section", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsx(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, className: "text-center mb-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Where We Work" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-10", children: geoCards.map((g, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true },
          variants: fadeUp,
          transition: { duration: 0.4, delay: i * 0.08 },
          className: "text-center",
          children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-6 w-6 text-accent mx-auto mb-3" }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground mb-2", children: g.title }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: g.body })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, className: "text-center mb-14", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "How It Works" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight", children: "What working with Vitalis looks like." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative grid grid-cols-2 lg:grid-cols-4 gap-6", children: [
        /* @__PURE__ */ jsx("div", { className: "hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-0.5 bg-border" }),
        processSteps.map((s, i) => /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true },
            variants: fadeUp,
            transition: { duration: 0.4, delay: i * 0.1 },
            className: "relative flex flex-col items-center text-center",
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary font-bold text-sm z-10 mb-4", children: s.num }),
              /* @__PURE__ */ jsx("h3", { className: "font-display text-base font-bold text-foreground", children: s.title }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs mt-1", children: s.body })
            ]
          },
          i
        ))
      ] })
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
            /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Surgical Facilities" })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl lg:text-3xl font-bold text-primary-foreground mb-3", children: "Planning a surgical facility or procedural centre?" }),
          /* @__PURE__ */ jsx("p", { className: "text-primary-foreground/80 text-sm leading-relaxed max-w-2xl mx-auto mb-6", children: "If your practice involves surgical or procedural services that would qualify as a Non-Hospital Surgical Facility under CPSA accreditation, Vitalis provides dedicated advisory for that pathway. NHSF builds and accreditation preparation involve a separate regulatory and financial framework from standard medical clinic development." }),
          /* @__PURE__ */ jsx(Button, { variant: "gold", size: "lg", asChild: true, className: "whitespace-normal h-auto py-3 text-center leading-snug", children: /* @__PURE__ */ jsxs(Link, { to: "/solutions/nhsf", children: [
            "Explore Our NHSF & Surgical Facility Advisory ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5 shrink-0" })
          ] }) })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-forest text-primary-foreground", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-3xl text-center", children: /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: fadeUp, transition: { duration: 0.5 }, children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold tracking-tight", children: "Your medical practice is a clinical asset and a business. It deserves strategy that treats it as both." }),
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
  Medical as default
};

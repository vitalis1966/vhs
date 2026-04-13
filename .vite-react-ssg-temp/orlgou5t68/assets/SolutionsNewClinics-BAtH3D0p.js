import { jsxs, jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { N as Navbar } from "./Navbar-DZHwhlEF.js";
import { Footer } from "./Footer-vLUE6RrN.js";
import { motion } from "framer-motion";
import { L as Link } from "./index-CalXArNJ.js";
import { B as Button } from "./button-DnzOxZqg.js";
import { ArrowRight, Clock, DollarSign, Settings, CheckCircle, Shield, Building2, FileText, Lightbulb, Target, Monitor, Cog, Users, Rocket, Landmark, Scale, Home, Laptop2, ShieldCheck } from "lucide-react";
import { u as usePageMeta } from "./seo-sReVioJD.js";
import { useLocation } from "react-router";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "react-dom";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./PageSEOContext-DZ23I7UH.js";
const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };
const heroStats = [
  { stat: "25+ Facility Builds Supported", context: "From concept to opening day across Canada" },
  { stat: "Medical · Dental · Veterinary", context: "All practice types, all stages of development" },
  { stat: "Calgary & Edmonton Focus", context: "Deep local market knowledge with national reach" },
  { stat: "Concept to Opening Day", context: "Every planning dimension under one advisory relationship" }
];
const challengeCards = [
  { icon: Clock, title: "Timeline Surprises", body: "Regulatory approvals, construction delays, equipment lead times, and accreditation processes each have their own timelines — and they interact with each other. A 12-month plan frequently becomes 18 months when these aren't coordinated from the start." },
  { icon: DollarSign, title: "Cost Overruns", body: "Scope changes after design is complete, equipment specification mismatches, lease terms that don't account for buildout requirements, and working capital shortfalls are the most common sources of cost overrun. They are almost always preventable with proper upfront modeling." },
  { icon: Settings, title: "Operational Gaps at Launch", body: "Practices that open without functional billing systems, staffed leadership, documented workflows, and tested technology spend their first months reacting to operational fires instead of building patient relationships. First impressions set long-term trajectories." }
];
const feasibilityItems = [
  "Market analysis: patient demographics, competition, referral patterns, and unmet demand in Calgary, Edmonton, and target communities",
  "Practice model viability: service mix, capacity assumptions, and revenue per visit benchmarks",
  "Capital requirements: buildout estimates, equipment costs, working capital, and contingency modeling",
  "Break-even analysis: the patient volume and revenue required to cover operating costs and debt service",
  "Financing readiness: assessment of capital availability, lender requirements, and financing structure options",
  "Go/no-go decision framework: a structured summary of key risks, sensitivities, and decision factors"
];
const facilitySteps = [
  { title: "Site Selection & Lease Strategy", body: "Evaluating locations against patient demographics, accessibility, parking, zoning, and the specific mechanical and structural requirements of a healthcare facility. Reviewing lease terms for buildout allowances, exclusivity provisions, and renewal options." },
  { title: "Space Programming", body: "Defining room count, room types, sizes, and adjacency requirements for your clinical model — consultation rooms, procedure rooms, recovery, sterilization, reception, and staff areas — before the architect begins design." },
  { title: "Architect & Design Coordination", body: "Providing clinical workflow input during schematic and design development phases. Reviewing drawings for operational logic, patient flow, infection prevention compliance, and regulatory requirements specific to your province and practice type." },
  { title: "Equipment Planning & Procurement", body: "Specifying clinical equipment requirements, coordinating with equipment vendors, managing procurement timelines to align with construction completion, and ensuring equipment installation is sequenced with construction milestones." },
  { title: "Construction Oversight Support", body: "Working alongside your project manager or general contractor to monitor progress, flag scope changes with cost implications, coordinate equipment delivery and installation, and manage the punch list process toward handover." },
  { title: "Pre-Opening Operational Readiness", body: "Ensuring the facility is operationally ready before the first patient — systems tested, staff trained, workflows documented, signage and wayfinding in place, and all compliance requirements met." }
];
const regulatoryCards = [
  { icon: Shield, title: "Practice Registration & Licensing", body: "Physician, dental, and veterinary practice registration requirements across Canadian provinces. CPSA, ADA+C, ABVMA, CPSBC, CDSBC, CVBC, and other provincial regulatory body requirements mapped to your specific practice type and location." },
  { icon: Building2, title: "Facility Standards & Accreditation", body: "Physical facility standards including room specifications, ventilation, sterilization, infection prevention and control, signage, and accessibility requirements. NHSF and surgical facility accreditation preparation for practices performing designated procedures." },
  { icon: FileText, title: "Operational Compliance Frameworks", body: "Policy and procedure development, privacy legislation compliance (PIPA, PHIPA, PIPEDA), incident reporting structures, quality assurance documentation, and the ongoing compliance obligations that begin on opening day." }
];
const recruitmentItems = [
  "Role mapping: defining every position needed at launch and at each growth stage, with clear scope of responsibility and reporting relationships",
  "Compensation benchmarking: salary ranges, production-based models, benefits, and incentive structures for physicians, dentists, veterinarians, allied health, and administrative staff across Canadian markets",
  "Recruitment strategy: search approach, job descriptions, candidate evaluation frameworks, and onboarding plans for clinical and administrative roles",
  "Partnership and associate structures: physician, dentist, or veterinarian associate agreements, buy-in pathways, and governance arrangements for multi-practitioner practices"
];
const cultureItems = [
  "Behavioural profiling: using validated assessment tools to understand the working styles, communication preferences, and behavioural tendencies of leadership and key clinical staff — and designing team compositions that complement rather than conflict",
  "Values and culture definition: articulating the practice's core values, defining what those values look like in daily behaviour, and building them into hiring criteria and onboarding",
  "Leadership design: defining the leadership model for the practice — who makes what decisions, how conflicts are resolved, how performance is discussed — before situations arise that require these structures",
  "Communication frameworks: how the team meets, how decisions are communicated, how feedback flows between clinical and administrative staff, and how the practice owner stays connected to operational reality as the team grows",
  "Conflict and performance protocols: documented processes for managing underperformance, interpersonal conflict, and clinical concerns before they become staff turnover events"
];
const techItems = [
  "EMR platform selection: Med Access, OSCAR, CHR, PS Suite, Wolf for medical; Dentrix, Eaglesoft, ABELDent, Curve for dental; ezyVet, Cornerstone, Provet Cloud for veterinary — evaluated against your specific workflow, billing requirements, and reporting needs",
  "Practice management and scheduling: appointment booking, patient communication, online booking integration, and scheduling model design",
  "Billing infrastructure: AHS billing setup for Alberta physicians, insurance claim submission systems for dental, provincial health authority billing structures, and third-party billing for WCB, MVA, and uninsured services",
  "IT infrastructure: network architecture, hardware specification, cybersecurity requirements, backup systems, and telehealth integration",
  "Diagnostic equipment integration: imaging, lab, and diagnostic equipment data integration with the clinical record",
  "Vendor coordination: managing technology vendor timelines to align with construction and opening milestones"
];
const developmentStages = [
  { icon: Lightbulb, title: "Vision & Concept Development", description: "Clarify your vision for the practice. Define the patient population, service lines, competitive positioning, and long-term goals. Assess market opportunity and feasibility." },
  { icon: Target, title: "Strategic Planning", description: "Develop a comprehensive business plan including service mix, operational model, staffing structure, financial projections, and growth roadmap." },
  { icon: DollarSign, title: "Financial Structuring", description: "Model capital requirements, operating costs, and revenue projections. Work with financial partners to secure appropriate financing and establish sustainable economics." },
  { icon: Building2, title: "Facility Design & Architecture", description: "Coordinate with architects and designers to ensure facility layout supports clinical workflows, patient experience, regulatory requirements, and long-term operational needs." },
  { icon: Monitor, title: "Technology Infrastructure", description: "Plan technology systems including EMR selection, practice management software, diagnostic equipment integration, and IT infrastructure." },
  { icon: Cog, title: "Operational Design", description: "Design workflows, policies, procedures, and operational systems. Create patient flow models, scheduling frameworks, and quality assurance processes." },
  { icon: Users, title: "Staffing Models", description: "Define staffing requirements, organizational structure, compensation models, and recruitment strategies. Plan for leadership development and team culture." },
  { icon: Rocket, title: "Launch Preparation", description: "Prepare for operational readiness including staff training, system testing, marketing launch, and early operations support to ensure successful opening." }
];
const advisoryPartners = [
  { icon: Landmark, label: "Financial Institutions", description: "Capital planning, practice financing, and financial structuring" },
  { icon: Building2, label: "Architects & Designers", description: "Healthcare facility planning and design coordination" },
  { icon: Scale, label: "Legal Advisors", description: "Business structure, contracts, and regulatory compliance" },
  { icon: Home, label: "Real Estate Advisors", description: "Site selection, lease negotiation, and property acquisition" },
  { icon: Laptop2, label: "Technology Providers", description: "EMR systems, practice management, and IT infrastructure" }
];
const SolutionsNewClinics = () => {
  const location = useLocation();
  usePageMeta(
    "Practice Planning & Development | New Clinic Build Consulting Canada | Vitalis Health Strategies",
    "Vitalis Health Strategies guides medical, dental, and veterinary practices through every stage of planning and development — feasibility, financial modeling, facility design, regulatory compliance, people strategy, and technology setup across Canada.",
    "/og-new-clinics.jpg"
  );
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    }
  }, [location.hash]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "flex items-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Planning & Building" })
      ] }),
      /* @__PURE__ */ jsx(motion.h1, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight", children: "Everything that has to go right before you open your doors." }),
      /* @__PURE__ */ jsx(motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl", children: "Opening a medical clinic, dental practice, veterinary facility, or surgical centre involves dozens of interconnected decisions — most of which are difficult or expensive to reverse after the fact. Vitalis coordinates the full planning process, from the first feasibility question through to opening day readiness, across Canada." }),
      /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.25 }, className: "mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3", children: heroStats.map((s) => /* @__PURE__ */ jsxs("div", { className: "bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border/30", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-foreground", children: s.stat }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: s.context })
      ] }, s.stat)) }),
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "mt-8 flex flex-col sm:flex-row gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "hero", size: "xl", asChild: true, className: "whitespace-normal h-auto py-3 text-center leading-snug", children: /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment", children: [
          "Start Your Build Strategy Assessment ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5 shrink-0" })
        ] }) }),
        /* @__PURE__ */ jsx(Button, { variant: "hero", size: "xl", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
          "Speak With Our Team ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-16 max-w-3xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "The Planning Challenge" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "Most new practices take longer and cost more than planned. The reason is almost always the same." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground text-lg leading-relaxed", children: "The decisions that matter most get made without complete information — because most practitioners are navigating a new build for the first time." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-6", children: challengeCards.map((card, i) => /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: i * 0.08 }, className: "bg-card rounded-2xl p-7 shadow-soft border border-border/40", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5", children: /* @__PURE__ */ jsx(card.icon, { className: "h-6 w-6 text-primary" }) }),
        /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-3", children: card.title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: card.body })
      ] }, card.title)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { id: "feasibility", className: "py-20 lg:py-28 bg-muted/30 scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Practice Feasibility & Financial Planning" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground mb-4", children: "Before you sign anything — know whether the numbers work." }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg leading-relaxed max-w-3xl mb-12", children: "Practice feasibility is not just about whether a location exists or whether there is patient demand. It is about whether the specific practice model you have in mind — with its service mix, staffing requirements, facility size, and capital needs — can generate the revenue required to be financially sustainable. Vitalis conducts feasibility analyses that give practitioners a clear financial picture before they commit to a lease, a loan, or a construction contract." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-10", children: [
        /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: 0.1 }, children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-6", children: "What we assess" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: feasibilityItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-accent flex-shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground leading-relaxed", children: item })
          ] }, item)) })
        ] }),
        /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: 0.15 }, className: "bg-card rounded-2xl p-8 shadow-card border border-border/40 flex flex-col justify-center", children: [
          /* @__PURE__ */ jsx("p", { className: "font-display text-2xl lg:text-3xl font-bold text-foreground mb-4", children: "Most practitioners underestimate startup capital by 20–40%" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "This is the most consistent finding across new practice feasibility assessments — not because the costs are hidden, but because they are not all modeled together. Equipment, leasehold improvements, working capital, professional fees, pre-opening marketing, and staff training each appear manageable individually. Combined, they frequently exceed initial expectations significantly." }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/70 italic mt-4", children: "Illustrative figure based on Vitalis engagement experience. Individual results vary." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { id: "facility-design", className: "py-20 lg:py-28 bg-background scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, className: "mb-16 max-w-3xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Facility Development Support" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "The facility you design today determines how you practice for the next decade." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground text-lg leading-relaxed", children: "Facility design decisions — room count, layout, workflow adjacency, mechanical rough-in, and equipment placement — are among the most expensive to change after construction. Vitalis provides operational and clinical input into the design process alongside your architect, ensuring the facility you build supports how you actually intend to practice." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: facilitySteps.map((step, i) => /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: i * 0.06 }, className: "flex gap-6 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center flex-shrink-0", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm", children: String(i + 1).padStart(2, "0") }),
          i < facilitySteps.length - 1 && /* @__PURE__ */ jsx("div", { className: "w-px h-full bg-border/60 mt-2 min-h-[24px]" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-xl p-6 shadow-soft border border-border/40 flex-1", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground mb-2", children: step.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: step.body })
        ] })
      ] }, step.title)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { id: "regulatory", className: "py-20 lg:py-28 bg-gradient-section scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, className: "mb-16 max-w-3xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Regulatory & Compliance Guidance" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "Every province has its own rules. Getting them wrong costs more than getting them right." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground text-lg leading-relaxed", children: "Regulatory requirements for private healthcare facilities in Canada vary significantly by province, practice type, and scope of services. CPSA in Alberta, CPSBC in BC, CPSO in Ontario — each has its own registration, facility, and operational standards. Add dental regulatory bodies, veterinary colleges, and NHSF accreditation for surgical facilities, and the compliance picture becomes genuinely complex. Vitalis maps applicable regulatory requirements before your build begins — so compliance is designed in, not retrofitted." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-6", children: regulatoryCards.map((card, i) => /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: i * 0.08 }, className: "bg-card rounded-2xl p-7 shadow-soft border border-border/40", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5", children: /* @__PURE__ */ jsx(card.icon, { className: "h-6 w-6 text-primary" }) }),
        /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-3", children: card.title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: card.body })
      ] }, card.title)) }),
      /* @__PURE__ */ jsx(motion.div, { ...fadeUp, transition: { delay: 0.3 }, className: "mt-8 bg-primary/5 border border-primary/20 rounded-xl p-5", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: "Note:" }),
        " Vitalis does not provide legal or regulatory advice. We help practices understand the operational planning implications of applicable requirements and connect them with qualified legal and regulatory advisors where needed."
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { id: "people", className: "py-20 lg:py-28 bg-muted/40 scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, className: "mb-16 max-w-3xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "People Strategy" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "The practice you build is only as strong as the team you build it with." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground text-lg leading-relaxed", children: "Most new practice builds focus intensively on the physical and financial elements — and underinvest in the people infrastructure that will determine day-to-day performance from day one. Vitalis integrates people strategy into the planning process from the start — not as an afterthought." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: 0.1 }, className: "bg-card rounded-2xl p-7 shadow-soft border border-border/40", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-3", children: "Recruitment & Role Design" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-5", children: "Identifying the right roles, defining them clearly, and recruiting the right people into them are foundational to a practice that functions well from launch. Vitalis works with practices to define their staffing model before recruiting begins — ensuring the people you hire are hired into a structure that makes sense." }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: recruitmentItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-accent flex-shrink-0 mt-1" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground leading-relaxed", children: item })
          ] }, item)) })
        ] }),
        /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: 0.15 }, className: "bg-card rounded-2xl p-7 shadow-soft border border-border/40", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-3", children: "Culture, Behaviours & Team Design" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-5", children: "A practice's culture is set in its first months of operation. The norms, behaviours, and expectations that form early become self-reinforcing — positively or negatively. Vitalis helps practices design the cultural environment they want before the team assembles." }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: cultureItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-accent flex-shrink-0 mt-1" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground leading-relaxed", children: item })
          ] }, item)) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(motion.div, { ...fadeUp, transition: { delay: 0.25 }, className: "mt-8 bg-card rounded-2xl p-8 shadow-card border border-border/40 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto italic", children: '"The most common reason new practices struggle in their first year is not clinical quality or patient volume. It is people problems — turnover, role confusion, and cultural misalignment — that compound before anyone names them."' }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { id: "technology", className: "py-20 lg:py-28 bg-background scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, className: "mb-16 max-w-3xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Technology & Software Setup" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "Technology decisions made before opening are the ones you live with the longest." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground text-lg leading-relaxed", children: "EMR selection, practice management software, scheduling systems, billing platforms, diagnostic equipment integration, and IT infrastructure — each one involves a decision that is expensive to reverse. Vitalis helps practices make these decisions with complete information, ensuring the technology they launch with supports their clinical model and scales with their growth." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: 0.1 }, children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-6", children: "What we evaluate and advise on" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: techItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-accent flex-shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground leading-relaxed", children: item })
          ] }, item)) })
        ] }),
        /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: 0.15 }, className: "bg-card rounded-2xl p-8 shadow-card border border-border/40 flex flex-col justify-center", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl font-bold text-foreground mb-4", children: "EMR selection is a 5–10 year decision." }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Most practices spend more time choosing their coffee machine than their EMR. The right platform for your clinical model, your billing structure, and your reporting needs is not the same for every practice. Vitalis helps you ask the right questions before a vendor relationship begins — not after you are locked into a contract." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-section", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "The Development Journey" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "From concept to opening day — the full development journey." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground text-lg leading-relaxed max-w-3xl", children: "Practice development involves many interconnected decisions. Vitalis helps coordinate these elements so your practice is positioned for a strong start from day one." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6", children: developmentStages.map((stage, i) => /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: i * 0.05 }, className: "bg-card rounded-2xl p-6 shadow-soft border border-border/40 hover:shadow-card transition-shadow duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(stage.icon, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-accent", children: String(i + 1).padStart(2, "0") })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground mb-2", children: stage.title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: stage.description })
      ] }, stage.title)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Coordinated Advisory" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "Working with trusted partners." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground text-lg leading-relaxed max-w-3xl", children: "Practice development requires expertise across many domains. Vitalis works alongside you to coordinate strategic partners who specialize in critical areas." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-5 gap-4", children: advisoryPartners.map((partner, i) => /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: i * 0.06 }, className: "bg-card rounded-xl p-5 shadow-soft border border-border/40 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(partner.icon, { className: "h-6 w-6 text-primary" }) }),
        /* @__PURE__ */ jsx("h4", { className: "font-display text-sm font-bold text-foreground mb-1", children: partner.label }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: partner.description })
      ] }, partner.label)) }),
      /* @__PURE__ */ jsx("div", { className: "mt-10 text-center", children: /* @__PURE__ */ jsxs(Link, { to: "/partners", className: "inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-foreground transition-colors", children: [
        "Explore the strategic ecosystem ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-20 bg-muted/30", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl", children: /* @__PURE__ */ jsx(motion.div, { ...fadeUp, className: "bg-primary/5 border border-primary/20 rounded-2xl p-8 lg:p-10", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row items-start lg:items-center gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-7 w-7 text-primary" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Planning a surgical or procedural facility?" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Non-Hospital Surgical Facilities and Chartered Surgical Facilities have a distinct regulatory, design, and financial planning process from standard medical, dental, or veterinary practice builds. CPSA accreditation, provincial surgical facility standards, and AHS facility contracting each require specific planning expertise." })
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", asChild: true, className: "flex-shrink-0 whitespace-normal h-auto py-3 text-center leading-snug", children: /* @__PURE__ */ jsxs(Link, { to: "/solutions/nhsf", children: [
        "Explore NHSF Advisory ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4 shrink-0" })
      ] }) })
    ] }) }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-section", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl text-center", children: /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground mb-6", children: "The best time to get the planning right is before you have committed to anything." }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto", children: "Start with a structured build assessment — a clear-eyed review of your plans, your assumptions, and the gaps that could cost you time and capital if left unaddressed." }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
        /* @__PURE__ */ jsx(Button, { variant: "hero", size: "xl", asChild: true, className: "whitespace-normal h-auto py-3 text-center leading-snug", children: /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment", children: [
          "Start Your Build Strategy Assessment ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5 shrink-0" })
        ] }) }),
        /* @__PURE__ */ jsx(Button, { variant: "hero", size: "xl", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
          "Speak With Our Team ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
        ] }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  SolutionsNewClinics as default
};

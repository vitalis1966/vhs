import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useState, useCallback, useEffect } from "react";
import { N as Navbar } from "./Navbar-DZHwhlEF.js";
import { Footer } from "./Footer-vLUE6RrN.js";
import { motion } from "framer-motion";
import { L as Link } from "./index-CalXArNJ.js";
import { c as cn } from "./utils-H80jjgLf.js";
import { B as Button } from "./button-DnzOxZqg.js";
import { Landmark, MapPin, Scale, Ruler, Monitor, ShieldCheck, Building, CheckCircle, ArrowRight } from "lucide-react";
import { u as usePageMeta } from "./seo-sReVioJD.js";
import "react-router";
import "react-dom";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./PageSEOContext-DZ23I7UH.js";
const atbLogo = "/assets/atb-logo-xLxpPHwS.png";
const hollandLogo = "/assets/holland-logo-DTa3muNf.svg";
const ecosystemSpokes = [
  { icon: Landmark, label: "Financial Institutions", angle: 0 },
  { icon: MapPin, label: "Real Estate Advisors", angle: 60 },
  { icon: Scale, label: "Legal Advisors", angle: 120 },
  { icon: Ruler, label: "Architecture & Design", angle: 180 },
  { icon: Monitor, label: "Technology Providers", angle: 240 },
  { icon: ShieldCheck, label: "Insurance & Risk", angle: 300 }
];
const partnerCategories = [
  {
    icon: Building,
    title: "Financial Institutions",
    hook: "The capital behind every clinic build, acquisition, and growth move.",
    items: [
      "Healthcare lending & development financing",
      "Practice acquisition capital",
      "Financial restructuring & planning"
    ]
  },
  {
    icon: MapPin,
    title: "Real Estate Advisors",
    hook: "The right location changes everything. The wrong lease can cost you years.",
    items: [
      "Site selection & market analysis",
      "Lease negotiation & tenant advisory",
      "Property acquisition strategy"
    ]
  },
  {
    icon: Scale,
    title: "Legal Advisors",
    hook: "Business structure, governance, and transactions done right from the start.",
    items: [
      "Corporate structure & partnership agreements",
      "Regulatory & compliance guidance",
      "M&A and transaction support"
    ]
  },
  {
    icon: Ruler,
    title: "Architecture & Design",
    hook: "Clinical spaces that work for patients, practitioners, and regulators.",
    items: [
      "Healthcare facility planning & design",
      "Regulatory compliance & accreditation layouts",
      "Patient flow & operational efficiency"
    ]
  },
  {
    icon: Monitor,
    title: "Technology Providers",
    hook: "The systems your practice runs on — selected and implemented without the chaos.",
    items: [
      "EMR selection & implementation",
      "IT infrastructure & cybersecurity",
      "Digital health & practice management tools"
    ]
  },
  {
    icon: ShieldCheck,
    title: "Insurance & Risk",
    hook: "Every practice needs it. Few get it right without guidance.",
    items: [
      "Malpractice & professional liability",
      "Business interruption & property coverage",
      "Risk structure tailored to your practice type"
    ]
  }
];
const coordinationCards = [
  {
    title: "One conversation",
    body: "You speak to Vitalis. We brief every specialist on your goals, your constraints, and what everyone else is doing — so you never repeat yourself."
  },
  {
    title: "Shared context",
    body: "Your architect, banker, and lawyer all work from the same strategic plan. Decisions compound instead of conflict."
  },
  {
    title: "Aligned incentives",
    body: "Every specialist in the ecosystem is accountable to your outcome — not just their own deliverable. That changes how they show up."
  },
  {
    title: "No gaps, no surprises",
    body: "When specialists work in silos, things fall through the cracks. When Vitalis coordinates them, nothing does."
  }
];
const featuredPartners = [
  {
    category: "FINANCIAL PARTNER",
    name: "ATB Financial",
    subtitle: "Healthcare & Wealth",
    hook: "The financial institution that understands what it actually costs to build and run a healthcare practice.",
    description: "ATB's Healthcare and Wealth teams support physicians and healthcare organizations with financing, capital planning, and financial strategy. They understand the unique financial needs of healthcare ventures — from clinic development financing to practice acquisition and long-term wealth planning.",
    bullets: [
      "Clinic development financing",
      "Facility builds and expansion",
      "Financial restructuring",
      "Growth and acquisition planning"
    ],
    logo: atbLogo,
    logoAlt: "ATB Financial",
    externalUrl: "https://www.atb.com/business/borrowing/business-loans/professional-practice-financing/"
  },
  {
    category: "ARCHITECTURE & DESIGN",
    name: "Holland Design",
    subtitle: "Healthcare Environments & Facilities",
    hook: "The design team that knows clinical environments don't just need to look good — they need to work.",
    description: "Holland Design specializes in healthcare facility planning and design. They create clinical environments that balance patient experience, operational efficiency, regulatory compliance, and long-term flexibility for growth.",
    bullets: [
      "Patient flow and experience",
      "Operational workflows",
      "Staffing models and efficiency",
      "Long-term practice growth"
    ],
    logo: hollandLogo,
    logoAlt: "Holland Design",
    externalUrl: "https://www.hollanddesign.ca/"
  },
  {
    category: "LEGAL PARTNER",
    name: "Field Law",
    subtitle: "Legal Advisory Services",
    hook: "Legal advisors who understand that healthcare transactions are different from every other kind.",
    description: "Field Law provides legal advisory services relevant to healthcare ventures and organizations. Their expertise spans corporate structuring, regulatory guidance, partnership agreements, and transaction support for healthcare businesses.",
    bullets: [
      "Business structure and governance",
      "Regulatory and compliance considerations",
      "Partnership and shareholder agreements",
      "Transaction and acquisition support"
    ],
    logo: null,
    logoAlt: "",
    externalUrl: null
  }
];
const Partners = () => {
  usePageMeta(
    "The Vitalis Ecosystem | Strategic Healthcare Advisory Partners | Vitalis Health Strategies",
    "The Vitalis Ecosystem connects medical, dental, and veterinary practices with trusted financial, legal, design, and technology partners — coordinated through one strategic relationship.",
    "/og-partners.jpg"
  );
  const containerRef = useRef(null);
  const hubRef = useRef(null);
  const nodeRefs = useRef([]);
  const [lines, setLines] = useState([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const recalcLines = useCallback(() => {
    if (!containerRef.current || !hubRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const hRect = hubRef.current.getBoundingClientRect();
    const hubCenterX = hRect.left - cRect.left + hRect.width / 2;
    const hubCenterY = hRect.top - cRect.top + hRect.height / 2;
    setContainerSize({ width: cRect.width, height: cRect.height });
    const newLines = nodeRefs.current.map((node) => {
      if (!node) return { x1: hubCenterX, y1: hubCenterY, x2: hubCenterX, y2: hubCenterY };
      const nRect = node.getBoundingClientRect();
      return {
        x1: hubCenterX,
        y1: hubCenterY,
        x2: nRect.left - cRect.left + nRect.width / 2,
        y2: nRect.top - cRect.top + nRect.height / 2
      };
    });
    setLines(newLines);
  }, []);
  useEffect(() => {
    const timer = setTimeout(recalcLines, 100);
    window.addEventListener("resize", recalcLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", recalcLines);
    };
  }, [recalcLines]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-16 lg:pt-40 lg:pb-24 bg-gradient-hero", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl text-center", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "flex items-center justify-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "THE VITALIS ECOSYSTEM" })
      ] }),
      /* @__PURE__ */ jsx(
        motion.h1,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 },
          className: "font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight",
          children: "Building a practice takes more than one expert."
        }
      ),
      /* @__PURE__ */ jsx(
        motion.p,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.2 },
          className: "mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto",
          children: "Vitalis sits at the centre of your advisory team — coordinating the specialists you need so every decision is aligned, every relationship is briefed, and nothing falls through the cracks."
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-forest", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl text-center", children: [
      /* @__PURE__ */ jsx(
        motion.p,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          className: "font-display text-2xl lg:text-4xl font-bold text-primary-foreground leading-snug",
          children: '"Most practice owners spend more time managing their advisors than running their practice."'
        }
      ),
      /* @__PURE__ */ jsx(
        motion.p,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay: 0.15 },
          className: "mt-8 text-base lg:text-lg text-primary-foreground/70 leading-relaxed max-w-3xl mx-auto",
          children: "A new clinic build alone typically requires a banker, an architect, a real estate advisor, a lawyer, a technology vendor, and an operational consultant — each working independently, often at cross-purposes. Vitalis changes that."
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-section overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.9 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true },
        transition: { duration: 0.7 },
        className: "relative max-w-4xl mx-auto",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "hidden lg:block relative h-[520px]", ref: containerRef, children: [
            containerSize.width > 0 && /* @__PURE__ */ jsx(
              "svg",
              {
                className: "absolute top-0 left-0 w-full h-full pointer-events-none",
                viewBox: `0 0 ${containerSize.width} ${containerSize.height}`,
                preserveAspectRatio: "none",
                children: lines.map((line, i) => /* @__PURE__ */ jsx(
                  "line",
                  {
                    x1: line.x1,
                    y1: line.y1,
                    x2: line.x2,
                    y2: line.y2,
                    stroke: "hsl(var(--accent))",
                    strokeWidth: "2",
                    strokeDasharray: "6 4",
                    opacity: "0.5"
                  },
                  i
                ))
              }
            ),
            /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.8 },
                whileInView: { opacity: 1, scale: 1 },
                viewport: { once: true },
                transition: { duration: 0.5, delay: 0.3 },
                className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20",
                ref: hubRef,
                children: /* @__PURE__ */ jsxs("div", { className: "w-40 h-40 rounded-full bg-gradient-forest flex flex-col items-center justify-center text-primary-foreground shadow-elevated", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-display text-2xl font-bold", children: "Vitalis" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-wider opacity-80 mt-1", children: "Strategic Hub" })
                ] })
              }
            ),
            ecosystemSpokes.map((spoke, i) => {
              const angleRad = (spoke.angle - 90) * (Math.PI / 180);
              const x = 50 + Math.cos(angleRad) * 36;
              const y = 50 + Math.sin(angleRad) * 36;
              return /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.8 },
                  whileInView: { opacity: 1, scale: 1 },
                  viewport: { once: true },
                  transition: { duration: 0.4, delay: 0.4 + i * 0.08 },
                  className: "absolute z-10",
                  style: { left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" },
                  ref: (el) => {
                    nodeRefs.current[i] = el;
                  },
                  children: /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl p-5 shadow-card hover:shadow-elevated transition-all duration-300 border border-border/40 text-center min-w-[150px]", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(spoke.icon, { className: "h-6 w-6 text-primary" }) }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-foreground leading-tight block", children: spoke.label })
                  ] })
                },
                spoke.label
              );
            })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "lg:hidden", children: [
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.9 },
                whileInView: { opacity: 1, scale: 1 },
                viewport: { once: true },
                className: "bg-gradient-forest rounded-2xl p-8 text-primary-foreground text-center mb-8 shadow-elevated",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "font-display text-2xl font-bold", children: "Vitalis" }),
                  /* @__PURE__ */ jsx("span", { className: "block text-xs uppercase tracking-wider opacity-80 mt-1", children: "Strategic Hub" })
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: ecosystemSpokes.map((spoke, i) => /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 15 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { delay: i * 0.08 },
                className: "bg-card rounded-xl p-4 shadow-soft border border-border/40 text-center",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-2", children: /* @__PURE__ */ jsx(spoke.icon, { className: "h-5 w-5 text-primary" }) }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-foreground", children: spoke.label })
                ]
              },
              spoke.label
            )) })
          ] })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "WHO WE COORDINATE" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight", children: "Every specialist your practice needs — already in your corner." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: partnerCategories.map((cat, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay: i * 0.06 },
          className: "bg-card rounded-2xl p-7 shadow-soft border border-border/40",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(cat.icon, { className: "h-6 w-6 text-primary" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-2", children: cat.title }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-4", children: cat.hook }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-accent mb-2", children: "What they handle for you:" }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-1.5", children: cat.items.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-accent flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: item })
            ] }, item)) })
          ]
        },
        cat.title
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-section", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "ESTABLISHED RELATIONSHIPS" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight", children: "Not referrals. Working relationships." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed", children: "These organizations have worked alongside Vitalis on real client engagements. When they come to your project, they already know the context." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: featuredPartners.filter((p) => p.category !== "LEGAL PARTNER").map((partner, i) => /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay: i * 0.1 },
          className: "bg-background rounded-2xl shadow-card border border-border overflow-hidden",
          children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 p-8 lg:p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border/30", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-accent mb-3", children: partner.category }),
              partner.logo ? /* @__PURE__ */ jsx("div", { className: cn("w-40 flex items-center justify-center mb-4", partner.name === "ATB Financial" ? "h-20" : "h-14"), children: partner.externalUrl ? /* @__PURE__ */ jsx("a", { href: partner.externalUrl, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx("img", { src: partner.logo, alt: partner.logoAlt, className: cn("object-contain bg-transparent", partner.name === "ATB Financial" ? "max-h-16 w-auto h-auto" : "max-w-full max-h-full") }) }) : /* @__PURE__ */ jsx("img", { src: partner.logo, alt: partner.logoAlt, className: cn("object-contain bg-transparent", partner.name === "ATB Financial" ? "max-h-16 w-auto h-auto" : "max-w-full max-h-full") }) }) : /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(Scale, { className: "h-8 w-8 text-primary-foreground" }) }),
              /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl lg:text-3xl font-bold text-foreground", children: partner.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-2", children: partner.subtitle })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8 p-8 lg:p-10", children: [
              /* @__PURE__ */ jsx("p", { className: "font-display text-base font-semibold text-foreground mb-4 italic", children: partner.hook }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-6", children: partner.description }),
              /* @__PURE__ */ jsxs("div", { className: "bg-secondary/30 rounded-xl p-5", children: [
                /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-foreground mb-3", children: [
                  "Vitalis collaborates with ",
                  partner.name,
                  " to support:"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-2", children: partner.bullets.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-accent flex-shrink-0" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: item })
                ] }, item)) })
              ] })
            ] })
          ] })
        },
        partner.name
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "ONE ECOSYSTEM" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight", children: "You talk to us. We coordinate everyone else." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-6", children: coordinationCards.map((card, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay: i * 0.08 },
          className: "bg-card rounded-2xl p-7 shadow-sm border border-border/40",
          children: [
            /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-3", children: card.title }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: card.body })
          ]
        },
        card.title
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-forest", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl text-center", children: /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-primary-foreground mb-6", children: "The right specialists. Coordinated from day one." }),
      /* @__PURE__ */ jsx("p", { className: "text-primary-foreground/70 text-lg leading-relaxed mb-8 max-w-2xl mx-auto", children: "Whether you're planning a new practice, navigating a transition, or ready to scale — Vitalis brings in who you need and makes sure everyone is working toward the same outcome." }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
        /* @__PURE__ */ jsx(Button, { variant: "gold", size: "xl", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
          "Speak With Our Team ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
        ] }) }),
        /* @__PURE__ */ jsx(Button, { variant: "hero-outline", size: "xl", className: "border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-foreground", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment", children: [
          "Start Your Practice Assessment ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
        ] }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  Partners as default
};

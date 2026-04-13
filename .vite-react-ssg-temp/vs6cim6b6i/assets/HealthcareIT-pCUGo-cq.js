import { jsxs, jsx } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Footer } from "./Footer-DArsv4kV.js";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { B as Button } from "./button-DnzOxZqg.js";
import { ArrowRight, Zap, Lock, BarChart2, CheckCircle, Monitor, Wifi, Shield, Laptop, Database, ClipboardList, Settings, Headphones, RefreshCw } from "lucide-react";
import { u as usePageMeta } from "./seo-sReVioJD.js";
import "react";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./PageSEOContext-DZ23I7UH.js";
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }
};
const coverageCards = [
  { icon: Monitor, label: "Managed IT Services", text: "Ongoing infrastructure management, monitoring, helpdesk, and support — so your team focuses on patients, not IT problems." },
  { icon: Wifi, label: "Network & Infrastructure", text: "Secure network design, firewall configuration, VPN access, and segmented clinical and administrative systems." },
  { icon: Shield, label: "Cybersecurity", text: "Firewall management, endpoint protection, data encryption, and vulnerability monitoring for healthcare environments." },
  { icon: Laptop, label: "Hardware & Procurement", text: "Workstations, servers, tablets, and peripherals — selected for EMR compatibility and clinical workflow requirements." },
  { icon: Database, label: "Backup & Recovery", text: "Automated backups, secure data storage, disaster recovery planning, and rapid restoration for critical systems." },
  { icon: BarChart2, label: "Operational Dashboards", text: "Custom reporting built from your EMR data — patient volumes, provider utilization, billing performance, and scheduling gaps." },
  { icon: ClipboardList, label: "EMR Advisory", text: "Platform evaluation, selection guidance, workflow configuration, and reporting structure — without replacing your vendor relationship." },
  { icon: Settings, label: "IT Strategy & Roadmap", text: "Long-term technology planning, vendor selection, upgrade timelines, and infrastructure investment aligned with your growth plans." },
  { icon: Headphones, label: "Helpdesk Support", text: "Ticketing system, remote troubleshooting, device support, and network issue resolution for your clinical team." }
];
const emrPlatforms = [
  { name: "Med Access", desc: "Widely used by Canadian physicians and specialists. Web-based, configurable, with scheduling and billing." },
  { name: "CHR", desc: "Collaborative Health Record. Integrated platform for multi-provider practices." },
  { name: "AVA EMR", desc: "Developed in Calgary. Integrated scheduling, charting, billing, and patient communication." },
  { name: "Zenoti", desc: "Enterprise platform for health and wellness clinics with scheduling, billing, and marketing." },
  { name: "Jane App", desc: "Canadian practice management with online booking, charting, telehealth, and insurance billing." }
];
const processSteps = [
  { icon: ClipboardList, label: "Assessment", text: "We review your current technology environment — systems, network, security, and data utilization — and identify gaps and priorities." },
  { icon: Settings, label: "Recommendation", text: "You receive a clear, prioritized plan: what to fix first, what can wait, and what will have the most immediate operational impact." },
  { icon: Zap, label: "Implementation", text: "We manage the setup, procurement, configuration, and vendor coordination — without disrupting your clinical operations." },
  { icon: RefreshCw, label: "Ongoing Support", text: "Monitoring, helpdesk, strategic reviews, and technology roadmap updates — so your systems stay ahead of your practice's growth." }
];
const HealthcareIT = () => {
  usePageMeta(
    "Digital Transformation for Healthcare Practices | EMR & Technology Consulting | Vitalis",
    "Modernize your practice management systems, EMR setup, and digital workflows with Vitalis technology consulting.",
    "/og-healthcare-it.jpg"
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, className: "flex items-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Healthcare IT" })
      ] }),
      /* @__PURE__ */ jsx(
        motion.h1,
        {
          ...fadeUp,
          transition: { delay: 0.1 },
          className: "font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight",
          children: "Your practice runs on technology. Most of it is not working as hard as it should."
        }
      ),
      /* @__PURE__ */ jsx(
        motion.p,
        {
          ...fadeUp,
          transition: { delay: 0.2 },
          className: "mt-8 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl",
          children: "Slow systems, fragmented software, and outdated infrastructure cost practices time, revenue, and patient experience every day — without anyone noticing until something fails. Vitalis provides technology strategy and managed IT services built specifically for medical, dental, and veterinary practices."
        }
      ),
      /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: 0.3 }, className: "mt-10 flex flex-wrap gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment", children: [
          "Get a Technology Assessment",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ] }) }),
        /* @__PURE__ */ jsx(Button, { variant: "hero-outline", size: "lg", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Speak With Our Team" }) })
      ] }),
      /* @__PURE__ */ jsx(motion.p, { ...fadeUp, transition: { delay: 0.4 }, className: "mt-6 text-sm text-muted-foreground", children: "Supporting medical, dental, and veterinary practices across Canada." })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-6", children: [
      {
        icon: Zap,
        label: "Systems That Slow You Down",
        text: "Every minute your team spends navigating a slow EMR or waiting on IT is a minute not spent on patient care."
      },
      {
        icon: Lock,
        label: "Security Gaps You May Not Know About",
        text: "Healthcare data is the most targeted in any industry. Most practices have at least one significant vulnerability."
      },
      {
        icon: BarChart2,
        label: "Data You Collect But Cannot Use",
        text: "Your EMR contains performance data that most practices never access — billing trends, provider utilization, scheduling gaps."
      }
    ].map((card, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        ...fadeUp,
        transition: { delay: i * 0.1 },
        className: "bg-card rounded-2xl p-6 border-l-4 border-accent shadow-soft",
        children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(card.icon, { className: "h-5 w-5 text-accent" }) }),
          /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground mb-2", children: card.label }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: card.text })
        ]
      },
      card.label
    )) }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-section", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsx(motion.div, { ...fadeUp, className: "text-center mb-16", children: /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "How we help — and where you are in your journey." }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            ...fadeUp,
            transition: { delay: 0.1 },
            className: "bg-card rounded-2xl p-8 shadow-card border-t-4 border-primary",
            children: [
              /* @__PURE__ */ jsx("span", { className: "inline-block text-xs font-semibold tracking-widest uppercase text-primary-foreground bg-primary px-3 py-1 rounded-full mb-4", children: "New Practice Build" }),
              /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl font-bold text-foreground mb-4", children: "Get it right from day one." }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-6", children: "Technology decisions made during a build are the hardest and most expensive to reverse. Vitalis designs your complete IT infrastructure before you open — so you launch with systems that work, networks that are secure, and software that fits how you actually practice." }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground mb-3", children: "What we set up:" }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-2 mb-8", children: [
                "Network architecture and secure Wi-Fi",
                "Workstations, servers, and clinical hardware",
                "EMR selection and configuration guidance",
                "Cybersecurity framework from day one",
                "Practice management software setup"
              ].map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-primary mt-0.5 flex-shrink-0" }),
                item
              ] }, item)) }),
              /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
                "Discuss Your Build",
                /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
              ] }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            ...fadeUp,
            transition: { delay: 0.2 },
            className: "bg-card rounded-2xl p-8 shadow-card border-t-4 border-accent",
            children: [
              /* @__PURE__ */ jsx("span", { className: "inline-block text-xs font-semibold tracking-widest uppercase text-accent-foreground bg-accent px-3 py-1 rounded-full mb-4", children: "Existing Practice" }),
              /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl font-bold text-foreground mb-4", children: "Fix what is costing you." }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-6", children: "Most established practices have at least one technology problem they have learned to work around. An IT audit identifies what is underperforming, what is creating risk, and where a targeted upgrade would have the most immediate impact." }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground mb-3", children: "What we review:" }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-2 mb-8", children: [
                "Current infrastructure and network performance",
                "Cybersecurity posture and vulnerabilities",
                "EMR configuration and data utilization",
                "Hardware age and replacement priority",
                "Operational reporting and dashboard capability"
              ].map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-accent mt-0.5 flex-shrink-0" }),
                item
              ] }, item)) }),
              /* @__PURE__ */ jsx(Button, { variant: "gold", size: "lg", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
                "Book an IT Audit",
                /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
              ] }) })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, className: "mb-16 max-w-3xl", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "What's included in Healthcare IT support." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground text-lg leading-relaxed", children: "Whether you need a single service or a complete managed solution, every offering below is available as part of an engagement." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-3 md:grid-cols-2 gap-6", children: coverageCards.map((card, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          ...fadeUp,
          transition: { delay: i * 0.04 },
          className: "bg-card rounded-2xl p-6 shadow-soft border border-border/40 hover:shadow-card transition-shadow duration-300",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(card.icon, { className: "h-5 w-5 text-primary" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-base font-bold text-foreground mb-2", children: card.label }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: card.text })
          ]
        },
        card.label
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-section", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, className: "mb-12 max-w-3xl", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "EMR platforms we know." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground text-lg leading-relaxed", children: "We do not install EMR systems — that is your vendor's role. We help you choose the right platform, configure it for your workflow, and extract the operational data that most practices leave on the table." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-5 gap-4", children: emrPlatforms.map((p, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          ...fadeUp,
          transition: { delay: i * 0.05 },
          className: "bg-card rounded-xl p-5 border border-border/40 shadow-soft",
          children: [
            /* @__PURE__ */ jsx("h3", { className: "font-display text-sm font-bold text-foreground mb-1", children: p.name }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: p.desc })
          ]
        },
        p.name
      )) }),
      /* @__PURE__ */ jsxs(motion.p, { ...fadeUp, transition: { delay: 0.3 }, className: "mt-6 text-sm text-muted-foreground text-center", children: [
        "Don't see your platform? We work across multiple systems.",
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/contact", className: "text-primary hover:text-foreground underline underline-offset-2 transition-colors", children: "Get in touch" }),
        " ",
        "to discuss your specific setup."
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsx(motion.div, { ...fadeUp, className: "text-center mb-16", children: /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "What working with us looks like." }) }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-4 gap-0", children: processSteps.map((step, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          ...fadeUp,
          transition: { delay: i * 0.1 },
          className: "relative flex flex-col items-center text-center px-4",
          children: [
            i < processSteps.length - 1 && /* @__PURE__ */ jsx("div", { className: "hidden md:block absolute top-8 -right-2 z-10", children: /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5 text-primary" }) }),
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(step.icon, { className: "h-7 w-7 text-primary" }) }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-accent tracking-widest uppercase mb-2", children: [
              "Step ",
              i + 1
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground mb-2", children: step.label }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: step.text })
          ]
        },
        step.label
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-forest text-primary-foreground", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl text-center", children: [
      /* @__PURE__ */ jsx(
        motion.h2,
        {
          ...fadeUp,
          className: "font-display text-3xl lg:text-5xl font-bold tracking-tight leading-tight",
          children: "Technology should be invisible — until it gives you an advantage."
        }
      ),
      /* @__PURE__ */ jsx(
        motion.p,
        {
          ...fadeUp,
          transition: { delay: 0.1 },
          className: "mt-8 text-lg leading-relaxed opacity-85 max-w-3xl mx-auto",
          children: "Most practices think about IT only when something breaks. The practices that pull ahead are the ones that treat technology as a strategic asset — one that supports better care, better data, and better financial performance."
        }
      ),
      /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: 0.2 }, className: "mt-10 flex flex-wrap justify-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "gold", size: "lg", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment", children: [
          "Get a Technology Assessment",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ] }) }),
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "lg",
            asChild: true,
            className: "border-2 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 font-medium tracking-wide transition-all duration-300",
            children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Speak With Our Team" })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  HealthcareIT as default
};

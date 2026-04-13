import { jsx, jsxs } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Footer } from "./Footer-DArsv4kV.js";
import { motion } from "framer-motion";
import { User, Building2, Heart, Users, ArrowRight } from "lucide-react";
import { CredibilitySection } from "./CredibilitySection-DYwQPIxX.js";
import { Link } from "react-router-dom";
import { B as Button } from "./button-DnzOxZqg.js";
import { u as usePageMeta } from "./seo-sReVioJD.js";
import { J as JsonLd, o as organizationSchema, b as buildBreadcrumbSchema } from "./JsonLd-VGPEamnK.js";
import "react";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./PageSEOContext-DZ23I7UH.js";
const pillars = [
  {
    icon: User,
    title: "Practitioner",
    description: "We work with practice owners and clinical leaders on the decisions that shape long-term success — ownership structure, leadership transitions, recruitment strategy, succession planning, and financial outcomes. Our goal is confident decision-making at every stage.",
    color: "bg-primary"
  },
  {
    icon: Building2,
    title: "Practice",
    description: "A high-performing practice is operationally sound, financially healthy, and built to scale. We assess and improve the systems, workflows, staffing models, and compliance structures that determine whether a practice performs at its potential or falls short of it.",
    color: "bg-forest-light"
  },
  {
    icon: Heart,
    title: "Patient",
    description: "Everything we do is ultimately measured by what patients and clients experience — quality of care, access, safety, and service consistency. We help practices build the operational foundation that makes excellent patient and client outcomes sustainable over time.",
    color: "bg-accent"
  },
  {
    icon: Users,
    title: "People",
    description: "The right practitioners, staff, and leadership structure are as important as any operational system. We help practices build the human infrastructure — recruitment, role design, and team alignment — that supports long-term performance.",
    color: "bg-primary"
  }
];
function ThreePsSection() {
  return /* @__PURE__ */ jsx("section", { className: "py-24 lg:py-32 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        className: "text-center max-w-2xl mx-auto mb-16",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
            /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Our Philosophy" })
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight", children: "The 4Ps Framework" }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 text-muted-foreground text-lg leading-relaxed", children: "Everything we do is designed to create stronger outcomes across four interconnected pillars." })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto items-stretch", children: pillars.map((pillar, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5, delay: i * 0.1 },
        className: "bg-card rounded-2xl p-6 lg:p-8 shadow-card hover:shadow-elevated transition-shadow duration-300 text-center h-full flex flex-col",
        children: [
          /* @__PURE__ */ jsx("div", { className: `w-16 h-16 rounded-2xl ${pillar.color} flex items-center justify-center mx-auto`, children: /* @__PURE__ */ jsx(pillar.icon, { className: "h-8 w-8 text-primary-foreground" }) }),
          /* @__PURE__ */ jsx("h3", { className: "mt-6 font-display text-2xl font-bold text-foreground", children: pillar.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground leading-relaxed", children: pillar.description })
        ]
      },
      pillar.title
    )) })
  ] }) });
}
const contentBlocks = [
  {
    heading: "How We Work",
    body: "We begin every engagement with a structured assessment — a clear-eyed look at where a practice stands across revenue, operations, staffing, growth capacity, and compliance. From there, we build a prioritized plan and work alongside the practice owner to implement it. We do not hand over a document and disappear."
  },
  {
    heading: "Who We Work With",
    body: "We work with private medical clinics, dental practices, and veterinary facilities across Canada — at every stage of their development. Whether a practitioner is opening their first facility, optimizing an established practice, or navigating a significant operational change, Vitalis brings the same structured, accountable approach."
  },
  {
    heading: "What Makes Us Different",
    body: "Most consulting firms advise from the outside. Vitalis was built from the inside. Our team has managed clinic operations, handled physician recruitment, worked through compliance audits, and made the same decisions our clients face. That operational experience is not a credential we list — it is how we think."
  }
];
const About = () => {
  usePageMeta(
    "About Vitalis Health Strategies | Clinician-Led Practice Consulting | Calgary, Alberta",
    "Founded by clinicians and healthcare executives. Vitalis brings operational experience — not just advice — to every practice engagement.",
    "/og-about.jpg"
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(JsonLd, { data: organizationSchema }),
    /* @__PURE__ */ jsx(JsonLd, { data: buildBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]) }),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "flex items-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "About Vitalis" })
      ] }),
      /* @__PURE__ */ jsx(motion.h1, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.1 }, className: "font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight", children: "Built by Clinicians. Focused on Practice Performance." }),
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.2 }, className: "mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed max-w-3xl", children: [
        /* @__PURE__ */ jsx("p", { children: "Vitalis Health Strategies was founded by clinicians and healthcare executives who spent years watching skilled practitioners struggle with the operational and financial side of running a practice." }),
        /* @__PURE__ */ jsx("p", { children: "The advice available to clinic, dental office, and veterinary practice owners was generic, expensive, and disconnected from day-to-day clinical reality. Vitalis was built to be different." }),
        /* @__PURE__ */ jsx("p", { children: "Every recommendation we make comes from a team that has operated practices, hired practitioners, navigated regulatory compliance, designed facilities, and built teams from the ground up. We do not produce reports that sit on shelves. Every engagement ends with an actionable plan and a team that stays accountable to outcomes." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl", children: /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-3 gap-8", children: contentBlocks.map((block, i) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.08 }, className: "bg-card rounded-2xl p-7 shadow-soft border border-border/40", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-bold text-foreground mb-4", children: block.heading }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: block.body })
    ] }, block.heading)) }) }) }),
    /* @__PURE__ */ jsx(ThreePsSection, {}),
    /* @__PURE__ */ jsx(CredibilitySection, { variant: "full" }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "Work With a Team That Has Been There" }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 flex flex-col sm:flex-row justify-center gap-4", children: /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
        "Connect With Our Team ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  About as default
};

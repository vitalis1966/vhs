import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useState, useEffect, Suspense, lazy } from "react";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Link } from "react-router-dom";
import { B as Button } from "./button-DnzOxZqg.js";
import { ArrowRight } from "lucide-react";
import { S as SEOHead } from "./SEOHead-zhKhQt1F.js";
import { u as usePageMeta } from "./seo-sReVioJD.js";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "vite-react-ssg";
import "@tanstack/react-query";
import "./client-CxdMKRkw.js";
import "@supabase/supabase-js";
import "./PageSEOContext-DZ23I7UH.js";
function HeroSection() {
  return /* @__PURE__ */ jsxs("section", { className: "relative min-h-[95vh] flex items-center bg-gradient-hero overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-20 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-20 left-10 w-80 h-80 rounded-full bg-primary/5 blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 relative z-10 pt-24 pb-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-8 animate-fade-in", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-[#7a5500] font-semibold tracking-widest uppercase text-sm", children: "Full-Cycle Healthcare Strategy" })
      ] }),
      /* @__PURE__ */ jsxs(
        "h1",
        {
          className: "font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.08] tracking-tight animate-fade-in",
          style: { animationDelay: "0.1s" },
          children: [
            "Practice Strategy for Medical,",
            " ",
            /* @__PURE__ */ jsx("br", {}),
            "Dental & Veterinary",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-gradient-primary italic", children: "— at Every Stage." })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "p",
        {
          className: "mt-8 text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-in",
          style: { animationDelay: "0.2s" },
          children: "Vitalis Health Strategies works with private medical, dental, and veterinary practices across Canada. Whether you are planning a new facility, running an established practice, or figuring out what is holding your current one back — our team has the operational and strategic experience to help you move forward with clarity."
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "mt-10 animate-fade-in",
          style: { animationDelay: "0.3s" },
          children: /* @__PURE__ */ jsx(Button, { variant: "hero", size: "xl", asChild: true, className: "whitespace-normal h-auto py-3 text-center leading-snug", children: /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment", children: [
            "Start Your Strategic Assessment",
            /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5 shrink-0" })
          ] }) })
        }
      )
    ] }) })
  ] });
}
function useLazySection(rootMargin = "200px") {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);
  return [ref, isVisible];
}
const Footer = lazy(() => import("./Footer-DArsv4kV.js").then((m) => ({ default: m.Footer })));
const PracticePathFinder = lazy(() => import("./PracticePathFinder-DJIYr2sM.js").then((m) => ({ default: m.PracticePathFinder })));
const ImpactStatsSection = lazy(() => import("./ImpactStatsSection-DLRQH1Bm.js").then((m) => ({ default: m.ImpactStatsSection })));
const WhatWeDoSection = lazy(() => import("./WhatWeDoSection-Bo2wN4VP.js").then((m) => ({ default: m.WhatWeDoSection })));
const CredibilitySection = lazy(() => import("./CredibilitySection-DYwQPIxX.js").then((m) => ({ default: m.CredibilitySection })));
const FinalCtaSection = lazy(() => import("./FinalCtaSection-BilElRyc.js").then((m) => ({ default: m.FinalCtaSection })));
const Index = () => {
  usePageMeta(
    "Vitalis Health Strategies | Healthcare Practice Consulting | Calgary, Canada",
    "Full-lifecycle consulting for medical, dental, and veterinary practices across Canada. From new builds to M&A — clinician-led strategy that drives measurable outcomes.",
    "/og-home.jpg"
  );
  const [belowFoldRef, showBelowFold] = useLazySection("400px");
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(SEOHead, {}),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx(HeroSection, {}),
      /* @__PURE__ */ jsx("div", { ref: belowFoldRef, className: "min-h-[200px]", children: showBelowFold && /* @__PURE__ */ jsxs(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "min-h-[200px]" }), children: [
        /* @__PURE__ */ jsx(PracticePathFinder, {}),
        /* @__PURE__ */ jsx(ImpactStatsSection, {}),
        /* @__PURE__ */ jsx(WhatWeDoSection, {}),
        /* @__PURE__ */ jsx(CredibilitySection, { variant: "homepage" }),
        /* @__PURE__ */ jsx(FinalCtaSection, {})
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "h-64" }), children: /* @__PURE__ */ jsx(Footer, {}) })
  ] });
};
export {
  Index as default
};

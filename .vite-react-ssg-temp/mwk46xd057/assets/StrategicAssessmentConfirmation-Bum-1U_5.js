import { jsxs, jsx } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Footer } from "./Footer-DArsv4kV.js";
import { motion } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import { B as Button } from "./button-DnzOxZqg.js";
import { Compass, TrendingUp, Building2, CheckCircle, ArrowRight } from "lucide-react";
import "react";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }
};
const trackContent = {
  new_clinic_build: {
    icon: Building2,
    color: "bg-primary/15",
    iconColor: "text-primary",
    title: "Clinic Build Readiness Assessment",
    description: "Based on your answers, we've identified the New Clinic Strategic Assessment as the most relevant path for you. This assessment is designed for physicians and healthcare organizations planning a new clinic, healthcare space, or practice launch.",
    next: "Click below to begin your assessment. Your progress will be saved automatically — you can complete it at your own pace."
  },
  existing_clinic: {
    icon: TrendingUp,
    color: "bg-accent/15",
    iconColor: "text-accent",
    title: "Practice Performance Assessment",
    description: "Based on your answers, we've identified the Existing Clinic Strategic Assessment as the most relevant path for you. This assessment is designed for clinic owners looking to evaluate performance, optimize operations, or plan strategic growth.",
    next: "Click below to begin your assessment. Your progress will be saved automatically — you can complete it at your own pace."
  },
  needs_review: {
    icon: Compass,
    color: "bg-accent/15",
    iconColor: "text-accent",
    title: "Your Strategic Assessment Is Being Prepared",
    description: "We're finalizing the most relevant assessment path for your situation and will provide secure access shortly.",
    next: "A member of the Vitalis team will follow up with you to discuss your needs and guide you to the right assessment."
  }
};
const StrategicAssessmentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const track = searchParams.get("track") || "needs_review";
  const token = searchParams.get("token");
  const content = trackContent[track] || trackContent.needs_review;
  const Icon = content.icon;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-3xl text-center", children: /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center", children: /* @__PURE__ */ jsx(CheckCircle, { className: "h-8 w-8 text-accent" }) }) }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight mb-6", children: "Thank You" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto", children: "Your Strategic Assessment intake has been submitted successfully." })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-2xl", children: /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, className: "bg-card rounded-2xl p-8 lg:p-10 shadow-card border border-border/40", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: `w-14 h-14 rounded-2xl ${content.color} flex items-center justify-center flex-shrink-0`, children: /* @__PURE__ */ jsx(Icon, { className: `h-7 w-7 ${content.iconColor}` }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-accent uppercase tracking-wider mb-1", children: "Your Assessment Path" }),
          /* @__PURE__ */ jsx("h2", { className: "font-display text-xl lg:text-2xl font-bold text-foreground", children: content.title })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-6", children: content.description }),
      /* @__PURE__ */ jsxs("div", { className: "bg-secondary/50 rounded-xl p-5 mb-8", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display text-sm font-bold text-foreground mb-2 uppercase tracking-wider", children: "What Happens Next" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: content.next })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
        token ? /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", asChild: true, className: "flex-1", children: /* @__PURE__ */ jsxs(Link, { to: `/assessment/${token}`, children: [
          "Continue to Your Assessment",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
        ] }) }) : /* @__PURE__ */ jsxs(Button, { variant: "hero", size: "lg", disabled: true, className: "flex-1 opacity-70", children: [
          "Continue to Your Assessment",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
        ] }),
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "lg", asChild: true, className: "flex-1", children: /* @__PURE__ */ jsx(Link, { to: "/", children: "Return to Website" }) })
      ] }),
      !token && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground text-center mt-6 italic", children: "Our team will provide access to your assessment shortly." })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  StrategicAssessmentConfirmation as default
};

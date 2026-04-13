import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { B as Button } from "./button-DnzOxZqg.js";
import { ArrowRight } from "lucide-react";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
function FinalCtaSection() {
  return /* @__PURE__ */ jsx("section", { className: "py-24 lg:py-32 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 text-center", children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.6 },
      className: "max-w-2xl mx-auto",
      children: [
        /* @__PURE__ */ jsxs("h2", { className: "font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight", children: [
          "Ready to build something",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "text-gradient-primary", children: "extraordinary?" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-muted-foreground text-lg leading-relaxed", children: "Whether you're launching, growing, or transitioning — we're here to make every stage count." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-col sm:flex-row justify-center gap-4", children: [
          /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
            "Speak With Our Team",
            /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
          ] }) }),
          /* @__PURE__ */ jsx(Button, { variant: "hero-outline", size: "lg", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/strategic-assessment", children: "Start Your Strategic Assessment" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Link, { to: "/solutions", className: "hover:text-primary transition-colors", children: "See Our Solutions →" }),
          /* @__PURE__ */ jsx(Link, { to: "/portfolio", className: "hover:text-primary transition-colors", children: "View Our Work →" }),
          /* @__PURE__ */ jsx(Link, { to: "/about", className: "hover:text-primary transition-colors", children: "About Vitalis →" })
        ] })
      ]
    }
  ) }) });
}
export {
  FinalCtaSection
};

import { jsx, jsxs } from "react/jsx-runtime";
import { L as Link } from "./index-CalXArNJ.js";
import "react";
import "react-dom";
import "react-router";
const vitalisLogo = "/vitalis-logo.webp";
const footerLinks = {
  Solutions: [
    { label: "New Practice Builds", href: "/solutions/new-clinics" },
    { label: "Operational Excellence", href: "/solutions/existing-clinics" },
    { label: "Revenue & Growth", href: "/clinic-audit" },
    { label: "M&A Advisory", href: "/contact" }
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "How We Work", href: "/how-we-work" },
    { label: "Engagement", href: "/engagement" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Ecosystem", href: "/partners" },
    { label: "Contact", href: "/contact" },
    { label: "Admin Login", href: "/admin/login" }
  ],
  Legal: [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "Cookie Policy", href: "/cookies" }
  ],
  Resources: [
    { label: "Strategic Assessment", href: "/strategic-assessment" },
    { label: "Insights", href: "/insights" }
  ]
};
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "bg-primary text-primary-foreground", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 py-16 lg:py-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx("img", { src: vitalisLogo, alt: "Vitalis Health Strategies", className: "h-10 w-auto brightness-0 invert", width: "120", height: "40" }) }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-white text-sm leading-relaxed max-w-xs", children: "Full-cycle healthcare consulting for medical, dental, and veterinary practices. We partner with practices through every stage of growth." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 text-sm text-white", children: [
          /* @__PURE__ */ jsx("p", { children: "Calgary, Alberta, Canada" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1", children: "info@vitalisstrategies.com" })
        ] })
      ] }),
      Object.entries(footerLinks).map(([category, links]) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-display text-sm font-semibold uppercase tracking-wider text-white/90 mb-4", children: category }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: links.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            to: link.href,
            className: "text-sm text-white hover:text-white/80 transition-colors",
            children: link.label
          }
        ) }, link.label)) })
      ] }, category))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-16 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-white/80", children: "© 2026 Vitalis Health Strategies Inc. All rights reserved." }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-6 text-sm text-white/80", children: [
        /* @__PURE__ */ jsx(Link, { to: "/privacy", className: "hover:text-white transition-colors", children: "Privacy Policy" }),
        /* @__PURE__ */ jsx("span", { className: "text-white/40", children: "·" }),
        /* @__PURE__ */ jsx(Link, { to: "/terms", className: "hover:text-white transition-colors", children: "Terms & Conditions" }),
        /* @__PURE__ */ jsx("span", { className: "text-white/40", children: "·" }),
        /* @__PURE__ */ jsx(Link, { to: "/disclaimer", className: "hover:text-white transition-colors", children: "Disclaimer" })
      ] })
    ] })
  ] }) });
}
export {
  Footer
};

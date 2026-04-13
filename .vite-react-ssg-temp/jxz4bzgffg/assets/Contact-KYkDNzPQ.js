import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Footer } from "./Footer-DArsv4kV.js";
import { B as BookingWidget } from "./BookingWidget-VGAyvILq.js";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { B as Button } from "./button-DnzOxZqg.js";
import { I as Input } from "./label-H2YDHQ-y.js";
import { T as Textarea } from "./textarea-B6XBNdk0.js";
import { CheckCircle2, Loader2, ArrowRight, MapPin, Mail } from "lucide-react";
import { u as usePageMeta } from "./seo-sReVioJD.js";
import { J as JsonLd, b as buildBreadcrumbSchema } from "./JsonLd-VGPEamnK.js";
import { s as supabase } from "./client-CxdMKRkw.js";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "./card-B9jBE8y5.js";
import "react-day-picker";
import "./use-toast-B2rUv-Rg.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "./PageSEOContext-DZ23I7UH.js";
import "@supabase/supabase-js";
const Contact = () => {
  usePageMeta(
    "Contact Vitalis Health Strategies | Healthcare Consulting Calgary",
    "Connect with Vitalis Health Strategies to discuss your practice goals, challenges, or opportunities. Calgary-based healthcare consulting.",
    "/og-contact.jpg"
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    interest: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState({ name: "", email: "" });
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { error: fnError } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          organization: formData.organization,
          area_of_interest: formData.interest,
          message: formData.message
        }
      });
      if (fnError) throw fnError;
      setSubmittedInfo({ name: formData.name, email: formData.email });
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", organization: "", interest: "", message: "" });
    } catch {
      setError("Something went wrong. Please try again or email us directly at info@vitalisstrategies.com");
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(JsonLd, { data: buildBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]) }),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "flex items-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Get In Touch" })
      ] }),
      /* @__PURE__ */ jsx(motion.h1, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight", children: "Let's start a conversation." }),
      /* @__PURE__ */ jsx(motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl", children: "Whether you're exploring a new venture, looking for an objective view of operations, or planning a transition — we're here to help you think it through." })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-12 bg-muted/20", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-2xl", children: /* @__PURE__ */ jsx(BookingWidget, {}) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-[1fr_360px] gap-16", children: [
      submitted ? /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "flex flex-col items-center justify-center text-center py-16 px-8 rounded-2xl", style: { backgroundColor: "#F5F2EC" }, children: [
        /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-full flex items-center justify-center mb-6", style: { backgroundColor: "#1C3D2E" }, children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-8 w-8 text-white" }) }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl font-bold mb-3", style: { color: "#1C3D2E" }, children: "Message sent." }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground leading-relaxed max-w-md mb-2", children: [
          "Thank you, ",
          submittedInfo.name,
          ". We have received your message and will be in touch within one business day."
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "A confirmation has been sent to ",
          submittedInfo.email,
          "."
        ] })
      ] }) : /* @__PURE__ */ jsxs(
        motion.form,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.3 },
          onSubmit: handleSubmit,
          className: "space-y-6",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground mb-2 block", children: "Name *" }),
                /* @__PURE__ */ jsx(Input, { required: true, disabled: submitting, value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "Your name", className: "bg-card" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground mb-2 block", children: "Email *" }),
                /* @__PURE__ */ jsx(Input, { required: true, type: "email", disabled: submitting, value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), placeholder: "you@example.com", className: "bg-card" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground mb-2 block", children: "Phone" }),
                /* @__PURE__ */ jsx(Input, { disabled: submitting, value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }), placeholder: "(555) 000-0000", className: "bg-card" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground mb-2 block", children: "Organization" }),
                /* @__PURE__ */ jsx(Input, { disabled: submitting, value: formData.organization, onChange: (e) => setFormData({ ...formData, organization: e.target.value }), placeholder: "Practice or organization name", className: "bg-card" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground mb-2 block", children: "Area of Interest" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  disabled: submitting,
                  value: formData.interest,
                  onChange: (e) => setFormData({ ...formData, interest: e.target.value }),
                  className: "flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Select an option..." }),
                    /* @__PURE__ */ jsx("option", { value: "new-practice", children: "New Practice Build" }),
                    /* @__PURE__ */ jsx("option", { value: "operations", children: "Operational Excellence" }),
                    /* @__PURE__ */ jsx("option", { value: "revenue", children: "Revenue & Finance" }),
                    /* @__PURE__ */ jsx("option", { value: "growth", children: "Growth Strategy" }),
                    /* @__PURE__ */ jsx("option", { value: "recruitment", children: "Practitioner Recruitment" }),
                    /* @__PURE__ */ jsx("option", { value: "ma", children: "M&A / Transition" }),
                    /* @__PURE__ */ jsx("option", { value: "healthcare-it", children: "Healthcare IT & Technology" }),
                    /* @__PURE__ */ jsx("option", { value: "people", children: "People Management" }),
                    /* @__PURE__ */ jsx("option", { value: "assessment", children: "Strategic Assessment" }),
                    /* @__PURE__ */ jsx("option", { value: "general", children: "General Inquiry" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground mb-2 block", children: "Message *" }),
              /* @__PURE__ */ jsx(Textarea, { required: true, disabled: submitting, value: formData.message, onChange: (e) => setFormData({ ...formData, message: e.target.value }), placeholder: "Tell us about your goals, challenges, or questions...", rows: 5, className: "bg-card" })
            ] }),
            error && /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive", children: error }),
            /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", type: "submit", disabled: submitting, children: submitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Sending..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              "Send Message",
              /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
            ] }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-semibold text-foreground mb-4", children: "Reach Us Directly" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-muted-foreground text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5 text-accent flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsx("span", { children: "Calgary, Alberta, Canada" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5 text-accent flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsx("span", { children: "info@vitalisstrategies.com" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl p-6 shadow-card", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base font-semibold text-foreground mb-2", children: "Prefer an assessment first?" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Our strategic assessment gives you a clear picture before committing to consulting." }),
          /* @__PURE__ */ jsx(Button, { variant: "hero-outline", size: "default", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/strategic-assessment", children: "Start Your Strategic Assessment" }) })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  Contact as default
};

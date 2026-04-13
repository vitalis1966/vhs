import { jsxs, jsx } from "react/jsx-runtime";
import { L as Link } from "./index-CalXArNJ.js";
import { N as Navbar } from "./Navbar-DZHwhlEF.js";
import { Footer } from "./Footer-vLUE6RrN.js";
import { motion } from "framer-motion";
import { LogOut, ClipboardList, FileSearch, Newspaper, Briefcase, MessageSquare, Search } from "lucide-react";
import { B as Button } from "./button-DnzOxZqg.js";
import { s as supabase } from "./client-B5yO-kwf.js";
import { useNavigate } from "react-router";
import "react";
import "react-dom";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@supabase/phoenix";
import "iceberg-js";
import "@supabase/auth-js";
import "tslib";
const adminPages = [
  {
    title: "Assessment Builder",
    description: "Create and manage assessment questionnaires, sections, and questions.",
    href: "/admin/assessments",
    icon: ClipboardList
  },
  {
    title: "Submissions Review",
    description: "Review submitted assessments, run AI analysis, and generate internal reports.",
    href: "/admin/submissions",
    icon: FileSearch
  },
  {
    title: "Insights",
    description: "Create and manage blog articles and insights content.",
    href: "/admin/insights",
    icon: Newspaper
  },
  {
    title: "Portfolio",
    description: "Create and manage portfolio case studies and advisory entries.",
    href: "/admin/portfolio",
    icon: Briefcase
  },
  {
    title: "Contact Submissions",
    description: "View and manage incoming contact form submissions.",
    href: "/admin/contacts",
    icon: MessageSquare
  },
  {
    title: "SEO Settings",
    description: "Manage meta tags, Open Graph, schemas, tracking, and redirects for all pages.",
    href: "/admin/seo",
    icon: Search
  }
];
function AdminDashboard() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-10 lg:pt-40 bg-gradient-hero", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
              /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Internal Admin" })
            ] }),
            /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight", children: "Admin Dashboard" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: handleLogout, children: [
        /* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }),
        "Sign Out"
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 bg-background flex-1", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: adminPages.map((page) => /* @__PURE__ */ jsx(Link, { to: page.href, children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "bg-card rounded-2xl shadow-soft border border-border/40 p-8 hover:shadow-elevated hover:border-primary/20 transition-all group cursor-pointer h-full",
        children: [
          /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors", children: /* @__PURE__ */ jsx(page.icon, { className: "h-6 w-6 text-primary" }) }),
          /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground mb-2", children: page.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: page.description })
        ]
      }
    ) }, page.href)) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  AdminDashboard as default
};

import { jsxs, jsx } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Footer } from "./Footer-DArsv4kV.js";
import { useParams, Link } from "react-router-dom";
import { Clock, Check, Copy, ArrowLeft } from "lucide-react";
import { u as usePageMeta } from "./seo-sReVioJD.js";
import { useQuery } from "@tanstack/react-query";
import { s as supabase } from "./client-CxdMKRkw.js";
import { format } from "date-fns";
import { useState } from "react";
import { B as Button } from "./button-DnzOxZqg.js";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "./PageSEOContext-DZ23I7UH.js";
import "@supabase/supabase-js";
import "@radix-ui/react-slot";
import "class-variance-authority";
const InsightArticle = () => {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);
  const { data: article, isLoading } = useQuery({
    queryKey: ["insight-article", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("insights_articles").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const { data: relatedArticles = [] } = useQuery({
    queryKey: ["related-articles", slug, article?.category],
    queryFn: async () => {
      if (!article) return [];
      const { data, error } = await supabase.from("insights_articles").select("id, title, slug, category, date, excerpt").eq("status", "published").neq("slug", slug).limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!article
  });
  usePageMeta(
    article?.meta_title || article?.title || "Insight | Vitalis",
    article?.meta_description || article?.excerpt || "",
    article?.featured_image_url || "/og-insights.jpg"
  );
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  const renderBody = (body) => {
    const lines = body.split("\n");
    const elements = [];
    let listItems = [];
    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-6 space-y-2 mb-6 text-foreground/90 leading-relaxed", children: listItems.map((item, i) => /* @__PURE__ */ jsx("li", { children: renderInline(item) }, i)) }, `list-${elements.length}`)
        );
        listItems = [];
      }
    };
    const renderInline = (text) => {
      const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return /* @__PURE__ */ jsx("strong", { className: "font-semibold", children: part.slice(2, -2) }, i);
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return /* @__PURE__ */ jsx("em", { children: part.slice(1, -1) }, i);
        }
        const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          return /* @__PURE__ */ jsx(Link, { to: linkMatch[2], className: "text-accent hover:underline font-medium", children: linkMatch[1] }, i);
        }
        return part;
      });
    };
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(/* @__PURE__ */ jsx("h2", { className: "font-display text-2xl font-bold text-foreground mt-10 mb-4", children: trimmed.slice(3) }, i));
      } else if (trimmed.startsWith("### ")) {
        flushList();
        elements.push(/* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground mt-8 mb-3", children: trimmed.slice(4) }, i));
      } else if (trimmed.startsWith("- ")) {
        listItems.push(trimmed.slice(2));
      } else if (trimmed.startsWith("---")) {
        flushList();
        elements.push(/* @__PURE__ */ jsx("hr", { className: "my-10 border-border" }, i));
      } else if (trimmed === "") {
        flushList();
      } else {
        flushList();
        elements.push(/* @__PURE__ */ jsx("p", { className: "text-foreground/90 leading-relaxed mb-4", children: renderInline(trimmed) }, i));
      }
    });
    flushList();
    return elements;
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
      /* @__PURE__ */ jsx(Navbar, {}),
      /* @__PURE__ */ jsx("div", { className: "pt-32 pb-20 container mx-auto px-4 max-w-3xl", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-muted rounded w-24" }),
        /* @__PURE__ */ jsx("div", { className: "h-8 bg-muted rounded w-3/4" }),
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-muted rounded w-40" }),
        /* @__PURE__ */ jsx("div", { className: "h-64 bg-muted rounded" })
      ] }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  if (!article) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
      /* @__PURE__ */ jsx(Navbar, {}),
      /* @__PURE__ */ jsxs("div", { className: "pt-32 pb-20 container mx-auto px-4 max-w-3xl text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-bold text-foreground mb-4", children: "Article not found" }),
        /* @__PURE__ */ jsx(Link, { to: "/insights", className: "text-accent hover:underline", children: "← Back to Insights" })
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("article", { className: "pt-32 pb-20 lg:pt-40 lg:pb-28", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-[720px]", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-foreground px-2.5 py-0.5 rounded-full border border-border bg-transparent inline-block mb-4", children: article.category }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4", children: article.title }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground mb-10", children: [
        /* @__PURE__ */ jsx("span", { children: article.date ? format(new Date(article.date), "MMMM d, yyyy") : "" }),
        article.estimated_read_time && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }),
          article.estimated_read_time,
          " min read"
        ] })
      ] }),
      article.featured_image_url && /* @__PURE__ */ jsx(
        "img",
        {
          src: article.featured_image_url,
          alt: article.title,
          className: "w-full rounded-lg mb-10 object-cover max-h-[400px]"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "prose-vitalis", children: article.body ? renderBody(article.body) : /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No content available." }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-16 pt-8 border-t border-border flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: handleCopyLink, className: "gap-2", children: [
          copied ? /* @__PURE__ */ jsx(Check, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4" }),
          copied ? "Copied!" : "Share this insight"
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/insights", className: "text-sm font-medium text-accent hover:underline inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
          " Back to Insights"
        ] })
      ] })
    ] }) }),
    relatedArticles.length > 0 && /* @__PURE__ */ jsx("section", { className: "py-16 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-6xl", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl font-bold text-foreground mb-8", children: "More from Vitalis" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: relatedArticles.map((ra) => /* @__PURE__ */ jsxs(
        Link,
        {
          to: `/insights/${ra.slug}`,
          className: "group bg-background rounded-lg border border-border/60 p-6 transition-all duration-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:border-border",
          style: { borderTopWidth: "3px", borderTopColor: "hsl(var(--forest))" },
          children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-foreground px-2.5 py-0.5 rounded-full border border-border bg-transparent inline-block mb-2", children: ra.category }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-base font-bold text-forest leading-snug line-clamp-2 mb-2", children: ra.title }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: ra.date ? format(new Date(ra.date), "MMMM yyyy") : "" })
          ]
        },
        ra.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  InsightArticle as default
};

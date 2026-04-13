import { jsxs, jsx } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Footer } from "./Footer-DArsv4kV.js";
import { useNavigate, Link } from "react-router-dom";
import { B as Button } from "./button-DnzOxZqg.js";
import { ArrowLeft, Plus, ArrowUp, ArrowDown, Pencil, Trash2 } from "lucide-react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { s as supabase } from "./client-CxdMKRkw.js";
import { t as toast } from "./use-toast-B2rUv-Rg.js";
import { B as Badge } from "./badge-Bd62qPcf.js";
import { useState } from "react";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@supabase/supabase-js";
const filterOptions = ["All", "New Build", "Revenue & Billing", "Operations", "Growth", "M&A", "Technology", "People", "Advisory"];
const PortfolioAdmin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("All");
  const { data: cases = [], isLoading } = useQuery({
    queryKey: ["admin-portfolio"],
    queryFn: async () => {
      const { data, error } = await supabase.from("portfolio_cases").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    }
  });
  const filteredCases = activeFilter === "All" ? cases : cases.filter((c) => c.tags?.includes(activeFilter));
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("portfolio_cases").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-portfolio"] });
      toast({ title: "Case study deleted" });
    }
  });
  const reorderMutation = useMutation({
    mutationFn: async ({ id, newOrder }) => {
      const { error } = await supabase.from("portfolio_cases").update({ sort_order: newOrder }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-portfolio"] });
    }
  });
  const handleMove = (index, direction) => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= cases.length) return;
    const currentItem = cases[index];
    const swapItem = cases[swapIndex];
    reorderMutation.mutate({ id: currentItem.id, newOrder: swapItem.sort_order });
    reorderMutation.mutate({ id: swapItem.id, newOrder: currentItem.sort_order });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("div", { className: "pt-28 pb-20 container mx-auto px-4 max-w-5xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(Link, { to: "/admin", className: "text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
            " Back to Admin"
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-bold text-foreground", children: "Portfolio" })
        ] }),
        /* @__PURE__ */ jsx(Button, { variant: "hero", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/admin/portfolio/new", children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-2" }),
          " New Case"
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto flex-nowrap pb-4 scrollbar-hide mb-4", children: filterOptions.map((filter) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveFilter(filter),
          className: `whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${activeFilter === filter ? "bg-forest text-primary-foreground border-forest" : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"}`,
          children: filter
        },
        filter
      )) }),
      isLoading ? /* @__PURE__ */ jsx("div", { className: "animate-pulse space-y-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx("div", { className: "h-16 bg-muted rounded" }, i)) }) : filteredCases.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center py-20", children: "No cases match this filter." }) : /* @__PURE__ */ jsx("div", { className: "border border-border rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-muted/50", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-8", children: "#" }),
          /* @__PURE__ */ jsx("th", { className: "text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Title" }),
          /* @__PURE__ */ jsx("th", { className: "text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell", children: "Specialty" }),
          /* @__PURE__ */ jsx("th", { className: "text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell", children: "Tags" }),
          /* @__PURE__ */ jsx("th", { className: "text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell", children: "Type" }),
          /* @__PURE__ */ jsx("th", { className: "text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "text-right p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: filteredCases.map((c, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-muted/30 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleMove(cases.indexOf(c), "up"),
                disabled: cases.indexOf(c) === 0,
                className: "text-muted-foreground hover:text-foreground disabled:opacity-20",
                children: /* @__PURE__ */ jsx(ArrowUp, { className: "w-3 h-3" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleMove(cases.indexOf(c), "down"),
                disabled: cases.indexOf(c) === cases.length - 1,
                className: "text-muted-foreground hover:text-foreground disabled:opacity-20",
                children: /* @__PURE__ */ jsx(ArrowDown, { className: "w-3 h-3" })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground text-sm line-clamp-2 max-w-xs", children: c.title }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4 hidden md:table-cell", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: c.specialty }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4 hidden lg:table-cell", children: /* @__PURE__ */ jsx("div", { className: "flex gap-1 flex-wrap", children: c.tags?.map((t) => /* @__PURE__ */ jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground", children: t }, t)) }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4 hidden md:table-cell", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground capitalize", children: c.case_type === "case_study" ? "Case Study" : "Advisory" }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx(Badge, { variant: c.status === "published" ? "default" : "secondary", children: c.status === "published" ? "Published" : "Draft" }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => navigate(`/admin/portfolio/${c.id}`), children: /* @__PURE__ */ jsx(Pencil, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
              if (confirm("Delete this case study? This cannot be undone.")) deleteMutation.mutate(c.id);
            }, children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 text-destructive" }) })
          ] }) })
        ] }, c.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  PortfolioAdmin as default
};

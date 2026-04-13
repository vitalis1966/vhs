import { jsxs, jsx } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Footer } from "./Footer-DArsv4kV.js";
import { useNavigate, Link } from "react-router-dom";
import { B as Button } from "./button-DnzOxZqg.js";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { s as supabase } from "./client-CxdMKRkw.js";
import { format } from "date-fns";
import { t as toast } from "./use-toast-B2rUv-Rg.js";
import { B as Badge } from "./badge-Bd62qPcf.js";
import "react";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@supabase/supabase-js";
const InsightsAdmin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["admin-insights"],
    queryFn: async () => {
      const { data, error } = await supabase.from("insights_articles").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data;
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("insights_articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-insights"] });
      toast({ title: "Article deleted" });
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("div", { className: "pt-28 pb-20 container mx-auto px-4 max-w-5xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(Link, { to: "/admin", className: "text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
            " Back to Admin"
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-bold text-foreground", children: "Insights" })
        ] }),
        /* @__PURE__ */ jsx(Button, { variant: "hero", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/admin/insights/new", children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-2" }),
          " New Article"
        ] }) })
      ] }),
      isLoading ? /* @__PURE__ */ jsx("div", { className: "animate-pulse space-y-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx("div", { className: "h-16 bg-muted rounded" }, i)) }) : articles.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center py-20", children: "No articles yet." }) : /* @__PURE__ */ jsx("div", { className: "border border-border rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-muted/50", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Title" }),
          /* @__PURE__ */ jsx("th", { className: "text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell", children: "Category" }),
          /* @__PURE__ */ jsx("th", { className: "text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell", children: "Date" }),
          /* @__PURE__ */ jsx("th", { className: "text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "text-right p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: articles.map((a) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-muted/30 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground text-sm line-clamp-1", children: a.title }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4 hidden md:table-cell", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: a.category }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4 hidden md:table-cell", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: a.date ? format(new Date(a.date), "MMM d, yyyy") : "" }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx(Badge, { variant: a.status === "published" ? "default" : "secondary", children: a.status === "published" ? "Published" : "Draft" }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => navigate(`/admin/insights/${a.id}`), children: /* @__PURE__ */ jsx(Pencil, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
              if (confirm("Delete this article?")) deleteMutation.mutate(a.id);
            }, children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 text-destructive" }) })
          ] }) })
        ] }, a.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  InsightsAdmin as default
};

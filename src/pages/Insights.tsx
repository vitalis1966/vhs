import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { usePageMeta } from "@/lib/seo";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const categories = [
  "All",
  "Practice Operations",
  "Revenue & Billing",
  "Growth & Expansion",
  "M&A & Transitions",
  "New Builds",
  "People & Leadership",
  "Regulatory Updates",
];

const Insights = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  usePageMeta(
    "Insights — Canadian Healthcare Practice | Vitalis",
    "The Vitalis team shares insights on the operational, financial, and strategic decisions facing medical, dental, and veterinary practices across Canada."
  );

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["insights-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insights_articles")
        .select("*")
        .eq("status", "published")
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = activeCategory === "All"
    ? articles
    : articles.filter((a: any) => a.category === activeCategory);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-6">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Insights</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Perspectives on Canadian healthcare practice.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            The Vitalis team shares insights on the operational, financial, and strategic decisions facing medical, dental, and veterinary practices across Canada.
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-6 bg-background border-b border-border sticky top-[72px] z-30">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="flex gap-2 overflow-x-auto flex-nowrap pb-1 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-forest text-primary-foreground border-forest"
                    : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-lg border border-border/60 p-6 animate-pulse" style={{ borderTopWidth: "3px", borderTopColor: "hsl(var(--forest))" }}>
                  <div className="h-4 bg-muted rounded w-24 mb-3" />
                  <div className="h-3 bg-muted rounded w-20 mb-4" />
                  <div className="h-5 bg-muted rounded w-full mb-2" />
                  <div className="h-5 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-3 bg-muted rounded w-full mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No articles in this category yet.</p>
              <button onClick={() => setActiveCategory("All")} className="mt-4 text-accent underline underline-offset-4 hover:text-accent/80">
                Show all articles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article: any, i: number) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                >
                  <Link
                    to={`/insights/${article.slug}`}
                    className="group bg-background rounded-lg border border-border/60 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:border-border h-full"
                    style={{ borderTopWidth: "3px", borderTopColor: "hsl(var(--forest))" }}
                  >
                    <div className="p-6 flex flex-col flex-1">
                      <span className="text-xs font-medium text-foreground px-2.5 py-0.5 rounded-full border border-border bg-transparent self-start mb-2">
                        {article.category}
                      </span>
                      <p className="text-xs text-muted-foreground mb-3">
                        {article.date ? format(new Date(article.date), "MMMM yyyy") : ""}
                      </p>
                      <h3 className="font-display text-lg font-bold text-forest leading-snug mb-3 line-clamp-3">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                        {article.excerpt}
                      </p>
                      <div className="mt-auto">
                        <span className="text-sm font-medium text-accent group-hover:underline inline-flex items-center gap-1">
                          Read more <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Insights;

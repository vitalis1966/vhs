import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Briefcase } from "lucide-react";
import { usePageMeta } from "@/lib/seo";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const filterOptions = ["All", "New Build", "Revenue & Billing", "Operations", "Technology", "People", "Advisory"];

const borderColorMap: Record<string, string> = {
  "New Build": "#264a39",
  "Revenue & Billing": "#b5832a",
  "Operations": "#3b5a7a",
  "Growth": "#c47c2b",
  "M&A": "#6b3d5a",
  "Technology": "#2a6b6b",
  "People": "#8b4a3a",
  "Advisory": "#5a7a5a",
};

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  usePageMeta(
    "Healthcare Consulting Portfolio & Case Studies | Vitalis",
    "A selection of healthcare consulting engagements across practice builds, revenue optimization, M&A advisory, and digital transformation."
  );

  const { data: allCases = [] } = useQuery({
    queryKey: ["portfolio-cases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_cases")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const filteredCases = activeFilter === "All"
    ? allCases
    : allCases.filter((c: any) => c.tags?.includes(activeFilter));

  const selectedCase = allCases.find((c: any) => c.id === selectedCaseId) || null;

  const handleCardClick = (cs: any) => {
    if (cs.case_type !== "advisory") {
      setSelectedCaseId(cs.id);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-6">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Our Work</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Engagements that moved practices forward.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            A selection of strategic, operational, and development engagements across Canada. Practice names and identifying details changed for confidentiality.
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-6 bg-background sticky top-[72px] z-30">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="flex gap-2 overflow-x-auto flex-nowrap pb-1 scrollbar-hide">
            {filterOptions.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  activeFilter === filter
                    ? "bg-forest text-primary-foreground border-forest"
                    : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="mt-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }} />
        </div>
      </section>

      {/* Card Grid */}
      <section className="pt-8 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            <AnimatePresence mode="popLayout">
              {filteredCases.map((cs: any, i: number) => {
                const isFirst = i === 0 && activeFilter === "All";
                const isAdvisory = cs.case_type === "advisory";
                const tags: string[] = cs.tags || [];
                const topBorderColor = borderColorMap[tags[0]] || "#264a39";
                const rowIndex = Math.floor(i / 3);
                const isAltRow = rowIndex % 2 === 1;
                return (
                  <motion.div
                    key={cs.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                    className={`group bg-white rounded-lg overflow-hidden flex flex-col min-h-[200px] transition-all duration-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)] ${
                      isFirst ? "lg:col-span-2" : ""
                    } ${!isAdvisory ? "cursor-pointer" : ""}`}
                    style={{
                      borderTop: `3px solid ${topBorderColor}`,
                      border: `1px solid rgba(0,0,0,0.12)`,
                      borderTopWidth: '3px',
                      borderTopColor: topBorderColor,
                      background: isAltRow ? 'rgba(38, 74, 57, 0.02)' : 'white',
                    }}
                    role={isAdvisory ? undefined : "button"}
                    tabIndex={isAdvisory ? undefined : 0}
                    onClick={() => handleCardClick(cs)}
                    onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !isAdvisory) { e.preventDefault(); setSelectedCaseId(cs.id); } }}
                  >
                    <div className="p-5 flex flex-col flex-1">
                      {/* Tags */}
                      <div className="flex gap-2 flex-wrap">
                        {tags.map((t: string) => (
                          <span key={t} className="text-xs text-foreground px-2 py-0.5 rounded-full border border-border" style={{ borderWidth: '0.5px' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                      {/* Specialty */}
                      <p className="text-[11px] text-muted-foreground uppercase tracking-widest mt-2">{cs.specialty}</p>
                      {/* Result stat */}
                      {!isAdvisory && cs.metric ? (
                        <p className="text-sm font-bold mt-1.5 mb-2 pl-2" style={{ color: topBorderColor, borderLeft: `2px solid ${topBorderColor}` }}>{cs.metric}</p>
                      ) : null}
                      {/* Title */}
                      <h3 className={`font-display font-semibold text-forest leading-[1.4] ${isAdvisory ? 'mt-2' : ''} ${isFirst ? "text-xl" : "text-base"} line-clamp-3`}>
                        {cs.title}
                      </h3>
                      <div className="mt-auto pt-3">
                        {cs.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <MapPin className="w-3 h-3" />
                            {cs.location}
                          </p>
                        )}
                        {!isAdvisory && (
                          <span className="text-sm font-medium text-accent hover:underline inline-flex items-center gap-1 mt-2">
                            Read more <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredCases.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No engagements match this filter.</p>
              <button onClick={() => setActiveFilter("All")} className="mt-4 text-accent underline underline-offset-4 hover:text-accent/80">
                Show all engagements
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <p className="text-muted-foreground mb-6 text-lg">Want to discuss how we can help your organization?</p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact">Speak With Our Team <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <Footer />

      {/* Case Study Drawer */}
      <Sheet open={!!selectedCase} onOpenChange={(open) => { if (!open) setSelectedCaseId(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-[640px] p-0 overflow-y-auto">
          {selectedCase && (
            <div className="flex flex-col min-h-full">
              <div className="p-6 lg:p-8 pb-0">
                <SheetHeader className="text-left mb-0">
                  <SheetDescription className="text-xs font-medium tracking-widest uppercase text-accent mb-3">
                    {selectedCase.specialty}{selectedCase.location ? `, ${selectedCase.location}` : ""}
                  </SheetDescription>
                  <SheetTitle className="font-display text-2xl lg:text-3xl font-bold text-foreground leading-snug">
                    {selectedCase.title}
                  </SheetTitle>
                </SheetHeader>
                {selectedCase.metric && (
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground border-y border-border py-4">
                    <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{(selectedCase.tags || []).join(", ")}</span>
                    {selectedCase.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{selectedCase.location}</span>}
                  </div>
                )}
                {selectedCase.metric && (
                  <p className="mt-4 text-lg font-bold text-forest">{selectedCase.metric}</p>
                )}
              </div>
              <div className="p-6 lg:p-8 space-y-8 flex-1">
                {selectedCase.description && (
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">Overview</p>
                    <p className="text-foreground/90 leading-relaxed">{selectedCase.description}</p>
                  </div>
                )}
                {selectedCase.body && (
                  <div className="prose prose-sm max-w-none text-foreground/90">
                    <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">Details</p>
                    {selectedCase.body.split("\n\n").map((p: string, i: number) => (
                      <p key={i} className="leading-relaxed mb-4 last:mb-0">{p}</p>
                    ))}
                  </div>
                )}
              </div>
              <div className="sticky bottom-0 p-6 lg:p-8 pt-4 pb-6 bg-background border-t border-border">
                <Button variant="hero" size="lg" className="w-full" asChild>
                  <Link to="/contact">Discuss a similar engagement <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Portfolio;

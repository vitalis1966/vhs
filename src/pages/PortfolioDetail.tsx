import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, MapPin } from "lucide-react";
import { motion } from "framer-motion";

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

const renderParagraphs = (text: string) =>
  text.split("\n\n").filter(Boolean).map((p, i) => (
    <p key={i} className="text-foreground/90 leading-relaxed mb-4 last:mb-0">{p}</p>
  ));

const PortfolioDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: c, isLoading } = useQuery({
    queryKey: ["portfolio-detail", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_cases")
        .select("*")
        .eq("slug", slug!)
        .eq("status", "published")
        .single();
      if (error) throw error;
      return data as any;
    },
    enabled: !!slug,
  });

  const stats = c ? [
    { value: c.ext_stat_1_value, label: c.ext_stat_1_label },
    { value: c.ext_stat_2_value, label: c.ext_stat_2_label },
    { value: c.ext_stat_3_value, label: c.ext_stat_3_label },
  ].filter((s: any) => s.value) : [];

  const services: string[] = c?.ext_services || [];

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 container mx-auto px-4 max-w-[780px]">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-40 bg-muted rounded" />
            <div className="h-10 w-3/4 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!c) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 container mx-auto px-4 max-w-[780px] text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Case study not found</h1>
          <Button variant="hero" asChild>
            <Link to="/portfolio">Back to Portfolio</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const tags: string[] = c.tags || [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="container mx-auto px-4 max-w-[780px]">
          <Link to="/portfolio" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
          </Link>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 flex-wrap mb-3">
            {tags.map((t: string) => (
              <span key={t} className="text-xs text-foreground px-2.5 py-1 rounded-full border border-border" style={{ borderWidth: '0.5px' }}>{t}</span>
            ))}
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
            {c.specialty}
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-3xl lg:text-4xl font-bold text-forest tracking-tight leading-tight mb-4">
            {c.metric}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-foreground/90 leading-relaxed text-lg mb-3">
            {c.description}
          </motion.p>

          {c.location && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm text-muted-foreground flex items-center gap-1.5 mb-8">
              <MapPin className="w-3.5 h-3.5" /> {c.location}
            </motion.p>
          )}

          <hr className="border-t mb-10" style={{ borderColor: '#B8860B' }} />

          {c.ext_situation && (
            <section className="mb-10">
              <h2 className="font-display text-xl font-bold text-forest mb-4">Situation</h2>
              {renderParagraphs(c.ext_situation)}
            </section>
          )}

          {c.ext_challenge && (
            <section className="mb-10">
              <h2 className="font-display text-xl font-bold text-forest mb-4">The Challenge</h2>
              {renderParagraphs(c.ext_challenge)}
            </section>
          )}

          {c.ext_what_we_did && (
            <section className="mb-10">
              <h2 className="font-display text-xl font-bold text-forest mb-4">What We Did</h2>
              {renderParagraphs(c.ext_what_we_did)}
            </section>
          )}

          {c.ext_results && (
            <section className="mb-10">
              <h2 className="font-display text-xl font-bold text-forest mb-4">Results</h2>
              {renderParagraphs(c.ext_results)}
            </section>
          )}

          {stats.length > 0 && (
            <section className="mb-10">
              <div className={`grid gap-4 ${stats.length === 1 ? 'grid-cols-1' : stats.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {stats.map((s: any, i: number) => (
                  <div key={i} className="bg-muted/40 rounded-lg p-5 text-center border border-border">
                    <p className="text-lg font-bold text-forest mb-1">{s.value}</p>
                    {s.label && <p className="text-xs text-muted-foreground">{s.label}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {services.length > 0 && (
            <section className="mb-10">
              <h2 className="font-display text-xl font-bold text-forest mb-4">Services in This Engagement</h2>
              <div className="flex flex-wrap gap-2">
                {services.map((s: string) => (
                  <span key={s} className="text-xs text-foreground px-3 py-1.5 rounded-full border border-border bg-muted/30">{s}</span>
                ))}
              </div>
            </section>
          )}

          <section className="pt-8 border-t border-border text-center">
            <p className="text-muted-foreground mb-5 text-lg">Want to discuss a similar engagement?</p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Speak With Our Team <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </section>
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default PortfolioDetail;

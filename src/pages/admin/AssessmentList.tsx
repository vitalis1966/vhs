import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Assessment } from "@/types/assessment";
import { ClipboardList, ArrowRight, Loader2 } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function AssessmentList() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    const { data } = await (supabase.from("assessments" as any).select("*").order("created_at") as any);
    setAssessments(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-20 lg:pt-40 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div {...fadeUp}>
            <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Admin</span>
          </div>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
              Assessment Builder
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Create and manage assessment templates, sections, and questions.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="space-y-4">
              {assessments.map((a) => (
                <motion.div
                  key={a.id}
                  {...fadeUp}
                  className="bg-card rounded-2xl p-6 shadow-soft border border-border/40 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                      <ClipboardList className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display text-lg font-bold text-foreground">{a.title}</h3>
                        <Badge variant={a.is_published ? "default" : "secondary"}>
                          {a.is_published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{a.description}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Slug: {a.slug}</p>
                    </div>
                  </div>
                  <Button variant="hero" size="sm" asChild>
                    <Link to={`/admin/assessments/${a.id}`}>
                      Edit
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              ))}
              {assessments.length === 0 && (
                <p className="text-center text-muted-foreground py-20">No assessments found.</p>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

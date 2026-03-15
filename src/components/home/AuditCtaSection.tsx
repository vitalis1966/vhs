import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, ArrowRight } from "lucide-react";

export function AuditCtaSection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-forest rounded-3xl p-10 lg:p-16 max-w-5xl mx-auto relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-forest-light/20" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-accent/10" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center">
                <ClipboardCheck className="h-10 w-10 text-accent-foreground" />
              </div>
            </div>

            <div className="text-center lg:text-left flex-1">
              <h2 className="font-display text-2xl lg:text-4xl font-bold text-primary-foreground tracking-tight">
                Explore a Strategic Practice Assessment
              </h2>
              <p className="mt-4 text-primary-foreground/75 text-lg leading-relaxed max-w-xl">
                Whether you are planning a new facility or looking for an objective view of an existing practice, our strategic assessment can help you see where to focus.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button variant="gold" size="lg" asChild>
                <Link to="/strategic-assessment/intake">
                  Explore Your Practice Strategy
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/contact">Talk to Us</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

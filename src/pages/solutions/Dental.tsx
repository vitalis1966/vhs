import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/lib/seo";
import { Building, TrendingUp, ArrowRight } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

export default function Dental() {
  usePageMeta(
    "Dental Practice Consulting | New Builds & Performance Optimization | Vitalis Health Strategies",
    "Vitalis Health Strategies works with general and specialty dental practices across Canada — from planning a new office to optimizing an established practice."
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
            <motion.div {...fadeUp}>
              <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Dental Practices</p>
              <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
                Strategic consulting for general, specialty, and multi-location dental practices.
              </h1>
              <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
                From planning your first dental office to optimizing a growing multi-location group, Vitalis brings the same structured, accountable approach to every stage of dental practice development.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div {...fadeUp} className="bg-card rounded-2xl p-8 shadow-card border border-border/40 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Planning a New Dental Practice</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                  New dental office planning including equipment procurement, compliance preparation, facility layout, staffing design, and financial planning — so you open with confidence.
                </p>
                <Button variant="hero-outline" size="default" asChild className="w-full">
                  <Link to="/strategic-assessment">Start Your Build Assessment <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </motion.div>

              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="bg-card rounded-2xl p-8 shadow-card border border-border/40 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Improving an Existing Dental Practice</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                  Fee collection review, scheduling optimization, expansion planning, and operational assessment — with clear priorities for improving practice performance.
                </p>
                <Button variant="hero-outline" size="default" asChild className="w-full">
                  <Link to="/strategic-assessment">Start Your Performance Assessment <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-section">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <motion.div {...fadeUp}>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-6">
                Ready to discuss your dental practice?
              </h2>
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">Speak With Our Team <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

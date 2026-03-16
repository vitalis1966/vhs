import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/lib/seo";
import { Building, TrendingUp, ArrowRight } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

export default function Veterinary() {
  usePageMeta(
    "Veterinary Practice Consulting | New Builds & Performance Optimization | Vitalis Health Strategies",
    "Vitalis Health Strategies supports small animal, mixed, and specialty veterinary practices across Canada — at every stage of their development."
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
            <motion.div {...fadeUp}>
              <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Veterinary Practices</p>
              <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
                Strategic consulting for small animal, mixed, and specialty veterinary practices.
              </h1>
              <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
                Whether you are opening a new veterinary clinic, expanding an established practice, or navigating a partnership change, Vitalis provides the operational and strategic expertise to move forward with clarity.
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
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Planning a New Veterinary Practice</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                  New clinic planning covering equipment, compliance, staffing design, facility layout, and financial modelling — built around the unique requirements of veterinary care.
                </p>
                <Button variant="hero-outline" size="default" asChild className="w-full">
                  <Link to="/strategic-assessment">Start Your Build Assessment <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </motion.div>

              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="bg-card rounded-2xl p-8 shadow-card border border-border/40 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Improving an Existing Veterinary Practice</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                  Revenue review, workflow analysis, growth planning, and staffing assessment — with structured recommendations to improve operational and financial performance.
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
                Ready to discuss your veterinary practice?
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

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/lib/seo";
import { Building, TrendingUp, ArrowRight } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

export default function Medical() {
  usePageMeta(
    "Healthcare Consulting for Medical Clinics & Surgical Practices | Vitalis Health Strategies",
    "Vitalis Health Strategies supports medical clinics, surgical centres, and specialty practices across Canada — from new builds to performance optimization."
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
            <motion.div {...fadeUp}>
              <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Medical Practices</p>
              <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
                Strategic consulting for medical clinics, surgical centres, and specialty practices.
              </h1>
              <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
                Vitalis works with general practitioners, specialists, and surgical groups across Canada — helping them plan new facilities, optimize existing operations, and navigate complex transitions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Two Paths */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div {...fadeUp} className="bg-card rounded-2xl p-8 shadow-card border border-border/40 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Planning a New Medical Practice</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                  Opening a new clinic or surgical facility? We help you navigate feasibility, financial planning, regulatory requirements, facility design, and staffing — so your practice launches on solid ground.
                </p>
                <Button variant="hero-outline" size="default" asChild className="w-full">
                  <Link to="/strategic-assessment">Start Your Build Assessment <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </motion.div>

              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="bg-card rounded-2xl p-8 shadow-card border border-border/40 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Improving an Existing Medical Practice</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                  Get an independent operational review covering revenue cycle performance, workflow efficiency, staffing structure, and growth planning — with clear, prioritized recommendations.
                </p>
                <Button variant="hero-outline" size="default" asChild className="w-full">
                  <Link to="/strategic-assessment">Start Your Performance Assessment <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-gradient-section">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <motion.div {...fadeUp}>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-6">
                Ready to discuss your medical practice?
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

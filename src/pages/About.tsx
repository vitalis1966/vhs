import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-accent font-medium tracking-widest uppercase text-sm mb-6"
          >
            About Vitalis
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight"
          >
            Your long-term strategic partner in healthcare.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl"
          >
            Vitalis Health Strategies is a full-cycle inception-to-exit consulting firm built for healthcare businesses and clinics. We exist because healthcare deserves strategic partners who understand the complete picture.
          </motion.p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-3xl font-bold text-foreground">Why we exist</h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Healthcare organizations face fragmented advice from disconnected specialists. A facilities consultant doesn't think about exit strategy. A growth advisor doesn't understand the build. We bridge that gap.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                By understanding every stage of the healthcare business lifecycle, we deliver advice that is contextual, connected, and compounding — not siloed.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <h2 className="font-display text-3xl font-bold text-foreground">What makes us different</h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />
                  <span>Full-cycle perspective from inception through exit</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />
                  <span>Deep operational and strategic healthcare expertise</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />
                  <span>The 3Ps framework — Physician, Practice, Patient</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />
                  <span>Partnership mindset, not transactional consulting</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />
                  <span>Actionable outcomes, not theoretical reports</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Ready to work with us?</h2>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Book a Consultation <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/how-we-work">See How We Work</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

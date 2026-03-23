import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HealthcarePathwaysSection } from "@/components/home/HealthcarePathwaysSection";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { usePageMeta } from "@/lib/seo";

const phases = [
  { phase: "Vision & Concept", description: "We help you shape the idea — validating feasibility, defining the model, and aligning vision with market opportunity.", when: "Starting from scratch or pivoting direction." },
  { phase: "Strategic Planning", description: "Deep analysis, competitive positioning, financial modeling, and roadmap development to set the foundation.", when: "Before committing capital or launching." },
  { phase: "Build & Launch", description: "Facility planning, team assembly, operational setup, and go-to-market execution to bring the vision to life.", when: "Ready to build or about to open doors." },
  { phase: "Operations & Optimization", description: "Workflow refinement, systems integration, efficiency gains, and compliance to run at peak performance.", when: "Open and seeking operational excellence." },
  { phase: "Revenue & Growth", description: "Revenue cycle optimization, pricing strategy, market expansion, and sustainable growth acceleration.", when: "Established and ready to scale." },
  { phase: "Team & Recruitment", description: "Practitioner and staff recruitment, culture building, succession planning, and workforce strategy.", when: "Growing the team or planning transitions." },
  { phase: "Scale & Expand", description: "Multi-location strategy, partnerships, geographic expansion, and portfolio development.", when: "Proven model ready for replication." },
  { phase: "Transition & Advisory", description: "M&A preparation, valuation support, deal structuring, buyer/partner identification, and leadership transitions.", when: "Planning a merger, acquisition, or leadership transition." },
];

const HowWeWork = () => {
  usePageMeta(
    "How We Work | Full-Lifecycle Healthcare Consulting | Vitalis Health Strategies",
    "From vision through long-term advisory — Vitalis supports healthcare practices through every stage of growth with structured, accountable consulting."
  );
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-6">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Our Method</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            The full lifecycle,<br />one strategic partner.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Most advisory firms see a slice. We see the entire arc of a healthcare practice — and that perspective makes every recommendation sharper, every decision better informed, and every outcome more valuable. Our <Link to="/about" className="text-primary hover:text-foreground underline underline-offset-2 transition-colors">clinician-led team</Link> brings operational experience to every phase. Start with a <Link to="/strategic-assessment" className="text-primary hover:text-foreground underline underline-offset-2 transition-colors">strategic assessment</Link> to find the right starting point.
          </motion.p>
        </div>
      </section>

      <HealthcarePathwaysSection />

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="space-y-0">
            {phases.map((p, i) => (
              <motion.div key={p.phase} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="grid lg:grid-cols-[200px_1fr] gap-6 py-10 border-b border-border last:border-b-0">
                <div>
                  <span className="font-display text-sm font-semibold text-accent uppercase tracking-wider">Phase {i + 1}</span>
                  <h3 className="font-display text-xl font-bold text-foreground mt-1">{p.phase}</h3>
                </div>
                <div>
                  <p className="text-muted-foreground leading-relaxed">{p.description}</p>
                  <p className="mt-3 text-sm text-muted-foreground/70 italic">Best for: {p.when}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-section text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Where is your practice right now?</h2>
          <p className="mt-4 text-muted-foreground text-lg">Let's find the right starting point — together.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Speak With Our Team <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/strategic-assessment">Start Your Strategic Assessment</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowWeWork;

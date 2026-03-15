import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardCheck, Stethoscope, Building } from "lucide-react";

const assessments = [
  {
    icon: Building,
    title: "Practice Build Readiness Assessment",
    description: "Planning a new practice involves dozens of interconnected decisions — from facility design and staffing models to technology infrastructure and long-term financial planning. Our planning assessment helps practitioners evaluate these factors before major commitments are made.",
    includes: [
      "Concept and market validation",
      "Facility planning readiness",
      "Financial model assessment",
      "Operational setup evaluation",
      "Launch readiness checklist",
      "Strategic recommendations",
    ],
  },
  {
    icon: Stethoscope,
    title: "Practice Performance Assessment",
    description: "Our practice performance assessment helps practice leaders evaluate operational systems, patient flow, staffing structure, technology usage, and financial performance to identify opportunities for improvement.",
    includes: [
      "Operational efficiency review",
      "Revenue cycle assessment",
      "Patient flow analysis",
      "Compliance and risk review",
      "Growth opportunity identification",
      "Prioritized action plan",
    ],
  },
];

const ClinicAudit = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-accent font-medium tracking-widest uppercase text-sm mb-6">
            Strategic Practice Assessment
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Start with clarity.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Our strategic assessment gives you an actionable roadmap — whether you're building something new or looking for an objective view of what exists.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button variant="gold" size="xl" asChild>
              <Link to="/strategic-assessment/intake">Explore a Practice Assessment <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            {assessments.map((audit, i) => (
              <motion.div
                key={audit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-8 lg:p-10 shadow-card"
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                  <audit.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold text-foreground">{audit.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{audit.description}</p>
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Includes</h4>
                  <ul className="space-y-2">
                    {audit.includes.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ClipboardCheck className="h-4 w-4 text-accent flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="hero-outline" size="default" asChild className="mt-8">
                  <Link to="/strategic-assessment/intake">Learn About This Assessment <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">How the assessment works</h2>
          <div className="mt-12 grid sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Share", desc: "Tell us about your practice and goals." },
              { step: "2", title: "Assess", desc: "We conduct a thorough strategic diagnostic." },
              { step: "3", title: "Act", desc: "Receive a clear, prioritized roadmap." },
            ].map((s) => (
              <div key={s.step}>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-lg font-bold mx-auto">
                  {s.step}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ClinicAudit;

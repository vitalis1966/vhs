import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { usePageMeta } from "@/lib/seo";

const projects = [
  { title: "Multi-Specialty Practice Launch", type: "New Practice Build", stage: "Inception → Launch", description: "Full lifecycle support for a 12,000 sq ft multi-specialty facility from concept through opening day." },
  { title: "Primary Care Revenue Optimization", type: "Revenue & Operations", stage: "Optimize → Grow", description: "Revenue cycle overhaul resulting in 28% improvement in net collections within 6 months." },
  { title: "Practitioner Group M&A Advisory", type: "Mergers & Acquisitions", stage: "Transition", description: "Strategic advisory for a 5-practitioner group through successful acquisition by a regional health system." },
  { title: "Urgent Care Network Expansion", type: "Growth Strategy", stage: "Scale → Expand", description: "Market analysis and operational playbook for expanding from 2 to 7 locations across two provinces." },
  { title: "Surgical Center Operational Assessment", type: "Strategic Assessment", stage: "Optimize", description: "Comprehensive operational and compliance assessment identifying $1.2M in annual efficiency opportunities." },
  { title: "Digital Transformation Program", type: "Digital & Technology", stage: "Optimize → Grow", description: "EMR optimization and digital workflow redesign reducing administrative burden by 35%." },
];

const Portfolio = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-accent font-medium tracking-widest uppercase text-sm mb-6">
            Our Work
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Results that speak.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            A selection of engagements across our full-cycle model. Some names changed for confidentiality.
          </motion.p>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-shadow duration-300"
              >
                <div className="flex gap-3 mb-4">
                  <span className="text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full">{p.type}</span>
                  <span className="text-xs font-medium bg-accent/15 text-accent px-3 py-1 rounded-full">{p.stage}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">{p.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed text-sm">{p.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6">Want to discuss how we can help your organization?</p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Talk to Us <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;

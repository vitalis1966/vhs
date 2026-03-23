import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function MnASection() {
  return (
    <section className="py-24 lg:py-32 bg-gradient-section">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Mergers, Acquisitions & Transitions</span>
          </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight">
              Considering a transition or partnership change?<br />
              <span className="text-gradient-primary">Let's discuss your opportunities.</span>
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              Vitalis Health Strategies supports acquisitions, mergers, and transitions for practice leaders across Canada's medical, dental, and veterinary sectors.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We help practice owners navigate complex transactions with clarity — preserving what makes your practice strong while providing the strategic and operational support to move forward confidently.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  Talk to a Transition Advisor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/contact">Learn About Our M&A Advisory</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-card rounded-2xl p-8 lg:p-10 shadow-card"
          >
            <h3 className="font-display text-xl font-bold text-foreground mb-6">What we deliver</h3>
            <ul className="space-y-4">
              {[
                { title: "Valuation & Market Analysis", desc: "Thorough financial analysis and market positioning to support informed decisions." },
                { title: "Due Diligence Support", desc: "Comprehensive operational assessment and risk evaluation for buyers and sellers." },
                { title: "Transaction Structuring", desc: "Deal structuring, negotiation support, and legal coordination." },
                { title: "Post-Merger Integration", desc: "Aligning operations, cultures, and systems to realize full transaction value." },
                { title: "Succession & Transition Planning", desc: "Smooth leadership transitions that protect legacy and continuity." },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

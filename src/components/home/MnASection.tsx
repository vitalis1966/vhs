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
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">
              Mergers, Acquisitions & Exits
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight">
              Curious about a potential sale?<br />
              <span className="text-gradient-primary">Let's discuss your opportunities.</span>
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              Vitalis Health Strategies facilitates acquisitions, mergers, and sales (exits) for medical directors of leading medical and surgical clinics across Canada.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We ensure you receive the maximum value while enhancing patient care and driving growth. By preserving your clinic's strengths and providing strategic operational support, we streamline the transaction process — allowing you to focus on what you do best and unlock your clinic's full potential.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  Discuss a Transition
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/solutions">View M&A Services</Link>
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
                { title: "Valuation & Market Analysis", desc: "Thorough financial analysis and market positioning to maximize sale value." },
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

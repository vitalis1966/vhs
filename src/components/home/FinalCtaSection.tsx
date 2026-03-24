import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCtaSection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            Ready to build something
            <br />
            <span className="text-gradient-primary">extraordinary?</span>
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Whether you're launching, growing, or transitioning — we're here to make every stage count.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                Speak With Our Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/strategic-assessment">Start Your Strategic Assessment</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/solutions" className="hover:text-primary transition-colors">See Our Solutions →</Link>
            <Link to="/portfolio" className="hover:text-primary transition-colors">View Our Work →</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About Vitalis →</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

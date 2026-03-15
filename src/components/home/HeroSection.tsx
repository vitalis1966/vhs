import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const heroStats = [
  { value: "200+", label: "Practices Supported Across Canada" },
  { value: "$40M+", label: "Revenue Gaps Identified Across Client Assessments" },
  { value: "15+", label: "New Facilities Guided from Concept to Opening" },
  { value: "Med · Dent · Vet", label: "Every Stage, One Team" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex items-center bg-gradient-hero overflow-hidden">
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-24 pb-16">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-8"
          >
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">
              Full-Cycle Healthcare Strategy
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.08] tracking-tight"
          >
            Practice Strategy for Medical,
            <br />
            Dental, and Veterinary
            <br />
            <span className="text-gradient-primary italic">Practices — at Every Stage.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            Vitalis Health Strategies works with private medical, dental, and veterinary practices across Canada. Whether you are planning a new facility, running an established practice, or figuring out what is holding your current one back — our team has the operational and strategic experience to help you move forward with clarity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 flex flex-col gap-2"
          >
            {[
              "Development & Build — Transform concepts into state-of-the-art healthcare environments",
              "Operational Growth — Optimize operations, strengthen patient care, fuel long-term growth",
              "Ongoing Advisory — Sustained strategic partnership through every stage",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-1" />
                <span className="text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/strategic-assessment/intake">
                Explore a Free Practice Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="hero" size="xl" asChild>
              <Link to="/solutions/new-clinics">
                Planning a New Facility? Start Here
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl"
        >
          {heroStats.map((stat, i) => (
            <div key={i} className="flex items-center gap-4 border-l-2 border-accent/30 pl-4">
              <div>
                <p className="font-display text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

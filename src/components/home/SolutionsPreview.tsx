import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Building, BarChart3, Settings, DollarSign,
  Users, TrendingUp, Handshake, Laptop, ArrowRight,
} from "lucide-react";

const solutions = [
  { icon: Building, title: "New Clinics & Builds", description: "Transform visionary concepts into state-of-the-art clinical environments. We combine innovative design, advanced technology, and data-driven insights to create efficient, NHSF-compliant, patient-centric facilities." },
  { icon: BarChart3, title: "Assessment & Risk", description: "Comprehensive assessments evaluating clinic scopes, regulatory compliance, patient safety risks, and financial vulnerabilities — enabling informed decisions that minimize risk." },
  { icon: Settings, title: "Workflow Optimization", description: "Streamline clinical and administrative processes using Lean Six Sigma methodologies. Reduce wait times, improve patient experience, and achieve significant cost savings." },
  { icon: DollarSign, title: "Revenue Cycle Management", description: "Maximize financial performance from registration and coding to claims submission and denial management. Optimize reimbursement and improve cash flow." },
  { icon: Users, title: "Physician Recruitment", description: "Comprehensive talent acquisition covering sourcing, interviewing, and onboarding. Strategic workforce planning to align physician resources with demand." },
  { icon: Laptop, title: "Digital Transformation", description: "Technology integration, EHR optimization, and digital workflow modernization to reduce administrative burden and improve clinical outcomes." },
  { icon: TrendingUp, title: "Strategic Growth", description: "Identify expansion opportunities, optimize existing operations, and align business strategies with market demands for long-term sustainable growth." },
  { icon: Handshake, title: "M&A & Exit Strategy", description: "Expert transactional support including due diligence, post-merger integration, and strategic exit planning to maximize value and ensure successful outcomes." },
];

export function SolutionsPreview() {
  return (
    <section className="py-24 lg:py-32 bg-gradient-section">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">
            Services? No. We Offer Solutions.
          </p>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            What we deliver
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Explore how our tailored solutions can elevate your healthcare operations. Each is designed to produce measurable results — not just recommendations.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-card rounded-xl p-6 shadow-soft hover:shadow-card transition-all duration-300 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                <s.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Button variant="hero-outline" size="lg" asChild>
            <Link to="/solutions">
              View All Solutions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Building, BarChart3, Settings, DollarSign,
  Users, TrendingUp, Handshake, Laptop, ArrowRight,
} from "lucide-react";

const solutions = [
  { icon: Building, title: "New Clinics & Builds", description: "From concept to doors open — full facility development support." },
  { icon: BarChart3, title: "Strategic Analysis", description: "Assessments, gap identification, and actionable roadmaps." },
  { icon: Settings, title: "Operational Excellence", description: "Workflow optimization, efficiency gains, and systems design." },
  { icon: DollarSign, title: "Revenue & Finance", description: "Revenue cycle management, coding, and financial performance." },
  { icon: Users, title: "Physician Recruitment", description: "Workforce strategy, recruitment, and succession planning." },
  { icon: Laptop, title: "Digital Transformation", description: "Technology integration and digital workflow modernization." },
  { icon: TrendingUp, title: "Growth Strategy", description: "Expansion planning, market analysis, and scaling support." },
  { icon: Handshake, title: "M&A & Exit", description: "Mergers, acquisitions, transitions, and value-maximized exits." },
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
            Solutions, Not Just Services
          </p>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            What we deliver
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Strategic consulting built around outcomes — not hours billed.
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

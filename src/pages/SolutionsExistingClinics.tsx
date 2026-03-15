import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Search,
  Cog,
  Users,
  Monitor,
  DollarSign,
  TrendingUp,
  Target,
  CheckCircle,
} from "lucide-react";
import { usePageMeta } from "@/lib/seo";
const optimizationAreas = [
  {
    icon: Search,
    title: "Operational Review",
    description: "Comprehensive assessment of current operations, workflows, systems, and performance. Identify inefficiencies, bottlenecks, and opportunities for improvement.",
  },
  {
    icon: Cog,
    title: "Workflow Optimization",
    description: "Redesign patient flow, appointment scheduling, clinical processes, and administrative workflows to improve efficiency and patient experience.",
  },
  {
    icon: Users,
    title: "Staffing Structure",
    description: "Evaluate staffing models, roles, and organizational structure. Optimize team composition, improve leadership alignment, and enhance workplace culture.",
  },
  {
    icon: Monitor,
    title: "Technology Modernization",
    description: "Assess current technology systems and plan strategic upgrades. Optimize EMR usage, improve system integration, and enable better data-driven decision making.",
  },
  {
    icon: DollarSign,
    title: "Financial Performance",
    description: "Analyze revenue cycle performance, cost structure, and profitability. Identify opportunities to improve collections, reduce overhead, and strengthen financial health.",
  },
  {
    icon: TrendingUp,
    title: "Growth Strategy",
    description: "Develop expansion plans including new service lines, additional locations, practitioner recruitment, and market positioning for sustainable long-term growth.",
  },
];

const engagementTypes = [
  {
    title: "Diagnostic Assessment",
    duration: "4-6 weeks",
    description: "Comprehensive review of operations, financials, technology, and staffing to identify improvement opportunities and develop recommendations.",
  },
  {
    title: "Implementation Support",
    duration: "3-6 months",
    description: "Hands-on support to execute improvement initiatives, redesign workflows, implement technology changes, and drive operational transformation.",
  },
  {
    title: "Strategic Advisory",
    duration: "Ongoing",
    description: "Long-term advisory partnership providing ongoing strategic guidance, performance monitoring, and support for major decisions and initiatives.",
  },
];

const outcomes = [
  "Improved patient flow and reduced wait times",
  "Increased operational efficiency and productivity",
  "Enhanced staff satisfaction and retention",
  "Better technology utilization and integration",
  "Stronger financial performance and profitability",
  "Sustainable growth and competitive positioning",
];

const SolutionsExistingClinics = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent font-medium tracking-widest uppercase text-sm mb-6"
          >
            Solutions for Existing Practices
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight"
          >
            Most practices are running well. There is almost always room to run better.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl"
          >
            Assessments across a range of practices have identified billing gaps, scheduling inefficiencies, and staffing misalignments that were not visible from inside the operation. The Vitalis Strategic Assessment is designed to give practice owners an independent, structured view of how their practice is performing — and where the clearest opportunities for improvement tend to be.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/strategic-assessment/intake">
                Learn About the Practice Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                Talk to Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Optimization Areas */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">How We Help</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Comprehensive practice improvement.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-3xl">
              Vitalis works with practice leaders to assess operations, identify opportunities, and implement improvements that drive measurable results.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {optimizationAreas.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-7 shadow-soft border border-border/40 hover:shadow-card transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                  <area.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{area.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{area.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Types */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Engagement Models</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Flexible engagement structures.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-3xl">
              Vitalis offers engagement models designed to match your needs — from focused assessments to ongoing strategic partnership.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {engagementTypes.map((type, i) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-7 shadow-card border border-border/40"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-display font-bold text-foreground">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-secondary/50 px-2 py-1 rounded">
                    {type.duration}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{type.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{type.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Common Outcomes</p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
                What assessments have found.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Across engagements, Vitalis assessments have consistently identified opportunities in these areas.
              </p>
            </div>
            <div className="space-y-3">
              {outcomes.map((outcome, i) => (
                <motion.div
                  key={outcome}
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">{outcome}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Advisory */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 lg:p-12 shadow-card border border-border/40 text-center"
          >
            <Target className="h-12 w-12 text-accent mx-auto mb-6" />
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Long-term strategic partnership.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              Many practice leaders retain Vitalis as an ongoing strategic advisor — providing guidance on major decisions, growth initiatives, and organizational challenges as they arise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/engagement">
                  Learn About Engagement Models
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Curious about where there may be room to improve?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              If you are curious about how your practice compares or where there may be room to improve, the assessment is a good place to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/strategic-assessment/intake">
                  Learn About the Practice Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Talk to Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SolutionsExistingClinics;

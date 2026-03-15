import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  DollarSign,
  Clock,
  TrendingUp,
  ClipboardList,
  FileText,
  MessageSquare,
  Quote,
} from "lucide-react";
import { usePageMeta } from "@/lib/seo";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const dimensions = [
  { num: "1", name: "Billing & Revenue Integrity", detail: "Fee collection rates, claim accuracy, denial patterns, uncaptured charges" },
  { num: "2", name: "Operational Efficiency", detail: "Patient flow, scheduling utilization, appointment throughput, bottlenecks" },
  { num: "3", name: "Staffing & Workforce", detail: "Role alignment, recruitment gaps, retention risk, cost per staff member" },
  { num: "4", name: "Financial Health", detail: "Overhead ratios, profitability by service line, cash flow patterns" },
  { num: "5", name: "Growth Readiness", detail: "Capacity utilization, market positioning, expansion feasibility" },
  { num: "6", name: "Compliance & Risk", detail: "Regulatory exposure, documentation gaps, liability considerations" },
  { num: "7", name: "Strategic Direction", detail: "Leadership bandwidth, growth trajectory, long-term planning infrastructure" },
];

const StrategicAssessment = () => {
  usePageMeta(
    "Free Practice Assessment | Operational & Financial Analysis | Vitalis Health Strategies",
    "A free structured assessment across 7 dimensions of practice performance. See where your practice stands and where to focus first."
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Section 1 — Hero */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.div {...fadeUp}>
            <h1 className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
              Find Out What Your Practice Assessment Reveals About Your Performance.
            </h1>
            <p className="mt-8 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Most practice owners are too close to day-to-day operations to see clearly where revenue is being left uncollected, where workflows are adding unnecessary cost, or where growth is being blocked. The Vitalis Practice Assessment gives you an independent, structured view — across seven dimensions of practice performance — in about 15 minutes.
            </p>
            <p className="mt-6 text-sm text-muted-foreground/70 tracking-wide">
              Completed by practices across medical, dental, and veterinary fields in Canada
            </p>
            <div className="mt-10">
              <Button variant="hero" size="xl" asChild>
                <Link to="/strategic-assessment/intake">
                  Begin the Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">
                Free. Confidential. Takes approximately 15 minutes.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2 — Problem Awareness */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Three patterns we see across almost every practice we assess.
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: DollarSign,
                label: "Billing Gaps",
                text: "Assessments consistently identify fee collection gaps that are not visible from inside the practice — in coding, claim submission, and follow-up processes.",
              },
              {
                icon: Clock,
                label: "Workflow Costs",
                text: "Scheduling inefficiencies and redundant administrative processes are among the most common sources of unnecessary overhead identified in practice assessments.",
              },
              {
                icon: TrendingUp,
                label: "Blocked Growth",
                text: "Practices that want to expand often discover their current staffing structure, capacity model, or technology setup cannot support the next stage without significant rework.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                {...fadeUp}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-7 shadow-soft border border-border/40 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — The Seven Dimensions */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
              What the assessment examines.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
              The Vitalis Practice Assessment is structured around seven dimensions. Each one is designed to surface issues that are difficult to see without an external, structured review.
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="bg-card rounded-2xl shadow-soft border border-border/40 overflow-hidden">
            <div className="hidden sm:grid sm:grid-cols-[60px_1fr_1.5fr] bg-secondary/50 px-6 py-4 text-sm font-bold text-foreground border-b border-border/40">
              <span>#</span>
              <span>Dimension</span>
              <span>What We Look At</span>
            </div>
            {dimensions.map((d, i) => (
              <div
                key={d.num}
                className={`grid sm:grid-cols-[60px_1fr_1.5fr] gap-2 sm:gap-0 px-6 py-5 ${
                  i < dimensions.length - 1 ? "border-b border-border/30" : ""
                }`}
              >
                <span className="font-bold text-accent text-sm">{d.num}</span>
                <span className="font-display font-semibold text-foreground text-sm">{d.name}</span>
                <span className="text-sm text-muted-foreground leading-relaxed">{d.detail}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 4 — What You Receive */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              What happens after you complete the assessment.
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: ClipboardList,
                label: "Complete the Assessment",
                text: "Answer 15 structured questions covering the seven dimensions. Takes approximately 15 minutes.",
              },
              {
                icon: FileText,
                label: "Receive Your Practice Health Summary",
                text: "A summary of your responses mapped across the seven dimensions, with a note on where the assessment identified areas worth examining further.",
              },
              {
                icon: MessageSquare,
                label: "Optional: Review With a Vitalis Consultant",
                text: "If you would like to discuss your results, you can book a free 45-minute consultation with a Vitalis advisor. There is no obligation to engage further.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                {...fadeUp}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
          <motion.p {...fadeUp} className="text-center mt-12 text-xs text-muted-foreground/70 italic">
            All responses are confidential. Vitalis does not share or publish any practice-level data.
          </motion.p>
        </div>
      </section>

      {/* Section 5 — Authority */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Built by practitioners. Used by practices across Canada.
            </h2>
          </motion.div>
          <motion.p {...fadeUp} className="text-muted-foreground text-lg leading-relaxed text-center max-w-3xl mx-auto mb-12">
            The Vitalis Practice Assessment is built on the same framework our team uses in full Strategic Analysis engagements — across medical clinics, dental practices, and veterinary facilities. It reflects what we have consistently found matters most when evaluating how a practice is performing and where the clearest opportunities for improvement tend to be.
          </motion.p>
          <motion.div {...fadeUp} className="bg-card rounded-2xl p-8 lg:p-10 shadow-soft border border-border/40 max-w-2xl mx-auto">
            <Quote className="h-8 w-8 text-accent/40 mb-4" />
            <blockquote className="text-foreground text-lg italic leading-relaxed mb-4">
              "Going through the assessment gave us a clearer picture of our billing process than three years of internal reviews had."
            </blockquote>
            <p className="text-sm text-muted-foreground">— Practice owner, Calgary (name withheld)</p>
          </motion.div>
        </div>
      </section>

      {/* Section 6 — How It Works */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Three steps. About 15 minutes.
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: ClipboardList, text: "Complete 15 questions" },
              { icon: FileText, text: "Receive your summary" },
              { icon: MessageSquare, text: "Optional consultation (free)" },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08 }} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7 — Final CTA */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
              The assessment is free. Your results are confidential.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              If you have been wondering where your practice stands — on billing, operations, staffing, growth, or compliance — this is a practical starting point.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/strategic-assessment/intake">
                Begin the Free Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="mt-6">
              <Link to="/contact" className="text-sm text-primary hover:text-foreground underline underline-offset-2 transition-colors">
                Prefer to speak with someone first? Book a 20-minute call →
              </Link>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StrategicAssessment;

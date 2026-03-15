import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  TrendingUp,
  CheckCircle,
  Target,
  Compass,
  ClipboardList,
} from "lucide-react";
import { usePageMeta } from "@/lib/seo";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const StrategicAssessment = () => {
  usePageMeta(
    "Free Practice Assessment | Operational & Financial Analysis | Vitalis Health Strategies",
    "A free structured assessment across 7 dimensions of practice performance. See where your practice stands and where to focus first."
  );
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.div {...fadeUp}>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center">
                <Compass className="h-8 w-8 text-accent" />
              </div>
            </div>
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-6">
              Strategic Planning Tool
            </p>
            <h1 className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
              Strategic Assessment
            </h1>
            <p className="mt-8 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              A structured planning and strategy tool designed to help physicians and healthcare organizations evaluate their next steps — whether launching a new practice or optimizing an existing one.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What it is */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
              What is the Strategic Assessment?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto mb-4">
              The Strategic Assessment is a guided evaluation that helps you understand where you stand, what decisions are ahead, and how to move forward with confidence.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
              Based on your situation, we'll guide you to the right assessment path — one designed for new ventures and one designed for existing practices.
            </p>
          </motion.div>

          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: ClipboardList,
                title: "Guided Process",
                desc: "Answer a short set of questions and we'll identify the most relevant assessment for your situation.",
              },
              {
                icon: Target,
                title: "Two Focused Paths",
                desc: "Whether you're building something new or improving what exists, there's a dedicated assessment for you.",
              },
              {
                icon: CheckCircle,
                title: "Strategic Clarity",
                desc: "Gain clarity on your priorities, readiness, and the key decisions ahead for your practice.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-7 shadow-soft border border-border/40 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Two Pathways */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Two Assessment Paths</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Which best describes your situation?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Track A */}
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl p-8 lg:p-10 shadow-card border border-border/40 flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mb-6">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                Planning a New Clinic or Space
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                You're in the early stages of planning a new healthcare facility, clinic, or practice. You need clarity on strategy, feasibility, and readiness before making major commitments.
              </p>
              <div className="space-y-2 mb-6">
                {[
                  "Clinic Build Readiness Assessment",
                  "Practice Launch Strategic Planning",
                  "Facility & Operations Strategy",
                  "Financial & Operational Feasibility",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground/70 italic">
                Ideal for physicians planning a new clinic, expanding into a new facility, or exploring a healthcare venture.
              </p>
            </motion.div>

            {/* Track B */}
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-8 lg:p-10 shadow-card border border-border/40 flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                Improving an Existing Clinic
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                You're operating an existing practice and want to evaluate performance, optimize operations, or plan for growth. You need a strategic review of where things stand today.
              </p>
              <div className="space-y-2 mb-6">
                {[
                  "Practice Performance Assessment",
                  "Operational Efficiency Review",
                  "Revenue & Workflow Optimization",
                  "Growth & Expansion Planning",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground/70 italic">
                Ideal for clinic owners seeking performance improvement, operational reviews, or strategic growth planning.
              </p>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div {...fadeUp} className="text-center mt-16">
            <p className="text-muted-foreground mb-6">
              Not sure which path is right? Start the intake and we'll guide you.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/strategic-assessment/intake">
                Start Your Strategic Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          <motion.p {...fadeUp} className="text-center mt-10 text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
            Your assessment results may point toward{" "}
            <Link to="/solutions/existing-clinics" className="text-primary hover:text-foreground underline underline-offset-2 transition-colors">Operations & Workflow Optimization</Link>,{" "}
            <Link to="/solutions/existing-clinics" className="text-primary hover:text-foreground underline underline-offset-2 transition-colors">Billing & Revenue Review</Link>,{" "}
            <Link to="/solutions/new-clinics" className="text-primary hover:text-foreground underline underline-offset-2 transition-colors">Growth Strategy & Expansion Planning</Link>, or{" "}
            <Link to="/engagement" className="text-primary hover:text-foreground underline underline-offset-2 transition-colors">Fractional & Advisory Leadership</Link>.
          </motion.p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              How It Works
            </h2>
          </motion.div>
          <div className="space-y-0">
            {[
              { step: "1", title: "Complete the Intake", desc: "Share key information about your situation, goals, and timeline." },
              { step: "2", title: "We Identify Your Path", desc: "Based on your answers, we'll match you with the most relevant Strategic Assessment." },
              { step: "3", title: "Receive Your Assessment", desc: "You'll be guided to a focused assessment designed for your specific situation." },
              { step: "4", title: "Gain Strategic Clarity", desc: "Understand your readiness, priorities, and next steps — backed by strategic insight." },
            ].map((item, i, arr) => (
              <motion.div key={item.step} {...fadeUp} transition={{ delay: i * 0.08 }} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-accent">{item.step}</span>
                  </div>
                  {i < arr.length - 1 && <div className="w-px flex-1 bg-border my-2" />}
                </div>
                <div className="pb-10">
                  <h3 className="font-display text-lg font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <Compass className="h-12 w-12 text-accent mx-auto mb-6" />
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Take the first step toward strategic clarity. The assessment takes just a few minutes to begin.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/strategic-assessment/intake">
                Start Your Strategic Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StrategicAssessment;

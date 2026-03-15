import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, ClipboardList, Map, FileText, Wrench, TrendingUp } from "lucide-react";

const phases = [
  {
    icon: MessageSquare,
    phase: "Phase 1",
    title: "Initial Conversation",
    description:
      "Practitioners and practice leaders connect with Vitalis to discuss goals, challenges, and opportunities. No commitment required.",
    details: ["Consultation call", "Initial discovery", "Discussion of goals and priorities"],
  },
  {
    icon: ClipboardList,
    phase: "Phase 2",
    title: "Strategic Assessment",
    description:
      "Clients often begin with a structured assessment to identify strengths, risks, opportunities, and practical priorities.",
    details: [
      "Practice Build Readiness Assessment (new practices)",
      "Practice Performance Assessment (existing practices)",
      "Gap analysis and strategic priorities",
    ],
  },
  {
    icon: Map,
    phase: "Phase 3",
    title: "Strategic Roadmap",
    description:
      "Vitalis develops a roadmap that aligns operational improvements, technology planning, staffing structure, and growth priorities.",
    details: ["Operational strategy", "Technology planning", "Staffing structure", "Growth priorities"],
  },
  {
    icon: FileText,
    phase: "Phase 4",
    title: "Proposal and Engagement",
    description:
      "Clients receive a clear proposal outlining scope, timeline, deliverables, and engagement model tailored to their context.",
    details: ["Defined scope", "Timeline and milestones", "Deliverables", "Engagement structure"],
  },
  {
    icon: Wrench,
    phase: "Phase 5",
    title: "Implementation Support",
    description:
      "Vitalis supports execution through workflow design, technology planning, leadership alignment, and operational improvement.",
    details: ["Workflow design", "Technology implementation planning", "Leadership support", "Operational refinement"],
  },
  {
    icon: TrendingUp,
    phase: "Phase 6",
    title: "Growth & Ongoing Advisory",
    description:
      "Many engagements continue as long-term advisory relationships supporting expansion strategy, recruitment, and sustained performance.",
    details: ["Expansion strategy", "Practitioner recruitment", "Strategic transactions", "Ongoing advisory support"],
  },
];

const Engagement = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent font-medium tracking-widest uppercase text-sm mb-6"
          >
            Engagement Model
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight"
          >
            A structured path with coordinated strategic support.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl"
          >
            Healthcare ventures often involve multiple advisors — architects, legal counsel, lenders, and technology specialists. We work alongside you to coordinate these relationships so decisions stay aligned and progress remains focused throughout the engagement.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-10">
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                Start the Conversation <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">Six-Phase Engagement Journey</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              Clear phases, clear decisions, and practical guidance from initial planning through ongoing advisory support.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-card transition-all duration-300 border border-border/40"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <phase.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent">{phase.phase}</span>
                    <h3 className="font-display text-xl font-bold text-foreground mt-2 mb-3">{phase.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{phase.description}</p>
                    <ul className="space-y-1.5">
                      {phase.details.map((detail) => (
                        <li key={detail} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-5">Built for long-term partnership</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            While some clients engage for specific projects, many retain Vitalis for ongoing strategic advisory. This continuity helps maintain alignment as organizations scale, adapt, and pursue new opportunities across Calgary and Canada.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">Ready to begin?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              Start with a strategic conversation and determine the right pathway for your organization.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Talk to Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/strategic-assessment/intake">Explore Your Practice Strategy</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Engagement;

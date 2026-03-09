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
    description: "Physicians or clinic leaders connect with Vitalis to discuss goals, challenges, and opportunities. No commitment required.",
    details: [
      "Consultation call",
      "Initial discovery",
      "Discussion of goals and challenges",
    ],
  },
  {
    icon: ClipboardList,
    phase: "Phase 2",
    title: "Strategic Assessment",
    description: "Depending on the situation, clients may begin with an assessment to identify strengths, risks, opportunities, and priorities.",
    details: [
      "Practice Launch Assessment (for new clinics)",
      "Practice Performance Assessment (for existing clinics)",
      "Strengths and gap analysis",
      "Priority identification",
    ],
  },
  {
    icon: Map,
    phase: "Phase 3",
    title: "Strategic Roadmap",
    description: "Vitalis develops a roadmap that outlines operational improvements, technology strategy, staffing structure, and growth opportunities.",
    details: [
      "Operational improvements",
      "Technology strategy",
      "Staffing structure",
      "Growth opportunities",
    ],
  },
  {
    icon: FileText,
    phase: "Phase 4",
    title: "Proposal and Engagement",
    description: "Clients receive a proposal outlining scope, timeline, deliverables, and engagement model tailored to their specific needs.",
    details: [
      "Scope of work",
      "Timeline and milestones",
      "Deliverables",
      "Engagement model",
    ],
  },
  {
    icon: Wrench,
    phase: "Phase 5",
    title: "Implementation Support",
    description: "Vitalis assists with execution through workshops, leadership meetings, operational design, and systems integration.",
    details: [
      "Workflow design",
      "Technology planning",
      "Leadership development",
      "Operational improvements",
    ],
  },
  {
    icon: TrendingUp,
    phase: "Phase 6",
    title: "Growth or Transition",
    description: "Some engagements continue into expansion strategy, physician recruitment, mergers and acquisitions, or exit planning.",
    details: [
      "Expansion strategy",
      "Physician recruitment",
      "Mergers or acquisitions",
      "Exit planning",
    ],
  },
];

const engagementTypes = [
  {
    title: "Strategic Advisory",
    description: "Ongoing strategic guidance and advisory support",
  },
  {
    title: "Project-Based Consulting",
    description: "Specific project delivery with defined outcomes",
  },
  {
    title: "Operational Improvement Programs",
    description: "Comprehensive operational transformation",
  },
  {
    title: "Technology Transformation",
    description: "Digital modernization and EHR implementation",
  },
  {
    title: "Leadership Support",
    description: "Executive coaching and leadership development",
  },
  {
    title: "Transaction Support",
    description: "M&A preparation and transaction execution",
  },
];

const Engagement = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-accent font-medium tracking-widest uppercase text-sm mb-6">
            How We Engage
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            A structured journey to success.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Every engagement follows a proven framework designed to deliver clarity, strategy, and results. Here's how we typically work together.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-10">
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">Start the Conversation <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Engagement Phases */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Six-Phase Engagement Journey
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              Our structured approach ensures every engagement delivers clear outcomes and measurable value.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-card transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <phase.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent">{phase.phase}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-3">{phase.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{phase.description}</p>
                    <ul className="space-y-1">
                      {phase.details.map((detail) => (
                        <li key={detail} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                          {detail}
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

      {/* Engagement Types */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Engagement Structures
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              We tailor our engagement model to match your specific needs, timeline, and objectives.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {engagementTypes.map((type, i) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl p-6 shadow-soft hover:shadow-card transition-all duration-300 text-center"
              >
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{type.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{type.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Ready to begin your journey?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              Every successful healthcare venture starts with a conversation. Let's discuss your vision and how we can help bring it to life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Book a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/clinic-audit">Explore Your Practice Strategy</Link>
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
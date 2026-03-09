import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Scale,
  Briefcase,
  Building2,
  Laptop2,
  Users,
  Landmark,
  Clock,
  MessageSquareOff,
  AlignHorizontalDistributeCenter,
  TrendingDown,
  Target,
  ArrowRight,
} from "lucide-react";

const advisorTypes = [
  { icon: Briefcase, label: "Financial Advisors" },
  { icon: Scale, label: "Legal Counsel" },
  { icon: Building2, label: "Architects & Designers" },
  { icon: Laptop2, label: "Technology Providers" },
  { icon: Users, label: "Recruitment Specialists" },
  { icon: Landmark, label: "Banking & Lending" },
];

const leftAdvisors = advisorTypes.slice(0, 3);
const rightAdvisors = advisorTypes.slice(3);

const benefits = [
  {
    icon: Clock,
    title: "Reduced Coordination Burden",
    description:
      "Healthcare professionals already manage demanding schedules. Coordinating multiple advisors independently can consume significant time. Working through a coordinated model allows physicians to focus on patients and clinical leadership.",
  },
  {
    icon: AlignHorizontalDistributeCenter,
    title: "Aligned Decision-Making",
    description:
      "Architects focus on design. Banks focus on financing. Lawyers focus on legal structure. Vitalis helps ensure these decisions align with the long-term success of the practice rather than optimizing in isolation.",
  },
  {
    icon: MessageSquareOff,
    title: "Fewer Communication Gaps",
    description:
      "When advisors operate independently, disconnects can occur — design decisions that conflict with workflows, technology that doesn't match operations, or financial structures misaligned with staffing models.",
  },
  {
    icon: Target,
    title: "Better Strategic Outcomes",
    description:
      "Strategic coordination ensures that facility design supports operational workflows, technology investments support daily operations, and staffing structures support sustainable growth.",
  },
];

export function TrustedNetworkSection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Hook */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">
            Coordinated Advisory
          </p>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            Healthcare projects rarely involve just one advisor.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-muted-foreground text-lg leading-relaxed">
            Physicians launching or growing clinics often need financing partners, architects, legal advisors, technology vendors, and operational consultants. We work alongside you to coordinate trusted partners — ensuring decisions are aligned and projects move forward efficiently.
          </p>
        </motion.div>

        {/* Hub Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto mb-24"
        >
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-4">
            <div className="flex flex-col gap-3 w-full lg:flex-1">
              {leftAdvisors.map((advisor, i) => (
                <motion.div
                  key={advisor.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 bg-card rounded-xl px-5 py-4 shadow-soft border border-border/40"
                >
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <advisor.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{advisor.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="hidden lg:flex flex-col gap-3 items-center text-muted-foreground/40">
              {leftAdvisors.map((_, i) => (
                <ArrowRight key={i} className="h-4 w-4" />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-forest rounded-2xl p-8 lg:p-10 text-primary-foreground text-center flex-shrink-0 w-full lg:w-56 shadow-elevated"
            >
              <div className="font-display text-2xl lg:text-3xl font-bold mb-1">Vitalis</div>
              <div className="text-xs uppercase tracking-widest opacity-70 mb-4">Your Strategic Partner</div>
              <p className="text-sm leading-relaxed opacity-85">
                Working alongside you to coordinate the right expertise
              </p>
            </motion.div>

            <div className="hidden lg:flex flex-col gap-3 items-center text-muted-foreground/40">
              {rightAdvisors.map((_, i) => (
                <ArrowRight key={i} className="h-4 w-4 rotate-180" />
              ))}
            </div>

            <div className="flex flex-col gap-3 w-full lg:flex-1">
              {rightAdvisors.map((advisor, i) => (
                <motion.div
                  key={advisor.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 bg-card rounded-xl px-5 py-4 shadow-soft border border-border/40"
                >
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <advisor.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{advisor.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        <div className="max-w-5xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Why coordinated advisory works
            </h3>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-7 shadow-soft hover:shadow-card transition-all duration-300 border border-border/40"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-5">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-display text-lg font-bold text-foreground mb-3">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Link to partners page */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Vitalis collaborates with trusted professionals across finance, architecture, legal, and technology.
          </p>
          <Link
            to="/partners"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-foreground transition-colors"
          >
            Explore the partner ecosystem
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

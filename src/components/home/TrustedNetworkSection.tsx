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
    title: "Time Savings",
    description:
      "Healthcare professionals already manage demanding schedules. Coordinating multiple advisors independently consumes significant time in meetings, emails, and project discussions. A coordinated advisory approach allows physicians to focus on patients and clinical leadership while strategic alignment happens behind the scenes.",
  },
  {
    icon: MessageSquareOff,
    title: "Reduced Communication Breakdowns",
    description:
      "When advisors operate independently, communication gaps can occur — design decisions that conflict with operational workflows, technology choices that don't align with clinic processes, or financial assumptions that don't match operational realities. Coordinated advisory helps prevent these disconnects.",
  },
  {
    icon: AlignHorizontalDistributeCenter,
    title: "Better Strategic Alignment",
    description:
      "Architects focus on design. Banks focus on financing. Lawyers focus on legal structure. Each advisor optimizes for their own domain. Vitalis helps ensure decisions across finance, operations, facility design, staffing models, and technology align with the long-term success of the practice.",
  },
  {
    icon: TrendingDown,
    title: "Lower Long-Term Costs",
    description:
      "Fragmented advisory often leads to costly corrections — inefficient clinic layouts that reduce patient flow, technology purchases that require early replacement, or staffing models that create unnecessary overhead. Strategic coordination early in the process helps prevent these expensive adjustments.",
  },
  {
    icon: Target,
    title: "Stronger Return on Investment",
    description:
      "Healthcare facilities involve significant capital investment. Strategic coordination ensures that facility design supports operational workflows, technology investments support daily operations, and staffing structures support sustainable growth — improving long-term performance and value creation.",
  },
];

const featuredPartners = [
  {
    name: "ATB Financial",
    category: "Financial & Banking",
    description:
      "ATB Financial provides specialized banking and advisory services for healthcare professionals. Their healthcare and private wealth teams support physicians and clinic operators with financing, capital planning, and long-term financial strategy.",
    collaboration:
      "Vitalis works closely with ATB to support clients with clinic financing, facility builds, financial restructuring, and growth planning.",
  },
  {
    name: "Holland Design",
    category: "Architecture & Facility Design",
    description:
      "Holland Design is an architectural and design firm with deep experience in healthcare facility planning and medical environments, creating clinical spaces that support operational efficiency and patient experience.",
    collaboration:
      "Vitalis collaborates with Holland Design to ensure clinic layouts support operational workflows, patient flow, and long-term practice growth.",
  },
  {
    name: "Field Law",
    category: "Legal & Regulatory",
    description:
      "Field Law is a full-service law firm with dedicated healthcare practice groups. Their team supports healthcare organizations with regulatory compliance, corporate structuring, licensing, and transaction advisory.",
    collaboration:
      "Vitalis works with Field Law to ensure clients receive comprehensive legal guidance throughout clinic development, operational changes, and strategic transactions.",
  },
];

export function TrustedNetworkSection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">
            Coordinated Healthcare Advisory
          </p>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            One partner. Every conversation.
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Healthcare ventures often involve architects, lenders, legal advisors, technology providers, and operational consultants. Vitalis helps coordinate these relationships — ensuring decisions are aligned and projects move forward efficiently.
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
            {/* Left advisors */}
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

            {/* Connecting arrows left */}
            <div className="hidden lg:flex flex-col gap-3 items-center text-muted-foreground/40">
              {leftAdvisors.map((_, i) => (
                <ArrowRight key={i} className="h-4 w-4" />
              ))}
            </div>

            {/* Central Vitalis Hub */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-forest rounded-2xl p-8 lg:p-10 text-primary-foreground text-center flex-shrink-0 w-full lg:w-56 shadow-elevated"
            >
              <div className="font-display text-2xl lg:text-3xl font-bold mb-1">Vitalis</div>
              <div className="text-xs uppercase tracking-widest opacity-70 mb-4">Strategic Hub</div>
              <p className="text-sm leading-relaxed opacity-85">
                Coordinating your entire advisory ecosystem
              </p>
            </motion.div>

            {/* Connecting arrows right */}
            <div className="hidden lg:flex flex-col gap-3 items-center text-muted-foreground/40">
              {rightAdvisors.map((_, i) => (
                <ArrowRight key={i} className="h-4 w-4 rotate-180" />
              ))}
            </div>

            {/* Right advisors */}
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

        {/* Why it works section */}
        <div className="max-w-5xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Why the coordinated model works
            </h3>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Working through a coordinated advisory structure has practical advantages that extend beyond convenience.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.slice(0, 3).map((benefit, i) => (
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
          <div className="grid sm:grid-cols-2 gap-6 mt-6">
            {benefits.slice(3).map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i + 3) * 0.08 }}
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

        {/* Featured Partners */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-10">
            <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              A trusted advisory network
            </h3>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Vitalis works with a curated group of professionals who understand healthcare ventures and share a commitment to physician success.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-10">
            {featuredPartners.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-7 shadow-soft border border-border/40"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">
                  {partner.category}
                </p>
                <h4 className="font-display text-lg font-bold text-foreground mb-3">{partner.name}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{partner.description}</p>
                <div className="border-t border-border/40 pt-4">
                  <p className="text-xs text-muted-foreground leading-relaxed italic">{partner.collaboration}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/partners"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-foreground transition-colors"
            >
              View the full partner ecosystem
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

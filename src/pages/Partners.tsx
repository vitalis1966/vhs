import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  Scale,
  Laptop2,
  Home,
  Landmark,
  Briefcase,
  Clock,
  MessageSquareOff,
  Target,
  TrendingDown,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { usePageMeta } from "@/lib/seo";

const ecosystemPartners = [
  { icon: Landmark, label: "Financial Institutions", angle: 0 },
  { icon: Scale, label: "Legal Advisors", angle: 60 },
  { icon: Building2, label: "Architecture & Design", angle: 120 },
  { icon: Home, label: "Real Estate Advisors", angle: 180 },
  { icon: Laptop2, label: "Technology Providers", angle: 240 },
  { icon: Briefcase, label: "Operational Consultants", angle: 300 },
];

const benefits = [
  {
    icon: Clock,
    title: "Time Savings",
    description: "Physicians often spend significant time coordinating advisors independently — time that could be spent on patient care or clinical leadership. A coordinated advisory structure helps reduce this burden, allowing healthcare leaders to focus on what matters most.",
  },
  {
    icon: MessageSquareOff,
    title: "Reduced Communication Breakdowns",
    description: "When multiple advisors operate independently, misalignment often occurs. Facility design may conflict with workflows. Technology systems may not match operational needs. Financial structures may be misaligned with staffing models. Coordinated advisory reduces these risks.",
  },
  {
    icon: Target,
    title: "Better Strategic Alignment",
    description: "Each advisor naturally focuses on their domain — architects optimize design, bankers focus on financing, lawyers focus on legal structure. Vitalis helps align these decisions across finance, operations, design, and technology to support the overall success of the practice.",
  },
  {
    icon: TrendingDown,
    title: "Lower Long-Term Costs",
    description: "Poor coordination often leads to expensive corrections later — inefficient clinic layouts requiring renovation, technology replacements, or operational inefficiencies that persist for years. Strategic coordination early in a project prevents these costly issues.",
  },
  {
    icon: DollarSign,
    title: "Stronger Return on Investment",
    description: "Healthcare facilities require major capital investment. Aligned decision-making across design, operations, technology, and finance improves long-term outcomes — protecting the investment and positioning the practice for sustainable success.",
  },
];

const Partners = () => {
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
            Strategic Ecosystem
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight"
          >
            Healthcare ventures require many specialists.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl"
          >
            Practitioners launching or growing practices often need financing partners, architects, legal advisors, real estate specialists, technology vendors, and operational consultants. Vitalis helps coordinate these professionals — ensuring decisions are aligned and projects move forward efficiently.
          </motion.p>
        </div>
      </section>

      {/* Visual Ecosystem Diagram */}
      <section className="py-20 lg:py-28 bg-background overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">The Vitalis Model</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Your strategic hub for healthcare advisory.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Rather than managing multiple disconnected advisors, Vitalis serves as a central coordinator — ensuring all expertise aligns with your strategic goals.
            </p>
          </div>

          {/* Hub-and-Spoke Diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative max-w-4xl mx-auto"
          >
            {/* Desktop: Circular Hub-and-Spoke */}
            <div className="hidden lg:block relative h-[520px]">
              {/* Connecting lines */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 500 500"
                preserveAspectRatio="xMidYMid meet"
              >
                {ecosystemPartners.map((partner, i) => {
                  const angleRad = (partner.angle - 90) * (Math.PI / 180);
                  const x2 = 250 + Math.cos(angleRad) * 180;
                  const y2 = 250 + Math.sin(angleRad) * 180;
                  return (
                    <motion.line
                      key={i}
                      x1="250"
                      y1="250"
                      x2={x2}
                      y2={y2}
                      stroke="hsl(var(--accent))"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.5 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  );
                })}
              </svg>

              {/* Center Hub - Vitalis */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <div className="w-40 h-40 rounded-full bg-gradient-forest flex flex-col items-center justify-center text-primary-foreground shadow-elevated">
                  <span className="font-display text-2xl font-bold">Vitalis</span>
                  <span className="text-xs uppercase tracking-wider opacity-80 mt-1">Strategic Hub</span>
                </div>
              </motion.div>

              {/* Partner nodes */}
              {ecosystemPartners.map((partner, i) => {
                const angleRad = (partner.angle - 90) * (Math.PI / 180);
                const x = 50 + Math.cos(angleRad) * 36;
                const y = 50 + Math.sin(angleRad) * 36;
                return (
                  <motion.div
                    key={partner.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                    className="absolute z-10"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="bg-card rounded-2xl p-5 shadow-card hover:shadow-elevated transition-all duration-300 border border-border/40 text-center min-w-[150px]">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
                        <partner.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-foreground leading-tight block">
                        {partner.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile: Stacked layout */}
            <div className="lg:hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-forest rounded-2xl p-8 text-primary-foreground text-center mb-8 shadow-elevated"
              >
                <span className="font-display text-2xl font-bold">Vitalis</span>
                <span className="block text-xs uppercase tracking-wider opacity-80 mt-1 mb-3">
                  Strategic Hub
                </span>
                <p className="text-sm leading-relaxed opacity-85">
                  Coordinating trusted partners for your healthcare venture
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                {ecosystemPartners.map((partner, i) => (
                  <motion.div
                    key={partner.label}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-card rounded-xl p-4 shadow-soft border border-border/40 text-center"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-2">
                      <partner.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{partner.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Coordinated Advisory Works */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">The Value of Coordination</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Why coordinated advisory works.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Healthcare projects involve many specialists. Without coordination, decisions can conflict, timelines can slip, and costs can escalate. Vitalis helps align the work of every advisor toward your strategic goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-7 shadow-soft hover:shadow-card transition-all duration-300 border border-border/40"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Partners */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Featured Partners</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Trusted professionals we work with.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Vitalis collaborates with established professionals who specialize in supporting healthcare ventures. Here are some of our key strategic partners.
            </p>
          </div>

          {/* ATB Financial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 lg:p-10 shadow-card border border-border/40 mb-8"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-forest flex items-center justify-center mb-4">
                  <Landmark className="h-8 w-8 text-primary-foreground" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">Financial Partner</p>
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">ATB Financial</h3>
                <p className="text-sm text-muted-foreground mt-2">Healthcare & Private Wealth</p>
              </div>
              <div className="lg:col-span-2">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  ATB's Healthcare and Private Wealth teams support physicians and healthcare organizations with financing, capital planning, and financial strategy. They understand the unique financial needs of healthcare ventures — from clinic development financing to practice acquisition and long-term wealth planning.
                </p>
                <div className="bg-secondary/30 rounded-xl p-5">
                  <h4 className="font-semibold text-foreground mb-3">Vitalis collaborates with ATB to support:</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {["Clinic development financing", "Facility builds and expansion", "Financial restructuring", "Growth and acquisition planning"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Holland Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 lg:p-10 shadow-card border border-border/40 mb-8"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-primary-foreground" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">Architecture & Design</p>
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Holland Design</h3>
                <p className="text-sm text-muted-foreground mt-2">Healthcare Environments</p>
              </div>
              <div className="lg:col-span-2">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Holland Design specializes in healthcare facility planning and design. They create clinical environments that balance patient experience, operational efficiency, regulatory compliance, and long-term flexibility for growth.
                </p>
                <div className="bg-secondary/30 rounded-xl p-5">
                  <h4 className="font-semibold text-foreground mb-3">Vitalis works with Holland Design to ensure practice layouts support:</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {["Patient flow and experience", "Operational workflows", "Staffing models and efficiency", "Long-term practice growth"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Field Law */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 lg:p-10 shadow-card border border-border/40"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4">
                  <Scale className="h-8 w-8 text-primary-foreground" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">Legal Partner</p>
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Field Law</h3>
                <p className="text-sm text-muted-foreground mt-2">Legal Advisory Services</p>
              </div>
              <div className="lg:col-span-2">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Field Law provides legal advisory services relevant to healthcare ventures and organizations. Their expertise spans corporate structuring, regulatory guidance, partnership agreements, and transaction support for healthcare businesses.
                </p>
                <div className="bg-secondary/30 rounded-xl p-5">
                  <h4 className="font-semibold text-foreground mb-3">Vitalis works with legal partners to ensure alignment in:</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {["Business structure and governance", "Regulatory and compliance considerations", "Partnership and shareholder agreements", "Transaction and acquisition support"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Additional Partner Categories */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Additional partner categories.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Beyond our featured partners, Vitalis coordinates with trusted professionals across additional categories based on project needs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Home,
                title: "Real Estate Advisors",
                description: "Site selection, lease negotiation, property acquisition, and location strategy for healthcare facilities.",
              },
              {
                icon: Laptop2,
                title: "Technology Providers",
                description: "EHR systems, practice management software, IT infrastructure, and digital health solutions.",
              },
              {
                icon: Briefcase,
                title: "Operational Consultants",
                description: "Workflow optimization, process improvement, and operational excellence specialists.",
              },
            ].map((category, i) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-7 shadow-soft border border-border/40"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{category.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{category.description}</p>
              </motion.div>
            ))}
          </div>
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
              Ready to coordinate your healthcare venture?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Whether you're planning a new practice or looking for an objective view of an existing one, Vitalis can help coordinate the right expertise for your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Talk to Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero" size="xl" asChild>
                <Link to="/strategic-assessment/intake">
                  Explore a Practice Assessment
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

export default Partners;

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Monitor,
  Wifi,
  Shield,
  Database,
  BarChart2,
  Settings,
  CheckCircle,
  Building2,
  RefreshCw,
  Stethoscope,
  Laptop,
  Server,
  Lock,
  Headphones,
  Zap,
  Users,
  ClipboardList,
} from "lucide-react";
import { usePageMeta } from "@/lib/seo";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const coverageCards = [
  { icon: Monitor, label: "Managed IT Services", text: "Ongoing infrastructure management, monitoring, helpdesk, and support — so your team focuses on patients, not IT problems." },
  { icon: Wifi, label: "Network & Infrastructure", text: "Secure network design, firewall configuration, VPN access, and segmented clinical and administrative systems." },
  { icon: Shield, label: "Cybersecurity", text: "Firewall management, endpoint protection, data encryption, and vulnerability monitoring for healthcare environments." },
  { icon: Laptop, label: "Hardware & Procurement", text: "Workstations, servers, tablets, and peripherals — selected for EMR compatibility and clinical workflow requirements." },
  { icon: Database, label: "Backup & Recovery", text: "Automated backups, secure data storage, disaster recovery planning, and rapid restoration for critical systems." },
  { icon: BarChart2, label: "Operational Dashboards", text: "Custom reporting built from your EMR data — patient volumes, provider utilization, billing performance, and scheduling gaps." },
  { icon: ClipboardList, label: "EMR Advisory", text: "Platform evaluation, selection guidance, workflow configuration, and reporting structure — without replacing your vendor relationship." },
  { icon: Settings, label: "IT Strategy & Roadmap", text: "Long-term technology planning, vendor selection, upgrade timelines, and infrastructure investment aligned with your growth plans." },
  { icon: Headphones, label: "Helpdesk Support", text: "Ticketing system, remote troubleshooting, device support, and network issue resolution for your clinical team." },
];

const emrPlatforms = [
  { name: "Med Access", desc: "Widely used by Canadian physicians and specialists. Web-based, configurable, with scheduling and billing." },
  { name: "CHR", desc: "Collaborative Health Record. Integrated platform for multi-provider practices." },
  { name: "AVA EMR", desc: "Developed in Calgary. Integrated scheduling, charting, billing, and patient communication." },
  { name: "Zenoti", desc: "Enterprise platform for health and wellness clinics with scheduling, billing, and marketing." },
  { name: "Jane App", desc: "Canadian practice management with online booking, charting, telehealth, and insurance billing." },
];

const processSteps = [
  { icon: ClipboardList, label: "Assessment", text: "We review your current technology environment — systems, network, security, and data utilization — and identify gaps and priorities." },
  { icon: Settings, label: "Recommendation", text: "You receive a clear, prioritized plan: what to fix first, what can wait, and what will have the most immediate operational impact." },
  { icon: Zap, label: "Implementation", text: "We manage the setup, procurement, configuration, and vendor coordination — without disrupting your clinical operations." },
  { icon: RefreshCw, label: "Ongoing Support", text: "Monitoring, helpdesk, strategic reviews, and technology roadmap updates — so your systems stay ahead of your practice's growth." },
];

const HealthcareIT = () => {
  usePageMeta(
    "Digital Transformation for Healthcare Practices | EMR & Technology Consulting | Vitalis",
    "Modernize your practice management systems, EMR setup, and digital workflows with Vitalis technology consulting.",
    "/og-healthcare-it.jpg"
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── SECTION 1 — HERO ── */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div {...fadeUp} className="flex items-center gap-2 mb-6">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Healthcare IT</span>
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight"
          >
            Your practice runs on technology. Most of it is not working as hard as it should.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl"
          >
            Slow systems, fragmented software, and outdated infrastructure cost practices time, revenue, and patient experience every day — without anyone noticing until something fails. Vitalis provides technology strategy and managed IT services built specifically for medical, dental, and veterinary practices.
          </motion.p>
          <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="mt-10 flex flex-wrap gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/strategic-assessment">
                Get a Technology Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/contact">Speak With Our Team</Link>
            </Button>
          </motion.div>
          <motion.p {...fadeUp} transition={{ delay: 0.4 }} className="mt-6 text-sm text-muted-foreground">
            Supporting medical, dental, and veterinary practices across Canada.
          </motion.p>
        </div>
      </section>

      {/* ── SECTION 2 — THE REAL PROBLEM ── */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                label: "Systems That Slow You Down",
                text: "Every minute your team spends navigating a slow EMR or waiting on IT is a minute not spent on patient care.",
              },
              {
                icon: Lock,
                label: "Security Gaps You May Not Know About",
                text: "Healthcare data is the most targeted in any industry. Most practices have at least one significant vulnerability.",
              },
              {
                icon: BarChart2,
                label: "Data You Collect But Cannot Use",
                text: "Your EMR contains performance data that most practices never access — billing trends, provider utilization, scheduling gaps.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border-l-4 border-accent shadow-soft"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center mb-4">
                  <card.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{card.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — TWO PATHS ── */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              How we help — and where you are in your journey.
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Card 1 — New Build */}
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl p-8 shadow-card border-t-4 border-primary"
            >
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary-foreground bg-primary px-3 py-1 rounded-full mb-4">
                New Practice Build
              </span>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">Get it right from day one.</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Technology decisions made during a build are the hardest and most expensive to reverse. Vitalis designs your complete IT infrastructure before you open — so you launch with systems that work, networks that are secure, and software that fits how you actually practice.
              </p>
              <p className="text-sm font-semibold text-foreground mb-3">What we set up:</p>
              <ul className="space-y-2 mb-8">
                {[
                  "Network architecture and secure Wi-Fi",
                  "Workstations, servers, and clinical hardware",
                  "EMR selection and configuration guidance",
                  "Cybersecurity framework from day one",
                  "Practice management software setup",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  Discuss Your Build
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Card 2 — Existing */}
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-8 shadow-card border-t-4 border-accent"
            >
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent-foreground bg-accent px-3 py-1 rounded-full mb-4">
                Existing Practice
              </span>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">Fix what is costing you.</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Most established practices have at least one technology problem they have learned to work around. An IT audit identifies what is underperforming, what is creating risk, and where a targeted upgrade would have the most immediate impact.
              </p>
              <p className="text-sm font-semibold text-foreground mb-3">What we review:</p>
              <ul className="space-y-2 mb-8">
                {[
                  "Current infrastructure and network performance",
                  "Cybersecurity posture and vulnerabilities",
                  "EMR configuration and data utilization",
                  "Hardware age and replacement priority",
                  "Operational reporting and dashboard capability",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="gold" size="lg" asChild>
                <Link to="/contact">
                  Book an IT Audit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — WHAT WE COVER ── */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div {...fadeUp} className="mb-16 max-w-3xl">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              What's included in Healthcare IT support.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Whether you need a single service or a complete managed solution, every offering below is available as part of an engagement.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            {coverageCards.map((card, i) => (
              <motion.div
                key={card.label}
                {...fadeUp}
                transition={{ delay: i * 0.04 }}
                className="bg-card rounded-2xl p-6 shadow-soft border border-border/40 hover:shadow-card transition-shadow duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-4">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground mb-2">{card.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — EMR PLATFORMS ── */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div {...fadeUp} className="mb-12 max-w-3xl">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              EMR platforms we know.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              We do not install EMR systems — that is your vendor's role. We help you choose the right platform, configure it for your workflow, and extract the operational data that most practices leave on the table.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {emrPlatforms.map((p, i) => (
              <motion.div
                key={p.name}
                {...fadeUp}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl p-5 border border-border/40 shadow-soft"
              >
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{p.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.p {...fadeUp} transition={{ delay: 0.3 }} className="mt-6 text-sm text-muted-foreground text-center">
            Don't see your platform? We work across multiple systems.{" "}
            <Link to="/contact" className="text-primary hover:text-foreground underline underline-offset-2 transition-colors">
              Get in touch
            </Link>{" "}
            to discuss your specific setup.
          </motion.p>
        </div>
      </section>

      {/* ── SECTION 6 — HOW IT WORKS ── */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              What working with us looks like.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-0">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.label}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center px-4"
              >
                {/* Connecting arrow */}
                {i < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-2 z-10">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mb-4">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="text-xs font-bold text-accent tracking-widest uppercase mb-2">Step {i + 1}</span>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{step.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7 — FINAL CTA ── */}
      <section className="py-20 lg:py-28 bg-forest text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.h2
            {...fadeUp}
            className="font-display text-3xl lg:text-5xl font-bold tracking-tight leading-tight"
          >
            Technology should be invisible — until it gives you an advantage.
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ delay: 0.1 }}
            className="mt-8 text-lg leading-relaxed opacity-85 max-w-3xl mx-auto"
          >
            Most practices think about IT only when something breaks. The practices that pull ahead are the ones that treat technology as a strategic asset — one that supports better care, better data, and better financial performance.
          </motion.p>
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="mt-10 flex flex-wrap justify-center gap-4">
            <Button variant="gold" size="lg" asChild>
              <Link to="/strategic-assessment">
                Get a Technology Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              className="border-2 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 font-medium tracking-wide transition-all duration-300"
            >
              <Link to="/contact">Speak With Our Team</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HealthcareIT;

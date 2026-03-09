import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, Building2, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const team = [
  {
    name: "Dr. Sarah Chen",
    title: "Founder & Principal Advisor",
    bio: "Healthcare strategist with deep experience in clinic development, operational planning, and long-term physician advisory across Calgary and Canada.",
    expertise: ["Clinic Development", "Strategic Advisory", "Operational Excellence"],
    image: "/placeholder.svg",
    fallback: "SC",
  },
  {
    name: "Michael Hart",
    title: "Senior Advisory Lead",
    bio: "Supports physician-led organizations with growth strategy, service expansion, and performance planning for multi-stage healthcare ventures.",
    expertise: ["Growth Strategy", "Practice Performance", "Roadmap Development"],
    image: "/placeholder.svg",
    fallback: "MH",
  },
  {
    name: "Priya Nand",
    title: "Operations & Implementation Advisor",
    bio: "Focuses on workflow redesign, staffing models, and implementation support to ensure strategic plans translate into measurable outcomes.",
    expertise: ["Workflow Design", "Staffing Models", "Implementation Support"],
    image: "/placeholder.svg",
    fallback: "PN",
  },
];

const threePillars = [
  {
    icon: User,
    title: "Physician",
    description: "Supporting leadership, ownership strategy, recruitment, and long-term success.",
  },
  {
    icon: Building2,
    title: "Practice",
    description: "Operational structure, systems, staffing, and sustainable growth.",
  },
  {
    icon: Heart,
    title: "Patient",
    description: "Ensuring care delivery, access, and experience remain central to every decision.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-accent font-medium tracking-widest uppercase text-sm mb-6"
          >
            About Vitalis
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight"
          >
            A strategic healthcare advisory partner.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl"
          >
            Based in Calgary, Vitalis Health Strategies works with physicians and healthcare organizations across Canada to design, launch, and optimize successful medical practices. We act as both strategic advisor and coordination partner across the full lifecycle of healthcare ventures.
          </motion.p>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-14">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-3xl font-bold text-foreground">What we do</h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Healthcare projects often involve architects, lenders, legal advisors, technology partners, consultants, and regulatory considerations. We work alongside clients to coordinate these moving parts so physicians and clinic leaders are not left managing fragmented decisions on their own.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Our approach combines healthcare consulting Calgary expertise with practical execution support — from concept planning through long-term improvement for organizations across Canada.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="font-display text-3xl font-bold text-foreground">How we're different</h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                {[
                  "Full-lifecycle strategy from vision through ongoing advisory",
                  "Coordination alongside trusted advisors and specialist partners",
                  "Physician-centered planning grounded in operational reality",
                  "Clear roadmaps with practical implementation support",
                  "Long-term partnership mindset, not one-time reporting",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3Ps Philosophy */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Our Philosophy</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Physician. Practice. Patient.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              Everything we do is designed to create stronger outcomes across three interconnected pillars.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {threePillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-8 shadow-soft border border-border/40 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto">
                  <pillar.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-foreground">{pillar.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Our Team</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Experienced advisors with healthcare focus</h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-3xl">
              Our team blends strategy, operations, and implementation expertise to support physicians and healthcare leaders across Calgary and Canada.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-7 shadow-soft border border-border/40"
              >
                <Avatar className="h-20 w-20 mb-5">
                  <AvatarImage src={member.image} alt={`${member.name} profile`} />
                  <AvatarFallback>{member.fallback}</AvatarFallback>
                </Avatar>
                <h3 className="font-display text-xl font-bold text-foreground">{member.name}</h3>
                <p className="text-sm font-medium text-accent mt-1">{member.title}</p>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {member.expertise.map((area) => (
                    <span key={area} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md">
                      {area}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10">
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/about/mission-vision">
                View Our Mission & Vision
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Ready to work with Vitalis?</h2>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                Book a Consultation <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/engagement">See How Engagement Works</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

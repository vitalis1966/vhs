import { motion } from "framer-motion";
import { User, Building2, Heart, Users } from "lucide-react";

const pillars = [
  {
    icon: User,
    title: "Practitioner",
    description: "We work with practice owners and clinical leaders on the decisions that shape long-term success — ownership structure, leadership transitions, recruitment strategy, succession planning, and financial outcomes. Our goal is confident decision-making at every stage.",
    color: "bg-primary",
  },
  {
    icon: Building2,
    title: "Practice",
    description: "A high-performing practice is operationally sound, financially healthy, and built to scale. We assess and improve the systems, workflows, staffing models, and compliance structures that determine whether a practice performs at its potential or falls short of it.",
    color: "bg-forest-light",
  },
  {
    icon: Heart,
    title: "Patient",
    description: "Everything we do is ultimately measured by what patients and clients experience — quality of care, access, safety, and service consistency. We help practices build the operational foundation that makes excellent patient and client outcomes sustainable over time.",
    color: "bg-accent",
  },
  {
    icon: Users,
    title: "People",
    description: "The right practitioners, staff, and leadership structure are as important as any operational system. We help practices build the human infrastructure — recruitment, role design, and team alignment — that supports long-term performance.",
    color: "bg-primary",
  },
];

export function ThreePsSection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Our Philosophy</p>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            The 4Ps Framework
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Everything we do is designed to create stronger outcomes across four interconnected pillars.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto items-stretch">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 lg:p-8 shadow-card hover:shadow-elevated transition-shadow duration-300 text-center h-full flex flex-col"
            >
              <div className={`w-16 h-16 rounded-2xl ${pillar.color} flex items-center justify-center mx-auto`}>
                <pillar.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold text-foreground">{pillar.title}</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

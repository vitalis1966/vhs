import { motion } from "framer-motion";
import { User, Building2, Heart, Users } from "lucide-react";

const pillars = [
  {
    icon: User,
    title: "Practitioner",
    description: "Ownership, leadership, recruitment, succession, financial outcomes, and confident decision-making.",
    color: "bg-primary",
  },
  {
    icon: Building2,
    title: "Practice",
    description: "Operations, systems, profitability, scalability, compliance readiness, and sustained value creation.",
    color: "bg-forest-light",
  },
  {
    icon: Heart,
    title: "Patient",
    description: "Experience, access, quality of care, safety, service flow, and long-term clinical excellence.",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 lg:p-8 shadow-card hover:shadow-elevated transition-shadow duration-300 text-center"
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

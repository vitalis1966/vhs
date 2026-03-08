import { motion } from "framer-motion";

const steps = [
  { number: "01", title: "Assess", description: "We listen, evaluate, and identify the real challenges and opportunities." },
  { number: "02", title: "Strategize", description: "We build a clear, tailored roadmap aligned with your goals and stage." },
  { number: "03", title: "Execute", description: "We implement alongside you — hands-on, accountable, results-driven." },
  { number: "04", title: "Optimize", description: "We refine, measure, and continuously improve for sustained performance." },
  { number: "05", title: "Grow", description: "We scale what works, expand strategically, and maximize value." },
];

export function ProcessSection() {
  return (
    <section className="py-24 lg:py-32 bg-gradient-section">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">How We Work</p>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            A clear path forward
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex gap-6 lg:gap-8 py-8 border-b border-border last:border-b-0 group"
            >
              <span className="font-display text-3xl lg:text-4xl font-bold text-accent/40 group-hover:text-accent transition-colors duration-300 flex-shrink-0 w-14">
                {step.number}
              </span>
              <div>
                <h3 className="font-display text-xl lg:text-2xl font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { Building2, TrendingUp, DollarSign, Users, ArrowLeftRight, HelpCircle } from "lucide-react";

const tiles = [
  {
    icon: Building2,
    label: "I'm opening a new practice",
    sublabel: "Planning, building, or about to launch",
    targetId: "journey-building",
  },
  {
    icon: TrendingUp,
    label: "I have an existing practice",
    sublabel: "Looking to improve performance or grow",
    targetId: "journey-operating",
  },
  {
    icon: DollarSign,
    label: "My revenue or billing needs attention",
    sublabel: "Billing gaps, fee schedule, or collections",
    targetId: "journey-operating",
  },
  {
    icon: Users,
    label: "I need to grow or recruit",
    sublabel: "Adding practitioners, locations, or staff",
    targetId: "journey-transitioning",
  },
  {
    icon: ArrowLeftRight,
    label: "I'm buying, selling, or transitioning",
    sublabel: "M&A, partnership change, or succession",
    targetId: "journey-transitioning",
  },
  {
    icon: HelpCircle,
    label: "I'm not sure where to start",
    sublabel: "A strategic assessment will clarify this",
    targetId: "assessment-cta",
  },
];

function scrollToId(targetId: string) {
  const el = document.getElementById(targetId);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export function JourneyFinderSection() {
  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">
            Find Your Starting Point
          </p>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            Where are you right now?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Choose what best describes your situation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {tiles.map((tile, i) => (
            <motion.button
              key={tile.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              onClick={() => scrollToId(tile.targetId)}
              className="bg-card rounded-xl border border-border/40 shadow-sm p-5 hover:border-primary/40 hover:shadow-md cursor-pointer transition-all duration-150 flex items-start gap-4 text-left"
            >
              <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
                <tile.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-base text-foreground">{tile.label}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{tile.sublabel}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

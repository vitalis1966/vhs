import { motion } from "framer-motion";
import { Stethoscope, Sparkles, PawPrint, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const tiles = [
  {
    to: "/solutions/medical",
    gradient: "bg-gradient-to-br from-[#1a3d3d] to-[#2d6b6b]",
    Icon: Stethoscope,
    eyebrow: "MEDICAL",
    label: "Medical Practice",
    sub: "Clinics · Specialists · Surgical",
  },
  {
    to: "/solutions/dental",
    gradient: "bg-gradient-to-br from-[#2d4a1e] to-[#4a7a30]",
    Icon: Sparkles,
    eyebrow: "DENTAL",
    label: "Dental Practice",
    sub: "General · Specialty · Multi-Location",
  },
  {
    to: "/solutions/veterinary",
    gradient: "bg-gradient-to-br from-[#3d2a1a] to-[#7a5530]",
    Icon: PawPrint,
    eyebrow: "VETERINARY",
    label: "Veterinary Practice",
    sub: "Companion · Mixed · Specialty",
  },
  {
    to: "/solutions/nhsf",
    gradient: "bg-gradient-to-br from-[#1a2a4a] to-[#2a4a7a]",
    Icon: Building2,
    eyebrow: "SURGICAL",
    label: "Surgical Facility",
    sub: "NHSF · CSF · Procedural Centre",
  },
];

export function JourneyFinderSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Who We Work With</span>
          </div>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            Tell us about your practice.
          </h2>
          <p className="mt-4 text-muted-foreground text-base max-w-md mx-auto">
            Select your practice type. We'll take you directly to the right place.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.eyebrow}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                to={tile.to}
                className={`${tile.gradient} relative rounded-2xl overflow-hidden h-[280px] flex flex-col justify-end cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:brightness-110 group block`}
                role="link"
                tabIndex={0}
              >
                <tile.Icon className="absolute top-6 right-6 w-20 h-20 text-white opacity-[0.15]" strokeWidth={1} />
                <div className="relative z-10 p-7">
                  <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
                    {tile.eyebrow}
                  </p>
                  <p className="text-white text-2xl font-bold font-display">
                    {tile.label}
                  </p>
                  <p className="text-white/70 text-sm mt-1">{tile.sub}</p>
                  <ArrowRight className="w-5 h-5 text-white/60 mt-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Not sure where to start?{" "}
          <Link to="/strategic-assessment" className="text-primary hover:underline">
            Take the strategic assessment →
          </Link>
        </div>
      </div>
    </section>
  );
}

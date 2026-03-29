import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Smile,
  PawPrint,
  Building2,
  ChevronRight,
  ArrowLeft,
  HardHat,
  TrendingUp,
  DollarSign,
  Settings,
  ArrowLeftRight,
  HelpCircle,
} from "lucide-react";

type PracticeType = "medical" | "dental" | "veterinary" | "surgical";

const practiceTypes = [
  {
    type: "medical" as PracticeType,
    gradient: "linear-gradient(135deg, #1a3d3d 0%, #2d6b6b 100%)",
    badgeBg: "bg-[#2d6b6b]",
    Icon: Stethoscope,
    eyebrow: "MEDICAL",
    name: "Medical Practice",
    desc: "Clinics · Specialists · Surgical Groups",
  },
  {
    type: "dental" as PracticeType,
    gradient: "linear-gradient(135deg, #1e3a12 0%, #3d7025 100%)",
    badgeBg: "bg-[#3d7025]",
    Icon: Smile,
    eyebrow: "DENTAL",
    name: "Dental Practice",
    desc: "General · Specialty · Multi-Location",
  },
  {
    type: "veterinary" as PracticeType,
    gradient: "linear-gradient(135deg, #3d2010 0%, #7a4520 100%)",
    badgeBg: "bg-[#7a4520]",
    Icon: PawPrint,
    eyebrow: "VETERINARY",
    name: "Veterinary Practice",
    desc: "Companion · Mixed · Specialty",
  },
  {
    type: "surgical" as PracticeType,
    gradient: "linear-gradient(135deg, #1a2540 0%, #2a457a 100%)",
    badgeBg: "bg-[#2a457a]",
    Icon: Building2,
    eyebrow: "SURGICAL",
    name: "Surgical Facility",
    desc: "NHSF · CSF · Procedural Centre",
  },
];

const situations = [
  {
    Icon: HardHat,
    label: "Building a new practice",
    sublabel: "Planning, launching, or opening from scratch",
    to: "/solutions/new-clinics",
  },
  {
    Icon: TrendingUp,
    label: "Growing an existing practice",
    sublabel: "Expansion, new locations, or scaling up",
    to: "/solutions/existing-clinics",
  },
  {
    Icon: DollarSign,
    label: "Revenue or billing problems",
    sublabel: "Gaps in collections, billing errors, fee schedules",
    to: "/solutions/existing-clinics",
  },
  {
    Icon: Settings,
    label: "Operations or workflow issues",
    sublabel: "Efficiency, scheduling, staffing, processes",
    to: "/solutions/existing-clinics",
  },
  {
    Icon: ArrowLeftRight,
    label: "Buying, selling, or transitioning",
    sublabel: "M&A, partnership change, succession planning",
    to: "/solutions/existing-clinics",
  },
  {
    Icon: HelpCircle,
    label: "Not sure yet",
    sublabel: "Start with a free strategic assessment",
    to: "/strategic-assessment",
  },
];

export function PracticePathFinder() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<PracticeType | null>(null);
  const navigate = useNavigate();

  const selected = practiceTypes.find((p) => p.type === selectedType);

  return (
    <section className="py-20 bg-muted/20 border-b border-border/20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {step === 1 && (
          <>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="h-px w-12 bg-accent" />
               <span className="text-[#7a5500] font-semibold tracking-widest uppercase text-sm">
                Get Started
              </span>
            </div>
            <h2 className="font-display text-4xl font-bold text-foreground">
              What type of practice are you?
            </h2>
            <p className="text-base text-muted-foreground mt-3">
              Select yours and we'll show you exactly where we can help.
            </p>

            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-5">
              {practiceTypes.map((tile) => (
                <div
                  key={tile.type}
                  className="relative rounded-2xl overflow-hidden cursor-pointer min-h-[210px] flex flex-col justify-end transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl"
                  style={{ background: tile.gradient }}
                  onClick={() => {
                    setSelectedType(tile.type);
                    setStep(2);
                  }}
                >
                  <tile.Icon
                    className="absolute top-5 right-5 text-white opacity-[0.12]"
                    size={72}
                    strokeWidth={1}
                  />
                  <div className="relative z-10 p-6 text-left">
                    <p className="text-white/50 text-xs uppercase tracking-widest font-medium">
                      {tile.eyebrow}
                    </p>
                    <p className="text-white text-2xl font-bold mt-1 font-display">
                      {tile.name}
                    </p>
                    <p className="text-white/65 text-sm mt-1.5">{tile.desc}</p>
                    <ChevronRight className="w-5 h-5 text-white/40 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 2 && selected && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-left">
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedType(null);
                }}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-white text-sm font-medium mb-8 ${selected.badgeBg}`}
            >
              {selected.name}
            </span>

            <h2 className="font-display text-4xl font-bold text-foreground">
              What are you looking to do?
            </h2>
            <p className="text-base text-muted-foreground mt-3">
              Select your situation and we'll take you to the right place.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {situations.map((s) => (
                <div
                  key={s.label}
                  onClick={() => navigate(s.to)}
                  className="bg-card rounded-xl border border-border/50 shadow-sm p-5 cursor-pointer hover:border-primary/50 hover:shadow-md hover:bg-primary/[0.03] transition-all duration-150 flex items-start gap-4 text-left"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <s.Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground text-[15px]">
                      {s.label}
                    </span>
                    <span className="text-muted-foreground text-sm mt-0.5">
                      {s.sublabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              You can always{" "}
              <Link
                to="/contact"
                className="text-primary hover:underline"
              >
                speak directly with our team
              </Link>{" "}
              instead.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

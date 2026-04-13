import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { L as Link } from "./index-CalXArNJ.js";
import { motion } from "framer-motion";
import { Stethoscope, Smile, PawPrint, Building2, ChevronRight, ArrowLeft, HardHat, TrendingUp, DollarSign, Settings, ArrowLeftRight, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router";
import "react-dom";
const practiceTypes = [
  {
    type: "medical",
    gradient: "linear-gradient(135deg, #1a3d3d 0%, #2d6b6b 100%)",
    badgeBg: "bg-[#2d6b6b]",
    Icon: Stethoscope,
    eyebrow: "MEDICAL",
    name: "Medical Practice",
    desc: "Clinics · Specialists · Surgical Groups"
  },
  {
    type: "dental",
    gradient: "linear-gradient(135deg, #1e3a12 0%, #3d7025 100%)",
    badgeBg: "bg-[#3d7025]",
    Icon: Smile,
    eyebrow: "DENTAL",
    name: "Dental Practice",
    desc: "General · Specialty · Multi-Location"
  },
  {
    type: "veterinary",
    gradient: "linear-gradient(135deg, #3d2010 0%, #7a4520 100%)",
    badgeBg: "bg-[#7a4520]",
    Icon: PawPrint,
    eyebrow: "VETERINARY",
    name: "Veterinary Practice",
    desc: "Companion · Mixed · Specialty"
  },
  {
    type: "surgical",
    gradient: "linear-gradient(135deg, #1a2540 0%, #2a457a 100%)",
    badgeBg: "bg-[#2a457a]",
    Icon: Building2,
    eyebrow: "SURGICAL",
    name: "Surgical Facility",
    desc: "NHSF · CSF · Procedural Centre"
  }
];
const situations = [
  {
    Icon: HardHat,
    label: "Building a new practice",
    sublabel: "Planning, launching, or opening from scratch",
    to: "/solutions/new-clinics"
  },
  {
    Icon: TrendingUp,
    label: "Growing an existing practice",
    sublabel: "Expansion, new locations, or scaling up",
    to: "/solutions/existing-clinics"
  },
  {
    Icon: DollarSign,
    label: "Revenue or billing problems",
    sublabel: "Gaps in collections, billing errors, fee schedules",
    to: "/solutions/existing-clinics"
  },
  {
    Icon: Settings,
    label: "Operations or workflow issues",
    sublabel: "Efficiency, scheduling, staffing, processes",
    to: "/solutions/existing-clinics"
  },
  {
    Icon: ArrowLeftRight,
    label: "Buying, selling, or transitioning",
    sublabel: "M&A, partnership change, succession planning",
    to: "/solutions/existing-clinics"
  },
  {
    Icon: HelpCircle,
    label: "Not sure yet",
    sublabel: "Start with a free strategic assessment",
    to: "/strategic-assessment"
  }
];
function PracticePathFinder() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();
  const selected = practiceTypes.find((p) => p.type === selectedType);
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-muted/20 border-b border-border/20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-6 text-center", children: [
    step === 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-[#7a5500] font-semibold tracking-widest uppercase text-sm", children: "Get Started" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "font-display text-4xl font-bold text-foreground", children: "What type of practice are you?" }),
      /* @__PURE__ */ jsx("p", { className: "text-base text-muted-foreground mt-3", children: "Select yours and we'll show you exactly where we can help." }),
      /* @__PURE__ */ jsx("div", { className: "mt-10 grid grid-cols-2 lg:grid-cols-4 gap-5", children: practiceTypes.map((tile) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "relative rounded-2xl overflow-hidden cursor-pointer min-h-[210px] flex flex-col justify-end transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl",
          style: { background: tile.gradient },
          onClick: () => {
            setSelectedType(tile.type);
            setStep(2);
          },
          children: [
            /* @__PURE__ */ jsx(
              tile.Icon,
              {
                className: "absolute top-5 right-5 text-white opacity-[0.12]",
                size: 72,
                strokeWidth: 1
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10 p-6 text-left", children: [
              /* @__PURE__ */ jsx("p", { className: "text-white/50 text-xs uppercase tracking-widest font-medium", children: tile.eyebrow }),
              /* @__PURE__ */ jsx("p", { className: "text-white text-2xl font-bold mt-1 font-display", children: tile.name }),
              /* @__PURE__ */ jsx("p", { className: "text-white/65 text-sm mt-1.5", children: tile.desc }),
              /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5 text-white/40 mt-4" })
            ] })
          ]
        },
        tile.type
      )) })
    ] }),
    step === 2 && selected && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.2 },
        children: [
          /* @__PURE__ */ jsx("div", { className: "text-left", children: /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setStep(1);
                setSelectedType(null);
              },
              className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer mb-6",
              children: [
                /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
                "Back"
              ]
            }
          ) }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-white text-sm font-medium mb-8 ${selected.badgeBg}`,
              children: selected.name
            }
          ),
          /* @__PURE__ */ jsx("h2", { className: "font-display text-4xl font-bold text-foreground", children: "What are you looking to do?" }),
          /* @__PURE__ */ jsx("p", { className: "text-base text-muted-foreground mt-3", children: "Select your situation and we'll take you to the right place." }),
          /* @__PURE__ */ jsx("div", { className: "mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto", children: situations.map((s) => /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => navigate(s.to),
              className: "bg-card rounded-xl border border-border/50 shadow-sm p-5 cursor-pointer hover:border-primary/50 hover:shadow-md hover:bg-primary/[0.03] transition-all duration-150 flex items-start gap-4 text-left",
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(s.Icon, { className: "w-5 h-5 text-primary" }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-[15px]", children: s.label }),
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-sm mt-0.5", children: s.sublabel })
                ] })
              ]
            },
            s.label
          )) }),
          /* @__PURE__ */ jsxs("p", { className: "mt-8 text-sm text-muted-foreground", children: [
            "You can always",
            " ",
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/contact",
                className: "text-primary hover:underline",
                children: "speak directly with our team"
              }
            ),
            " ",
            "instead."
          ] })
        ]
      }
    )
  ] }) });
}
export {
  PracticePathFinder
};

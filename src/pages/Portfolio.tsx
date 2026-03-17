import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, MapPin, Clock, Briefcase, X } from "lucide-react";
import { usePageMeta } from "@/lib/seo";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface CaseMetric {
  label: string;
  value: string;
  sublabel: string;
}

interface CaseStudy {
  id: string;
  title: string;
  tagline: string;
  location: string;
  type: string[];
  specialty: string;
  size: string;
  duration: string;
  gradient: string;
  overview: string;
  challenge: string;
  approach: string;
  outcome: string;
  services: string[];
  metrics: CaseMetric[];
}

const caseStudies: CaseStudy[] = [
  {
    id: "calgary-dermatology-nhsf",
    title: "A Calgary dermatology group builds Alberta's newest CPSA-accredited surgical facility.",
    tagline: "Three dermatologists. A shared vision for a procedural centre. Two years of planning compressed into a successful opening.",
    location: "Calgary, Alberta",
    type: ["New Build", "Technology"],
    specialty: "Dermatology · NHSF",
    size: "8,400 sq ft · 3 physicians · CPSA-accredited NHSF",
    duration: "22 months — concept through opening",
    gradient: "linear-gradient(135deg, hsl(155 35% 14%) 0%, hsl(152 32% 22%) 50%, hsl(150 25% 35%) 100%)",
    overview: "Three Calgary dermatologists — two medical, one cosmetic — had been operating out of separate practices for years before deciding to build a shared procedural centre that could accommodate Mohs micrographic surgery, laser procedures, and cosmetic services under one roof. The vision was clear. The path to execution was not.\n\nThe proposed facility qualified as a Non-Hospital Surgical Facility under CPSA's framework — triggering a full accreditation requirement before a single patient could be seen. The group had no prior experience with NHSF development, had not worked together operationally, and had a combined lease expiry timeline that created real pressure on the development schedule.\n\nVitalis engaged at the feasibility stage — before any capital was committed — and coordinated the full development process from site selection through CPSA accreditation and opening day operations.",
    challenge: "The group's initial financial model underestimated capital requirements by approximately 35%. Their preferred SE Calgary location required specific mechanical infrastructure that the proposed space could not accommodate. And the three physicians had not agreed on the governance structure, compensation model, or operational ownership model that would govern the practice once open — decisions that needed to be made before the lease was signed, not after.",
    approach: "Vitalis rebuilt the financial model from scratch, incorporating NHSF-specific equipment costs, CPSA registration fees, accreditation preparation timelines, and working capital requirements through the pre-revenue period. A parallel site selection process identified an alternative location in the SW with the mechanical capacity needed for laser and surgical infrastructure.\n\nThe governance and compensation model was designed before the partnership agreement was drafted — giving the group's legal advisors a clear operational framework to translate into legal documentation. CPSA accreditation preparation ran concurrently with construction: policies, procedures, credentialing frameworks, and incident reporting protocols were all built and functional before the facility was physically complete.\n\nThe accreditation inspection was scheduled the week after construction handover.",
    outcome: "The facility received CPSA accreditation on first assessment — no requirements list, no re-assessment. It opened six weeks ahead of the original projected timeline. All three physicians were operational within the first month. The facility's first-year patient volume exceeded the base-case financial model by 22%.",
    services: ["Practice Feasibility & Financial Modeling", "NHSF Accreditation Preparation", "Site Selection & Lease Advisory", "Governance & Partnership Structure Design", "Technology & EMR Selection", "CPSA Compliance Documentation", "Operational Systems Design"],
    metrics: [
      { label: "First-attempt CPSA accreditation", value: "No requirements list", sublabel: "Passed on first assessment" },
      { label: "6 weeks ahead of schedule", value: "Early opening", sublabel: "Original opening target exceeded" },
      { label: "22% above base-case volume", value: "+22%", sublabel: "First full year of operations" },
    ],
  },
  {
    id: "edmonton-family-medicine-revenue",
    title: "Edmonton family medicine group recovers $310K in annual billing gaps.",
    tagline: "Five GPs. Solid patient relationships. A billing system that had been quietly losing money for years.",
    location: "Edmonton, Alberta",
    type: ["Revenue & Billing", "Operations"],
    specialty: "Family Medicine",
    size: "5-physician group · ~9,000 patient panel",
    duration: "14 weeks — assessment through implementation",
    gradient: "linear-gradient(135deg, hsl(30 60% 30%) 0%, hsl(35 55% 40%) 50%, hsl(38 55% 52%) 100%)",
    overview: "A five-physician family medicine group in south Edmonton had been operating together for nine years. The practice had strong patient relationships, stable physician tenure, and above-average AHS panel sizes. On the surface, it was performing well. The physicians had simply never had an independent view of the financial performance.\n\nThe assessment revealed systematic billing gaps across three distinct revenue streams — AHS claims, uninsured services, and third-party billing — that had been accumulating since the practice's founding without anyone identifying the pattern.",
    challenge: "The AHS billing workflow had been set up by an administrative hire in the practice's first year and had not been reviewed since. Several service codes were being consistently under-reported. Uninsured services — medical notes, insurance forms, driver's medicals, and executive health assessments — had no systematic fee schedule and were being billed ad hoc at rates well below market. WCB and MVA billing was largely being left to patients to manage.",
    approach: "Vitalis conducted a structured revenue cycle assessment across all three billing streams, sampling 90 days of claims and identifying the specific patterns driving under-collection. An updated AHS billing protocol was implemented with the existing administrative team — no new hires required. A formal uninsured service fee schedule was built, approved by the physician group, and integrated into the booking and checkout workflow. A WCB/MVA billing protocol was designed and the practice enrolled in a billing service for third-party claims.",
    outcome: "The revenue changes were implemented over six weeks without disruption to patient care or administrative workflow. Within 60 days of full implementation, monthly collections had increased by $26,000. Annualized, the identified billing gaps represented $310,000 in previously uncaptured revenue — from the same patient volume, same physicians, same physical space.",
    services: ["Revenue Cycle Assessment", "AHS Billing Protocol Redesign", "Uninsured Service Fee Schedule Development", "WCB & MVA Billing Setup", "Administrative Workflow Optimization"],
    metrics: [
      { label: "$310K annualized revenue recovered", value: "$310K", sublabel: "From existing patient volume" },
      { label: "6 weeks to full implementation", value: "6 weeks", sublabel: "No disruption to clinical operations" },
      { label: "3 billing streams optimized", value: "3 streams", sublabel: "AHS, uninsured services, and third-party" },
    ],
  },
  {
    id: "calgary-dental-dso-advisory",
    title: "A Calgary dental group navigates a DSO acquisition — on their own terms.",
    tagline: "Three locations. An unsolicited acquisition offer. And no idea whether the number on the table was fair.",
    location: "Calgary, Alberta",
    type: ["M&A"],
    specialty: "General Dentistry",
    size: "3-location dental group · 4 dentists",
    duration: "8 months",
    gradient: "linear-gradient(135deg, hsl(215 15% 35%) 0%, hsl(215 13% 42%) 50%, hsl(215 10% 52%) 100%)",
    overview: "A dental group with three Calgary locations — two general dental, one with a significant orthodontic component — received an unsolicited acquisition approach from a national DSO. The offer was substantial. The lead dentist and founder had been considering an exit within five years. On the surface, the timing seemed right.\n\nThe problem was that none of the three dentists understood how to evaluate the offer — whether the EBITDA multiple was appropriate, what earn-out provisions meant for their working arrangements, or whether their practice was worth more than the offer implied.",
    challenge: "The DSO's offer was structured with a headline number that looked attractive but embedded an earn-out tied to a 3-year associate retention metric that the founding dentist had no practical ability to guarantee. The EBITDA multiple applied was at the lower end of the market range for a practice with the group's profitability profile. And the purchase price was calculated on unadjusted EBITDA that did not account for several above-market owner expenses that would normalize upward under new ownership.",
    approach: "Vitalis was engaged two weeks after the initial offer was received. The financial model was rebuilt with normalized EBITDA — restating owner compensation, personal expenses run through the practice, and discretionary spending — which increased the defensible EBITDA figure by 31%. A comparable transaction analysis was conducted against current DSO acquisition multiples for Alberta multi-location dental practices.\n\nVitalis prepared a detailed counter-position and negotiated alongside the group's legal counsel through four rounds of discussion. The earn-out structure was restructured to remove the associate retention dependency. The headline purchase price was increased.",
    outcome: "The final transaction closed at 23% above the original offer — a difference of approximately $680,000. The earn-out provisions were restructured to be based on practice revenue targets rather than staff retention. The founding dentist remained as an associate for 18 months post-close under terms he had agreed to, then transitioned out on the planned timeline.",
    services: ["Practice Valuation", "EBITDA Normalization Analysis", "M&A Advisory & Negotiation Support", "Deal Structure Review", "Transition Planning"],
    metrics: [
      { label: "23% above original offer", value: "+23%", sublabel: "Final transaction price" },
      { label: "~$680K additional value", value: "$680K", sublabel: "Recovered through negotiation" },
      { label: "Earn-out restructured", value: "Revenue-based", sublabel: "Not staff retention" },
    ],
  },
  {
    id: "calgary-orthopaedics-new-build",
    title: "A Calgary orthopaedic and sports medicine clinic opens ahead of schedule and under budget.",
    tagline: "A specialist group with a shared vision — and a site that almost derailed the entire project.",
    location: "Calgary, Alberta",
    type: ["New Build"],
    specialty: "Orthopedics · Sports Medicine",
    size: "5,200 sq ft · 2 orthopaedic surgeons + 1 sports medicine physician",
    duration: "18 months",
    gradient: "linear-gradient(135deg, hsl(155 40% 25%) 0%, hsl(152 35% 32%) 50%, hsl(170 35% 38%) 100%)",
    overview: "Two orthopaedic surgeons and a sports medicine physician had been renting space in separate facilities for years, each referring patients to the others without a shared operational base. The plan was to build a combined clinic with shared imaging, rehabilitation, and procedure capacity — a model that would reduce overhead for all three and create a more integrated patient experience.\n\nThe group had identified a location in NW Calgary and was weeks away from signing a lease when Vitalis was brought in for a feasibility review.",
    challenge: "The proposed NW Calgary location had a structural issue with the floor load specifications that would have required significant and expensive reinforcement to support the planned imaging equipment. More critically, the space had no provision for the medical gas infrastructure required for the procedure room. These were not visible from the lease terms or the standard commercial real estate inspection — but they would have added approximately $180,000 to the buildout cost and extended the timeline by four months.\n\nA parallel issue: the group's financial model had not modelled shared overhead correctly — each physician had modelled their own costs in isolation, meaning the collective financial picture had never been built.",
    approach: "The lease was paused while two alternative sites were assessed. The preferred alternative — a ground-floor space in a medical-dental building in the NW corridor — had the required mechanical capacity, adequate floor loading, and a landlord willing to provide a tenant improvement allowance that covered 60% of the buildout cost.\n\nA consolidated financial model was built for the three-physician group, incorporating shared overhead allocation, individual revenue projections by service type, and imaging equipment amortization. The physicians reached agreement on the cost-sharing model before the lease was signed.",
    outcome: "The clinic opened 5 weeks ahead of the revised timeline. Total buildout cost came in 8% under the model — the TI allowance negotiated from the landlord covered infrastructure costs that would have been absorbed entirely at the original location. In the first year of operations, combined overhead per physician was 24% lower than each had been paying individually.",
    services: ["Practice Feasibility & Site Assessment", "Financial Modeling & Overhead Allocation", "Lease Negotiation Advisory", "Facility Design Input", "Equipment Procurement Planning", "Operational Launch Preparation"],
    metrics: [
      { label: "5 weeks ahead of schedule", value: "5 weeks early", sublabel: "Revised opening timeline" },
      { label: "8% under budget", value: "-8%", sublabel: "Final buildout cost" },
      { label: "24% lower overhead per physician", value: "-24%", sublabel: "vs. individual practice costs" },
    ],
  },
  {
    id: "edmonton-urgent-care-expansion",
    title: "Edmonton urgent care network scales from two locations to five in 26 months.",
    tagline: "Strong unit economics at two clinics. A growth plan that had never been written down.",
    location: "Edmonton, Alberta",
    type: ["Growth", "Operations"],
    specialty: "Urgent Care · Walk-In Medicine",
    size: "2 → 5 locations · 14 → 31 physicians across network",
    duration: "26 months — strategy through third location opening",
    gradient: "linear-gradient(135deg, hsl(220 50% 30%) 0%, hsl(225 45% 38%) 50%, hsl(240 40% 45%) 100%)",
    overview: "An Edmonton urgent care operator with two well-performing clinics — one in the south, one in the west end — had strong patient volumes, solid physician relationships, and the operational confidence to grow. What they lacked was a documented growth framework: a financial model for expansion, a site selection methodology, a hiring model that could scale, and the technology infrastructure to manage a multi-site network.\n\nThe operator had been approached by two investment partners in the prior 18 months, had turned both down, and decided to grow independently. Vitalis was engaged to build and execute the expansion strategy.",
    challenge: "The two existing clinics ran on slightly different operational models — different EMR configurations, different scheduling approaches, different fee structures for uninsured services. Quality and patient experience were consistent because the owner was physically present across both locations most days. A third location would make that impossible.\n\nThe financial model for expansion also had a significant gap: the owner had been modelling new location economics based on the performance of the existing two — which were both in high-density residential corridors with strong walk-in demand. The three identified target markets included one suburban commercial zone with meaningfully different demographics.",
    approach: "Vitalis conducted demographic and competitive analysis for six potential Edmonton expansion markets, producing a ranked site matrix with revenue projections, competition intensity, and infrastructure cost estimates for each. The three sites selected for expansion had materially stronger projected economics than the one the owner had initially favoured.\n\nA standardized operational model was designed for the network — common EMR configuration, common fee schedules, common scheduling protocols — that could be replicated at each new location without the owner's daily presence. A hiring and credentialing model for new physicians was built, and a medical director structure was designed for each location.",
    outcome: "Three additional locations opened over 26 months. All three reached operational break-even within the financial model's projected timeframe. Physician headcount across the network grew from 14 to 31. The owner was no longer the operational dependency at any individual location.",
    services: ["Growth Strategy & Market Analysis", "Site Selection Methodology", "Financial Modeling for Multi-Site Operations", "Operational Standardization", "Technology & EMR Standardization", "Physician Recruitment Framework", "Medical Director Structure Design"],
    metrics: [
      { label: "3 new locations in 26 months", value: "3 locations", sublabel: "All within projected economics" },
      { label: "14 → 31 physicians", value: "2.2× growth", sublabel: "Network headcount" },
      { label: "Break-even on schedule", value: "On target", sublabel: "All three new locations" },
    ],
  },
  {
    id: "calgary-internal-medicine-people",
    title: "A Calgary specialist group fixes its people problems before they become patient problems.",
    tagline: "High clinical quality. High staff turnover. A leadership team that had never been shown what was actually driving it.",
    location: "Calgary, Alberta",
    type: ["People", "Operations"],
    specialty: "Internal Medicine · Cardiology",
    size: "4-physician specialist group · 12 clinical and administrative staff",
    duration: "11 months",
    gradient: "linear-gradient(135deg, hsl(345 45% 30%) 0%, hsl(345 40% 38%) 50%, hsl(340 45% 48%) 100%)",
    overview: "A four-physician group combining internal medicine and cardiology had built a respected specialist practice over nine years. Referral volumes were strong. Clinical outcomes were excellent. But the practice had replaced seven staff members in the prior 18 months — including two clinical coordinators and a billing specialist — and the physicians were increasingly pulled into operational and interpersonal issues that had nothing to do with patient care.\n\nThe lead physician described it as 'a people problem we can't seem to fix.' What the assessment found was that it was a systems problem wearing a people costume.",
    challenge: "Behavioural profiling of the physician group and key clinical staff revealed a team composition that had significant strengths — deep technical expertise, high attention to detail, strong individual accountability — but no natural internal communication bridge between the physicians' analytical, task-focused working style and the emotionally-driven, relationship-oriented preferences of the nursing and administrative team.\n\nThere were no documented performance expectations for any non-physician role. There was no regular team communication structure. Underperformance was addressed reactively and inconsistently — sometimes immediately, sometimes never — which had created a perception of favouritism and arbitrary management. Two of the seven staff departures in the prior 18 months had followed incidents where performance issues were addressed with no documented process.",
    approach: "Individual behavioural profiles were completed for all 16 team members. The results were shared with the physician group in a facilitated session that connected the profile data to the specific dynamics they had been experiencing — without naming individuals. A team communication model was designed that created structured touchpoints between physicians and staff that didn't require any individual to change their fundamental working style.\n\nPerformance expectation frameworks were built for every non-physician role. A feedback and performance conversation model was trained with the lead physician and the clinic manager. Clear protocols for managing underperformance — with documentation requirements and timelines — were established and communicated to the full team.",
    outcome: "Staff turnover in the 12 months following the engagement: one departure — a retirement. The two remaining clinical coordinators who had been flagged as potential departure risks received structured feedback and role clarity and remained. Administrative overhead — time spent by physicians on non-clinical operational issues — decreased by an estimated 60% within six months. Billing performance also improved: the billing specialist, now operating within a clear performance framework, identified and corrected a systematic coding pattern that had been causing claim denials.",
    services: ["Behavioural Profiling & Team Assessment", "Performance Framework Design", "Culture & Communication Structure", "Leadership Development", "Operations & Workflow Review", "Billing Performance Improvement"],
    metrics: [
      { label: "1 departure in 12 months post-engagement", value: "1 vs. 7", sublabel: "Down from 7 in prior 18 months" },
      { label: "~60% reduction in physician admin time", value: "-60%", sublabel: "Non-clinical operational issues" },
      { label: "Systematic billing improvement", value: "Coding corrected", sublabel: "From performance clarity" },
    ],
  },
  {
    id: "vancouver-ophthalmology-nhsf",
    title: "Vancouver ophthalmology group achieves CPSBC accreditation for a new cataract and refractive surgical centre.",
    tagline: "British Columbia's NHMSFAP framework. A practice with NHSF experience in Alberta but not in BC. Two different regulatory worlds.",
    location: "Vancouver, British Columbia",
    type: ["New Build", "Technology"],
    specialty: "Ophthalmology",
    size: "6,800 sq ft · 2 ophthalmologists · CPSBC-accredited NHSF",
    duration: "20 months",
    gradient: "linear-gradient(135deg, hsl(270 35% 30%) 0%, hsl(270 30% 38%) 50%, hsl(280 35% 45%) 100%)",
    overview: "Two Vancouver ophthalmologists — one specializing in cataract surgery, one in refractive procedures — had been operating out of hospital-affiliated facilities for their entire careers. Both had reached the point where the scheduling constraints and infrastructure limitations of the hospital system were actively limiting their procedural volume and patient access. The decision to build an independent surgical facility was driven by a clear clinical and financial rationale.\n\nOne of the two physicians had previously been involved in an Alberta NHSF development project, which created a false assumption: that British Columbia's regulatory framework was similar to Alberta's. It is not.",
    challenge: "The College of Physicians and Surgeons of BC operates the Non-Hospital Medical and Surgical Facilities Accreditation Program (NHMSFAP) — a distinct framework with different standards, different inspection processes, and different documentation requirements from CPSA's NHSF program in Alberta. Several elements the physician assumed were transferable from Alberta — including the infection prevention and control framework and the credentialing structure — required material revision to meet BC-specific standards.\n\nThe facility's planned equipment specification had also been built around an Alberta vendor relationship. When mapped against NHMSFAP laser equipment standards, two items required replacement before the accreditation application could proceed.",
    approach: "Vitalis conducted a full gap analysis between the physician's Alberta NHSF experience and the CPSBC NHMSFAP requirements — producing a specific list of documentation, equipment, and operational elements that needed to be built or revised before the BC accreditation application. The documentation framework was rebuilt to NHMSFAP standards. Equipment specifications were revised, and procurement was resequenced to align with the corrected specification.\n\nA parallel workstream addressed the Health Authority contracting question: one of the physicians qualified for a Fraser Health Authority surgical facility contract for publicly funded cataract procedures. Vitalis supported the application preparation.",
    outcome: "CPSBC NHMSFAP accreditation was granted on the first assessment. The Fraser Health Authority contract was secured for cataract surgery. The facility opened within the planned timeline. Combined public and private revenue in the first operating year exceeded the base-case financial model by 17%.",
    services: ["Provincial Regulatory Mapping (CPSBC NHMSFAP)", "Facility Design & Equipment Advisory", "NHMSFAP Accreditation Preparation", "Health Authority Contract Application Support", "Financial Modeling", "Operational Systems Design"],
    metrics: [
      { label: "First-attempt CPSBC accreditation", value: "Passed", sublabel: "NHMSFAP — no re-assessment required" },
      { label: "Fraser Health contract secured", value: "Contracted", sublabel: "Publicly funded cataract surgery" },
      { label: "17% above base-case revenue", value: "+17%", sublabel: "First full operating year" },
    ],
  },
  {
    id: "toronto-dental-specialty-revenue",
    title: "A Toronto dental specialty group recovers lost revenue and opens a second location.",
    tagline: "Strong clinical reputation. An insurance billing system that had been set up wrong in year one and never corrected.",
    location: "Toronto, Ontario",
    type: ["Revenue & Billing", "Growth"],
    specialty: "Orthodontics · General Dentistry",
    size: "2-location group · 3 dentists",
    duration: "16 months",
    gradient: "linear-gradient(135deg, hsl(25 55% 30%) 0%, hsl(28 50% 38%) 50%, hsl(35 50% 45%) 100%)",
    overview: "A Toronto dental practice combining general dentistry and orthodontics had grown steadily over eight years to a two-dentist, one-orthodontist group operating from a single Etobicoke location. The practice had a loyal patient base and strong orthodontic patient volume. The owner-dentist had been considering a second location for three years but had not been able to build a financial case that satisfied him.\n\nThe revenue assessment changed that calculation entirely.",
    challenge: "The practice's insurance billing workflow had been established by the founding dentist's spouse — who had no dental billing training — and had never been audited. Over eight years, a systematic error in how coordination of benefits was being processed had resulted in consistent underclaiming on patients with dual insurance coverage. A secondary issue: the orthodontic fee schedule had not been updated since 2019 and was running approximately 12% below current RCDSO-aligned market rates.\n\nThe financial model for a second location had been built on the practice's reported net collections — which were themselves understated due to the billing errors.",
    approach: "Vitalis conducted a billing audit across 24 months of claims data, identifying the coordination of benefits error pattern and calculating the annualized impact. The billing workflow was restructured and the administrative team was trained on correct dual-insurance submission sequences. The orthodontic fee schedule was reviewed against current Ontario market benchmarks and updated.\n\nWith corrected revenue figures, the financial model for a second location was rebuilt. The economics supported expansion. Vitalis supported site selection for a second Etobicoke-area location and advised on the lease negotiation.",
    outcome: "The billing corrections resulted in a 14% improvement in net monthly collections within 90 days — without any change to patient volume or clinical operations. The second location opened 11 months after the engagement began, using the corrected financial model as its planning basis. In its first six months, the second location performed within 8% of the financial projections.",
    services: ["Revenue Cycle & Billing Audit", "Coordination of Benefits Correction", "Fee Schedule Review & Update", "Multi-Location Financial Modeling", "Site Selection Advisory", "Lease Negotiation Support"],
    metrics: [
      { label: "14% increase in net monthly collections", value: "+14%", sublabel: "Within 90 days of billing corrections" },
      { label: "Second location opened in 11 months", value: "11 months", sublabel: "From engagement start" },
      { label: "Within 8% of financial projections", value: "±8%", sublabel: "Second location first 6 months" },
    ],
  },
  {
    id: "edmonton-surgical-centre-operations",
    title: "An Edmonton surgical centre improves OR utilization by 23 percentage points without adding capacity.",
    tagline: "A well-accredited NHSF with a utilization problem. The OR was there. The cases were not filling it.",
    location: "Edmonton, Alberta",
    type: ["Operations", "Revenue & Billing"],
    specialty: "General Surgery · Dermatology",
    size: "NHSF · 2 ORs · AHS-contracted CSF",
    duration: "9 months",
    gradient: "linear-gradient(135deg, hsl(175 40% 28%) 0%, hsl(185 40% 35%) 50%, hsl(170 35% 38%) 100%)",
    overview: "An Edmonton NHSF with two operating rooms and an AHS Chartered Surgical Facility contract for general surgery and dermatology procedures had been operating for three years. CPSA accreditation was current. The AHS contract was performing — but at 61% of contracted procedure volume. The facility was leaving AHS contract capacity unfilled while the physicians were citing scheduling and staffing constraints as the limiting factors.\n\nThe facility's leadership brought in Vitalis after an internal review failed to identify the root cause of the utilization gap.",
    challenge: "The assessment identified three distinct problems compounding each other. First, the OR booking process was physician-driven and informal — each surgeon called the booking coordinator directly, with no standardized lead time requirements or block booking structure. This resulted in fragmented scheduling with significant gaps between cases that were visible in the schedule but not being used for add-on bookings.\n\nSecond, the case mix was skewed toward longer, lower-volume procedures that consumed OR time without generating proportionate AHS facility fees. The facility had been selecting cases based on physician preference rather than economic optimization.\n\nThird, anesthesia coverage had a single-provider dependency — when the primary anesthesiologist was unavailable, cases were cancelled rather than rescheduled to a backup provider, because no formal backup arrangement existed.",
    approach: "A block booking structure was designed and implemented — replacing the ad hoc booking system with defined booking windows, standardized lead times by procedure type, and a structured add-on list managed by the booking coordinator. Case mix analysis produced an optimized procedure schedule that improved revenue per OR hour without reducing physician access.\n\nAn anesthesia backup agreement was negotiated with a second provider. Cancellation rates dropped immediately.",
    outcome: "OR utilization increased from 61% to 84% over six months. AHS contract procedure volume reached 91% of the contracted maximum in month seven. Annual facility fee revenue increased by approximately $340,000 from the same physical infrastructure and physician complement.",
    services: ["OR Utilization Assessment", "Block Booking System Design", "Case Mix Optimization", "Anesthesia Coverage Planning", "AHS Contract Performance Optimization", "Operational Systems Redesign"],
    metrics: [
      { label: "61% → 84% OR utilization", value: "61→84%", sublabel: "Six months post-implementation" },
      { label: "91% of AHS contract maximum", value: "91%", sublabel: "Month 7 procedure volume" },
      { label: "~$340K additional annual revenue", value: "$340K", sublabel: "Same infrastructure, no new capacity" },
    ],
  },
];

const filterOptions = ["All", "New Build", "Revenue & Billing", "Operations", "Growth", "M&A", "Technology", "People"];

// Card column span config for the mixed-size grid layout
const getCardSpan = (index: number): string => {
  if (index === 0) return "md:col-span-2 lg:col-span-3"; // flagship full-width
  return "";
};

const getCardMinHeight = (index: number): string => {
  if (index === 0) return "min-h-[360px]";
  return "min-h-[280px]";
};

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  usePageMeta(
    "Healthcare Consulting Portfolio & Case Studies | Vitalis",
    "A selection of healthcare consulting engagements across practice builds, revenue optimization, M&A advisory, and digital transformation."
  );

  const filteredCases = activeFilter === "All"
    ? caseStudies
    : caseStudies.filter(c => c.type.includes(activeFilter));

  const selectedCase = caseStudies.find(c => c.id === selectedCaseId) || null;

  const handleCardClick = (id: string) => setSelectedCaseId(id);
  const handleCardKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedCaseId(id);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-accent font-medium tracking-widest uppercase text-sm mb-6">
            Our Work
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Engagements that moved practices forward.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            A selection of strategic, operational, and development engagements across Canada. Practice names and identifying details changed for confidentiality.
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-6 bg-background border-b border-border sticky top-[72px] z-30">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="flex gap-2 overflow-x-auto flex-nowrap pb-1 scrollbar-hide">
            {filterOptions.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  activeFilter === filter
                    ? "bg-forest text-primary-foreground border-forest"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Card Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCases.map((cs, i) => (
                <motion.div
                  key={cs.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer group ${getCardMinHeight(activeFilter === "All" ? caseStudies.indexOf(cs) : -1)} ${activeFilter === "All" ? getCardSpan(caseStudies.indexOf(cs)) : ""}`}
                  style={{ background: cs.gradient }}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCardClick(cs.id)}
                  onKeyDown={(e) => handleCardKeyDown(e, cs.id)}
                >
                  {/* Arrow icon */}
                  <div className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>

                  {/* Bottom overlay scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7 z-10">
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {cs.type.map(t => (
                        <span key={t} className="text-xs font-medium bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                          {t}
                        </span>
                      ))}
                      <span className="text-xs font-medium bg-white/10 text-white/80 px-3 py-1 rounded-full backdrop-blur-sm">
                        {cs.specialty}
                      </span>
                    </div>
                    <h3 className="font-display text-lg lg:text-xl xl:text-2xl font-bold text-white leading-snug mb-2">
                      {cs.title}
                    </h3>
                    <p className="mt-2 text-white/70 text-sm flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {cs.location}
                    </p>
                  </div>

                  {/* Hover scale */}
                  <div className="absolute inset-0 group-hover:scale-[1.02] transition-transform duration-500 origin-center" style={{ background: cs.gradient }} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredCases.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No engagements match this filter.</p>
              <button onClick={() => setActiveFilter("All")} className="mt-4 text-accent underline underline-offset-4 hover:text-accent/80">
                Show all engagements
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <p className="text-muted-foreground mb-6 text-lg">Want to discuss how we can help your organization?</p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact">Speak With Our Team <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <Footer />

      {/* Case Study Drawer */}
      <Sheet open={!!selectedCase} onOpenChange={(open) => { if (!open) setSelectedCaseId(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-[640px] p-0 overflow-y-auto">
          {selectedCase && (
            <div className="flex flex-col min-h-full">
              {/* Drawer header */}
              <div className="p-6 lg:p-8 pb-0">
                <SheetHeader className="text-left mb-0">
                  <SheetDescription className="text-xs font-medium tracking-widest uppercase text-accent mb-3">
                    {selectedCase.specialty} — {selectedCase.location}
                  </SheetDescription>
                  <SheetTitle className="font-display text-2xl lg:text-3xl font-bold text-foreground leading-snug">
                    {selectedCase.title}
                  </SheetTitle>
                </SheetHeader>
                <p className="mt-4 text-lg text-muted-foreground italic leading-relaxed">
                  {selectedCase.tagline}
                </p>

                {/* Metadata strip */}
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground border-y border-border py-4">
                  <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{selectedCase.type.join(", ")}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{selectedCase.location}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{selectedCase.duration}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{selectedCase.size}</p>
              </div>

              {/* Body */}
              <div className="p-6 lg:p-8 space-y-8 flex-1">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">Situation</p>
                  {selectedCase.overview.split("\n\n").map((p, i) => (
                    <p key={i} className="text-foreground/90 leading-relaxed mb-4 last:mb-0">{p}</p>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">The Challenge</p>
                  {selectedCase.challenge.split("\n\n").map((p, i) => (
                    <p key={i} className="text-foreground/90 leading-relaxed mb-4 last:mb-0">{p}</p>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">What We Did</p>
                  {selectedCase.approach.split("\n\n").map((p, i) => (
                    <p key={i} className="text-foreground/90 leading-relaxed mb-4 last:mb-0">{p}</p>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">Results</p>
                  {selectedCase.outcome.split("\n\n").map((p, i) => (
                    <p key={i} className="text-foreground/90 leading-relaxed mb-4 last:mb-0">{p}</p>
                  ))}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {selectedCase.metrics.map((m, i) => (
                    <div key={i} className="bg-muted/50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-foreground">{m.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">{m.sublabel}</p>
                    </div>
                  ))}
                </div>

                {/* Services */}
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">Services In This Engagement</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCase.services.map(s => (
                      <span key={s} className="text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="sticky bottom-0 p-6 lg:p-8 pt-4 pb-6 bg-background border-t border-border">
                <Button variant="hero" size="lg" className="w-full" asChild>
                  <Link to="/contact">Discuss a similar engagement <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Portfolio;

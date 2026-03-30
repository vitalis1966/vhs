import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Clock, Briefcase } from "lucide-react";
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
  overview: string;
  challenge: string;
  approach: string;
  outcome: string;
  services: string[];
  metrics: CaseMetric[];
  isOngoing?: boolean;
}

const caseStudies: CaseStudy[] = [
  {
    id: "calgary-ent-surgical-build",
    title: "A Calgary surgical group builds an accredited procedural centre and opens ahead of projection.",
    tagline: "Two specialists. Years of shared referrals. A facility they had been planning to build together for a long time.",
    location: "Calgary, Alberta",
    type: ["New Build"],
    specialty: "Specialist Surgery",
    size: "2 surgeons",
    duration: "18 months from planning to opening",
    overview: "Two specialist surgeons with established practices in Calgary had been discussing a shared procedural facility for several years. Both operated in overlapping clinical areas, shared a referral network, and had the financial foundation to support a joint build. The clinical rationale was clear. The path to making it happen was not.\n\nNeither had developed an independent facility before. Both carried full clinical schedules alongside the planning process. The facility they envisioned required specific regulatory accreditation, specialized clinical infrastructure, and a governance structure between two co-owners that had never been formally designed.\n\nVitalis engaged during the early feasibility stage and coordinated the full development process from initial planning through to accreditation and opening.",
    challenge: "The two surgeons had identified a space they both wanted to proceed with. During Vitalis's facility specification review, a structural issue was identified that had not surfaced in earlier walkthroughs. The proposed space could not accommodate the clinical infrastructure requirements of the planned facility without modifications the building owner was not willing to make.\n\nA second issue surfaced at the same time: the ownership and governance structure between the two surgeons had not been formally defined. A general understanding existed, but no cost-sharing agreement, scheduling protocol, or decision-making framework was in place for shared operational expenses and future service decisions.",
    approach: "An alternative site was identified within three weeks. The new location had appropriate technical specifications, existing medical infrastructure rough-in, and a landlord with prior experience accommodating healthcare tenants. Lease terms included a tenant improvement allowance that offset a significant portion of the specialized buildout costs.\n\nThe governance framework was designed before the lease was signed. This included a cost-sharing structure, a scheduling protocol, and a decision-making process for shared expenses and future service additions. The framework was developed in coordination with the surgeons' legal counsel.\n\nRegulatory accreditation preparation ran in parallel with construction. Policies, procedures, credentialing frameworks, and compliance documentation were complete before the facility handed over. The accreditation inspection was booked for the week of construction completion.",
    outcome: "First-attempt regulatory accreditation with no outstanding requirements. The facility opened ahead of the revised projection. In the first six months of operation, combined procedure volume exceeded the base-case financial model by 19%. Both surgeons reduced their dependence on external facility bookings within the first year.",
    services: ["Practice Feasibility and Financial Modeling", "Regulatory Accreditation Preparation", "Site Selection and Lease Advisory", "Governance and Partnership Structure Design", "Facility Design Input", "Compliance Documentation", "Operational Systems Design"],
    metrics: [
      { label: "First-attempt accreditation", value: "No requirements list", sublabel: "Passed on first assessment" },
      { label: "4 weeks ahead of schedule", value: "Ahead of revised projection", sublabel: "" },
      { label: "+19% above base-case volume", value: "+19%", sublabel: "First 6 months of operations" },
    ],
  },
  {
    id: "edmonton-family-medicine-revenue",
    title: "Edmonton family medicine group recovers $310K in annual billing gaps.",
    tagline: "Five GPs. Solid patient relationships. A billing system that had been quietly losing money for years.",
    location: "Edmonton, Alberta",
    type: ["Revenue & Billing", "Operations"],
    specialty: "Family Medicine",
    size: "5-physician group, ~9,000 patient panel",
    duration: "14 weeks, assessment through implementation",
    overview: "A five-physician family medicine group in south Edmonton had been operating together for nine years. The practice had strong patient relationships, stable physician tenure, and above-average AHS panel sizes. On the surface, it was performing well. The physicians had simply never had an independent view of the financial performance.\n\nThe assessment revealed systematic billing gaps across three distinct revenue streams (AHS claims, uninsured services, and third-party billing) that had been accumulating since the practice's founding without anyone identifying the pattern.",
    challenge: "The AHS billing workflow had been set up by an administrative hire in the practice's first year and had not been reviewed since. Several service codes were being consistently under-reported. Uninsured services, including medical notes, insurance forms, driver's medicals, and executive health assessments, had no systematic fee schedule and were being billed ad hoc at rates well below market. WCB and MVA billing was largely being left to patients to manage.",
    approach: "Vitalis conducted a structured revenue cycle assessment across all three billing streams, sampling 90 days of claims and identifying the specific patterns driving under-collection. An updated AHS billing protocol was implemented with the existing administrative team, with no new hires required. A formal uninsured service fee schedule was built, approved by the physician group, and integrated into the booking and checkout workflow. A WCB/MVA billing protocol was designed and the practice enrolled in a billing service for third-party claims.",
    outcome: "The revenue changes were implemented over six weeks without disruption to patient care or administrative workflow. Within 60 days of full implementation, monthly collections had increased by $26,000. Annualized, the identified billing gaps represented $310,000 in previously uncaptured revenue from the same patient volume, same physicians, and same physical space.",
    services: ["Revenue Cycle Assessment", "AHS Billing Protocol Redesign", "Uninsured Service Fee Schedule Development", "WCB and MVA Billing Setup", "Administrative Workflow Optimization"],
    metrics: [
      { label: "$310K annualized revenue recovered", value: "$310K", sublabel: "From existing patient volume" },
      { label: "6 weeks to full implementation", value: "6 weeks", sublabel: "No disruption to clinical operations" },
      { label: "3 billing streams optimized", value: "3 streams", sublabel: "AHS, uninsured services, and third-party" },
    ],
  },
  {
    id: "ortho-sports-medicine-new-build",
    title: "A multi-specialty clinic builds a new facility, opens ahead of schedule, and under budget.",
    tagline: "Two practitioners. A shared facility concept. A timeline that couldn't slip.",
    location: "Western Canada",
    type: ["New Build"],
    specialty: "Musculoskeletal and Sports Medicine",
    size: "5,200 sq ft, 2 surgeons + 1 sports medicine physician",
    duration: "18 months",
    overview: "Two surgeons and a sports medicine physician had been renting space in separate facilities for years, each referring patients to the others without a shared operational base. The plan was to build a combined clinic with shared imaging, rehabilitation, and procedure capacity, a model that would reduce overhead for all three and create a more integrated patient experience.\n\nThe group had identified a location and was weeks away from signing a lease when Vitalis was brought in for a feasibility review.",
    challenge: "The proposed location had a structural issue with the floor load specifications that would have required significant and expensive reinforcement to support the planned imaging equipment. More critically, the space had no provision for the medical gas infrastructure required for the procedure room. These were not visible from the lease terms or the standard commercial real estate inspection, but they would have added approximately $180,000 to the buildout cost and extended the timeline by four months.\n\nA parallel issue: the group's financial model had not modelled shared overhead correctly. Each physician had modelled their own costs in isolation, meaning the collective financial picture had never been built.",
    approach: "The lease was paused while two alternative sites were assessed. The preferred alternative, a ground-floor space in a medical-dental building in the same corridor, had the required mechanical capacity, adequate floor loading, and a landlord willing to provide a tenant improvement allowance that covered 60% of the buildout cost.\n\nA consolidated financial model was built for the three-physician group, incorporating shared overhead allocation, individual revenue projections by service type, and imaging equipment amortization. The physicians reached agreement on the cost-sharing model before the lease was signed.",
    outcome: "The clinic opened 5 weeks ahead of the revised timeline. Total buildout cost came in 8% under the model. The TI allowance negotiated from the landlord covered infrastructure costs that would have been absorbed entirely at the original location. In the first year of operations, combined overhead per physician was 24% lower than each had been paying individually.",
    services: ["Practice Feasibility and Site Assessment", "Financial Modeling and Overhead Allocation", "Lease Negotiation Advisory", "Facility Design Input", "Equipment Procurement Planning", "Operational Launch Preparation"],
    metrics: [
      { label: "5 weeks ahead of schedule", value: "5 weeks early", sublabel: "Revised opening timeline" },
      { label: "8% under budget", value: "-8%", sublabel: "Final buildout cost" },
      { label: "24% lower overhead per physician", value: "-24%", sublabel: "vs. individual practice costs" },
    ],
  },
  {
    id: "vancouver-ophthalmology-nhsf",
    title: "A BC ophthalmology group builds an accredited surgical facility and opens on time.",
    tagline: "Two ophthalmologists. Hospital-based careers. A surgical facility they were ready to build independently.",
    location: "British Columbia",
    type: ["New Build", "Technology"],
    specialty: "Ophthalmology",
    size: "2 ophthalmologists",
    duration: "20 months from planning to opening",
    overview: "Two ophthalmologists who had spent their careers operating out of hospital facilities had reached a point where scheduling constraints and infrastructure limitations were actively restricting their clinical volume and patient access. The decision to build an independent surgical facility was driven by a clear clinical and financial rationale.\n\nOne of the two physicians had prior experience with an accredited surgical facility development in another province. That experience created a planning assumption that proved incorrect: the regulatory framework in British Columbia operates under a different set of standards, requirements, and inspection processes than the framework they were familiar with. Proceeding on the assumption that the prior experience was transferable would have created significant compliance risk.",
    challenge: "",
    approach: "Vitalis conducted a full gap analysis between the physicians' prior experience and the applicable BC regulatory requirements. The analysis produced a specific list of documentation, equipment specifications, and operational elements that needed to be built or revised before the accreditation application could proceed.\n\nThe documentation framework was rebuilt to meet the applicable provincial standards. Equipment specifications were reviewed and procurement was resequenced to align with the corrected requirements. Accreditation preparation ran in parallel with construction.",
    outcome: "First-attempt accreditation with no re-assessment required. The facility opened within the planned timeline. Combined procedure volume in the first full operating year exceeded the base-case financial model by 17%.",
    services: ["Provincial Regulatory Mapping", "Facility Design and Equipment Advisory", "Accreditation Preparation", "Financial Modeling", "Operational Systems Design"],
    metrics: [
      { label: "First-attempt accreditation", value: "Passed", sublabel: "No re-assessment required" },
      { label: "On timeline", value: "On schedule", sublabel: "Opened within the planned schedule" },
      { label: "+17% above base-case revenue", value: "+17%", sublabel: "First full operating year" },
    ],
  },
  {
    id: "specialty-medicine-build",
    title: "A specialty clinic opens with the operational and financial infrastructure that most new practices spend years building.",
    tagline: "A single specialist. A clear clinical vision. And a financial model that almost didn't get built.",
    location: "Canada",
    type: ["New Build", "Revenue & Billing"],
    specialty: "Specialty Medicine",
    size: "2,800 sq ft, 1 physician, registered clinic",
    duration: "13 months",
    overview: "A specialist completing a fellowship had a clear plan: open an independent clinic serving both adult and pediatric patients, with on-site testing, treatment programs, and a structured management program. The clinical model was well-defined. The business model required significant development.\n\nSpecialty practices in Canada have a specific billing profile: a mix of fee-for-service for clinical visits, uninsured services for certain testing panels, and the operational complexity of managing clinical programs that require regular patient attendance over multi-year periods. Most specialists entering private practice for the first time underestimate the revenue cycle complexity of this billing structure.",
    challenge: "The physician's initial financial model projected first-year revenue based on a full panel of patients from month three onward. It did not account for the ramp-up period required to build a referral network from referring family physicians and pediatricians, who typically take 6 to 9 months to begin consistently sending patients to a new specialist. The projected break-even timeline was therefore approximately 8 months shorter than a realistic model would produce.\n\nThe clinic design also had an efficiency gap: the proposed layout placed the patient waiting and observation area on the opposite side of the space from the nursing station, creating a staffing model that required a second clinical staff member earlier than financially feasible.",
    approach: "The financial model was rebuilt with realistic referral ramp assumptions based on comparable specialty practices in the same market. A GP outreach and referral development strategy was built into the pre-opening operational plan, creating the referral pipeline before opening day rather than after.\n\nThe facility layout was redesigned to consolidate the observation area adjacent to the nursing station, reducing the clinical staffing requirement during the practice's first two years. The billing structure was mapped in full before opening: insured billing codes, uninsured service fee schedules for testing panels, and a structured approach to managing billing over multi-year patient courses.",
    outcome: "The clinic reached billing break-even one month ahead of the revised (realistic) financial model. Referral volume from GP partners was measurably higher than comparable solo specialist openings in the same market, attributed to the pre-opening outreach program. The specialty program reached patient volume targets within the first year, providing a recurring revenue base that stabilized the practice's cash flow profile significantly earlier than the initial financial projections.",
    services: ["New Practice Feasibility and Financial Modeling", "Facility Design Input", "Billing Structure Setup", "Referral Development Strategy", "Operational Systems Design", "Staff Recruitment Planning"],
    metrics: [
      { label: "Break-even on revised timeline", value: "1 month ahead", sublabel: "Realistic financial model" },
      { label: "Patient volume targets met", value: "On target", sublabel: "Within first year" },
      { label: "Above-average referral volume", value: "Above market", sublabel: "GP outreach program outcome" },
    ],
  },
  {
    id: "cosmetic-medicine-expense",
    title: "A cosmetic medicine practice reduces overhead by 31 percent and rebuilds its financial model for sustainable growth.",
    tagline: "Strong clinical reputation. Revenue that looked good until the costs were modelled properly.",
    location: "Canada",
    type: ["Operations", "Revenue & Billing"],
    specialty: "Cosmetic and Aesthetic Medicine",
    size: "Solo practitioner, mixed public and private-pay",
    duration: "10 months",
    overview: "A cosmetic and aesthetic medicine practitioner had operated a well-regarded independent practice for seven years. Clinical outcomes were strong. Patient volume was above average. The practice had a mix of publicly insured reconstructive procedures and private-pay cosmetic services, a billing structure that should have produced excellent financial performance.\n\nThe reality was a practice operating on thin margins despite strong revenue, with no clear picture of where the money was going or which services were actually profitable.",
    challenge: "The practice had accumulated overhead across seven years of organic growth: staff who had been hired for specific tasks that were no longer the highest priority, a facility lease that had rolled to market rate without renegotiation, supply costs that had never been benchmarked against alternatives, and a cosmetic service pricing structure that had not been updated since the practice opened.\n\nThe publicly insured side of the practice was also billing below what the applicable schedule permitted for several procedure codes, a systematic gap that had never been identified because the physician had no independent revenue cycle review.",
    approach: "Vitalis conducted a full operational and financial assessment: staff role analysis, facility cost benchmarking, supply cost review, and a complete billing audit across 18 months of claims. The billing audit identified four procedure codes being consistently under-billed, representing approximately $67,000 in recoverable annual revenue.\n\nThe cosmetic service fee schedule was rebuilt against current market rates for the same procedures. Three supply vendors were replaced with better-priced alternatives without compromising clinical specification. The staffing model was restructured: two part-time roles were consolidated into one full-time role with a broader scope, reducing labour cost while improving administrative coverage.",
    outcome: "Total overhead reduction across the engagement: 31%. Billing corrections implemented within 60 days added $67,000 in annual revenue. The cosmetic fee schedule update increased average revenue per cosmetic case by 18%. The practice's net margin improved from 22% to 41% over the engagement period, a 19-point improvement without adding a single patient.",
    services: ["Operational and Financial Assessment", "Billing Revenue Cycle Review", "Cost Structure Analysis and Vendor Benchmarking", "Fee Schedule Review and Update", "Staffing Model Optimization", "Operations and Workflow Redesign"],
    metrics: [
      { label: "31% overhead reduction", value: "-31%", sublabel: "Total across all cost categories" },
      { label: "$67K annual revenue recovered", value: "$67K", sublabel: "Billing corrections" },
      { label: "22% to 41% net margin", value: "+19 pts", sublabel: "19-point improvement" },
    ],
  },
  // New case studies
  {
    id: "psychology-group-expansion",
    title: "A psychology group opens a second location, restructures operations across both sites, and stabilizes financial performance.",
    tagline: "An established group practice. A second location that exposed what the first one had quietly absorbed.",
    location: "Canada",
    type: ["Operations", "People", "New Build"],
    specialty: "Psychology and Mental Health",
    size: "2 locations, 6 clinicians",
    duration: "6 months",
    overview: "A group psychology practice with a single established location had operated successfully for several years. The lead psychologist had built a team of six clinicians with strong patient retention and a full appointment schedule. When the opportunity to open a second location arose, the decision was made to proceed. Within six months of opening, the financial and operational strain of running two sites made clear that the model that had worked at one location was not built to scale.\n\nThe core issue was not revenue. Both locations had patient volume. The issue was that the operational infrastructure had been designed around the owner being physically present. Scheduling, billing, clinical oversight, and staff management all ran through a single point of contact. At one location this was manageable. At two it was unsustainable.",
    challenge: "The owner was spending most of each week managing operational issues across two sites rather than delivering clinical services. Billing at the second location was being processed inconsistently, with uninsured service fees and third-party billing handled differently at each site. Staff at the new location had not been onboarded with clear role expectations, and two departures in the first four months had created scheduling instability.",
    approach: "Vitalis conducted a full operational assessment across both sites. A standardized billing protocol was implemented for uninsured services, third-party payers, and insurance submissions. Fee schedules were reviewed and updated across both locations to reflect current market rates.\n\nAn operational model was designed that did not require the owner to be the central decision-maker for daily functions. This included role redesign for the clinic manager position, a scheduling framework that could be managed remotely, and a communication structure between sites. A staff onboarding process was documented and implemented before the next hire.\n\nFinancial modeling was updated to reflect the true two-location cost structure, and a revised break-even analysis was completed to give the owner a clear picture of what profitability at both locations actually required.",
    outcome: "Within four months of implementation, the owner had reduced direct operational involvement by an estimated 60 percent and returned to a full clinical schedule. Billing consistency improved materially across both sites. The practice reached combined break-even at the second location ahead of the revised projection.",
    services: ["Operational Assessment and Workflow Redesign", "Billing Protocol Standardization", "Fee Schedule Review and Update", "Role Design and Staff Onboarding Framework", "Financial Modeling and Break-Even Analysis", "Multi-Site Management Structure Design"],
    metrics: [
      { label: "60% reduction in owner operational involvement", value: "-60%", sublabel: "Within four months" },
      { label: "Break-even ahead of revised projection", value: "Ahead of plan", sublabel: "Second location" },
      { label: "Billing consistency restored", value: "Standardized", sublabel: "Across both sites" },
    ],
  },
  {
    id: "new-location-build-generic",
    title: "A practice owner plans and opens a second location, on time and within budget, in a new market.",
    tagline: "A proven model. A new market. A build that needed to go right the first time.",
    location: "Canada",
    type: ["New Build", "Operations"],
    specialty: "Healthcare Practice",
    size: "2 locations",
    duration: "14 months",
    overview: "A practice owner with one well-established location had identified a second market opportunity and made the decision to expand. The business case was sound and the clinical model had been refined over several years of operation. What the owner had not done before was manage a facility build in a market where they had no existing relationships, no knowledge of local commercial real estate, and no prior experience navigating the regulatory and operational requirements for a new site.\n\nThe build scope was significant. The new location required a purpose-designed clinical layout, specific infrastructure for the practice type, and regulatory compliance preparation before the facility could open. A construction contractor had been identified and a general timeline had been discussed, but no formal project plan existed.",
    challenge: "The early site selection process had not accounted for several location-specific constraints. The first space under consideration had lease terms that were unfavorable for a healthcare tenant, including no tenant improvement allowance and a restriction on signage that would have limited visibility at street level. A second space had favorable terms but required a structural assessment before clinical infrastructure could be specified.\n\nOn the operational side, the owner had not yet defined the staffing model for the new location, the compensation structure for the clinical team, or the practice management technology that would be used. These decisions needed to be made before the buildout design could be finalized.",
    approach: "Vitalis provided site selection advisory, lease review, and negotiation support for the second space, which proceeded after the structural assessment confirmed feasibility. Lease terms were renegotiated to include a tenant improvement allowance that offset a meaningful portion of buildout costs.\n\nA clinical space program was developed to guide the architect and contractor, specifying room count, layout requirements, and clinical infrastructure needs. Construction milestones were tracked against the opening timeline, and equipment procurement was coordinated to align with construction completion.\n\nThe staffing model was designed before recruitment began. Compensation benchmarks were established for each role, a hiring process was documented, and onboarding materials were prepared so that the team hired for the new location started with clear expectations from day one.",
    outcome: "The facility opened within the planned timeline and within budget. The new location reached its initial patient volume target within the first three months of operation.",
    services: ["Site Selection and Lease Advisory", "Clinical Space Programming", "Facility Design Coordination", "Staffing Model Design and Recruitment Framework", "Practice Management Technology Setup", "Financial Modeling"],
    metrics: [
      { label: "On time and within budget", value: "On target", sublabel: "Facility opening" },
      { label: "Patient volume target reached", value: "Within 3 months", sublabel: "Of opening" },
      { label: "Staffed and operational from day one", value: "No delays", sublabel: "No hiring delays" },
    ],
  },
  {
    id: "family-medicine-revenue-increase",
    title: "A solo physician with over 15 years in practice achieves a 44 percent year-over-year revenue increase without adding patients.",
    tagline: "Fifteen years in practice. A full patient panel. Revenue that had plateaued for years.",
    location: "Canada",
    type: ["Revenue & Billing", "Operations"],
    specialty: "Family Medicine",
    size: "Solo physician, full patient panel",
    duration: "12 months",
    overview: "A solo family physician had been in practice for over 15 years. The practice had a full and loyal patient panel, strong clinical outcomes, and a stable team. Revenue had remained essentially flat for the previous four years. The physician assumed this was a function of capacity, not performance. There was no more room in the schedule.\n\nWhat the physician had not seen was that the revenue generated per patient encounter had drifted significantly below what the practice model and patient panel could support. The billing system had not been reviewed since the early years of the practice. Uninsured service fees had never been formally structured. Third-party billing was inconsistent. Several service codes being used regularly were generating below their appropriate reimbursement rates.",
    challenge: "The physician had never had an independent review of the practice's financial performance. All billing had been managed by the same administrative staff member for nine years using a process established at the start of the practice. No external benchmark had ever been applied. From the inside, the numbers looked normal because they had always looked that way.\n\nThe practice also had no formal structure for uninsured services. Fees were set informally and had not been updated in years. Patients were often not informed of uninsured services at booking, leading to inconsistent collection at the point of care.",
    approach: "Vitalis conducted a full revenue cycle review covering insured services, uninsured service fees, and third-party billing. A 90-day sample of billing records was analyzed against applicable fee schedules and reimbursement benchmarks.\n\nAn updated fee schedule was built for all uninsured services, benchmarked against current market rates. An updated billing protocol was implemented with the existing administrative team, requiring no new hires. A booking and checkout workflow was redesigned to ensure uninsured service disclosure and collection happened consistently.\n\nThird-party billing for WCB, MVA, and insurance forms was reorganized and partially outsourced to a billing service, removing the administrative burden from the in-house team.",
    outcome: "Within 12 months of implementation, the practice recorded a 44 percent year-over-year revenue increase. This was achieved with no increase in patient volume, no new staff, and no change to the physician's clinical schedule. It represented the largest single-year revenue increase in the practice's history.",
    services: ["Revenue Cycle Assessment", "Fee Schedule Review and Development", "Uninsured Service Fee Structure", "AHS and Third-Party Billing Protocol Redesign", "Administrative Workflow Optimization"],
    metrics: [
      { label: "44% year-over-year revenue increase", value: "+44%", sublabel: "Largest in the practice's 15-year history" },
      { label: "No new patients added", value: "Same panel", sublabel: "Same panel, same schedule" },
      { label: "No additional staff", value: "Existing team", sublabel: "Existing team, updated protocols" },
    ],
  },
  {
    id: "multi-specialty-culture-retention",
    title: "A multi-specialty clinic addresses a culture and retention problem before it becomes a patient care problem.",
    tagline: "A well-run clinic on paper. A team that kept leaving.",
    location: "Canada",
    type: ["People", "Operations"],
    specialty: "Multi-Specialty Clinic",
    size: "Multi-physician group, 12 clinical and administrative staff",
    duration: "12 months",
    overview: "A multi-specialty clinic with strong patient volumes and an experienced physician group had been experiencing staff turnover at a rate that was becoming operationally disruptive. Over an 18-month period, seven support staff members had left. Three were replaceable without significant disruption. The others created gaps in clinical workflow, institutional knowledge, and team cohesion that took months to recover from.\n\nThe physician group had attributed the turnover to compensation. Wages were reviewed and adjusted twice. The turnover continued. When a senior clinical coordinator gave notice and cited management style and unclear expectations as the reason for leaving, the lead physician recognized that the problem was not being addressed at its source.",
    challenge: "The clinic had no formal performance management process. Expectations for non-clinical staff had never been documented. Feedback was informal and inconsistent, and staff reported in exit conversations that they often did not know where they stood or what was expected of them. The culture that had formed was one of ambiguity, which different people experienced as stressful in different ways.\n\nThe physician group, while excellent clinically, had not had any leadership development support. Disagreements between partners about how to address staff issues had created inconsistency in how different staff members were managed, which compounded the problem.",
    approach: "Vitalis conducted behavioural profiling for the clinical and leadership team to give the physician group an objective picture of their own working styles and how those styles were landing with the non-clinical team around them. The profiling results were shared in a facilitated session that gave language to dynamics that had been present but unnamed.\n\nPerformance frameworks were built for every non-clinical role. These included documented expectations, defined scope of responsibility, and a structured feedback process. A communication model was designed so that staff had regular, predictable touchpoints with leadership and a clear process for raising concerns.\n\nA partner alignment session addressed the disagreements between physicians about management approach and established a shared framework for how personnel decisions would be made going forward.",
    outcome: "In the 12 months following the engagement, the clinic had one staff departure, a retirement. The two staff members who had been identified as retention risks during the engagement remained and both reported in subsequent check-ins that their experience had improved materially. Physician time spent on non-clinical operational issues decreased by an estimated 60 percent.",
    services: ["Behavioural Profiling and Team Assessment", "Performance Framework Design", "Leadership Communication Structure", "Partner Alignment Facilitation", "Staff Onboarding and Expectation Design"],
    metrics: [
      { label: "1 departure in 12 months", value: "1 vs. 7", sublabel: "Down from 7 in the prior 18 months" },
      { label: "60% reduction in physician time on non-clinical issues", value: "-60%", sublabel: "Estimated" },
      { label: "Retention stabilized", value: "Stabilized", sublabel: "No departures linked to culture or management" },
    ],
  },
  // Advisory engagements
  {
    id: "dental-ongoing-advisory",
    title: "Dental group retains Vitalis as ongoing strategic advisor through a period of operational growth and expansion planning.",
    tagline: "",
    location: "",
    type: ["Advisory"],
    specialty: "Multi-Site Dental Organization",
    size: "3 locations",
    duration: "Ongoing",
    isOngoing: true,
    overview: "", challenge: "", approach: "", outcome: "",
    services: ["Strategic Advisory", "Compensation Review", "Expansion Planning"],
    metrics: [],
  },
  {
    id: "primary-care-ongoing",
    title: "Primary care group engaged on rolling performance review, billing optimization, and quarterly operational benchmarking.",
    tagline: "",
    location: "",
    type: ["Advisory"],
    specialty: "Primary Care",
    size: "Multi-physician group",
    duration: "Ongoing",
    isOngoing: true,
    overview: "", challenge: "", approach: "", outcome: "",
    services: ["Operational Review", "Billing Performance", "Staffing Structure"],
    metrics: [],
  },
  {
    id: "veterinary-ongoing",
    title: "Independent veterinary practice retained Vitalis through a corporate acquisition approach and a subsequent growth phase.",
    tagline: "",
    location: "",
    type: ["Advisory"],
    specialty: "Veterinary Practice",
    size: "Independent practice",
    duration: "Ongoing",
    isOngoing: true,
    overview: "", challenge: "", approach: "", outcome: "",
    services: ["Valuation Advisory", "Associate Retention", "Operational Improvement"],
    metrics: [],
  },
  {
    id: "surgical-specialty-ongoing",
    title: "Specialist practice engaged for EBITDA improvement, overhead reduction, and acquisition readiness over an 18-month period.",
    tagline: "",
    location: "",
    type: ["Advisory"],
    specialty: "Surgical Specialty",
    size: "Single-location practice",
    duration: "18-month engagement",
    isOngoing: true,
    overview: "", challenge: "", approach: "", outcome: "",
    services: ["EBITDA Improvement", "Overhead Reduction", "Transition Preparation"],
    metrics: [],
  },
  {
    id: "specialist-group-ongoing",
    title: "Multi-physician practice retains Vitalis for leadership transition planning, team structure design, and partner succession.",
    tagline: "",
    location: "",
    type: ["Advisory"],
    specialty: "Specialist Group",
    size: "Multi-physician group",
    duration: "Ongoing",
    isOngoing: true,
    overview: "", challenge: "", approach: "", outcome: "",
    services: ["Leadership Development", "Partner Transition", "Governance Design"],
    metrics: [],
  },
];

const filterOptions = ["All", "New Build", "Revenue & Billing", "Operations", "Growth", "M&A", "Technology", "People", "Advisory"];

const borderColorMap: Record<string, string> = {
  "New Build": "#264a39",
  "Revenue & Billing": "#b5832a",
  "Operations": "#3b5a7a",
  "Growth": "#c47c2b",
  "M&A": "#6b3d5a",
  "Technology": "#2a6b6b",
  "People": "#8b4a3a",
  "Advisory": "#5a7a5a",
};

const resultStatMap: Record<string, string> = {
  "calgary-ent-surgical-build": "+19% above projected volume",
  "edmonton-family-medicine-revenue": "$310K recovered annually",
  "calgary-dental-dso-advisory": "+23% above original offer",
  "ortho-sports-medicine-new-build": "Opened ahead of schedule, under budget",
  "urgent-care-expansion": "2 to 5 locations in 26 months",
  "vancouver-ophthalmology-nhsf": "First-attempt accreditation",
  "specialty-medicine-build": "Break-even 1 month ahead of plan",
  "cosmetic-medicine-expense": "31% overhead reduction",
  "psychology-group-expansion": "New location opened on time",
  "new-location-build-generic": "Opened within timeline and budget",
  "family-medicine-revenue-increase": "44% year-over-year revenue increase",
  "multi-specialty-culture-retention": "Staff turnover reduced by 70 percent",
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

  const handleCardClick = (cs: CaseStudy) => {
    if (!cs.isOngoing) {
      setSelectedCaseId(cs.id);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-6">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Our Work</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Engagements that moved practices forward.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            A selection of strategic, operational, and development engagements across Canada. Practice names and identifying details changed for confidentiality.
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-6 bg-background sticky top-[72px] z-30">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="flex gap-2 overflow-x-auto flex-nowrap pb-1 scrollbar-hide">
            {filterOptions.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  activeFilter === filter
                    ? "bg-forest text-primary-foreground border-forest"
                    : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="mt-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }} />
        </div>
      </section>

      {/* Card Grid */}
      <section className="pt-8 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            <AnimatePresence mode="popLayout">
              {filteredCases.map((cs, i) => {
                const isFirst = i === 0 && activeFilter === "All";
                const topBorderColor = borderColorMap[cs.type[0]] || "#264a39";
                const resultStat = resultStatMap[cs.id];
                const rowIndex = Math.floor(i / 3);
                const isAltRow = rowIndex % 2 === 1;
                return (
                  <motion.div
                    key={cs.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                    className={`group bg-white rounded-lg overflow-hidden flex flex-col min-h-[200px] transition-all duration-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)] ${
                      isFirst ? "lg:col-span-2" : ""
                    } ${!cs.isOngoing ? "cursor-pointer" : ""}`}
                    style={{
                      borderTop: `3px solid ${topBorderColor}`,
                      border: `1px solid rgba(0,0,0,0.12)`,
                      borderTopWidth: '3px',
                      borderTopColor: topBorderColor,
                      background: isAltRow ? 'rgba(38, 74, 57, 0.02)' : 'white',
                    }}
                    role={cs.isOngoing ? undefined : "button"}
                    tabIndex={cs.isOngoing ? undefined : 0}
                    onClick={() => handleCardClick(cs)}
                    onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !cs.isOngoing) { e.preventDefault(); setSelectedCaseId(cs.id); } }}
                  >
                    <div className="p-5 flex flex-col flex-1">
                      {/* Tags */}
                      <div className="flex gap-2 flex-wrap">
                        {cs.type.map(t => (
                          <span key={t} className="text-xs text-foreground px-2 py-0.5 rounded-full border border-border" style={{ borderWidth: '0.5px' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                      {/* Specialty */}
                      <p className="text-[11px] text-muted-foreground uppercase tracking-widest mt-2">{cs.specialty}</p>
                      {/* Result stat (no Active badge for ongoing) */}
                      {!cs.isOngoing && resultStat ? (
                        <p className="text-sm font-bold mt-1.5 mb-2 pl-2" style={{ color: topBorderColor, borderLeft: `2px solid ${topBorderColor}` }}>{resultStat}</p>
                      ) : null}
                      {/* Title */}
                      <h3 className={`font-display font-semibold text-forest leading-[1.4] ${cs.isOngoing ? 'mt-2' : ''} ${isFirst ? "text-xl" : "text-base"} line-clamp-3`}>
                        {cs.title}
                      </h3>
                      <div className="mt-auto pt-3">
                        {cs.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <MapPin className="w-3 h-3" />
                            {cs.location}
                          </p>
                        )}
                        {!cs.isOngoing && (
                          <span className="text-sm font-medium text-accent hover:underline inline-flex items-center gap-1 mt-2">
                            Read more <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
              <div className="p-6 lg:p-8 pb-0">
                <SheetHeader className="text-left mb-0">
                  <SheetDescription className="text-xs font-medium tracking-widest uppercase text-accent mb-3">
                    {selectedCase.specialty}{selectedCase.location ? `, ${selectedCase.location}` : ""}
                  </SheetDescription>
                  <SheetTitle className="font-display text-2xl lg:text-3xl font-bold text-foreground leading-snug">
                    {selectedCase.title}
                  </SheetTitle>
                </SheetHeader>
                {selectedCase.tagline && (
                  <p className="mt-4 text-lg text-muted-foreground italic leading-relaxed">
                    {selectedCase.tagline}
                  </p>
                )}
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground border-y border-border py-4">
                  <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{selectedCase.type.join(", ")}</span>
                  {selectedCase.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{selectedCase.location}</span>}
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{selectedCase.duration}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{selectedCase.size}</p>
              </div>
              <div className="p-6 lg:p-8 space-y-8 flex-1">
                {selectedCase.overview && (
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">Situation</p>
                    {selectedCase.overview.split("\n\n").map((p, i) => (
                      <p key={i} className="text-foreground/90 leading-relaxed mb-4 last:mb-0">{p}</p>
                    ))}
                  </div>
                )}
                {selectedCase.challenge && (
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">The Challenge</p>
                    {selectedCase.challenge.split("\n\n").map((p, i) => (
                      <p key={i} className="text-foreground/90 leading-relaxed mb-4 last:mb-0">{p}</p>
                    ))}
                  </div>
                )}
                {selectedCase.approach && (
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">What We Did</p>
                    {selectedCase.approach.split("\n\n").map((p, i) => (
                      <p key={i} className="text-foreground/90 leading-relaxed mb-4 last:mb-0">{p}</p>
                    ))}
                  </div>
                )}
                {selectedCase.outcome && (
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">Results</p>
                    {selectedCase.outcome.split("\n\n").map((p, i) => (
                      <p key={i} className="text-foreground/90 leading-relaxed mb-4 last:mb-0">{p}</p>
                    ))}
                  </div>
                )}
                {/* Compact stat list */}
                {selectedCase.metrics.length > 0 && (
                  <div className="space-y-2">
                    {selectedCase.metrics.map((m, i) => {
                      const topBorderColor = borderColorMap[selectedCase.type[0]] || "#264a39";
                      return (
                        <div key={i} className="flex items-baseline gap-2 pl-3" style={{ borderLeft: `3px solid ${topBorderColor}` }}>
                          <span className="text-sm font-bold text-forest">{m.label}</span>
                          <span className="text-sm text-muted-foreground">/</span>
                          <span className="text-sm text-muted-foreground">{m.sublabel || m.value}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {selectedCase.services.length > 0 && (
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
                )}
              </div>
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

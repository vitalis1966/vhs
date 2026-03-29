import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/lib/seo";
import { JsonLd, buildServiceSchema, buildBreadcrumbSchema } from "@/components/JsonLd";
import {
  ClipboardList, DollarSign, Building2, Shield, FileText, Users, Settings,
  BarChart2, RefreshCw, ArrowRight, MapPin, Eye, Bone, Microscope, Scissors,
  Baby, Activity, Stethoscope, Smile, PawPrint, Zap, Brain, CheckCircle
} from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const hooks = [
  "Most surgical facility builds in Canada take 6–18 months longer than planned. The reason is almost always the same: accreditation requirements were not built into the project timeline from the start.",
  "Every province regulates surgical facilities differently. A facility designed and built to Alberta's CPSA standards may not meet BC's NHMSFAP requirements — and vice versa. Provincial regulatory alignment must be part of your planning, not an afterthought.",
  "Adding a new surgical service to an accredited facility requires a full re-assessment in most provinces. Facilities that don't plan their complete service scope from the beginning pay for it twice.",
];

const services = [
  { icon: ClipboardList, label: "Feasibility & Pre-Planning", body: "Before a dollar is committed, Vitalis assesses whether your planned facility is viable — financially, operationally, and regulatorily. This includes procedure scope planning, revenue modeling, capital cost estimation, and provincial regulatory requirements review. The most common reason surgical facility builds fail is that feasibility was never properly assessed." },
  { icon: DollarSign, label: "Financial Modeling", body: "Surgical facility financial models are unlike standard clinic models. AHS and provincial health authority facility fees, physician billing separation, procedure cost-per-case analysis, capital amortization, and private-pay revenue streams must all be modeled independently and together. Vitalis builds the financial model your lender, your partners, and your board will need." },
  { icon: Building2, label: "Facility Design Consultation", body: "OR count, recovery room design, sterile processing specifications, medical gas infrastructure, equipment placement, and patient flow — aligned with provincial accreditation standards before the architect draws a line. Facilities designed without regulatory alignment are the ones that require expensive retrofits at inspection time." },
  { icon: Shield, label: "Provincial Accreditation Preparation", body: "Each province's College of Physicians and Surgeons (or equivalent regulatory body) has specific documentation, staffing, equipment, and operational standards that must be in place before accreditation is granted. Vitalis prepares the complete documentation framework — policies, procedures, credentialing systems, incident reporting protocols, and quality assurance structures." },
  { icon: FileText, label: "Medical Director & Credentialing Support", body: "Every accredited surgical facility requires a named Medical Director who is accountable for credentialing and privileging all regulated members. The credentialing framework must be documented and functional before accreditation assessment. Vitalis helps facilities establish and document the Medical Director role and credentialing processes to the standard required by their provincial regulator." },
  { icon: Users, label: "Surgical Staffing Strategy", body: "OR nurses, surgical technologists, and anesthesia providers are in high demand across Canada's public and private surgical sectors. Vitalis helps surgical facilities develop staffing models, compensation structures, and recruitment strategies for the clinical roles that cannot be filled with generic healthcare recruitment." },
  { icon: Settings, label: "Operational Systems Design", body: "Patient intake, surgical scheduling, OR turnover protocols, recovery room management, sterile processing workflows, incident detection and reporting, and quality improvement structures — all built for compliance and operational efficiency before opening day, not developed reactively after issues arise." },
  { icon: BarChart2, label: "Performance Assessment — Existing Facilities", body: "For operating NHSFs and surgical facilities: an independent review of OR utilization, case mix profitability, staffing cost ratios, accreditation compliance posture, and revenue optimization opportunities. Facilities that have never had an independent operational review consistently find significant addressable performance gaps." },
  { icon: RefreshCw, label: "Ongoing Advisory & Standards Updates", body: "Provincial accreditation standards are updated regularly. AHS and provincial health authority contract requirements evolve. Technology changes. Vitalis provides ongoing advisory to ensure surgical facilities stay ahead of compliance requirements and continuously improve operational and financial performance." },
];

const provinces = [
  {
    province: "Alberta",
    body: "College of Physicians and Surgeons of Alberta (CPSA)",
    framework: "Non-Hospital Surgical Facility (NHSF) — and Chartered Surgical Facility (CSF) under the Health Facilities Act for publicly funded contracting",
    context: "CPSA sets and enforces NHSF standards. Accreditation required before opening. 4-year reassessment cycle — triggered earlier by service changes, renovations, or relocations. Medical Director appointment and credentialing framework required. AHS pays facility fees to CSFs for publicly funded procedures; physician fees billed separately through AHCIP. CPSA updated to v4 standards compliance by October 2024. Alberta has approximately 48 active CSF contracts covering ophthalmology, orthopedics, dermatology, plastics, gynecology, ENT, OMS, and general surgery.",
    note: "Vitalis is based in Calgary. Alberta is our primary NHSF market and the province where our regulatory expertise is deepest.",
  },
  {
    province: "British Columbia",
    body: "College of Physicians and Surgeons of BC (CPSBC)",
    framework: "Non-Hospital Medical and Surgical Facilities Accreditation Program (NHMSFAP)",
    context: "CPSBC's NHMSFAP accredits private medical and surgical facilities in BC. Standards cover facility design, staffing, patient safety, and operational quality. The program operates independently of the hospital system and is distinct from Alberta's CPSA framework — facilities designed to Alberta standards must be reviewed against BC standards separately. BC also has publicly funded contracting arrangements for specific procedure types through the provincial health authority.",
    note: "Vitalis works with surgical facility clients in BC, with specific familiarity with NHMSFAP standards and BC Health Authority contracting processes.",
  },
  {
    province: "Saskatchewan",
    body: "College of Physicians and Surgeons of Saskatchewan (CPSS)",
    framework: "Non-Hospital Surgical Facility (NHSF) — Saskatchewan adopted Alberta's CPSA NHSF Standards and Guidelines",
    context: "Saskatchewan's NHSF framework is based on Alberta's CPSA standards, creating strong alignment between the two provinces. This means facilities planning operations in both provinces have a more manageable compliance path than those spanning Alberta and BC or Ontario. Saskatchewan Health Authority contracts with NHSFs for publicly funded procedures in select categories.",
    note: "Vitalis supports clients planning surgical facilities in Saskatchewan, leveraging the direct alignment with Alberta's CPSA standards.",
  },
  {
    province: "Manitoba",
    body: "College of Physicians and Surgeons of Manitoba (CPSM)",
    framework: "Non-Hospital Medical and Surgical Facilities Accreditation Program",
    context: "Manitoba's CPSM operates an NHMSF accreditation program for private surgical and medical facilities. The program covers facility standards, equipment, staffing, and patient safety requirements. Manitoba's publicly funded surgical contracting has been more limited than Alberta's or BC's, though the province has been expanding private surgical capacity in recent years.",
    note: "Vitalis provides advisory for clients considering Manitoba surgical facility development.",
  },
  {
    province: "Ontario",
    body: "College of Physicians and Surgeons of Ontario (CPSO) for Out-of-Hospital Premises (OHP); Accreditation Canada for Integrated Community Health Services Centres (ICHSC) under O. Reg 215/23 as of April 1, 2024",
    framework: "Out-of-Hospital Premises (OHP) — CPSO; Integrated Community Health Services Centres (ICHSC) — Accreditation Canada",
    context: "Ontario has two overlapping regulatory frameworks for private surgical facilities. The CPSO regulates Out-of-Hospital Premises under the Medicine Act. Since April 1, 2024, Accreditation Canada acts as the inspection body for Integrated Community Health Services Centres under new provincial regulation O. Reg 215/23. Some facilities are subject to both frameworks. Ontario's approach involves more direct government oversight than western provinces. Ontario prohibits direct patient payment for insured advanced diagnostic services — a distinct restriction compared to western provinces.",
    note: "Ontario's dual regulatory framework requires specific navigation expertise. Vitalis works with clients in Ontario to map applicable requirements before facility planning begins.",
  },
  {
    province: "Other Provinces & National Context",
    body: "",
    framework: "",
    context: "Quebec operates Centres médicaux spécialisés (CMS) under its own provincial framework. New Brunswick, Nova Scotia, and other Atlantic provinces have their own regulatory arrangements for private surgical facilities. Vitalis works with clients across Canada and maps the applicable regulatory framework for each province as a first step in every multi-provincial engagement. No two provincial frameworks are identical — national surgical facility plans require province-by-province regulatory mapping, not a single-standard approach.",
    note: "",
  },
];

const procedures = [
  { icon: Eye, label: "Ophthalmology", desc: "Cataract surgery, non-cataract ophthalmic procedures, refractive surgery (LASIK), and laser procedures. One of the highest-volume NHSF categories in Canada — AHS actively contracts for cataract surgery in Calgary and Edmonton CSFs." },
  { icon: Bone, label: "Orthopedics", desc: "Hip and knee replacements, arthroscopy, bone and joint procedures, shoulder surgery, and hand surgery. Alberta expanded approved orthopedic procedures in NHSFs in recent years. Requires specialized OR tables, imaging, and implant management." },
  { icon: Microscope, label: "Dermatology", desc: "Mohs micrographic surgery, excision and reconstruction, laser surgery, and skin cancer procedures. Among the earliest NHSF categories in western Canada. Can include significant private-pay cosmetic volume alongside publicly insured procedures." },
  { icon: Scissors, label: "Plastic Surgery", desc: "Reconstructive and cosmetic plastic surgery. Most plastic surgery NHSFs have a mixed revenue model — publicly insured reconstructive procedures alongside private-pay cosmetic procedures." },
  { icon: Baby, label: "Gynecology", desc: "Pregnancy terminations, outpatient gynecological surgery, laparoscopic procedures, and other gynecological surgical services. Require specific equipment, recovery, and privacy standards." },
  { icon: Activity, label: "ENT (Ear, Nose & Throat)", desc: "Tonsillectomy, adenoidectomy, septoplasty, sinus surgery, and other otolaryngological procedures. Approved in most provincial NHSF frameworks. Require specific scope equipment and anesthesia protocols." },
  { icon: Stethoscope, label: "General Surgery", desc: "The scope of general surgical procedures approved for NHSF delivery has expanded in Alberta and other provinces. Includes hernia repair, cholecystectomy, and other procedures that do not require intensive care resources." },
  { icon: Activity, label: "Pain Management & Interventional", desc: "Nerve blocks, epidural injections, facet joint injections, and other interventional pain procedures under sedation. Growing NHSF category with relatively lower capital requirements." },
  { icon: Smile, label: "Oral Maxillofacial Surgery (OMS)", desc: "Surgical extractions, jaw surgery, implant surgery, and reconstructive oral surgery under general anesthesia. Approved AHS CSF category in Alberta. Requires both CPSA NHSF and ADA+C compliance." },
  { icon: Zap, label: "Cosmetic & Aesthetic Procedures", desc: "Cosmetic surgical procedures are typically private-pay rather than publicly insured — the same CPSA accreditation requirements apply. Facilities offering cosmetic surgery have entirely different revenue model dynamics from CSFs with AHS contracts." },
  { icon: Brain, label: "Neurosurgery (Limited Scope)", desc: "Select outpatient neurosurgical procedures in appropriately equipped NHSFs. Limited in scope compared to hospital-based neurosurgery. Requires specific equipment and staffing standards." },
  { icon: Settings, label: "Interventional Radiology & Vascular", desc: "Select interventional procedures in appropriately equipped NHSFs. Growing category in provinces that have expanded the approved procedure list for private surgical facilities." },
];

const buildSteps = [
  { num: "01", icon: ClipboardList, heading: "Feasibility & Scope Definition", body: "Before any commitment is made — lease, architect, or equipment — Vitalis assesses whether the planned facility is viable. This means defining the complete procedure scope, modeling revenue (facility fees, physician billing, private pay), estimating capital costs, mapping provincial regulatory requirements, and building a go/no-go financial model. This step protects your investment. Facilities that skip it are the ones that run out of money before opening." },
  { num: "02", icon: Shield, heading: "Provincial Regulatory Mapping", body: "Each provincial College of Physicians and Surgeons (or equivalent body) has specific requirements for facility design, equipment, staffing, documentation, and operations. Vitalis maps every applicable standard for your province and procedure scope before the architect is engaged — so the building is designed to pass accreditation, not redesigned after it fails." },
  { num: "03", icon: Building2, heading: "Facility Design Input", body: "Vitalis works alongside your architect to ensure the facility design meets accreditation standards from the first draft. OR dimensions, recovery room capacity, sterile processing layout, medical gas infrastructure, equipment placement, and patient flow are all reviewed against provincial standards before construction begins. Retrofitting a facility for accreditation compliance after construction is complete is one of the most expensive mistakes in surgical facility development." },
  { num: "04", icon: FileText, heading: "Accreditation Documentation Build", body: "During construction, Vitalis builds the complete documentation framework required for accreditation: policies and procedures, quality assurance systems, incident reporting protocols, infection prevention and control programs, Medical Director appointment documentation, and credentialing and privileging frameworks for all regulated members. These must be complete and functional at the time of the accreditation inspection — not in draft." },
  { num: "05", icon: Users, heading: "Staffing & Pre-Opening Operations", body: "Vitalis supports surgical nurse recruitment, anesthesia provider arrangement, Medical Director appointment, and pre-opening operational testing. Accreditation inspectors assess not just the physical facility but the operational readiness of the team. Facilities that are physically complete but operationally unprepared fail their inspection." },
  { num: "06", icon: CheckCircle, heading: "Accreditation Support & Opening", body: "Vitalis prepares the facility team for the accreditation inspection, supports the assessment process, and addresses any requirements identified by the regulator before first patient. After accreditation, Vitalis transitions to an ongoing advisory role — ensuring the facility maintains compliance, optimizes performance, and stays ahead of standards updates." },
];

const facilityTypes = [
  { icon: Stethoscope, label: "Medical Surgical Facilities", body: "Physician-owned and corporate NHSFs performing medical surgical procedures — ophthalmology, orthopedics, dermatology, plastics, gynecology, ENT, general surgery, and others. Medical NHSFs are the most common type in Canada and the most complex in terms of regulatory and financial structure. May operate under AHS or provincial health authority contracts for publicly funded procedures, or entirely as private-pay facilities.", cta: "Medical NHSF Advisory", href: "/solutions/medical" },
  { icon: Smile, label: "Dental & OMS Surgical Facilities", body: "Oral maxillofacial surgery centres, dental surgical facilities, and sedation dentistry practices performing procedures under general anesthesia or deep sedation. These facilities operate under dual regulatory frameworks — CPSA NHSF accreditation and ADA+C (or equivalent provincial dental regulatory body) standards simultaneously. OMS procedures are an approved AHS CSF category in Alberta.", cta: "Dental Surgical Facility Advisory", href: "/solutions/dental" },
  { icon: PawPrint, label: "Veterinary Surgical Facilities", body: "Specialty veterinary surgery centres, emergency and critical care facilities, and referral practices with dedicated surgical suites. Veterinary surgical facilities are regulated by provincial veterinary regulatory bodies (ABVMA in Alberta, CVBC in BC) — distinct from CPSA — with their own facility classification, equipment, and staffing standards. Capital requirements are among the highest in the veterinary sector.", cta: "Veterinary Surgical Facility Advisory", href: "/solutions/veterinary" },
];

const failurePoints = [
  { problem: "Accreditation requirements were not built into the project timeline", solution: "Vitalis maps the full accreditation pathway — documentation build, staffing requirements, inspection scheduling — at the feasibility stage. Accreditation readiness runs parallel to construction, not after it." },
  { problem: "The facility was designed without regulatory alignment", solution: "Vitalis provides regulatory-aligned design input before the architect draws a line. Every design decision that affects accreditation is reviewed against provincial standards in the design phase — not after the building is complete." },
  { problem: "The financial model treated the facility fee and physician billing as one revenue stream", solution: "Vitalis builds separate, detailed models for facility fee revenue, physician billing, and private-pay revenue — with realistic volume assumptions, ramp-up timelines, and expense structures." },
  { problem: "Staffing — particularly anesthesia — wasn't secured before opening", solution: "Vitalis works on anesthesia provider arrangements and surgical nurse recruitment as a priority workstream from the planning stage — not as an afterthought after the facility is built." },
  { problem: "The service scope wasn't fully defined before accreditation — and adding services later required a full re-assessment", solution: "Vitalis works with clients to define their complete intended service scope before the accreditation application — so re-assessments for scope expansion are avoided or planned and budgeted." },
  { problem: "The Medical Director role wasn't properly established — creating compliance exposure from day one", solution: "Vitalis supports Medical Director appointment, documentation of responsibilities, and establishment of the credentialing and privileging framework to the standard required by the provincial regulator." },
];

const cases = [
  { tag: "New Build — NHSF Accreditation · Alberta", headline: "First-attempt CPSA accreditation — no re-assessment required", body: "An ophthalmology practice planning an independent NHSF in Alberta engaged Vitalis at feasibility stage. A full standards gap analysis, parallel documentation build, and pre-assessment preparation resulted in first-attempt CPSA accreditation with no requirements list." },
  { tag: "Multi-Province · Western Canada", headline: "Surgical facility compliant across Alberta and BC frameworks", body: "A surgical group planning facilities in both Alberta and BC engaged Vitalis to map the regulatory differences between CPSA and CPSBC NHMSFAP standards. The facility design and documentation framework addressed both provincial requirements simultaneously, avoiding costly province-by-province retrofitting." },
  { tag: "Performance Assessment · Alberta", headline: "OR utilization improved from 61% to 84% within 6 months", body: "An established NHSF with declining AHS contract performance engaged Vitalis for an operational assessment. Scheduling redesign, case mix rebalancing, and turnover protocol changes improved OR utilization from 61% to 84% within six months." },
];

export default function NHSF() {
  usePageMeta(
    "Non-Hospital Surgical Facility Consulting Canada | NHSF Build, Accreditation & Operations | Vitalis Health Strategies",
    "Vitalis Health Strategies guides surgical facility builds from concept to accreditation across every Canadian province — medical, dental, and veterinary surgical facilities, all service types, full regulatory compliance with the College of Physicians and Surgeons."
  );

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={buildServiceSchema("Non-Hospital Surgical Facility Consulting", "Advisory and consulting for NHSF and surgical facility planning, licensing, operations, and compliance.", "/solutions/nhsf")} />
      <JsonLd data={buildBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }, { name: "Surgical Facilities", path: "/solutions/nhsf" }])} />
      <Navbar />
      <main>
        {/* S1 — Hero */}
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl text-center">
            <motion.div {...fadeUp}>
              <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Non-Hospital Surgical Facilities</span>
          </div>
              <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
                We build surgical facilities from the ground up — concept to accreditation, in every province, for every type of surgical practice.
              </h1>
              <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-4xl mx-auto">
                Opening a non-hospital surgical facility in Canada is one of the most regulated, capital-intensive, and operationally complex undertakings in private healthcare. Every province has its own regulatory body, its own accreditation standards, and its own approach to publicly funded contracting. Vitalis provides end-to-end advisory for surgical facility builds, regulatory navigation, accreditation preparation, and ongoing operational optimization — for medical, dental, and veterinary surgical practices across Canada.
              </p>
            </motion.div>

            {/* Hook strip */}
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="mt-12 grid md:grid-cols-3 gap-4">
              {hooks.map((h, i) => (
                <div key={i} className="bg-accent/10 border border-accent/30 rounded-xl p-5 text-left">
                  <p className="text-sm text-foreground leading-relaxed">{h}</p>
                </div>
              ))}
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.25 }} className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button variant="hero" size="lg" asChild><Link to="/contact">Book a Surgical Facility Consultation <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              <Button variant="hero-outline" size="lg" asChild><Link to="/strategic-assessment">Start With an Assessment</Link></Button>
            </motion.div>
          </div>
        </section>

        {/* S2 — Services */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">End-to-end advisory — from the first conversation to ongoing operations.</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Every stage of the surgical facility lifecycle. Every province. Every surgical specialty.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.06 }} className="bg-card rounded-2xl p-6 shadow-card border border-border/40 flex flex-col">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4"><Icon className="h-5 w-5 text-primary" /></div>
                    <h3 className="font-display text-base font-bold text-foreground mb-2">{s.label}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* S3 — What is an NHSF */}
        <section className="py-24 lg:py-32 bg-gradient-section">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <motion.div {...fadeUp} className="text-center mb-10">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Non-Hospital Surgical Facilities in Canada — what they are and why they matter.</h2>
            </motion.div>
            <motion.p {...fadeUp} className="text-muted-foreground leading-relaxed mb-12 max-w-4xl mx-auto">
              A Non-Hospital Surgical Facility is any facility outside a public hospital that performs designated surgical or procedural services. In Canada, these facilities operate under provincial regulatory frameworks that delegate accreditation authority to the provincial College of Physicians and Surgeons — or in some provinces, to designated national bodies. Every province that permits NHSFs requires accreditation before a facility can treat patients. Every province has its own standards, its own inspection process, and its own approach to publicly funded contracting. There is no single national framework — understanding the province-by-province landscape is foundational to planning a surgical facility anywhere in Canada.
            </motion.p>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div {...fadeUp} className="bg-card rounded-2xl p-8 shadow-card border border-border/40">
                <h3 className="font-display text-lg font-bold text-foreground mb-3">What NHSFs Do</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">NHSFs perform surgical and procedural services that do not require the full resources of a public hospital — ophthalmology, orthopedics, dermatology, plastics, gynecology, ENT, oral surgery, pain management, and other specialties. They can be physician-owned, corporate-owned, or structured as public-private partnerships. They may serve entirely private-pay patients, or may contract with provincial health authorities to deliver publicly funded procedures.</p>
              </motion.div>
              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="bg-card rounded-2xl p-8 shadow-card border border-border/40">
                <h3 className="font-display text-lg font-bold text-foreground mb-3">Why They Exist</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">NHSFs emerged across Canada as a mechanism to increase surgical capacity, reduce hospital wait times, and provide a more focused patient experience for certain procedure types. Alberta's Alberta Surgical Initiative, Ontario's community surgical centre expansion, and BC's long-standing NHMSFAP program all reflect provincial recognition that well-regulated private surgical facilities play a legitimate role in the healthcare system. In 2024-25, Alberta alone budgeted for 60,000-65,000 publicly funded procedures to be performed in chartered surgical facilities.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* S4 — Provincial Regulatory Frameworks */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <motion.div {...fadeUp} className="text-center mb-6">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Every province is different. Here is what surgical facility accreditation looks like across Canada.</h2>
              <p className="text-muted-foreground mt-3 max-w-3xl mx-auto">Vitalis has working knowledge of the regulatory framework in every province where we operate. This section outlines the key accreditation body and framework for each major province.</p>
            </motion.div>
            <div className="space-y-6 mt-14">
              {provinces.map((p, i) => (
                <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} className="bg-card rounded-2xl p-6 lg:p-8 shadow-card border-l-4 border-primary">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="h-5 w-5 text-primary shrink-0" />
                    <h3 className="font-display text-lg font-bold text-foreground">{p.province}</h3>
                  </div>
                  {p.body && <p className="text-sm font-semibold text-foreground mb-1">{p.body}</p>}
                  {p.framework && <p className="text-xs text-muted-foreground mb-3"><span className="font-medium">Framework:</span> {p.framework}</p>}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">{p.context}</p>
                  {p.note && <p className="text-sm text-primary font-medium italic">{p.note}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* S5 — Procedure Types */}
        <section className="py-24 lg:py-32 bg-gradient-section">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Surgical procedures performed in NHSFs across Canada.</h2>
              <p className="text-muted-foreground mt-3 max-w-3xl mx-auto">The approved procedure list varies by province and evolves over time. The following are the core categories that appear across most provincial frameworks.</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {procedures.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.05 }} className="bg-card rounded-2xl p-5 shadow-card border border-border/40">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center mb-3"><Icon className="h-4 w-4 text-primary" /></div>
                    <h3 className="font-display text-sm font-bold text-foreground mb-1">{p.label}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{p.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* S6 — Build Process */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <motion.h2 {...fadeUp} className="font-display text-2xl lg:text-3xl font-bold text-foreground text-center mb-14">How Vitalis builds a surgical facility — from first conversation to first patient.</motion.h2>
            <div className="space-y-8 relative">
              {/* Vertical line */}
              <div className="hidden md:block absolute left-6 top-8 bottom-8 w-px bg-primary/20" />
              {buildSteps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} className="flex gap-6 relative">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center z-10">
                      <span className="text-sm font-bold text-primary">{s.num}</span>
                    </div>
                    <div className="bg-card rounded-2xl p-6 shadow-card border border-border/40 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <h3 className="font-display text-base font-bold text-foreground">{s.heading}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* S7 — Facility Types */}
        <section className="py-24 lg:py-32 bg-gradient-section">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <motion.h2 {...fadeUp} className="font-display text-2xl lg:text-3xl font-bold text-foreground text-center mb-14">Surgical facility types Vitalis works with.</motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {facilityTypes.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }} className="bg-card rounded-2xl p-8 shadow-card border border-border/40 flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6"><Icon className="h-6 w-6 text-primary" /></div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-3">{f.label}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-6">{f.body}</p>
                    <Button variant="hero-outline" size="default" asChild className="w-full whitespace-normal h-auto py-3 text-center leading-snug"><Link to={f.href}>{f.cta} <ArrowRight className="ml-1 h-4 w-4 shrink-0" /></Link></Button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* S8 — Financial Model */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <motion.div {...fadeUp} className="text-center mb-6">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">The surgical facility financial model — the part most surgeons don't fully understand before they build.</h2>
              <p className="text-muted-foreground mt-3 max-w-3xl mx-auto">Surgical facilities in Canada that contract with provincial health authorities operate under a dual revenue structure that is fundamentally different from a medical clinic. Understanding this structure is not optional — it determines whether your facility is financially viable.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8 mt-14">
              <motion.div {...fadeUp} className="bg-card rounded-2xl p-8 shadow-card border border-primary/20">
                <h3 className="font-display text-lg font-bold text-foreground mb-3">Provincial Health Authority Facility Fee</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">When a surgical facility contracts with a provincial health authority (AHS in Alberta, HIBC in BC, etc.) to perform publicly funded procedures, it receives a facility fee for each procedure. This fee is intended to cover operational costs — space, nursing staff, surgical supplies, utilities, equipment amortization, and administrative overhead. It is not a profit margin. Profitability comes from operating efficiently within the fee structure.</p>
                <ul className="space-y-2">
                  {["Fee rates are set by the health authority, not the facility","Rates vary by procedure type and province","The fee covers facility costs only — not physician fees","Facility fee revenue requires meeting accreditation and contracting standards"].map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />{t}</li>
                  ))}
                </ul>
              </motion.div>
              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="bg-card rounded-2xl p-8 shadow-card border border-accent/30">
                <h3 className="font-display text-lg font-bold text-foreground mb-3">Physician Fee-for-Service (Separate)</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">Surgeons performing procedures in NHSFs bill their provincial health insurance plan (AHCIP in Alberta, MSP in BC, OHIP in Ontario) directly for physician services — at the same fee schedule rates as hospital procedures. Anesthesiologists bill separately. These payments go to the physician, not the facility.</p>
                <ul className="space-y-2">
                  {["Physician income and facility revenue are financially independent","Both streams must be modeled separately","A facility can be profitable while a physician loses money, or vice versa","New NHSF operators frequently confuse these two streams in their financial models"].map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />{t}</li>
                  ))}
                </ul>
              </motion.div>
            </div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="bg-accent/10 border border-accent/30 rounded-2xl p-8 mt-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-3">Private Pay Revenue</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">NHSFs may also perform private-pay procedures — services not covered by provincial health insurance or health authority contracts. Cosmetic surgery, elective procedures for international patients, and certain uninsured services can generate private-pay revenue. Private pay has no facility fee ceiling — the facility sets its own pricing. The same accreditation standards apply regardless of payer.</p>
            </motion.div>
          </div>
        </section>

        {/* S9 — Why Builds Fail */}
        <section className="py-24 lg:py-32 bg-gradient-section">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <motion.h2 {...fadeUp} className="font-display text-2xl lg:text-3xl font-bold text-foreground text-center mb-14">The most common reasons surgical facility builds stall, fail, or significantly overspend — and what Vitalis does to prevent each one.</motion.h2>
            <div className="space-y-6">
              {failurePoints.map((f, i) => (
                <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} className={`rounded-2xl p-6 lg:p-8 border border-border/40 ${i % 2 === 0 ? 'bg-card' : 'bg-card/60'}`}>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl font-bold text-primary/30 font-display shrink-0">0{i + 1}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2"><span className="text-destructive">Problem:</span> {f.problem}</p>
                      <p className="text-sm text-muted-foreground"><span className="font-semibold text-primary">Vitalis:</span> {f.solution}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* S10 — Cases */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Surgical facility engagements — a sample.</h2>
              <p className="text-muted-foreground text-sm mt-2">Client details withheld.</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {cases.map((c, i) => (
                <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }} className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">{c.tag}</span>
                  <h3 className="font-display text-lg font-bold text-foreground mt-3 mb-2">{c.headline}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{c.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* S11 — Final CTA */}
        <section className="py-20 lg:py-28 bg-forest-dark">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
            <motion.div {...fadeUp}>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-primary-foreground tracking-tight">A surgical facility is not a clinic with an OR. It is one of the most complex investments in private healthcare — and one of the most rewarding when it is built correctly.</h2>
              <p className="text-primary-foreground/70 mt-4 text-lg">Vitalis provides the advisory experience to do it right — from the first feasibility conversation through accreditation and into long-term operations. We have done this across provinces, across specialties, and across facility types. We know exactly where the process breaks down and how to prevent it.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button variant="hero" size="lg" asChild className="whitespace-normal h-auto py-3 text-center leading-snug"><Link to="/contact">Book a Surgical Facility Consultation <ArrowRight className="ml-1 h-4 w-4 shrink-0" /></Link></Button>
                <Button variant="hero-outline" size="lg" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"><Link to="/strategic-assessment">Start With an Assessment</Link></Button>
              </div>
              <p className="text-primary-foreground/50 text-sm mt-8">Vitalis works with surgical facilities across Alberta, British Columbia, Saskatchewan, Manitoba, Ontario, and other Canadian provinces. Contact us to discuss your province and procedure scope.</p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

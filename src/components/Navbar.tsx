import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Stethoscope, Smile, PawPrint, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import vitalisLogo from "@/assets/vitalis-logo.png";

const practiceTypes = [
  {
    icon: Stethoscope,
    label: "Medical Practices",
    description: "Clinics, surgical centres, and specialty practices",
    href: "/solutions/medical",
  },
  {
    icon: Smile,
    label: "Dental Practices",
    description: "General, specialty, and multi-location dental",
    href: "/solutions/dental",
  },
  {
    icon: PawPrint,
    label: "Veterinary Practices",
    description: "Small animal, mixed, and specialty vet clinics",
    href: "/solutions/veterinary",
  },
];

const nhsfItem = {
  icon: Building2,
  label: "Non-Hospital Surgical Facilities",
  description: "Build, accredit, and operate surgical facilities across Canada",
  href: "/solutions/nhsf",
};

const planningItems = [
  { label: "Practice Feasibility & Financial Planning", href: "/solutions/new-clinics#feasibility" },
  { label: "Facility Development Support", href: "/solutions/new-clinics#facility-design" },
  { label: "Regulatory & Compliance Guidance", href: "/solutions/new-clinics#regulatory" },
  { label: "Recruitment & Staffing Design", href: "/solutions/new-clinics#people" },
  { label: "Technology & Software Setup", href: "/solutions/new-clinics#technology" },
];

const operatingItems = [
  { label: "Strategic Practice Assessment", href: "/strategic-assessment" },
  { label: "Operations & Workflow Optimization", href: "/solutions/existing-clinics#operations" },
  { label: "Billing & Revenue Review", href: "/solutions/existing-clinics#billing" },
  { label: "Growth Strategy & Expansion Planning", href: "/solutions/existing-clinics#growth" },
  { label: "Digital Transformation", href: "/healthcare-it" },
  { label: "Non-Hospital Surgical Facilities", href: "/solutions/nhsf" },
  { label: "Fractional & Advisory Leadership", href: "/engagement" },
  { label: "Mergers, Acquisitions & Transitions", href: "/solutions/existing-clinics#transitions" },
];

const simpleNavLinks = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Overview", href: "/about" },
      { label: "Mission & Vision", href: "/about/mission-vision" },
    ],
  },
  { label: "How We Work", href: "/how-we-work" },
  { label: "Engagement", href: "/engagement" },
  { label: "Healthcare IT", href: "/healthcare-it" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  const renderDesktopLink = (link: typeof simpleNavLinks[0]) => {
    if (link.children) {
      return (
        <div
          key={link.href}
          className="relative group"
          onMouseEnter={() => setOpenDropdown(link.href)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <button
            className={cn(
              "text-[13px] font-medium tracking-wide transition-colors hover:text-primary flex items-center gap-1 whitespace-nowrap py-2",
              location.pathname.startsWith(link.href) ? "text-primary" : "text-muted-foreground"
            )}
          >
            {link.label}
            <ChevronDown className="h-3 w-3" />
          </button>
          {openDropdown === link.href && (
            <div className="absolute top-full left-0 pt-2">
              <div className="bg-card rounded-lg shadow-elevated border border-border/40 py-2 min-w-[180px]">
                {link.children.map((child) => (
                  <Link
                    key={child.href}
                    to={child.href}
                    className={cn(
                      "block px-4 py-2 text-sm transition-colors hover:bg-secondary/50",
                      location.pathname === child.href ? "text-primary font-medium" : "text-muted-foreground"
                    )}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return (
      <Link
        key={link.href}
        to={link.href}
        className={cn(
          "text-[13px] font-medium tracking-wide transition-colors hover:text-primary whitespace-nowrap py-2",
          location.pathname === link.href ? "text-primary" : "text-muted-foreground"
        )}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 lg:h-20 px-4 lg:px-6 xl:px-8 max-w-[1440px]">
        <Link to="/" className="flex items-center flex-shrink-0">
          <img src={vitalisLogo} alt="Vitalis Health Strategies" className="h-10 lg:h-12 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden xl:flex items-center gap-2 2xl:gap-4">
          {simpleNavLinks.slice(0, 3).map(renderDesktopLink)}

          {/* Solutions Mega-Menu */}
          <div
            className="relative group"
            onMouseEnter={() => setOpenDropdown("solutions")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              className={cn(
                "text-[13px] font-medium tracking-wide transition-colors hover:text-primary flex items-center gap-1 whitespace-nowrap py-2",
                location.pathname.startsWith("/solutions") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Solutions
              <ChevronDown className="h-3 w-3" />
            </button>
            {openDropdown === "solutions" && (
              <div className="absolute top-full right-0 xl:-right-20 pt-2">
                <div className="bg-card rounded-xl shadow-elevated border border-border/40 overflow-hidden" style={{ width: "720px" }}>
                  <div className="grid grid-cols-3 divide-x divide-border/40 p-6 gap-0">
                    {/* Column 1 — By Practice Type */}
                    <div className="pr-6">
                      <p className="px-1 pb-3 text-xs font-semibold uppercase tracking-wider text-accent">
                        By Practice Type
                      </p>
                      <div className="space-y-1">
                        {practiceTypes.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            className="flex items-start gap-3 px-2 py-2.5 rounded-lg transition-colors hover:bg-secondary/50 group/item"
                          >
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary transition-colors">
                              <item.icon className="h-4 w-4 text-primary group-hover/item:text-primary-foreground transition-colors" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.label}</p>
                              <p className="text-xs text-muted-foreground leading-snug">{item.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-border/30 mt-3 pt-3">
                        <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-accent">
                          Surgical Facilities
                        </p>
                        <Link
                          to={nhsfItem.href}
                          className="flex items-start gap-3 px-2 py-2.5 rounded-lg transition-colors hover:bg-secondary/50 group/item"
                        >
                          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary transition-colors">
                            <nhsfItem.icon className="h-4 w-4 text-primary group-hover/item:text-primary-foreground transition-colors" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{nhsfItem.label}</p>
                            <p className="text-xs text-muted-foreground leading-snug">{nhsfItem.description}</p>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Column 2 — Planning & Building */}
                    <div className="px-6">
                      <p className="px-1 pb-3 text-xs font-semibold uppercase tracking-wider text-accent">
                        Planning & Building
                      </p>
                      {planningItems.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-2 py-1.5 text-sm transition-colors hover:bg-secondary/50 rounded text-muted-foreground hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>

                    {/* Column 3 — Operating, Growing & Advising */}
                    <div className="pl-6">
                      <p className="px-1 pb-3 text-xs font-semibold uppercase tracking-wider text-accent">
                        Operating, Growing & Advising
                      </p>
                      {operatingItems.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-2 py-1.5 text-sm transition-colors hover:bg-secondary/50 rounded text-muted-foreground hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Strip */}
                  <div className="border-t border-border/40 bg-secondary/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Not sure where to start?</span>
                    <div className="flex items-center gap-4">
                      <Link to="/strategic-assessment" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                        Take the Strategic Assessment <ArrowRight className="h-3 w-3" />
                      </Link>
                      <Link to="/contact" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                        Speak With Our Team <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {simpleNavLinks.slice(3).map(renderDesktopLink)}

          <div className="flex items-center gap-2 ml-2">
            <Button variant="hero" size="sm" asChild className="whitespace-nowrap text-[13px]">
              <Link to="/strategic-assessment">Strategic Assessment</Link>
            </Button>
            <Button variant="hero" size="sm" asChild className="whitespace-nowrap text-[13px]">
              <Link to="/contact">Speak With Our Team</Link>
            </Button>
          </div>
        </div>

        <button
          className="xl:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="xl:hidden bg-background border-b border-border max-h-[80vh] overflow-y-auto">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {simpleNavLinks.slice(0, 3).map((link) =>
              link.children ? (
                <div key={link.href} className="flex flex-col gap-2">
                  <span className="text-base font-medium text-foreground">{link.label}</span>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "text-sm font-medium pl-4 py-1 transition-colors",
                        location.pathname === child.href ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-base font-medium py-2 transition-colors",
                    location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Solutions — Mobile */}
            <div className="flex flex-col gap-3">
              <Link
                to="/solutions"
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-foreground"
              >
                Solutions
              </Link>

              <div className="pl-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">By Practice Type</p>
                {practiceTypes.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-muted-foreground py-1 pl-2"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-border/30 mt-2 pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">Surgical Facilities</p>
                  <Link
                    to={nhsfItem.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-muted-foreground py-1 pl-2"
                  >
                    {nhsfItem.label}
                  </Link>
                </div>
              </div>

              <div className="pl-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">Planning & Building</p>
                {planningItems.map((child) => (
                  <Link
                    key={child.label}
                    to={child.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-muted-foreground py-1 pl-2"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>

              <div className="pl-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">Operating, Growing & Advising</p>
                {operatingItems.map((child) => (
                  <Link
                    key={child.label}
                    to={child.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-muted-foreground py-1 pl-2"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>

              <div className="pl-4 pt-2 flex flex-col gap-2">
                <Link
                  to="/strategic-assessment"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-primary flex items-center gap-1"
                >
                  Take the Strategic Assessment <ArrowRight className="h-3 w-3" />
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-primary flex items-center gap-1"
                >
                  Speak With Our Team <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {simpleNavLinks.slice(3).map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-base font-medium py-2 transition-colors",
                  location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}

            <Button variant="hero" size="lg" asChild className="mt-2">
              <Link to="/strategic-assessment" onClick={() => setMobileOpen(false)}>Strategic Assessment</Link>
            </Button>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact" onClick={() => setMobileOpen(false)}>Speak With Our Team</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

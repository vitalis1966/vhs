import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import vitalisLogo from "@/assets/vitalis-logo.png";

const navLinks = [
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
  {
    label: "Solutions",
    href: "/solutions",
    children: [
      { label: "Overview", href: "/solutions" },
      { label: "New Practices", href: "/solutions/new-clinics" },
      { label: "Existing Practices", href: "/solutions/existing-clinics" },
    ],
    tracks: {
      "Planning & Building a Practice": [
        { label: "Practice Feasibility & Financial Planning", href: "/solutions/new-clinics" },
        { label: "Facility Development Support", href: "/solutions/new-clinics" },
        { label: "Regulatory & Compliance Guidance", href: "/solutions/new-clinics" },
        { label: "Recruitment & Staffing Design", href: "/solutions/new-clinics" },
        { label: "Technology & Software Setup", href: "/solutions/new-clinics" },
      ],
      "Operating, Growing & Advising": [
        { label: "Strategic Practice Assessment", href: "/strategic-assessment/intake" },
        { label: "Operations & Workflow Optimization", href: "/solutions/existing-clinics" },
        { label: "Billing & Revenue Review", href: "/solutions/existing-clinics" },
        { label: "Growth Strategy & Expansion Planning", href: "/solutions/existing-clinics" },
        { label: "Digital Transformation", href: "/healthcare-it" },
        { label: "Fractional & Advisory Leadership", href: "/engagement" },
        { label: "Mergers, Acquisitions & Transitions", href: "/contact" },
      ],
    },
  },
  { label: "Healthcare IT", href: "/healthcare-it" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 lg:h-20 px-4 lg:px-6 xl:px-8 max-w-[1440px]">
        <Link to="/" className="flex items-center flex-shrink-0">
          <img src={vitalisLogo} alt="Vitalis Health Strategies" className="h-10 lg:h-12 w-auto" />
        </Link>

        <div className="hidden xl:flex items-center gap-2 2xl:gap-4">
          {navLinks.map((link) =>
            link.tracks ? (
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
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                    <div className="bg-card rounded-lg shadow-elevated border border-border/40 py-4 px-2 min-w-[520px] grid grid-cols-2 gap-4">
                      {Object.entries(link.tracks).map(([trackName, items]) => (
                        <div key={trackName}>
                          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-accent">
                            {trackName}
                          </p>
                          {items.map((child) => (
                            <Link
                              key={child.label}
                              to={child.href}
                              className="block px-3 py-1.5 text-sm transition-colors hover:bg-secondary/50 rounded text-muted-foreground hover:text-foreground"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : link.children ? (
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
            ) : (
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
            )
          )}
          <div className="flex items-center gap-2 ml-2">
            <Button variant="hero" size="sm" asChild className="whitespace-nowrap text-[13px]">
              <Link to="/strategic-assessment">Practice Assessment</Link>
            </Button>
            <Button variant="hero" size="sm" asChild className="whitespace-nowrap text-[13px]">
              <Link to="/contact">Talk to Us</Link>
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

      {mobileOpen && (
        <div className="xl:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) =>
              link.tracks ? (
                <div key={link.href} className="flex flex-col gap-3">
                  <Link
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-medium text-foreground"
                  >
                    {link.label}
                  </Link>
                  {Object.entries(link.tracks).map(([trackName, items]) => (
                    <div key={trackName} className="pl-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">
                        {trackName}
                      </p>
                      {items.map((child) => (
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
                  ))}
                </div>
              ) : link.children ? (
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
            <Button variant="hero" size="lg" asChild className="mt-2">
              <Link to="/strategic-assessment/intake" onClick={() => setMobileOpen(false)}>Practice Assessment</Link>
            </Button>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact" onClick={() => setMobileOpen(false)}>Talk to Us</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

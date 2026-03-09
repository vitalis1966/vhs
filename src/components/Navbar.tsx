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
      { label: "New Clinics", href: "/solutions/new-clinics" },
      { label: "Existing Clinics", href: "/solutions/existing-clinics" },
    ],
  },
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
      <div className="container mx-auto flex items-center justify-between h-16 lg:h-20 px-4 lg:px-8">
        <Link to="/" className="flex items-center">
          <img src={vitalisLogo} alt="Vitalis Health Strategies" className="h-10 lg:h-12 w-auto" />
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.href}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(link.href)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors hover:text-primary flex items-center gap-1",
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
                  "text-sm font-medium tracking-wide transition-colors hover:text-primary",
                  location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            )
          )}
          <Button variant="hero" size="default" asChild>
            <Link to="/clinic-audit">Strategic Assessment</Link>
          </Button>
          <Button variant="hero" size="default" asChild>
            <Link to="/contact">Book a Consultation</Link>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) =>
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
            <Button variant="hero" size="lg" asChild className="mt-2">
              <Link to="/contact" onClick={() => setMobileOpen(false)}>Book a Consultation</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

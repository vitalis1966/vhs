import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import vitalisLogo from "@/assets/vitalis-logo.png";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Mission & Vision", href: "/about/mission-vision" },
  { label: "How We Work", href: "/how-we-work" },
  { label: "Engagement", href: "/engagement" },
  { label: "Solutions", href: "/solutions" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Partners", href: "/partners" },
  { label: "Strategic Assessment", href: "/clinic-audit" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 lg:h-20 px-4 lg:px-8">
        <Link to="/" className="flex items-center">
          <img src={vitalisLogo} alt="Vitalis Health Strategies" className="h-10 lg:h-12 w-auto" />
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
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
          ))}
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
            {navLinks.map((link) => (
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
              <Link to="/contact" onClick={() => setMobileOpen(false)}>Book a Consultation</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

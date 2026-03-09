import { Link } from "react-router-dom";
import vitalisLogo from "@/assets/vitalis-logo.png";

const footerLinks = {
  Solutions: [
    { label: "New Clinic Builds", href: "/solutions" },
    { label: "Operational Excellence", href: "/solutions" },
    { label: "Revenue & Growth", href: "/solutions" },
    { label: "M&A Advisory", href: "/solutions" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "How We Work", href: "/how-we-work" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Partners", href: "/partners" },
    { label: "Contact", href: "/contact" },
    { label: "Admin Login", href: "/admin/login" },
  ],
  Resources: [
    { label: "Clinic Audit", href: "/clinic-audit" },
    { label: "Insights", href: "/insights" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/">
              <img src={vitalisLogo} alt="Vitalis Health Strategies" className="h-10 w-auto brightness-0 invert" />
            </Link>
            <p className="mt-4 text-primary-foreground/70 text-sm leading-relaxed max-w-xs">
              Full-cycle inception-to-exit healthcare consulting. We partner with clinics and healthcare businesses through every stage of growth.
            </p>
            <div className="mt-6 text-sm text-primary-foreground/60">
              <p>Calgary, Alberta, Canada</p>
              <p className="mt-1">info@vitalisstrategies.com</p>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-primary-foreground/50 mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/admin/submissions" className="text-sm text-primary-foreground/50 hover:text-primary-foreground/70 transition-colors cursor-default">
            © {new Date().getFullYear()} Vitalis Health Strategies. All rights reserved.
          </Link>
          <div className="flex gap-6 text-sm text-primary-foreground/50">
            <Link to="/privacy" className="hover:text-primary-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-primary-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

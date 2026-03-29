import { Link } from "react-router-dom";
const vitalisLogo = "/vitalis-logo.webp";

const footerLinks = {
  Solutions: [
    { label: "New Practice Builds", href: "/solutions/new-clinics" },
    { label: "Operational Excellence", href: "/solutions/existing-clinics" },
    { label: "Revenue & Growth", href: "/clinic-audit" },
    { label: "M&A Advisory", href: "/contact" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "How We Work", href: "/how-we-work" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Ecosystem", href: "/partners" },
    { label: "Contact", href: "/contact" },
    { label: "Admin Login", href: "/admin/login" },
  ],
  Resources: [
    { label: "Strategic Assessment", href: "/strategic-assessment" },
    { label: "Insights", href: "/insights" },
  ],
  Legal: [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "Cookie Policy", href: "/cookies" },
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
              <img src={vitalisLogo} alt="Vitalis Health Strategies" className="h-10 w-auto brightness-0 invert" width="120" height="40" />
            </Link>
            <p className="mt-4 text-white text-sm leading-relaxed max-w-xs">
              Full-cycle healthcare consulting for medical, dental, and veterinary practices. We partner with practices through every stage of growth.
            </p>
            <div className="mt-6 text-sm text-white">
              <p>Calgary, Alberta, Canada</p>
              <p className="mt-1">info@vitalisstrategies.com</p>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="font-display text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
                {category}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-white hover:text-white/80 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/80">
            © {new Date().getFullYear()} Vitalis Health Strategies. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/80">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

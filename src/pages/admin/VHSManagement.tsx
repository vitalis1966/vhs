import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdminGuard } from "@/components/AdminGuard";
import { motion } from "framer-motion";
import { ArrowLeft, ClipboardList, FileSearch, Newspaper, Search, Briefcase, MessageSquare, ShieldCheck, ScrollText, Users } from "lucide-react";

const vhsManagementPages = [
  { title: "Assessment Builder", description: "Create and manage assessment questionnaires, sections, and questions.", href: "/admin/assessments", icon: ClipboardList },
  { title: "Submissions Review", description: "Review submitted assessments, run AI analysis, and generate internal reports.", href: "/admin/submissions", icon: FileSearch },
  { title: "Insights", description: "Create and manage blog articles and insights content.", href: "/admin/insights", icon: Newspaper },
  { title: "Portfolio", description: "Create and manage portfolio case studies and advisory entries.", href: "/admin/portfolio", icon: Briefcase },
  { title: "Contact Submissions", description: "View and manage incoming contact form submissions.", href: "/admin/contacts", icon: MessageSquare },
  { title: "SEO Settings", description: "Manage meta tags, Open Graph, schemas, tracking, and redirects for all pages.", href: "/admin/seo", icon: Search },
  { title: "Administrators", description: "Create and manage admin accounts. Reset passwords, toggle access, and protect the built-in administrator.", href: "/admin/administrators", icon: ShieldCheck },
  { title: "Logging", description: "View login attempts, file activity, and password change events across the platform.", href: "/admin/logging", icon: ScrollText },
  { title: "Client Management", description: "Manage client portal users and review documentation submissions.", href: "/admin/client-management", icon: Users },
];

function Inner() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="pt-32 pb-10 lg:pt-40 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Platform</span>
          </div>
          <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            VHS Management
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
            Manage and administer the Vitalis Health Strategies website platform.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vhsManagementPages.map((page) => (
              <Link key={page.href} to={page.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl shadow-soft border border-border/40 p-8 hover:shadow-elevated hover:border-primary/20 transition-all group cursor-pointer h-full"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <page.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {page.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {page.description}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default function VHSManagement() {
  return <AdminGuard><Inner /></AdminGuard>;
}

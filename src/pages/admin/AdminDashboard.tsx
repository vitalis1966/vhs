import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { ClipboardList, FileSearch, LogOut, Newspaper, Search, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const adminPages = [
  {
    title: "Assessment Builder",
    description: "Create and manage assessment questionnaires, sections, and questions.",
    href: "/admin/assessments",
    icon: ClipboardList,
  },
  {
    title: "Submissions Review",
    description: "Review submitted assessments, run AI analysis, and generate internal reports.",
    href: "/admin/submissions",
    icon: FileSearch,
  },
  {
    title: "Insights",
    description: "Create and manage blog articles and insights content.",
    href: "/admin/insights",
    icon: Newspaper,
  },
  {
    title: "SEO Settings",
    description: "Manage meta tags, Open Graph, schemas, tracking, and redirects for all pages.",
    href: "/admin/seo",
    icon: Search,
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="pt-32 pb-10 lg:pt-40 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Internal Admin</span>
          </div>
              <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
                Admin Dashboard
              </h1>
            </motion.div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminPages.map((page) => (
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

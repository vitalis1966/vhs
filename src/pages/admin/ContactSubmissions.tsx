import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Mail, CheckCircle2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const INTEREST_LABELS: Record<string, string> = {
  "new-practice": "New Practice Build",
  operations: "Operational Excellence",
  revenue: "Revenue & Finance",
  growth: "Growth Strategy",
  recruitment: "Practitioner Recruitment",
  ma: "M&A / Transition",
  "healthcare-it": "Healthcare IT & Technology",
  people: "People Management",
  assessment: "Strategic Assessment",
  general: "General Inquiry",
};

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  area_of_interest: string | null;
  message: string;
  status: string;
  submitted_at: string;
}

const STATUS_CYCLE: Record<string, string> = {
  new: "read",
  read: "replied",
  replied: "new",
};

const statusStyle = (status: string) => {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "read":
      return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    case "replied":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-200";
  }
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Submission | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      toast.error("Failed to load submissions");
      console.error(error);
    } else {
      setSubmissions((data as Submission[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const cycleStatus = async (sub: Submission) => {
    const nextStatus = STATUS_CYCLE[sub.status] || "new";
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status: nextStatus })
      .eq("id", sub.id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, status: nextStatus } : s))
      );
    }
  };

  const markReplied = async (sub: Submission) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status: "replied" })
      .eq("id", sub.id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, status: "replied" } : s))
      );
      if (selected?.id === sub.id) {
        setSelected({ ...sub, status: "replied" });
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", deleteTarget.id);
    if (error) {
      toast.error("Failed to delete submission");
    } else {
      toast.success("Submission deleted");
      setSubmissions((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      if (selected?.id === deleteTarget.id) setSelected(null);
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="pt-32 pb-10 lg:pt-40 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">Admin</span>
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">Contact Submissions</h1>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-background flex-1">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : submissions.length === 0 ? (
            <p className="text-muted-foreground">No submissions yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/40 shadow-soft">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30">
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Date</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Organization</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Area of Interest</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{formatDate(sub.submitted_at)}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{sub.name}</td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${sub.email}`} className="hover:underline" style={{ color: "#B8860B" }}>{sub.email}</a>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{sub.organization || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {sub.area_of_interest ? (INTEREST_LABELS[sub.area_of_interest] || sub.area_of_interest) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => cycleStatus(sub)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize cursor-pointer transition-colors ${statusStyle(sub.status)}`}
                        >
                          {sub.status}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelected(sub)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget(sub)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Submission Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-y-3">
                <span className="font-semibold text-muted-foreground">Name</span>
                <span className="text-foreground">{selected.name}</span>
                <span className="font-semibold text-muted-foreground">Email</span>
                <a href={`mailto:${selected.email}`} style={{ color: "#B8860B" }}>{selected.email}</a>
                <span className="font-semibold text-muted-foreground">Phone</span>
                <span className="text-foreground">{selected.phone || "—"}</span>
                <span className="font-semibold text-muted-foreground">Organization</span>
                <span className="text-foreground">{selected.organization || "—"}</span>
                <span className="font-semibold text-muted-foreground">Interest</span>
                <span className="text-foreground">{selected.area_of_interest ? (INTEREST_LABELS[selected.area_of_interest] || selected.area_of_interest) : "—"}</span>
                <span className="font-semibold text-muted-foreground">Date</span>
                <span className="text-foreground">{formatDate(selected.submitted_at)}</span>
                <span className="font-semibold text-muted-foreground">Status</span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize w-fit ${statusStyle(selected.status)}`}>{selected.status}</span>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground block mb-2">Message</span>
                <div className="bg-muted/30 rounded-lg p-4 text-foreground whitespace-pre-wrap leading-relaxed border border-border/30">
                  {selected.message}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="hero" size="sm" asChild>
                  <a href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: Your Vitalis inquiry")}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Reply by Email
                  </a>
                </Button>
                {selected.status !== "replied" && (
                  <Button variant="outline" size="sm" onClick={() => markReplied(selected)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Replied
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
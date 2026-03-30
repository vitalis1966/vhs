import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const filterOptions = ["All", "New Build", "Revenue & Billing", "Operations", "Growth", "M&A", "Technology", "People", "Advisory"];

const PortfolioAdmin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: cases = [], isLoading } = useQuery({
    queryKey: ["admin-portfolio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_cases")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const filteredCases = activeFilter === "All"
    ? cases
    : cases.filter((c: any) => c.tags?.includes(activeFilter));

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("portfolio_cases").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-portfolio"] });
      toast({ title: "Case study deleted" });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from("portfolio_cases")
        .update({ sort_order: newOrder })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-portfolio"] });
    },
  });

  const handleMove = (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= cases.length) return;
    const currentItem = cases[index];
    const swapItem = cases[swapIndex];
    reorderMutation.mutate({ id: currentItem.id, newOrder: swapItem.sort_order });
    reorderMutation.mutate({ id: swapItem.id, newOrder: currentItem.sort_order });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20 container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin
            </Link>
            <h1 className="font-display text-3xl font-bold text-foreground">Portfolio</h1>
          </div>
          <Button variant="hero" asChild>
            <Link to="/admin/portfolio/new"><Plus className="w-4 h-4 mr-2" /> New Case</Link>
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto flex-nowrap pb-4 scrollbar-hide mb-4">
          {filterOptions.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                activeFilter === filter
                  ? "bg-forest text-primary-foreground border-forest"
                  : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded" />)}
          </div>
        ) : filteredCases.length === 0 ? (
          <p className="text-muted-foreground text-center py-20">No cases match this filter.</p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-8">#</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Specialty</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Tags</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Type</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCases.map((c: any, idx: number) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => handleMove(cases.indexOf(c), "up")}
                          disabled={cases.indexOf(c) === 0}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMove(cases.indexOf(c), "down")}
                          disabled={cases.indexOf(c) === cases.length - 1}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground text-sm line-clamp-2 max-w-xs">{c.title}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{c.specialty}</span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {c.tags?.map((t: string) => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground capitalize">{c.case_type === "case_study" ? "Case Study" : "Advisory"}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant={c.status === "published" ? "default" : "secondary"}>
                        {c.status === "published" ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/portfolio/${c.id}`)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => {
                          if (confirm("Delete this case study? This cannot be undone.")) deleteMutation.mutate(c.id);
                        }}>
                          <Trash2 className="w-4 h-4 text-destructive" />
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
      <Footer />
    </div>
  );
};

export default PortfolioAdmin;

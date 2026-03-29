import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const InsightsAdmin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["admin-insights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insights_articles")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("insights_articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-insights"] });
      toast({ title: "Article deleted" });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20 container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin
            </Link>
            <h1 className="font-display text-3xl font-bold text-foreground">Insights</h1>
          </div>
          <Button variant="hero" asChild>
            <Link to="/admin/insights/new"><Plus className="w-4 h-4 mr-2" /> New Article</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded" />)}
          </div>
        ) : articles.length === 0 ? (
          <p className="text-muted-foreground text-center py-20">No articles yet.</p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Category</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Date</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {articles.map((a: any) => (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-foreground text-sm line-clamp-1">{a.title}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{a.category}</span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{a.date ? format(new Date(a.date), "MMM d, yyyy") : ""}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant={a.status === "published" ? "default" : "secondary"}>
                        {a.status === "published" ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/insights/${a.id}`)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => {
                          if (confirm("Delete this article?")) deleteMutation.mutate(a.id);
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

export default InsightsAdmin;

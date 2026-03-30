import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const tagOptions = ["New Build", "Revenue & Billing", "Operations", "Growth", "M&A", "Technology", "People", "Advisory"];

const PortfolioEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    specialty: "",
    location: "Canada",
    metric: "",
    description: "",
    tags: [] as string[],
    case_type: "case_study",
    body: "",
    sort_order: 0,
    status: "draft",
  });

  const { data: existing } = useQuery({
    queryKey: ["admin-portfolio-case", id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase
        .from("portfolio_cases")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title || "",
        slug: existing.slug || "",
        specialty: existing.specialty || "",
        location: existing.location || "Canada",
        metric: existing.metric || "",
        description: existing.description || "",
        tags: existing.tags || [],
        case_type: existing.case_type || "case_study",
        body: existing.body || "",
        sort_order: existing.sort_order || 0,
        status: existing.status || "draft",
      });
    }
  }, [existing]);

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleSpecialtyChange = (val: string) => {
    setForm(f => ({
      ...f,
      specialty: val,
      slug: isNew || f.slug === generateSlug(f.specialty) ? generateSlug(val) : f.slug,
    }));
  };

  const toggleTag = (tag: string) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }));
  };

  const saveMutation = useMutation({
    mutationFn: async (publish: boolean) => {
      const payload = {
        title: form.title,
        slug: form.slug,
        specialty: form.specialty,
        location: form.location,
        metric: form.metric,
        description: form.description,
        tags: form.tags,
        case_type: form.case_type,
        body: form.body || null,
        sort_order: form.sort_order,
        status: publish ? "published" : form.status,
      };
      if (isNew) {
        const { error } = await supabase.from("portfolio_cases").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("portfolio_cases").update(payload).eq("id", id);
        if (error) throw error;
      }
    },
    onSuccess: (_, publish) => {
      queryClient.invalidateQueries({ queryKey: ["admin-portfolio"] });
      toast({ title: publish ? "Case published" : "Case saved" });
      navigate("/admin/portfolio");
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20 container mx-auto px-4 max-w-3xl">
        <Link to="/admin/portfolio" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
        </Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          {isNew ? "New Case" : "Edit Case"}
        </h1>

        <div className="space-y-6">
          {/* Core Section */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Core</p>

            <div>
              <Label>Specialty *</Label>
              <Input value={form.specialty} onChange={e => handleSpecialtyChange(e.target.value)} placeholder="e.g. Family Medicine, Ophthalmology" />
            </div>

            <div>
              <Label>Metric / Headline *</Label>
              <Input value={form.metric} onChange={e => setForm(f => ({ ...f, metric: e.target.value }))} placeholder="e.g. $310K recovered annually" />
              <p className="text-xs text-muted-foreground mt-1">Bold stat shown on the card</p>
            </div>

            <div>
              <Label>Title / Description * ({form.description.length} chars)</Label>
              <Textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value, title: e.target.value }))}
                placeholder="1-2 sentences shown on the card"
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">Aim for under 140 characters</p>
            </div>

            <div>
              <Label>Location *</Label>
              <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Calgary, Alberta" />
            </div>

            <div>
              <Label className="mb-2 block">Tags *</Label>
              <div className="flex flex-wrap gap-3">
                {tagOptions.map(tag => (
                  <label key={tag} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={form.tags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Case Type *</Label>
                <Select value={form.case_type} onValueChange={v => setForm(f => ({ ...f, case_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="case_study">Case Study</SelectItem>
                    <SelectItem value="advisory">Advisory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
          </div>

          {/* Extended Content - only for case studies */}
          {form.case_type === "case_study" && (
            <Collapsible defaultOpen={!!form.body}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                <ChevronDown className="w-4 h-4" /> Extended Content
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <Label>Body Content (Markdown)</Label>
                <p className="text-xs text-muted-foreground mb-2">Supports ## headings, **bold**, - bullet lists. Populates the detail view.</p>
                <Textarea
                  value={form.body}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  placeholder="Extended case study content..."
                  rows={16}
                  className="font-mono text-sm"
                />
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Slug */}
          <div>
            <Label>Slug *</Label>
            <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated-slug" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => saveMutation.mutate(false)} disabled={saveMutation.isPending}>
              Save Draft
            </Button>
            <Button variant="hero" onClick={() => saveMutation.mutate(true)} disabled={saveMutation.isPending}>
              Publish
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PortfolioEditor;

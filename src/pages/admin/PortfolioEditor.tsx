import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const tagOptions = ["New Build", "Revenue & Billing", "Operations", "Growth", "M&A", "Technology", "People", "Advisory"];

const serviceOptions = [
  "Practice Feasibility and Financial Modeling",
  "Regulatory Accreditation Preparation",
  "Site Selection and Lease Advisory",
  "Governance and Partnership Structure Design",
  "Facility Design Input",
  "Compliance Documentation",
  "Operational Systems Design",
  "Revenue Cycle Review",
  "Billing Optimization",
  "Staffing and Role Design",
  "People and Culture Assessment",
  "Technology and EMR Advisory",
  "M&A and Transaction Advisory",
  "Practice Valuation",
  "Strategic Advisory",
  "Financial Restructuring",
  "Growth Planning",
  "Recruitment Strategy",
];

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
    sort_order: 0,
    status: "draft",
    ext_situation: "",
    ext_challenge: "",
    ext_what_we_did: "",
    ext_results: "",
    ext_stat_1_value: "",
    ext_stat_1_label: "",
    ext_stat_2_value: "",
    ext_stat_2_label: "",
    ext_stat_3_value: "",
    ext_stat_3_label: "",
    ext_services: [] as string[],
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
      return data as any;
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
        sort_order: existing.sort_order || 0,
        status: existing.status || "draft",
        ext_situation: existing.ext_situation || "",
        ext_challenge: existing.ext_challenge || "",
        ext_what_we_did: existing.ext_what_we_did || "",
        ext_results: existing.ext_results || "",
        ext_stat_1_value: existing.ext_stat_1_value || "",
        ext_stat_1_label: existing.ext_stat_1_label || "",
        ext_stat_2_value: existing.ext_stat_2_value || "",
        ext_stat_2_label: existing.ext_stat_2_label || "",
        ext_stat_3_value: existing.ext_stat_3_value || "",
        ext_stat_3_label: existing.ext_stat_3_label || "",
        ext_services: existing.ext_services || [],
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

  const toggleService = (service: string) => {
    setForm(f => ({
      ...f,
      ext_services: f.ext_services.includes(service)
        ? f.ext_services.filter(s => s !== service)
        : [...f.ext_services, service],
    }));
  };

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const saveMutation = useMutation({
    mutationFn: async (publish: boolean) => {
      const payload: any = {
        title: form.title,
        slug: form.slug,
        specialty: form.specialty,
        location: form.location,
        metric: form.metric,
        description: form.description,
        tags: form.tags,
        case_type: form.case_type,
        sort_order: form.sort_order,
        status: publish ? "published" : form.status,
        ext_situation: form.ext_situation || null,
        ext_challenge: form.ext_challenge || null,
        ext_what_we_did: form.ext_what_we_did || null,
        ext_results: form.ext_results || null,
        ext_stat_1_value: form.ext_stat_1_value || null,
        ext_stat_1_label: form.ext_stat_1_label || null,
        ext_stat_2_value: form.ext_stat_2_value || null,
        ext_stat_2_label: form.ext_stat_2_label || null,
        ext_stat_3_value: form.ext_stat_3_value || null,
        ext_stat_3_label: form.ext_stat_3_label || null,
        ext_services: form.ext_services.length > 0 ? form.ext_services : null,
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

  const hasExtendedContent = !!(form.ext_situation || form.ext_challenge || form.ext_what_we_did || form.ext_results);

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
              <Input value={form.metric} onChange={e => set("metric", e.target.value)} placeholder="e.g. $310K recovered annually" />
              <p className="text-xs text-muted-foreground mt-1">Bold stat shown on the card</p>
            </div>

            <div>
              <Label>Title / Description * ({form.description.length} chars)</Label>
              <Textarea
                value={form.description}
                onChange={e => { set("description", e.target.value); set("title", e.target.value); }}
                placeholder="1-2 sentences shown on the card"
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">Aim for under 140 characters</p>
            </div>

            <div>
              <Label>Location *</Label>
              <Input value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Calgary, Alberta" />
            </div>

            <div>
              <Label className="mb-2 block">Tags *</Label>
              <div className="flex flex-wrap gap-3">
                {tagOptions.map(tag => (
                  <label key={tag} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={form.tags.includes(tag)} onCheckedChange={() => toggleTag(tag)} />
                    {tag}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Case Type *</Label>
                <Select value={form.case_type} onValueChange={v => set("case_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="case_study">Case Study</SelectItem>
                    <SelectItem value="advisory">Advisory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={e => set("sort_order", parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>

          {/* Extended Content - only for case studies */}
          {form.case_type === "case_study" && (
            <Collapsible defaultOpen={hasExtendedContent}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                <ChevronDown className="w-4 h-4" /> Extended Content
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-6">
                {/* Situation */}
                <div>
                  <Label>Situation</Label>
                  <Textarea value={form.ext_situation} onChange={e => set("ext_situation", e.target.value)} placeholder="Describe the practice background, context, and what led to the engagement. 2–4 paragraphs." rows={5} />
                </div>

                {/* The Challenge */}
                <div>
                  <Label>The Challenge</Label>
                  <Textarea value={form.ext_challenge} onChange={e => set("ext_challenge", e.target.value)} placeholder="What specific problems, risks, or blockers did Vitalis find or need to address?" rows={4} />
                </div>

                {/* What We Did */}
                <div>
                  <Label>What We Did</Label>
                  <Textarea value={form.ext_what_we_did} onChange={e => set("ext_what_we_did", e.target.value)} placeholder="Describe the work Vitalis did — what was identified, decided, built, or implemented." rows={5} />
                </div>

                {/* Results */}
                <div>
                  <Label>Results</Label>
                  <Textarea value={form.ext_results} onChange={e => set("ext_results", e.target.value)} placeholder="What were the outcomes? Be specific. Refer to the headline metric." rows={4} />
                </div>

                {/* Result Stats */}
                <div>
                  <Label className="mb-2 block">Result Stats (up to 3)</Label>
                  <div className="space-y-3">
                    {[1, 2, 3].map(n => (
                      <div key={n} className="grid grid-cols-2 gap-3">
                        <Input
                          value={(form as any)[`ext_stat_${n}_value`]}
                          onChange={e => set(`ext_stat_${n}_value`, e.target.value)}
                          placeholder={`Stat ${n} value — e.g. +19% above projection`}
                        />
                        <Input
                          value={(form as any)[`ext_stat_${n}_label`]}
                          onChange={e => set(`ext_stat_${n}_label`, e.target.value)}
                          placeholder={`Label — e.g. First 6 months`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div>
                  <Label className="mb-2 block">Services in This Engagement</Label>
                  <div className="flex flex-wrap gap-3">
                    {serviceOptions.map(service => (
                      <label key={service} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox checked={form.ext_services.includes(service)} onCheckedChange={() => toggleService(service)} />
                        {service}
                      </label>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Slug */}
          <div>
            <Label>Slug *</Label>
            <Input value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="auto-generated-slug" />
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

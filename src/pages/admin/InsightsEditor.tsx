import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const categories = [
  "Practice Operations",
  "Revenue & Billing",
  "Growth & Expansion",
  "M&A & Transitions",
  "New Builds",
  "People & Leadership",
  "Regulatory Updates",
];

const InsightsEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "Practice Operations",
    status: "draft",
    date: new Date().toISOString().split("T")[0],
    estimated_read_time: 5,
    excerpt: "",
    body: "",
    featured_image_url: "",
    meta_title: "",
    meta_description: "",
  });

  const { data: existing } = useQuery({
    queryKey: ["admin-insight", id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase
        .from("insights_articles")
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
        category: existing.category || "Practice Operations",
        status: existing.status || "draft",
        date: existing.date || new Date().toISOString().split("T")[0],
        estimated_read_time: existing.estimated_read_time || 5,
        excerpt: existing.excerpt || "",
        body: existing.body || "",
        featured_image_url: existing.featured_image_url || "",
        meta_title: existing.meta_title || "",
        meta_description: existing.meta_description || "",
      });
    }
  }, [existing]);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleTitleChange = (val: string) => {
    setForm(f => ({
      ...f,
      title: val,
      slug: isNew || f.slug === generateSlug(f.title) ? generateSlug(val) : f.slug,
    }));
  };

  const saveMutation = useMutation({
    mutationFn: async (publish: boolean) => {
      const payload = {
        ...form,
        status: publish ? "published" : form.status,
        published_at: publish ? new Date().toISOString() : undefined,
        updated_at: new Date().toISOString(),
      };
      if (isNew) {
        const { error } = await supabase.from("insights_articles").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("insights_articles").update(payload).eq("id", id);
        if (error) throw error;
      }
    },
    onSuccess: (_, publish) => {
      queryClient.invalidateQueries({ queryKey: ["admin-insights"] });
      toast({ title: publish ? "Article published" : "Article saved" });
      navigate("/admin/insights");
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const articleUrl = `${window.location.origin}/insights/${form.slug}`;
  const linkedInText = `${form.title} — ${(form.excerpt || "").split(".")[0]}. Read on the Vitalis website: ${articleUrl}`;
  const emailSubject = `New from Vitalis: ${form.title}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20 container mx-auto px-4 max-w-3xl">
        <Link to="/admin/insights" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Insights
        </Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          {isNew ? "New Article" : "Edit Article"}
        </h1>

        <div className="space-y-6">
          <div>
            <Label>Title *</Label>
            <Input value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Article title" />
          </div>

          <div>
            <Label>Slug</Label>
            <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="article-slug" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
          </div>

          <div>
            <Label>Estimated Read Time (minutes)</Label>
            <Input type="number" min={1} value={form.estimated_read_time} onChange={e => setForm(f => ({ ...f, estimated_read_time: parseInt(e.target.value) || 5 }))} />
          </div>

          <div>
            <Label>Excerpt ({form.excerpt.length}/300)</Label>
            <Textarea
              value={form.excerpt}
              onChange={e => { if (e.target.value.length <= 300) setForm(f => ({ ...f, excerpt: e.target.value })); }}
              placeholder="Short description..."
              rows={3}
            />
          </div>

          <div>
            <Label>Featured Image URL</Label>
            <Input value={form.featured_image_url} onChange={e => setForm(f => ({ ...f, featured_image_url: e.target.value }))} placeholder="https://..." />
            {form.featured_image_url && (
              <img src={form.featured_image_url} alt="Preview" className="mt-2 rounded-lg max-h-48 object-cover" />
            )}
          </div>

          <div>
            <Label>Body Content (Markdown)</Label>
            <p className="text-xs text-muted-foreground mb-2">Supports ## headings, ### subheadings, **bold**, *italic*, - bullet lists, [link text](url), and --- horizontal rules.</p>
            <Textarea
              value={form.body}
              onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              placeholder="Write your article..."
              rows={20}
              className="font-mono text-sm"
            />
          </div>

          {/* SEO section */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              <ChevronDown className="w-4 h-4" /> SEO Settings
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4">
              <div>
                <Label>Meta Title ({form.meta_title.length}/60)</Label>
                <Input value={form.meta_title} onChange={e => setForm(f => ({ ...f, meta_title: e.target.value }))} maxLength={60} />
              </div>
              <div>
                <Label>Meta Description ({form.meta_description.length}/160)</Label>
                <Textarea value={form.meta_description} onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))} maxLength={160} rows={2} />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => saveMutation.mutate(false)} disabled={saveMutation.isPending}>
              Save Draft
            </Button>
            <Button variant="hero" onClick={() => saveMutation.mutate(true)} disabled={saveMutation.isPending}>
              Publish
            </Button>
          </div>

          {/* Share panel - shown if already published */}
          {!isNew && existing?.status === "published" && (
            <div className="mt-8 p-6 bg-muted/50 rounded-lg space-y-4">
              <h3 className="font-display text-lg font-bold text-foreground">Share this article</h3>
              <div>
                <Label className="text-xs text-muted-foreground">Article URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={articleUrl} readOnly className="text-sm" />
                  <Button variant="outline" size="sm" onClick={() => handleCopy(articleUrl)}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">LinkedIn Post</Label>
                <Textarea value={linkedInText} readOnly rows={3} className="text-sm mt-1" />
                <Button variant="ghost" size="sm" className="mt-1" onClick={() => handleCopy(linkedInText)}>Copy</Button>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email Subject</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={emailSubject} readOnly className="text-sm" />
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(emailSubject)}>Copy</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InsightsEditor;

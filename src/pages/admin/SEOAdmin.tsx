import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Settings, FileCode, ArrowRightLeft, Image, Download } from "lucide-react";
import { PagesTab } from "@/components/admin/seo/PagesTab";
import { GlobalTab } from "@/components/admin/seo/GlobalTab";
import { SchemaTab } from "@/components/admin/seo/SchemaTab";
import { RedirectsTab } from "@/components/admin/seo/RedirectsTab";
import { FaviconsTab } from "@/components/admin/seo/FaviconsTab";
import { supabase } from "@/integrations/supabase/client";
import { generateSitemap } from "@/utils/generateSitemap";
import { toast } from "@/hooks/use-toast";

export default function SEOAdmin() {
  const [generating, setGenerating] = useState(false);

  const handleGenerateSitemap = async () => {
    setGenerating(true);
    try {
      const { data: global } = await supabase.from("seo_global").select("site_url").single();
      const siteUrl = global?.site_url || "https://www.vitalisstrategies.com";
      const xml = await generateSitemap(supabase, siteUrl);
      const blob = new Blob([xml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sitemap.xml";
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "✓ Sitemap generated", description: "Upload this file to /public/sitemap.xml to make it live." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-6 lg:pt-40 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Admin
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">SEO Management</span>
          </div>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
              SEO Settings
            </h1>
            <Button variant="outline" size="sm" onClick={handleGenerateSitemap} disabled={generating}>
              <Download className="h-4 w-4 mr-1" />{generating ? "Generating…" : "Generate & Download Sitemap"}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-6 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <Tabs defaultValue="pages">
            <TabsList className="mb-6 flex-wrap h-auto gap-1">
              <TabsTrigger value="pages" className="gap-1"><Globe className="h-4 w-4" />Pages</TabsTrigger>
              <TabsTrigger value="global" className="gap-1"><Settings className="h-4 w-4" />Global & Integrations</TabsTrigger>
              <TabsTrigger value="schema" className="gap-1"><FileCode className="h-4 w-4" />Schema</TabsTrigger>
              <TabsTrigger value="redirects" className="gap-1"><ArrowRightLeft className="h-4 w-4" />Redirects</TabsTrigger>
              <TabsTrigger value="favicons" className="gap-1"><Image className="h-4 w-4" />Favicons & OG Images</TabsTrigger>
            </TabsList>
            <TabsContent value="pages"><PagesTab /></TabsContent>
            <TabsContent value="global"><GlobalTab /></TabsContent>
            <TabsContent value="schema"><SchemaTab /></TabsContent>
            <TabsContent value="redirects"><RedirectsTab /></TabsContent>
            <TabsContent value="favicons"><FaviconsTab /></TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
    </div>
  );
}

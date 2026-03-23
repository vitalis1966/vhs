import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Copy, Check } from "lucide-react";
import { usePageMeta } from "@/lib/seo";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const InsightArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);

  const { data: article, isLoading } = useQuery({
    queryKey: ["insight-article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insights_articles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: relatedArticles = [] } = useQuery({
    queryKey: ["related-articles", slug, article?.category],
    queryFn: async () => {
      if (!article) return [];
      const { data, error } = await supabase
        .from("insights_articles")
        .select("id, title, slug, category, date, excerpt")
        .eq("status", "published")
        .neq("slug", slug!)
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!article,
  });

  usePageMeta(
    article?.meta_title || article?.title || "Insight | Vitalis",
    article?.meta_description || article?.excerpt || ""
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple markdown-like renderer for the body
  const renderBody = (body: string) => {
    const lines = body.split("\n");
    const elements: JSX.Element[] = [];
    let inList = false;
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc pl-6 space-y-2 mb-6 text-foreground/90 leading-relaxed">
            {listItems.map((item, i) => <li key={i}>{renderInline(item)}</li>)}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const renderInline = (text: string) => {
      // Handle bold, italic, links
      const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          return <Link key={i} to={linkMatch[2]} className="text-accent hover:underline font-medium">{linkMatch[1]}</Link>;
        }
        return part;
      });
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(<h2 key={i} className="font-display text-2xl font-bold text-foreground mt-10 mb-4">{trimmed.slice(3)}</h2>);
      } else if (trimmed.startsWith("### ")) {
        flushList();
        elements.push(<h3 key={i} className="font-display text-xl font-bold text-foreground mt-8 mb-3">{trimmed.slice(4)}</h3>);
      } else if (trimmed.startsWith("- ")) {
        inList = true;
        listItems.push(trimmed.slice(2));
      } else if (trimmed.startsWith("---")) {
        flushList();
        elements.push(<hr key={i} className="my-10 border-border" />);
      } else if (trimmed === "") {
        flushList();
      } else {
        flushList();
        elements.push(<p key={i} className="text-foreground/90 leading-relaxed mb-4">{renderInline(trimmed)}</p>);
      }
    });
    flushList();
    return elements;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 container mx-auto px-4 max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-40" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 container mx-auto px-4 max-w-3xl text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Article not found</h1>
          <Link to="/insights" className="text-accent hover:underline">← Back to Insights</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <article className="pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="container mx-auto px-4 max-w-[720px]">
          {/* Category tag */}
          <span className="text-xs font-medium text-foreground px-2.5 py-0.5 rounded-full border border-border bg-transparent inline-block mb-4">
            {article.category}
          </span>

          {/* Title */}
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">
            {article.title}
          </h1>

          {/* Date + read time */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-10">
            <span>{article.date ? format(new Date(article.date), "MMMM d, yyyy") : ""}</span>
            {article.estimated_read_time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.estimated_read_time} min read
              </span>
            )}
          </div>

          {/* Featured image */}
          {article.featured_image_url && (
            <img
              src={article.featured_image_url}
              alt={article.title}
              className="w-full rounded-lg mb-10 object-cover max-h-[400px]"
            />
          )}

          {/* Body */}
          <div className="prose-vitalis">
            {article.body ? renderBody(article.body) : <p className="text-muted-foreground">No content available.</p>}
          </div>

          {/* Share */}
          <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Share this insight"}
            </Button>
            <Link to="/insights" className="text-sm font-medium text-accent hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Insights
            </Link>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">More from Vitalis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((ra: any) => (
                <Link
                  key={ra.id}
                  to={`/insights/${ra.slug}`}
                  className="group bg-background rounded-lg border border-border/60 p-6 transition-all duration-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:border-border"
                  style={{ borderTopWidth: "3px", borderTopColor: "hsl(var(--forest))" }}
                >
                  <span className="text-xs font-medium text-foreground px-2.5 py-0.5 rounded-full border border-border bg-transparent inline-block mb-2">
                    {ra.category}
                  </span>
                  <h3 className="font-display text-base font-bold text-forest leading-snug line-clamp-2 mb-2">{ra.title}</h3>
                  <p className="text-xs text-muted-foreground">{ra.date ? format(new Date(ra.date), "MMMM yyyy") : ""}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default InsightArticle;

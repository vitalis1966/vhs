import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Save, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const INTEGRATION_CARDS: Array<{
  key: string;
  label: string;
  icon: string;
  description: string;
  helpUrl: string;
  helpLabel: string;
  relatedKeys?: string[];
  isGtm?: boolean;
}> = [
  { key: "google_analytics_id", label: "Google Analytics 4", icon: "📊", description: "Track website traffic and user behavior.", helpUrl: "https://analytics.google.com", helpLabel: "analytics.google.com" },
  { key: "google_tag_manager_head", label: "Google Tag Manager", icon: "🏷️", description: "Paste the two GTM snippets exactly as provided by Google Tag Manager. No ID needed — just paste the full code blocks.", helpUrl: "https://tagmanager.google.com", helpLabel: "tagmanager.google.com", isGtm: true },
  { key: "google_search_console", label: "Search Console Verification", icon: "🔍", description: "Paste the content value only — not the full <meta> tag.", helpUrl: "https://search.google.com/search-console", helpLabel: "search.google.com" },
  { key: "google_ads_id", label: "Google Ads", icon: "📣", description: "Conversion tracking for Google Ads campaigns.", helpUrl: "https://ads.google.com", helpLabel: "ads.google.com", relatedKeys: ["google_ads_conversion_label"] },
  { key: "bing_verification", label: "Bing Webmaster", icon: "🅱️", description: "Verify site ownership for Bing Webmaster Tools.", helpUrl: "https://www.bing.com/webmasters", helpLabel: "bing.com/webmasters" },
  { key: "pinterest_verification", label: "Pinterest Verification", icon: "📌", description: "Verify site ownership for Pinterest.", helpUrl: "https://business.pinterest.com", helpLabel: "business.pinterest.com" },
  { key: "meta_pixel_id", label: "Meta Pixel", icon: "📘", description: "Track conversions and build audiences for Meta ads.", helpUrl: "https://business.facebook.com/events_manager", helpLabel: "business.facebook.com" },
  { key: "linkedin_partner_id", label: "LinkedIn Insight Tag", icon: "💼", description: "Track conversions and retarget for LinkedIn ads.", helpUrl: "https://www.linkedin.com/campaignmanager", helpLabel: "linkedin.com/campaignmanager" },
  { key: "hotjar_id", label: "Hotjar", icon: "🔥", description: "Heatmaps, session recordings, and feedback.", helpUrl: "https://www.hotjar.com", helpLabel: "hotjar.com" },
  { key: "intercom_app_id", label: "Intercom", icon: "💬", description: "Live chat and customer support widget.", helpUrl: "https://www.intercom.com", helpLabel: "intercom.com" },
  { key: "crisp_website_id", label: "Crisp Chat", icon: "🗨️", description: "Live chat widget for customer conversations.", helpUrl: "https://crisp.chat", helpLabel: "crisp.chat" },
];

export function GlobalTab() {
  const queryClient = useQueryClient();
  const { data: global, isLoading } = useQuery({
    queryKey: ["seo-admin-global"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_global").select("*").eq("id", 1).single();
      if (error) throw error;
      return data as Record<string, unknown>;
    },
  });

  const [form, setForm] = useState<Record<string, unknown>>({});
  const [initialized, setInitialized] = useState(false);

  if (global && !initialized) {
    setForm(global);
    setInitialized(true);
  }

  const saveMutation = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { error } = await supabase.from("seo_global").update(values).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-global"] });
      queryClient.invalidateQueries({ queryKey: ["seo-global"] });
      queryClient.invalidateQueries({ queryKey: ["seo-global-scripts"] });
      toast({ title: "✓ Global settings saved" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateField = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  if (isLoading) return <p className="text-muted-foreground p-4">Loading…</p>;

  const hasGTM = !!((form.google_tag_manager_head as string) || (form.google_tag_manager_body as string));
  const hasGA4 = !!(form.google_analytics_id as string);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
          <Save className="h-4 w-4 mr-1" />Save All Settings
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left — Defaults + Social */}
        <div className="space-y-6">
          <fieldset className="space-y-3 border border-border/40 rounded-xl p-4">
            <legend className="text-sm font-semibold px-2">Site Defaults</legend>
            <div><Label>Site Name</Label><Input value={(form.site_name as string) || ""} onChange={(e) => updateField("site_name", e.target.value)} /></div>
            <div><Label>Site URL</Label><Input value={(form.site_url as string) || ""} onChange={(e) => updateField("site_url", e.target.value)} /></div>
            <div><Label>Site Locale</Label><Input value={(form.site_locale as string) || ""} onChange={(e) => updateField("site_locale", e.target.value)} /></div>
            <div><Label>Default Title (fallback)</Label><Input value={(form.default_title as string) || ""} onChange={(e) => updateField("default_title", e.target.value)} /></div>
            <div><Label>Default Description (fallback)</Label><Textarea value={(form.default_description as string) || ""} onChange={(e) => updateField("default_description", e.target.value)} rows={2} /></div>
            <div><Label>Default Robots</Label><Input value={(form.default_robots as string) || ""} onChange={(e) => updateField("default_robots", e.target.value)} /></div>
            <div><Label>Default OG Image</Label><Input value={(form.default_og_image as string) || ""} onChange={(e) => updateField("default_og_image", e.target.value)} /></div>
            <div>
              <Label>Theme Color</Label>
              <div className="flex gap-2 items-center">
                <input type="color" value={(form.theme_color as string) || "#1C3D2E"} onChange={(e) => updateField("theme_color", e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                <Input value={(form.theme_color as string) || ""} onChange={(e) => updateField("theme_color", e.target.value)} className="flex-1 font-mono" />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-3 border border-border/40 rounded-xl p-4">
            <legend className="text-sm font-semibold px-2">Social Profiles</legend>
            <div><Label>Twitter/X Handle</Label><Input value={(form.twitter_handle as string) || ""} onChange={(e) => updateField("twitter_handle", e.target.value)} placeholder="@vitalishealth" /></div>
            <div><Label>Facebook App ID</Label><Input value={(form.facebook_app_id as string) || ""} onChange={(e) => updateField("facebook_app_id", e.target.value)} /></div>
            <div><Label>Facebook Page URL</Label><Input value={(form.facebook_page_url as string) || ""} onChange={(e) => updateField("facebook_page_url", e.target.value)} /></div>
            <div><Label>LinkedIn URL</Label><Input value={(form.linkedin_url as string) || ""} onChange={(e) => updateField("linkedin_url", e.target.value)} /></div>
            <div><Label>Instagram URL</Label><Input value={(form.instagram_url as string) || ""} onChange={(e) => updateField("instagram_url", e.target.value)} /></div>
          </fieldset>
        </div>

        {/* Right — Integrations */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Integrations</h3>

          {hasGTM && hasGA4 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm">
              ⚠️ GTM is active. GA4 will <strong>not</strong> fire directly. Configure GA4 as a tag inside your GTM container at{" "}
              <a href="https://tagmanager.google.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">tagmanager.google.com</a>.
              The GA4 ID here is stored for reference only while GTM is active.
            </div>
          )}

          {INTEGRATION_CARDS.map((card) => {
            const val = (form[card.key] as string) || "";
            const isActive = !!val;
            return (
              <Card key={card.key} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{card.icon}</span>
                    <span className="font-semibold text-sm">{card.label}</span>
                  </div>
                  <Badge variant={isActive ? "default" : "secondary"} className={cn(isActive ? "bg-green-100 text-green-700 hover:bg-green-100" : "")}>
                    {isActive ? "ACTIVE ✓" : "NOT CONFIGURED"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
                <Input value={val} onChange={(e) => updateField(card.key, e.target.value)} placeholder={`Enter ${card.label} ID`} className="font-mono text-sm" />
                {card.relatedKeys?.map((rk) => (
                  <div key={rk}>
                    <Label className="text-xs">Conversion Label</Label>
                    <Input value={(form[rk] as string) || ""} onChange={(e) => updateField(rk, e.target.value)} className="font-mono text-sm" />
                  </div>
                ))}
                <a href={card.helpUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                  Get from: {card.helpLabel} <ExternalLink className="h-3 w-3" />
                </a>
              </Card>
            );
          })}

          <fieldset className="space-y-3 border border-border/40 rounded-xl p-4">
            <legend className="text-sm font-semibold px-2">Custom Scripts</legend>
            <div>
              <Label>Custom Head Script (JS)</Label>
              <Textarea value={(form.custom_head_script as string) || ""} onChange={(e) => updateField("custom_head_script", e.target.value)} rows={4} className="font-mono text-xs" />
            </div>
            <div>
              <Label>Custom Body Script (JS)</Label>
              <Textarea value={(form.custom_body_script as string) || ""} onChange={(e) => updateField("custom_body_script", e.target.value)} rows={4} className="font-mono text-xs" />
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

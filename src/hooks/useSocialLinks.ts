import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SocialLink {
  id: string;
  platform: string;
  is_active: boolean;
  profile_url: string | null;
  display_label: string | null;
  icon_style: "original" | "filled" | "outline" | "monochrome";
  open_in_new_tab: boolean;
  sort_order: number;
}

export function useSocialLinks() {
  return useQuery({
    queryKey: ["seo-social"],
    queryFn: async (): Promise<SocialLink[]> => {
      const { data, error } = await (supabase as any)
        .from("seo_social_links")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      // Footer-side guard: skip rows without a usable URL
      return (data || []).filter(
        (r: SocialLink) => r.profile_url && r.profile_url.trim().length > 0,
      );
    },
    staleTime: 60_000,
  });
}

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function SEORedirectHandler() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { data: redirect } = useQuery({
    queryKey: ["seo-redirect", pathname],
    queryFn: async () => {
      const { data } = await supabase
        .from("seo_redirects")
        .select("to_path, redirect_type")
        .eq("from_path", pathname)
        .eq("is_active", true)
        .maybeSingle();
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (redirect?.to_path) {
      if (redirect.to_path.startsWith("http")) {
        window.location.href = redirect.to_path;
      } else {
        navigate(redirect.to_path, { replace: true });
      }
    }
  }, [redirect, navigate]);

  return null;
}

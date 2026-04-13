import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useEffect, Suspense } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { u as useToast } from "./use-toast-B2rUv-Rg.js";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { c as cn } from "./utils-H80jjgLf.js";
import { useTheme } from "next-themes";
import { Toaster as Toaster$2 } from "sonner";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useQuery, QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Head } from "vite-react-ssg";
import { u as useGlobalScripts, S as SEOHead } from "./SEOHead-zhKhQt1F.js";
import { s as supabase } from "./client-CxdMKRkw.js";
import { P as PageSEOProvider } from "./PageSEOContext-DZ23I7UH.js";
import "clsx";
import "tailwind-merge";
import "@supabase/supabase-js";
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsx(ToastPrimitives.Root, { ref, className: cn(toastVariants({ variant }), className), ...props });
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors group-[.destructive]:border-muted/40 hover:bg-secondary group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-[.destructive]:focus:ring-destructive disabled:pointer-events-none disabled:opacity-50",
      className
    ),
    ...props
  }
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Close,
  {
    ref,
    className: cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-foreground group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(ToastPrimitives.Title, { ref, className: cn("text-sm font-semibold", className), ...props }));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(ToastPrimitives.Description, { ref, className: cn("text-sm opacity-90", className), ...props }));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
function Toaster$1() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action, ...props }) {
      return /* @__PURE__ */ jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsx(ToastViewport, {})
  ] });
}
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$2,
    {
      theme,
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const TooltipProvider = TooltipPrimitive.Provider;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
function GlobalScripts() {
  const scripts = useGlobalScripts();
  const rawGtmHead = scripts?.google_tag_manager_head || "";
  const rawGtmBody = scripts?.google_tag_manager_body || "";
  const customBody = scripts?.custom_body_script || "";
  const gtmHead = rawGtmHead.replace(/<!--.*?-->/gs, "").replace(/<\/?script[^>]*>/gi, "").trim();
  const gtmBody = rawGtmBody.trim();
  useEffect(() => {
    if (!gtmBody) return;
    const existing = document.getElementById("gtm-noscript-container");
    if (existing) existing.remove();
    const container = document.createElement("div");
    container.id = "gtm-noscript-container";
    container.innerHTML = gtmBody;
    if (container.firstChild) {
      document.body.insertBefore(container.firstChild, document.body.firstChild);
    }
    return () => {
      try {
        const el = document.getElementById("gtm-noscript-container");
        if (el) document.body.removeChild(el);
        const ns = document.body.querySelector('noscript > iframe[src*="googletagmanager.com/ns.html"]');
        if (ns?.parentElement) document.body.removeChild(ns.parentElement);
      } catch {
      }
    };
  }, [gtmBody]);
  useEffect(() => {
    if (!customBody) return;
    const el = document.createElement("script");
    el.innerHTML = customBody;
    document.body.insertBefore(el, document.body.firstChild);
    return () => {
      try {
        document.body.removeChild(el);
      } catch {
      }
    };
  }, [customBody]);
  if (!scripts) return null;
  const {
    google_analytics_id: ga4Id,
    google_ads_id: adsId,
    meta_pixel_id: pixelId,
    linkedin_partner_id: linkedinId,
    hotjar_id: hotjarId,
    intercom_app_id: intercomId,
    crisp_website_id: crispId,
    custom_head_script: customHead
  } = scripts;
  const hasGTM = !!gtmHead;
  const useGA4 = !!ga4Id && !hasGTM;
  const useAds = !!adsId && !hasGTM;
  return /* @__PURE__ */ jsxs(Head, { children: [
    hasGTM && /* @__PURE__ */ jsx("script", { children: gtmHead }),
    useGA4 && /* @__PURE__ */ jsx("script", { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${ga4Id}` }),
    useGA4 && !useAds && /* @__PURE__ */ jsx("script", { children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');` }),
    useGA4 && useAds && /* @__PURE__ */ jsx("script", { children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');gtag('config','${adsId}');` }),
    useAds && !useGA4 && /* @__PURE__ */ jsx("script", { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${adsId}` }),
    useAds && !useGA4 && /* @__PURE__ */ jsx("script", { children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${adsId}');` }),
    pixelId && /* @__PURE__ */ jsx("script", { children: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');` }),
    linkedinId && /* @__PURE__ */ jsx("script", { children: `_linkedin_partner_id="${linkedinId}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s)})(window.lintrk);` }),
    hotjarId && /* @__PURE__ */ jsx("script", { children: `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${hotjarId},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');` }),
    intercomId && /* @__PURE__ */ jsx("script", { children: `window.intercomSettings={api_base:"https://api-iam.intercom.io",app_id:"${intercomId}"};(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${intercomId}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();` }),
    crispId && /* @__PURE__ */ jsx("script", { children: `window.$crisp=[];window.CRISP_WEBSITE_ID="${crispId}";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();` }),
    customHead && /* @__PURE__ */ jsx("script", { children: customHead })
  ] });
}
function RedirectHandler() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { data: redirects } = useQuery({
    queryKey: ["seo-redirects"],
    queryFn: async () => {
      const { data } = await supabase.from("seo_redirects").select("from_path, to_path, redirect_type").eq("is_active", true);
      return data || [];
    },
    staleTime: 5 * 60 * 1e3
  });
  useEffect(() => {
    if (!redirects) return;
    const match = redirects.find((r) => r.from_path === pathname);
    if (match) {
      if (match.to_path.startsWith("http")) {
        window.location.href = match.to_path;
      } else {
        navigate(match.to_path, { replace: match.redirect_type === 301 });
      }
    }
  }, [pathname, redirects, navigate]);
  return null;
}
function SEOLayout({ children }) {
  return /* @__PURE__ */ jsxs(PageSEOProvider, { children: [
    /* @__PURE__ */ jsx(SEOHead, {}),
    children
  ] });
}
const queryClient = new QueryClient();
function RootLayout() {
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxs(TooltipProvider, { children: [
    /* @__PURE__ */ jsx(Toaster$1, {}),
    /* @__PURE__ */ jsx(Toaster, {}),
    /* @__PURE__ */ jsx(GlobalScripts, {}),
    /* @__PURE__ */ jsx(RedirectHandler, {}),
    /* @__PURE__ */ jsx(SEOLayout, { children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "min-h-screen" }), children: /* @__PURE__ */ jsx(Outlet, {}) }) })
  ] }) });
}
export {
  RootLayout as default
};

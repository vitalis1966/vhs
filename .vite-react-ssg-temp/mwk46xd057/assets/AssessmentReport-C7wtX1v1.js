import { jsx, jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { s as supabase } from "./client-CxdMKRkw.js";
import { AlertCircle, Mail, Loader2 } from "lucide-react";
import { B as Button } from "./button-DnzOxZqg.js";
import "@supabase/supabase-js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
const vitalisLogo = "/vitalis-logo.webp";
function AssessmentReport() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    let cancelled = false;
    const resolve = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("prepare-assessment-report", {
          body: { access_token: token }
        });
        if (cancelled) return;
        if (error) {
          console.error("Network/invoke error preparing report:", error);
          setStatus("error");
          return;
        }
        if (data?.report_token) {
          navigate(`/report/${data.report_token}`, { replace: true });
          return;
        }
        console.error("Failed to prepare assessment report token:", data);
        setStatus("error");
      } catch (err) {
        if (cancelled) return;
        console.error("Error preparing assessment report:", err);
        setStatus("error");
      }
    };
    resolve();
    return () => {
      cancelled = true;
    };
  }, [token, navigate]);
  if (status === "error") {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-md mx-auto px-4", children: [
      /* @__PURE__ */ jsx("img", { src: vitalisLogo, alt: "Vitalis Health Strategies", className: "h-10 mx-auto mb-8" }),
      /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5", children: /* @__PURE__ */ jsx(AlertCircle, { className: "h-7 w-7 text-destructive" }) }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-xl font-bold text-foreground mb-3", children: "Report Not Available" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6 leading-relaxed", children: "Your report is not available yet or the link has expired. Please contact us if you need assistance." }),
      /* @__PURE__ */ jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsxs("a", { href: "mailto:info@vitalisstrategies.com", children: [
        /* @__PURE__ */ jsx(Mail, { className: "mr-2 h-4 w-4" }),
        "Contact Us"
      ] }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background flex flex-col items-center justify-center", children: [
    /* @__PURE__ */ jsx("img", { src: vitalisLogo, alt: "Vitalis Health Strategies", className: "h-10 mb-6" }),
    /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-accent mb-3" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Your report is being prepared, please wait..." })
  ] });
}
export {
  AssessmentReport as default
};

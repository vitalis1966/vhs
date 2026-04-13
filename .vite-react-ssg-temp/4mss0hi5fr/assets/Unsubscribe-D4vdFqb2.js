import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useSearchParams } from "./index-CalXArNJ.js";
import { s as supabase } from "./client-B5yO-kwf.js";
import "react-dom";
import "react-router";
import "@supabase/phoenix";
import "iceberg-js";
import "@supabase/auth-js";
import "tslib";
const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const [processing, setProcessing] = useState(false);
  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    const validateToken = async () => {
      try {
        const response = await fetch(
          `${"https://ilbhphreyvaoomhpvaxi.supabase.co"}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsYmhwaHJleXZhb29taHB2YXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDQwODAsImV4cCI6MjA4ODU4MDA4MH0.XWJxYAndKB_Xs2DE1BkN_7t7YU94JPMEepMYTvQMK_c" } }
        );
        const data = await response.json();
        if (data.valid === true) {
          setStatus("valid");
        } else if (data.reason === "already_unsubscribed") {
          setStatus("already_unsubscribed");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("invalid");
      }
    };
    validateToken();
  }, [token]);
  const handleUnsubscribe = async () => {
    if (!token) return;
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token }
      });
      if (error) throw error;
      if (data?.success) {
        setStatus("success");
      } else if (data?.reason === "already_unsubscribed") {
        setStatus("already_unsubscribed");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setProcessing(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background flex items-center justify-center px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full bg-card rounded-xl shadow-lg p-8 text-center", children: [
    status === "loading" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Validating your request…" })
    ] }),
    status === "valid" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground mb-4", children: "Unsubscribe" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-6", children: "Are you sure you want to unsubscribe from email notifications from Vitalis Health Strategies?" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleUnsubscribe,
          disabled: processing,
          className: "bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50",
          children: processing ? "Processing…" : "Confirm Unsubscribe"
        }
      )
    ] }),
    status === "success" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-green-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground mb-2", children: "Unsubscribed" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "You have been successfully unsubscribed from email notifications." })
    ] }),
    status === "already_unsubscribed" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground mb-2", children: "Already Unsubscribed" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "You have already been unsubscribed from email notifications." })
    ] }),
    status === "invalid" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground mb-2", children: "Invalid Link" }),
      /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
        "This unsubscribe link is invalid or has expired. If you continue to receive unwanted emails, please contact us at",
        " ",
        /* @__PURE__ */ jsx("a", { href: "mailto:info@vitalisstrategies.com", className: "text-primary underline", children: "info@vitalisstrategies.com" }),
        "."
      ] })
    ] }),
    status === "error" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground mb-2", children: "Something Went Wrong" }),
      /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
        "We couldn't process your request. Please try again or contact us at",
        " ",
        /* @__PURE__ */ jsx("a", { href: "mailto:info@vitalisstrategies.com", className: "text-primary underline", children: "info@vitalisstrategies.com" }),
        "."
      ] })
    ] })
  ] }) });
};
export {
  Unsubscribe as default
};

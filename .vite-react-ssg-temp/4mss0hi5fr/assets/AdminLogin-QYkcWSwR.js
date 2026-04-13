import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { N as Navbar } from "./Navbar-DZHwhlEF.js";
import { Footer } from "./Footer-vLUE6RrN.js";
import { B as Button } from "./button-DnzOxZqg.js";
import { L as Label, I as Input } from "./label-H2YDHQ-y.js";
import { s as supabase } from "./client-B5yO-kwf.js";
import { u as useToast } from "./use-toast-B2rUv-Rg.js";
import { Lock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import "./index-CalXArNJ.js";
import "react-dom";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@supabase/phoenix";
import "iceberg-js";
import "@supabase/auth-js";
import "tslib";
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/admin");
    }
    setLoading(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center bg-background pt-20", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-sm mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl shadow-soft border border-border/40 p-8", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(Lock, { className: "h-5 w-5 text-primary" }) }) }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-xl font-bold text-foreground text-center mb-1", children: "Admin Login" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center mb-6", children: "Sign in to access the admin dashboard" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              required: true,
              placeholder: "admin@vitalisstrategies.com"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "password",
              type: "password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              required: true,
              placeholder: "••••••••"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(Button, { type: "submit", className: "w-full", disabled: loading, children: [
          loading && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Sign In"
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  AdminLogin as default
};

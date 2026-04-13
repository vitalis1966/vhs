import { jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { s as supabase } from "./client-CxdMKRkw.js";
import { Loader2 } from "lucide-react";
import "@supabase/supabase-js";
function AdminGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate("/admin/login", { replace: true });
        } else {
          setAuthenticated(true);
        }
        setLoading(false);
      }
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/admin/login", { replace: true });
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  return authenticated ? /* @__PURE__ */ jsx(Fragment, { children }) : null;
}
export {
  AdminGuard
};

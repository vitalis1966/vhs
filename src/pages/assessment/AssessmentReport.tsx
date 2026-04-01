import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function AssessmentReport() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const resolve = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("resolve-assessment-report", {
          body: { access_token: token },
        });

        if (error || !data?.report_token) {
          console.error("Failed to resolve assessment report token:", error || data);
          setStatus("error");
          return;
        }

        navigate(`/report/${data.report_token}`, { replace: true });
      } catch (err) {
        console.error("Error resolving assessment report:", err);
        setStatus("error");
      }
    };

    resolve();
  }, [token, navigate]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">Report Not Available</h1>
          <p className="text-muted-foreground">
            Your report is not available yet or the link has expired. Please contact us if you need assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Loading report…</p>
    </div>
  );
}

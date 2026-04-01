import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const vitalisLogo = "/vitalis-logo.webp";

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <img src={vitalisLogo} alt="Vitalis Health Strategies" className="h-10 mx-auto mb-8" />
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="font-display text-xl font-bold text-foreground mb-3">Report Not Available</h1>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Your report is not available yet or the link has expired. Please contact us if you need assistance.
          </p>
          <Button variant="outline" asChild>
            <a href="mailto:info@vitalisstrategies.com">
              <Mail className="mr-2 h-4 w-4" />
              Contact Us
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <img src={vitalisLogo} alt="Vitalis Health Strategies" className="h-10 mb-6" />
      <Loader2 className="h-6 w-6 animate-spin text-accent mb-3" />
      <p className="text-sm text-muted-foreground">Loading your report...</p>
    </div>
  );
}

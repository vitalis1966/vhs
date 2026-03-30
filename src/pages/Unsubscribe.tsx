import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Status = "loading" | "valid" | "already_unsubscribed" | "invalid" | "success" | "error";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
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
        body: { token },
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card rounded-xl shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Validating your request…</p>
          </>
        )}

        {status === "valid" && (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-4">Unsubscribe</h1>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to unsubscribe from email notifications from Vitalis Health Strategies?
            </p>
            <button
              onClick={handleUnsubscribe}
              disabled={processing}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {processing ? "Processing…" : "Confirm Unsubscribe"}
            </button>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Unsubscribed</h1>
            <p className="text-muted-foreground">
              You have been successfully unsubscribed from email notifications.
            </p>
          </>
        )}

        {status === "already_unsubscribed" && (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-2">Already Unsubscribed</h1>
            <p className="text-muted-foreground">
              You have already been unsubscribed from email notifications.
            </p>
          </>
        )}

        {status === "invalid" && (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-2">Invalid Link</h1>
            <p className="text-muted-foreground">
              This unsubscribe link is invalid or has expired. If you continue to receive unwanted
              emails, please contact us at{" "}
              <a href="mailto:info@vitalisstrategies.com" className="text-primary underline">
                info@vitalisstrategies.com
              </a>.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-2">Something Went Wrong</h1>
            <p className="text-muted-foreground">
              We couldn't process your request. Please try again or contact us at{" "}
              <a href="mailto:info@vitalisstrategies.com" className="text-primary underline">
                info@vitalisstrategies.com
              </a>.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;

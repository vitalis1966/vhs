import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AppIndex() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  useEffect(() => {
    navigate(isMobile ? "/app/my-tasks" : "/app/home", { replace: true });
  }, [isMobile, navigate]);
  return null;
}

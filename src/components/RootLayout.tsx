import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalScripts } from "@/components/GlobalScripts";
import { RedirectHandler } from "@/components/RedirectHandler";
import { SEOLayout } from "@/components/SEOLayout";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <GlobalScripts />
        <RedirectHandler />
        <SEOLayout>
          <Suspense fallback={<div className="min-h-screen" />}>
            <Outlet />
          </Suspense>
        </SEOLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

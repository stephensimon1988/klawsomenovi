import { lazy, Suspense, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "./components/ScrollToTop";

const Index = lazy(() => import("./pages/Index.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const KlawsomeAdmin = lazy(() => import("./pages/KlawsomeAdmin.tsx"));
const Business = lazy(() => import("./pages/Business.tsx"));
const BusinessDevelopment = lazy(() => import("./pages/BusinessDevelopment.tsx"));
const Birthdays = lazy(() => import("./pages/Birthdays.tsx"));
const Careers = lazy(() => import("./pages/Careers.tsx"));
const News = lazy(() => import("./pages/News.tsx"));
const Rewards = lazy(() => import("./pages/Rewards.tsx"));
const Gallery = lazy(() => import("./pages/Gallery.tsx"));
const OurStory = lazy(() => import("./pages/OurStory.tsx"));
const Faq = lazy(() => import("./pages/Faq.tsx"));
const Rental = lazy(() => import("./pages/Rental.tsx"));
const Store = lazy(() => import("./pages/Store.tsx"));
const CommunityPartners = lazy(() => import("./pages/CommunityPartners.tsx"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe.tsx"));
const ClawMachineTips = lazy(() => import("./pages/ClawMachineTips.tsx"));
const ClawsomeVideoGame = lazy(() => import("./pages/ClawsomeVideoGame.tsx"));
const FloatingContactWidget = lazy(() => import("./components/FloatingContactWidget"));
const BackToTop = lazy(() => import("./components/BackToTop"));
const BookNowDialog = lazy(() => import("./components/BookNowDialog"));
const DividerParallax = lazy(() => import("./components/DividerParallax"));

const ClawGameRedirect = () => {
  useEffect(() => {
    window.location.href = "https://poki.com/en/g/lucky-claw-machine";
  }, []);
  return null;
};

/** Mount decorative/utility widgets after first paint so they don't block LCP. */
const DeferredExtras = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    const idle = w.requestIdleCallback;
    if (idle) {
      const id = idle(() => setReady(true));
      return () => {
        const cancel = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
        cancel?.(id);
      };
    }
    const t = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(t);
  }, []);
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <DividerParallax />
      <FloatingContactWidget />
      <BackToTop />
      <BookNowDialog />
    </Suspense>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000,
      gcTime: 30 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<div aria-hidden="true" />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/business" element={<Business />} />
          <Route path="/partner-with-klawsome" element={<BusinessDevelopment />} />
          <Route path="/business-development" element={<Navigate to="/partner-with-klawsome" replace />} />
          <Route path="/birthdays" element={<Birthdays />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/news" element={<News />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/rental" element={<Rental />} />
          <Route path="/store" element={<Store />} />
          <Route path="/community" element={<Navigate to="/community-outreach" replace />} />
          <Route path="/community-partners" element={<Navigate to="/community-outreach" replace />} />
          <Route path="/community-outreach" element={<CommunityPartners />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/claw-machine-tips" element={<ClawMachineTips />} />
          <Route path="/claw-game" element={<ClawGameRedirect />} />
          <Route path="/clawsome-video-game" element={<ClawsomeVideoGame />} />
          <Route path="/klawsome-admin" element={<KlawsomeAdmin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        <DeferredExtras />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

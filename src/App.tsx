import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import FloatingContactWidget from "./components/FloatingContactWidget";
import BackToTop from "./components/BackToTop";
import ScrollToTop from "./components/ScrollToTop";
import BookNowDialog from "./components/BookNowDialog";
import DividerParallax from "./components/DividerParallax";

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
const InfoHub = lazy(() => import("./pages/InfoHub.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <DividerParallax />
        <Suspense fallback={<div aria-hidden="true" />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/business" element={<Business />} />
          <Route path="/business-development" element={<BusinessDevelopment />} />
          <Route path="/birthdays" element={<Birthdays />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/news" element={<News />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/rental" element={<Rental />} />
          <Route path="/store" element={<Store />} />
          <Route path="/community" element={<Navigate to="/community-partners" replace />} />
          <Route path="/community-partners" element={<CommunityPartners />} />
          <Route path="/info-hub" element={<InfoHub />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/klawsome-admin" element={<KlawsomeAdmin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        <FloatingContactWidget />
        <BackToTop />
        <BookNowDialog />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

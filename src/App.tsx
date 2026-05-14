import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import KlawsomeAdmin from "./pages/KlawsomeAdmin.tsx";
import Business from "./pages/Business.tsx";
import BusinessDevelopment from "./pages/BusinessDevelopment.tsx";
import Birthdays from "./pages/Birthdays.tsx";
import Careers from "./pages/Careers.tsx";
import News from "./pages/News.tsx";
import Rewards from "./pages/Rewards.tsx";
import Gallery from "./pages/Gallery.tsx";
import OurStory from "./pages/OurStory.tsx";
import Faq from "./pages/Faq.tsx";
import Rental from "./pages/Rental.tsx";
import Store from "./pages/Store.tsx";
import CommunityPartners from "./pages/CommunityPartners.tsx";
import InfoHub from "./pages/InfoHub.tsx";
import Contact from "./pages/Contact.tsx";
import Unsubscribe from "./pages/Unsubscribe.tsx";
import FloatingContactWidget from "./components/FloatingContactWidget";
import BackToTop from "./components/BackToTop";
import ScrollToTop from "./components/ScrollToTop";
import BookNowDialog from "./components/BookNowDialog";
import DividerParallax from "./components/DividerParallax";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <DividerParallax />
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
        <FloatingContactWidget />
        <BackToTop />
        <BookNowDialog />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

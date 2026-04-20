import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import KlawsomeAdmin from "./pages/KlawsomeAdmin.tsx";
import Business from "./pages/Business.tsx";
import Birthdays from "./pages/Birthdays.tsx";
import Careers from "./pages/Careers.tsx";
import News from "./pages/News.tsx";
import Rewards from "./pages/Rewards.tsx";
import Gallery from "./pages/Gallery.tsx";
import OurStory from "./pages/OurStory.tsx";
import Faq from "./pages/Faq.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/business" element={<Business />} />
          <Route path="/birthdays" element={<Birthdays />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/news" element={<News />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/klawsome-admin" element={<KlawsomeAdmin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

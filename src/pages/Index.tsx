import KawaiiNav from '@/components/KawaiiNav';
import KawaiiHero from '@/components/KawaiiHero';
import KawaiiVisit from '@/components/KawaiiVisit';
import KawaiiAbout from '@/components/KawaiiAbout';
import KawaiiTokenPrices from '@/components/KawaiiTokenPrices';
import KawaiiReviews from '@/components/KawaiiReviews';
import KawaiiNews from '@/components/KawaiiNews';
import KawaiiGiftCards from '@/components/KawaiiGiftCards';
import KawaiiStory from '@/components/KawaiiStory';

import KawaiiFooter from '@/components/KawaiiFooter';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      <KawaiiHero />
      <KawaiiVisit />
      <KawaiiAbout />
      <KawaiiTokenPrices />
      <KawaiiReviews />
      <KawaiiNews />
      <KawaiiGiftCards />
      {/* Scheduling section placeholder — Acuity iframe will go here */}
      <section id="scheduling" className="py-20 px-4 bg-gradient-to-b from-background to-kawaii-lavender/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Book Your Visit 🗓️</h2>
          <p className="text-muted-foreground mb-8">Schedule your next Klawsome adventure!</p>
          <div className="rounded-2xl border border-border bg-card p-12 text-muted-foreground">
            Acuity scheduling form coming soon
          </div>
        </div>
      </section>
      <KawaiiStory />
      <KawaiiFooter />
    </div>
  );
};

export default Index;

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
      <KawaiiAbout />
      <KawaiiVisit />
      <KawaiiTokenPrices />
      <KawaiiReviews />
      <KawaiiNews />
      <KawaiiGiftCards />
      {/* Scheduling section */}
      <section id="scheduling" className="py-28 px-6 lg:px-12 bg-secondary/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-heading font-bold text-primary uppercase tracking-[0.2em] mb-4">Schedule</p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">Book Your Visit</h2>
          <p className="text-muted-foreground font-body text-lg mb-10">Schedule your next Klawsome adventure!</p>
          <div className="rounded-2xl border border-border bg-background p-16 text-muted-foreground text-center font-body">
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

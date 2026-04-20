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
      <section id="scheduling" className="section-y section-x bg-secondary/50">
        <div className="ds-container-narrow">
          <p className="ds-eyebrow">Schedule</p>
          <h2 className="ds-h2 mb-4">Book Your Visit</h2>
          <p className="ds-lead mb-10">Schedule your next Klawsome adventure!</p>
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

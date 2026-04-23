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
import KawaiiDivider from '@/components/KawaiiDivider';
import DividerAudit from '@/components/DividerAudit';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      <KawaiiHero />
      <KawaiiDivider variant="wave" from="white" to="baby-blue" stroke="baby-pink" />
      <KawaiiAbout />
      <KawaiiDivider variant="scallop" from="baby-blue" to="baby-pink" stroke="baby-blue" />
      <KawaiiVisit />
      <KawaiiDivider variant="cloud" from="baby-pink" to="red" stroke="white" />
      <KawaiiTokenPrices />
      <KawaiiDivider variant="bumps" from="red" to="white" stroke="baby-pink" />
      <KawaiiReviews />
      <KawaiiDivider variant="petals" from="white" to="baby-blue" stroke="baby-pink" />
      <KawaiiNews />
      <KawaiiDivider variant="zigzag-soft" from="baby-blue" to="white" stroke="baby-pink" />
      <KawaiiGiftCards />
      <KawaiiDivider variant="wave" from="white" to="baby-pink" stroke="baby-blue" flip />
      {/* Scheduling section */}
      <section id="scheduling" className="section-y section-x bg-[hsl(var(--klawsome-baby-pink))]">
        <div className="ds-container-narrow">
          <p className="ds-eyebrow">Schedule</p>
          <h2 className="ds-h2 mb-4">Book Your Visit</h2>
          <p className="ds-lead mb-10">Schedule your next Klawsome adventure!</p>
          <div className="rounded-2xl border border-border bg-background p-16 text-muted-foreground text-center font-body">
            Acuity scheduling form coming soon
          </div>
        </div>
      </section>
      <KawaiiDivider variant="scallop" from="baby-pink" to="baby-blue" stroke="white" />
      <KawaiiStory />
      <KawaiiDivider variant="cloud" from="baby-blue" to="baby-pink" stroke="white" />
      <KawaiiFooter />
      <DividerAudit />
    </div>
  );
};

export default Index;

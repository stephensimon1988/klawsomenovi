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
      {/* GiftCards is white, Scheduling is baby-pink. Top must be white, bottom pink.
          Removed `flip` which was inverting the colors and causing a stacked gap. */}
      <KawaiiDivider variant="wave" from="white" to="baby-pink" stroke="baby-blue" />
      {/* Scheduling section */}
      <section id="scheduling" className="section-y section-x bg-[hsl(var(--klawsome-baby-pink))]">
        <div className="ds-container">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="ds-eyebrow">Schedule</p>
            <h2 className="ds-h2 mb-4">Book Your Visit</h2>
            <p className="ds-lead">Schedule your next Klawsome adventure!</p>
          </div>
          <div className="rounded-2xl border border-border bg-background overflow-hidden">
            <iframe
              src="https://klawsome.as.me/"
              title="Klawsome Acuity Scheduling"
              frameBorder="0"
              className="w-full h-screen block"
            />
          </div>
        </div>
      </section>
      <KawaiiDivider variant="scallop" from="baby-pink" to="baby-blue" stroke="white" />
      <KawaiiStory />
      <KawaiiFooter prevColor="baby-blue" />
      <DividerAudit />
    </div>
  );
};

export default Index;

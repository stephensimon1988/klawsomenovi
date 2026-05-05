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
import scheduleImage from '@/assets/kawaii-art/community_sakura-novi.png';

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
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
            <div className="md:col-span-5">
              <img
                src={scheduleImage}
                alt="Kawaii scheduling calendar with plush characters"
                loading="lazy"
                width={1024}
                height={1024}
                className="ds-img-hero"
              />
            </div>
            <div className="md:col-span-7">
              <p className="ds-eyebrow">Schedule</p>
              <h2 className="ds-h2 mb-4">Book Your Visit</h2>
              <p className="ds-lead mb-10">Schedule your next Klawsome adventure!</p>
              <div className="rounded-2xl border border-border bg-background p-16 text-muted-foreground text-center font-body">
                Acuity scheduling form coming soon
              </div>
            </div>
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

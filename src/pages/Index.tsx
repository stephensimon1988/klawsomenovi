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
import { Button } from '@/components/ui/button';
import { openBookingModal } from '@/components/BookNowDialog';

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
      <KawaiiDivider variant="scallop" from="white" to="baby-blue" stroke="baby-pink" />
      <KawaiiStory />
      <KawaiiDivider variant="wave" from="baby-blue" to="white" stroke="baby-pink" />
      <section id="scheduling" className="py-20 px-6 lg:px-12 bg-background">
        <div className="container mx-auto max-w-5xl text-center mb-10">
          <p className="ds-eyebrow text-primary mb-3">Book an Event with Klawsome</p>
          <h2 className="ds-h2 ds-stroke ds-stroke--navy">Book an event with Klawsome</h2>
          <p className="mt-4 text-muted-foreground font-body max-w-2xl mx-auto">
            Birthday parties, machine rentals, or Klawsome Mobile — pick your date and check out securely.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="hero" onClick={() => openBookingModal()} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start Booking
            </Button>
            <Button size="hero" variant="outline" onClick={() => openBookingModal('rental')}>
              Rent a Machine
            </Button>
          </div>
        </div>
      </section>
      <KawaiiFooter prevColor="white" />
    </div>
  );
};

export default Index;

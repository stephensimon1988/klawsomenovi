import KawaiiNav from '@/components/KawaiiNav';
import KawaiiHero from '@/components/KawaiiHero';
import KawaiiVisit from '@/components/KawaiiVisit';
import KawaiiAbout from '@/components/KawaiiAbout';
import KawaiiTokenPrices from '@/components/KawaiiTokenPrices';
import KawaiiReviews from '@/components/KawaiiReviews';
import KawaiiNews from '@/components/KawaiiNews';
import KawaiiGiftCards from '@/components/KawaiiGiftCards';
import KawaiiStory from '@/components/KawaiiStory';
import KawaiiScheduling from '@/components/KawaiiScheduling';
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
      <KawaiiScheduling />
      <KawaiiStory />
      <KawaiiFooter />
    </div>
  );
};

export default Index;

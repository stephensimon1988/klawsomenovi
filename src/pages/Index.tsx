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
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    const id = 'acuity-embed-script';
    if (document.getElementById(id)) return;
    const s = document.createElement('script');
    s.id = id;
    s.src = 'https://embed.acuityscheduling.com/js/embed.js';
    s.async = true;
    document.body.appendChild(s);
  }, []);

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
      <KawaiiFooter prevColor="baby-blue" />
      <DividerAudit />
    </div>
  );
};

export default Index;

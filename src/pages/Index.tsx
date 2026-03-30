import KawaiiNav from '@/components/KawaiiNav';
import KawaiiHero from '@/components/KawaiiHero';
import KawaiiAbout from '@/components/KawaiiAbout';
import KawaiiProducts from '@/components/KawaiiProducts';
import KawaiiFooter from '@/components/KawaiiFooter';
import KawaiiScheduling from '@/components/KawaiiScheduling';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      <KawaiiHero />
      <KawaiiAbout />
      <KawaiiProducts />
      <KawaiiScheduling />
      <KawaiiFooter />
    </div>
  );
};

export default Index;

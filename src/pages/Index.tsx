import KawaiiNav from '@/components/KawaiiNav';
import KawaiiHero from '@/components/KawaiiHero';
import KawaiiAbout from '@/components/KawaiiAbout';
import KawaiiProducts from '@/components/KawaiiProducts';
import KawaiiFooter from '@/components/KawaiiFooter';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      <KawaiiHero />
      <KawaiiAbout />
      <KawaiiProducts />
      <KawaiiFooter />
    </div>
  );
};

export default Index;

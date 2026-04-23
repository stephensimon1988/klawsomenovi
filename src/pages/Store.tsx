import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import PageHero from '@/components/PageHero';
import DynamicSections from '@/components/DynamicSections';
import { usePageHero } from '@/hooks/useCmsContent';

const Store = () => {
  const { data: hero } = usePageHero('store');
  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      <PageHero
        eyebrow={hero?.eyebrow || 'Prize Shop'}
        title={hero?.title || 'Klawsome Prize Shop'}
        subtitle={hero?.subtitle}
        imageUrl={hero?.image_url || ''}
      />
      <DynamicSections pageKey="store" />
      <KawaiiFooter />
    </div>
  );
};

export default Store;
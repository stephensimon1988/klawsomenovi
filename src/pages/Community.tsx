import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import PageHero from '@/components/PageHero';
import DynamicSections from '@/components/DynamicSections';
import { usePageHero } from '@/hooks/useCmsContent';

const Community = () => {
  const { data: hero } = usePageHero('community');
  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      <PageHero
        eyebrow={hero?.eyebrow || 'Community'}
        title={hero?.title || 'Community & Partners'}
        subtitle={hero?.subtitle}
        imageUrl={hero?.image_url || ''}
      />
      <DynamicSections pageKey="community" />
      <KawaiiFooter />
    </div>
  );
};

export default Community;
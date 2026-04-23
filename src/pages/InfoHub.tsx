import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import PageHero from '@/components/PageHero';
import DynamicSections from '@/components/DynamicSections';
import { usePageHero } from '@/hooks/useCmsContent';

const InfoHub = () => {
  const { data: hero } = usePageHero('info-hub');
  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      <PageHero
        eyebrow={hero?.eyebrow || 'Info Hub'}
        title={hero?.title || 'Klawsome Info Hub'}
        subtitle={hero?.subtitle}
        imageUrl={hero?.image_url || ''}
      />
      <DynamicSections pageKey="info-hub" />
      <KawaiiFooter />
    </div>
  );
};

export default InfoHub;
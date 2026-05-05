import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import PageHero from '@/components/PageHero';
import DynamicSections from '@/components/DynamicSections';
import { usePageHero } from '@/hooks/useCmsContent';

const Contact = () => {
  const { data: hero } = usePageHero('contact');
  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      <PageHero
        eyebrow={hero?.eyebrow || 'Contact'}
        title={hero?.title || 'Contact Klawsome'}
        subtitle={hero?.subtitle}
        imageUrl={hero?.image_url || ''}
      />
      <DynamicSections pageKey="contact" />
      <KawaiiFooter prevColor="secondary-soft" />
    </div>
  );
};

export default Contact;
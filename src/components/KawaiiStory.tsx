import { useGsapScroll } from '@/hooks/useGsapScroll';
import LottieAccent from './LottieAccent';
import { useCmsSingle, type HomepageContent } from '@/hooks/useCmsContent';

const KawaiiStory = () => {
  const ref = useGsapScroll<HTMLDivElement>({ type: 'scaleIn', duration: 1 });
  const { data: content } = useCmsSingle<HomepageContent>('homepage_content');

  return (
    <section id="story" className="section-y section-x bg-secondary/50 relative overflow-hidden">
      <LottieAccent type="sparkle" className="absolute bottom-8 right-12 opacity-15" size={80} />

      <div className="ds-container-narrow">
        <div ref={ref} style={{ opacity: 0 }}>
          <p className="ds-eyebrow mb-6">Our Story</p>
          <h2 className="ds-h2 mb-8">
            {content?.story_title || 'The Klawsome Story'}
          </h2>
          <p className="ds-lead">
            {content?.story_body || "Klawsome! is Michigan's first stand-alone claw machine arcade, offering a unique and exciting experience where customers can test their skills to win kawaii-style plushies from vibrantly colored claw machines. We are a family-owned local business based in Novi, Michigan, inspired by the popular arcades in Asian countries."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default KawaiiStory;

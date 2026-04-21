import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import { useCmsSingle, useCmsTable, usePageHero, type HomepageContent, type OurStorySection } from '@/hooks/useCmsContent';
import PageHero from '@/components/PageHero';

const OurStory = () => {
  const { data: content } = useCmsSingle<HomepageContent>('homepage_content');
  const { data: hero } = usePageHero('our_story');
  const { data: sections } = useCmsTable<OurStorySection>('our_story_sections');

  const title = hero?.title || content?.story_title || 'Our Story';
  const body = content?.story_body || '';
  const image = hero?.image_url || content?.story_image_url || 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg';

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />

      <PageHero
        eyebrow={hero?.eyebrow || 'About Us'}
        title={title}
        imageUrl={image}
      />

      {/* Intro */}
      <section className="section-y section-x">
        <div className="ds-container-narrow">
          <p className="ds-lead text-foreground text-2xl md:text-3xl">
            {body}
          </p>
        </div>
      </section>

      {(sections || []).map((s, idx) => (
        <section key={s.id} className={`section-y section-x ${idx % 2 === 0 ? 'bg-secondary/40' : ''}`}>
          <div className="ds-container-narrow">
            {s.eyebrow && <p className="ds-eyebrow">{s.eyebrow}</p>}
            <h2 className="ds-h2 uppercase mb-10">{s.title}</h2>
            <div className="space-y-6 ds-lead whitespace-pre-line">{s.body}</div>
          </div>
        </section>
      ))}

      <KawaiiFooter />
    </div>
  );
};

export default OurStory;

import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import KawaiiDivider, { DividerVariant } from '@/components/KawaiiDivider';
import { useCmsSingle, useCmsTable, usePageHero, type HomepageContent, type OurStorySection } from '@/hooks/useCmsContent';
import PageHero from '@/components/PageHero';

const OurStory = () => {
  const { data: content } = useCmsSingle<HomepageContent>('homepage_content');
  const { data: hero } = usePageHero('our_story');
  const { data: sections } = useCmsTable<OurStorySection>('our_story_sections');

  const title = hero?.title || content?.story_title || 'Our Story';
  const body = content?.story_body || '';
  const image = hero?.image_url || content?.story_image_url || 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg';

  const VARIANTS: DividerVariant[] = ['wave', 'scallop', 'cloud', 'bumps', 'petals', 'zigzag-soft', 'brush', 'blob'];

  // Family photos used to illustrate the first two CMS-driven story sections.
  const SECTION_IMAGES = [
    'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg',
    'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/057fb62e-a01f-49c9-a963-255ce0091234/KlawsomeCrewSelfieWall.jpg',
  ];

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40);

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />

      <PageHero
        eyebrow={hero?.eyebrow || 'About Us'}
        title={title}
        imageUrl={image}
        jumpLinks={[
          { label: 'Intro', id: 'story-intro' },
          ...((sections || []).slice(0, 7).map((s) => ({
            label: s.title.length > 18 ? s.title.slice(0, 16) + '…' : s.title,
            id: `story-${slugify(s.title)}`,
          }))),
        ]}
      />

      {/* Intro */}
      <section id="story-intro" className="section-y section-x">
        <div className="ds-container-narrow">
          <p className="ds-lead text-foreground text-2xl md:text-3xl">
            {body}
          </p>
        </div>
      </section>

      {(sections || []).map((s, idx) => {
        // Intro is white. First mapped section (idx=0) is secondary/40 → divider white→secondary-soft.
        const thisColor = idx % 2 === 0 ? 'secondary-soft' : 'white';
        const prevColor = idx === 0 ? 'white' : (idx % 2 === 1 ? 'secondary-soft' : 'white');
        const variant = VARIANTS[idx % VARIANTS.length];
        const stroke = thisColor === 'white' ? 'baby-pink' : 'baby-blue';
        const sideImage = SECTION_IMAGES[idx];
        const imageOnLeft = idx % 2 === 0;
        return (
          <div key={s.id}>
            {prevColor !== thisColor && (
              <KawaiiDivider variant={variant} from={prevColor as any} to={thisColor as any} stroke={stroke as any} height={90} />
            )}
            <section id={`story-${slugify(s.title)}`} className={`section-y section-x ${idx % 2 === 0 ? 'bg-secondary/40' : ''}`}>
              {sideImage ? (
                <div className="ds-container">
                  <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className={imageOnLeft ? 'md:order-1' : 'md:order-2'}>
                      <img
                        src={sideImage}
                        alt={s.title}
                        loading="lazy"
                        className="w-full h-auto rounded-kawaii shadow-lg object-cover aspect-[4/5]"
                      />
                    </div>
                    <div className={imageOnLeft ? 'md:order-2' : 'md:order-1'}>
                      {s.eyebrow && <p className="ds-eyebrow">{s.eyebrow}</p>}
                      <h2 className="ds-h2 uppercase mb-10">{s.title}</h2>
                      <div className="space-y-6 ds-lead whitespace-pre-line">{s.body}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="ds-container-narrow">
                  {s.eyebrow && <p className="ds-eyebrow">{s.eyebrow}</p>}
                  <h2 className="ds-h2 uppercase mb-10">{s.title}</h2>
                  <div className="space-y-6 ds-lead whitespace-pre-line">{s.body}</div>
                </div>
              )}
            </section>
          </div>
        );
      })}

      <KawaiiFooter />
    </div>
  );
};

export default OurStory;

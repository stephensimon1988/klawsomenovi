import { useGsapScroll } from '@/hooks/useGsapScroll';
import LottieAccent from './LottieAccent';
import { useCmsSingle, type HomepageContent } from '@/hooks/useCmsContent';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { openBookingModal } from './BookNowDialog';
const storyImage = 'https://nrxfzjysodxqmwsstcim.supabase.co/storage/v1/object/public/site-images/transparent-png/bear-panda-fox-cat-party.webp';

const KawaiiStory = () => {
  const ref = useGsapScroll<HTMLDivElement>({ type: 'scaleIn', duration: 1 });
  const { data: content } = useCmsSingle<HomepageContent>('homepage_content');

  return (
    <section id="story" className="section-y section-x bg-secondary relative overflow-hidden">
      <LottieAccent type="sparkle" className="absolute bottom-8 right-12 opacity-15" size={80} />

      <div className="ds-container">
        <div ref={ref} className="grid md:grid-cols-12 gap-10 md:gap-16 items-center" style={{ opacity: 0 }}>
          <div className="md:col-span-6 md:order-2 img-hover rounded-2xl">
            <img
              src={content?.story_image_url || storyImage}
              alt={content?.story_title || 'The Klawsome Story'}
              loading="lazy"
              width={1024}
              height={1024}
              className="ds-img-hero"
            />
          </div>
          <div className="md:col-span-6 md:order-1">
            <p className="ds-eyebrow mb-6">Our Story</p>
            <h2 className="ds-h2 ds-stroke ds-stroke--navy mb-8">
              {content?.story_title || 'The Klawsome Story'}
            </h2>
            <p className="ds-lead">
              {content?.story_body || "Klawsome! is Michigan's first stand-alone claw machine arcade, offering a unique and exciting experience where customers can test their skills to win kawaii-style plushies from vibrantly colored claw machines. We are a family-owned local business based in Novi, Michigan, inspired by the popular arcades in Asian countries."}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                onClick={openBookingModal}
                className="rounded-full px-8 font-heading font-bold tracking-wider bg-primary hover:bg-primary/90 text-white"
              >
                BOOK NOW
              </Button>
              <Link
                to="/our-story"
                className="font-heading font-bold text-sm tracking-[0.15em] uppercase text-primary hover:text-primary/80 underline-offset-4 hover:underline"
              >
                Read Our Story →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KawaiiStory;

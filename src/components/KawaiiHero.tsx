import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from './ui/button';
import LottieAccent from './LottieAccent';
import { useCmsSingle, type HomepageContent } from '@/hooks/useCmsContent';
gsap.registerPlugin(ScrollTrigger);

const KawaiiHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const { data: content } = useCmsSingle<HomepageContent>('homepage_content');

  const headline = content?.hero_headline || "Michigan's first stand-alone claw arcade";
  const subheadline = content?.hero_subheadline || 'Step into Klawsome and experience bright, colorful machines filled with kawaii plushies and prizes.';
  const heroImage = content?.hero_image_url || 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        y: 120,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      const textChildren = textRef.current?.children;
      if (textChildren) {
        gsap.fromTo(
          textChildren,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.3 }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headlineParts = headline.split('\n');

  const jumpLinks: { label: string; id: string }[] = [
    { label: 'About', id: 'about' },
    { label: 'Visit', id: 'visit' },
    { label: 'Tokens', id: 'tokens' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'News', id: 'news' },
    { label: 'Gift Cards', id: 'giftcards' },
    { label: 'Our Story', id: 'story' },
    { label: 'Book', id: 'scheduling' },
  ];

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <section id="hero" ref={sectionRef} className="relative min-h-screen flex items-end overflow-hidden">
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url('${heroImage}')`,
          top: '-60px',
          bottom: '-60px',
        }}
      />
      <div className="absolute inset-0 bg-white/55" />

      <LottieAccent type="sparkle" className="absolute top-24 right-12 opacity-30 z-10" size={80} />

      <div className="relative z-10 ds-container section-x pb-24 pt-32">
        <div ref={textRef} className="max-w-3xl">
          <h1 className="ds-h1 mb-6" style={{ opacity: 0, color: 'hsl(var(--klawsome-navy))' }}>
            {headlineParts.map((part, i) => (
              <span key={i} className="block">
                {part}
              </span>
            ))}
          </h1>

          <p className="ds-lead max-w-xl mb-10" style={{ opacity: 0, color: 'hsl(var(--klawsome-navy) / 0.8)' }}>
            {subheadline}
          </p>

          <div className="space-y-5" style={{ opacity: 0 }}>
            <nav aria-label="Jump to section" className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 w-full">
              {jumpLinks.map((l) => (
                <Button
                  key={l.id}
                  size="heroSm"
                  onClick={() => scrollTo(l.id)}
                  className="w-full bg-klawsome-navy text-white hover:bg-klawsome-navy/90 border border-klawsome-navy shadow-md"
                >
                  {l.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KawaiiHero;

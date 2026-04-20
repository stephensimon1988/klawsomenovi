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
  const ctaText = content?.hero_cta_text || 'Play';
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      <LottieAccent type="sparkle" className="absolute top-24 right-12 opacity-30 z-10" size={80} />

      <div className="relative z-10 container mx-auto px-6 lg:px-12 pb-24 pt-32">
        <div ref={textRef} className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 leading-[0.95] tracking-tight text-white uppercase" style={{ opacity: 0 }}>
            {headlineParts.map((part, i) => (
              <span key={i} className="block">
                {part}
              </span>
            ))}
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-xl mb-10 font-body leading-relaxed" style={{ opacity: 0 }}>
            {subheadline}
          </p>

          <div className="flex flex-wrap items-center gap-4" style={{ opacity: 0 }}>
            <Button
              size="lg"
              onClick={() => document.getElementById('tokens')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full px-10 py-6 text-sm font-heading font-bold tracking-wider bg-primary hover:bg-primary/90 text-white uppercase"
            >
              {ctaText}
            </Button>
            <Button
              size="lg"
              onClick={() => document.getElementById('scheduling')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full px-10 py-6 text-sm font-heading font-bold tracking-wider bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20 uppercase"
            >
              Reserve
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KawaiiHero;

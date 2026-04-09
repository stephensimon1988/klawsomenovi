import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from './ui/button';
import LottieAccent from './LottieAccent';
import { useCmsSingle, type HomepageContent } from '@/hooks/useCmsContent';

gsap.registerPlugin(ScrollTrigger);

const KawaiiHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const { data: content } = useCmsSingle<HomepageContent>('homepage_content');

  // Fallbacks
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

      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.7, rotate: -8 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)', delay: 0.3 }
      );

      const textChildren = textRef.current?.children;
      if (textChildren) {
        gsap.fromTo(
          textChildren,
          { opacity: 0, x: 60, skewX: 3 },
          { opacity: 1, x: 0, skewX: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.5 }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split headline on newlines for multi-line display
  const headlineParts = headline.split('\n');

  return (
    <section id="hero" ref={sectionRef} className="relative min-h-[85vh] flex items-center overflow-hidden pt-16">
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url('${heroImage}')`,
          top: '-60px',
          bottom: '-60px',
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <LottieAccent type="sparkle" className="absolute top-16 right-12 opacity-50 z-10" size={100} />
      <LottieAccent type="star" className="absolute bottom-20 left-8 opacity-40 z-10" size={70} />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center w-full">
          <div ref={logoRef} className="flex justify-center p-[10%]" style={{ opacity: 0 }}>
            <img
              src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/f907dbc8-8a5c-43a3-8224-1729d43956bb/CircularLogo_Klawsome_RGB.png"
              alt="Klawsome Logo"
              className="w-full h-auto object-contain"
            />
          </div>

          <div ref={textRef} className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 leading-tight text-white" style={{ opacity: 0 }}>
              {headlineParts.map((part, i) => (
                <span key={i}>
                  {i === headlineParts.length - 1 ? (
                    <span className="kawaii-text-gradient">{part}</span>
                  ) : (
                    <>
                      {part}
                      <br />
                    </>
                  )}
                </span>
              ))}
            </h1>

            <p className="text-base md:text-lg text-white/70 max-w-lg mb-6 font-body leading-relaxed" style={{ opacity: 0 }}>
              {subheadline}
            </p>

            <div className="flex flex-col sm:flex-row items-center md:items-start gap-3" style={{ opacity: 0 }}>
              <Button size="lg" onClick={() => document.getElementById('tokens')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full px-10 py-6 text-lg font-heading font-bold bg-primary hover:bg-primary/90 text-white glow-hover glow-coral">
                {ctaText}
              </Button>
              <Button size="lg" onClick={() => document.getElementById('scheduling')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full px-10 py-6 text-lg font-heading font-bold bg-klawsome-navy text-white hover:bg-klawsome-navy/90 glow-hover glow-blue">
                Reserve
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KawaiiHero;

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LottieAccent from './LottieAccent';
import { useCmsSingle, useCmsTable, type HomepageContent, type StoreHour } from '@/hooks/useCmsContent';
import { formatHoursSummary } from '@/lib/hoursSummary';
import { openBookingModal } from './BookNowDialog';
import { Link } from 'react-router-dom';
gsap.registerPlugin(ScrollTrigger);

const KawaiiHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  const { data: content } = useCmsSingle<HomepageContent>('homepage_content');
  const { data: hours } = useCmsTable<StoreHour>('store_hours');
  const hoursSummary = formatHoursSummary(hours);

  const headline = content?.hero_headline || "Michigan's first stand-alone claw arcade";
  const subheadline = hoursSummary.hasData
    ? hoursSummary.full
    : (content?.hero_subheadline || 'Step into Klawsome and experience bright, colorful machines filled with kawaii plushies and prizes.');
  const heroImage = content?.hero_image_url || 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.webp';

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

  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
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
        className="absolute inset-0 will-change-transform overflow-hidden"
        style={{ top: '-60px', bottom: '-60px' }}
      >
        <video
          src="/hero-intro.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroImage}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-white/55" />

      <LottieAccent type="sparkle" className="absolute top-24 right-12 opacity-30 z-10" size={80} />

      <div className="relative z-10 ds-container section-x pb-24 pt-32">
        <div ref={textRef} className="max-w-3xl">
          <h1 className="ds-h1 ds-stroke ds-stroke--h1 ds-stroke--navy mb-6" style={{ opacity: 0 }}>
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
            <nav aria-label="Quick actions" className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-heading font-bold bg-klawsome-red text-white border border-klawsome-red shadow-md transition-all duration-200 hover:bg-klawsome-yellow hover:text-klawsome-navy hover:border-klawsome-yellow hover:-translate-y-[5px] hover:shadow-[0_8px_24px_-4px_hsl(var(--klawsome-yellow)/0.7)]"
              >
                Book Event
              </button>
              <Link
                to="/store"
                className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-heading font-bold bg-klawsome-red text-white border border-klawsome-red shadow-md transition-all duration-200 hover:bg-klawsome-yellow hover:text-klawsome-navy hover:border-klawsome-yellow hover:-translate-y-[5px] hover:shadow-[0_8px_24px_-4px_hsl(var(--klawsome-yellow)/0.7)]"
              >
                Store
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div ref={sentinelRef} className="absolute bottom-0 left-0 h-px w-px" aria-hidden="true" />
      <nav
        aria-label="Jump to section (sticky)"
        className={`fixed top-20 left-0 right-0 z-40 bg-klawsome-yellow shadow-md transition-all duration-300 ${
          stuck ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="ds-container section-x py-2">
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {jumpLinks.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => scrollTo(l.id)}
                className="inline-flex items-center justify-center rounded-full px-2.5 py-1.5 text-[10px] sm:px-4 sm:py-2 sm:text-xs font-heading font-bold bg-klawsome-red text-white border border-klawsome-red shadow-md transition-all duration-200 hover:bg-klawsome-yellow hover:text-klawsome-navy hover:border-klawsome-yellow hover:-translate-y-[5px] hover:shadow-[0_8px_24px_-4px_hsl(var(--klawsome-yellow)/0.7)]"
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </section>
  );
};

export default KawaiiHero;

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from './ui/button';
import LottieAccent from './LottieAccent';

gsap.registerPlugin(ScrollTrigger);

const KawaiiHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax background
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

      // Logo entrance
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.7, rotate: -8 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)', delay: 0.3 }
      );

      // Text entrance with stagger
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

  return (
    <section id="hero" ref={sectionRef} className="relative min-h-[85vh] flex items-center overflow-hidden pt-16">
      {/* Background image with parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg')`,
          top: '-60px',
          bottom: '-60px',
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Lottie sparkle accents */}
      <LottieAccent type="sparkle" className="absolute top-16 right-12 opacity-50 z-10" size={100} />
      <LottieAccent type="star" className="absolute bottom-20 left-8 opacity-40 z-10" size={70} />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center w-full">
          {/* Left — Logo */}
          <div ref={logoRef} className="flex justify-center p-[10%]" style={{ opacity: 0 }}>
            <img
              src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/f907dbc8-8a5c-43a3-8224-1729d43956bb/CircularLogo_Klawsome_RGB.png"
              alt="Klawsome Logo"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Right — Text content */}
          <div ref={textRef} className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 leading-tight text-white" style={{ opacity: 0 }}>
              Michigan's first
              <br />
              stand-alone
              <br />
              <span className="kawaii-text-gradient">claw arcade</span>
            </h1>

            <p className="text-base md:text-lg text-white/70 max-w-lg mb-6 font-body leading-relaxed" style={{ opacity: 0 }}>
              Step into Klawsome and experience bright, colorful machines filled with kawaii plushies and prizes. Open Tuesday through Sunday, 11 a.m. to 9 p.m. at Sakura Novi in Michigan.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-kawaii p-4 max-w-sm mb-6 border border-white/20 mx-auto md:mx-0 glow-hover glow-blue" style={{ opacity: 0 }}>
              <p className="text-white font-heading font-semibold text-sm">Spring break hours:</p>
              <p className="text-white/70 font-body text-sm">Monday March 30, 11 a.m. to 9 p.m.</p>
              <p className="text-white/70 font-body text-sm">Closed Easter Sunday April 5</p>
              <p className="text-white font-heading font-semibold text-sm mt-2">Regular hours:</p>
              <p className="text-white/70 font-body text-sm">Tue–Sun 11 a.m. to 9 p.m. · Closed Mondays</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center md:items-start gap-3" style={{ opacity: 0 }}>
              <Button size="lg" onClick={() => document.getElementById('tokens')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full px-10 py-6 text-lg font-heading font-bold bg-primary hover:bg-primary/90 text-white glow-hover glow-coral">
                Play
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

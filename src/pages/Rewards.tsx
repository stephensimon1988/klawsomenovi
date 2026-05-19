import { useEffect, useRef, useState } from 'react';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import KawaiiDivider from '@/components/KawaiiDivider';
import { Button } from '@/components/ui/button';
import { usePageHero } from '@/hooks/useCmsContent';

const SPARKLE = '/rewards/klawsome-sparkle.gif';

const Sparkle = ({ className = '' }: { className?: string }) => (
  <img src={SPARKLE} alt="" aria-hidden className={`pointer-events-none select-none animate-float ${className}`} />
);

const BENEFITS = [
  { title: 'Birthday Bonus', body: 'Get a free plushie or gift bag on your special day!' },
  { title: 'Earn Points Every Time You Play', body: '$1 = 1 point toward free plushies.' },
  { title: 'Member-Exclusive Rewards & Events', body: 'Unlock special challenges, VIP drops, and exclusive events.' },
  { title: 'Chances to Win', body: 'Get a free spin for bonus tokens when you join, and be entered into monthly raffles!' },
];

const TIERS = [
  { name: 'Base', min: 'Starter (0)', benefit: 'x1 points' },
  { name: 'Collector', min: '500', benefit: 'x1.2 points' },
  { name: 'Master Of The Claw', min: '1500', benefit: 'x1.4 points' },
  { name: 'Legendary', min: '4000', benefit: 'x1.7 points' },
];

const REDEMPTIONS = [
  { points: '250', reward: 'Free mini plushie of your choice' },
  { points: '500', reward: 'Free regular plushie of your choice' },
  { points: '1000', reward: 'Any XL plushie of your choice' },
];

const Rewards = () => {
  const { data: hero } = usePageHero('rewards');

  // Sticky jump nav (mirrors PageHero behavior)
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const jumpLinks = [
    { label: 'Benefits', id: 'benefits' },
    { label: 'Tiers', id: 'tiers' },
    { label: 'Redeem', id: 'redemptions' },
  ];
  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />

      {/* Custom kawaii hero — sky-blue with Loyalty script + bubble title + rocking cat */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 bg-klawsome-baby-blue">
        {/* Floating sparkles */}
        <img
          src="/rewards/klawsome-sparkle.gif"
          alt=""
          aria-hidden
          className="absolute top-16 left-[8%] w-16 md:w-24 opacity-90 animate-float"
        />
        <img
          src="/rewards/klawsome-sparkle.gif"
          alt=""
          aria-hidden
          className="absolute top-40 right-[10%] w-20 md:w-28 opacity-90 animate-float [animation-delay:-1.5s]"
        />

        <div className="ds-container section-x relative z-10">
          <div className="flex flex-col items-center text-center">
            <img
              src="/rewards/loyalty-title.webp"
              alt="Loyalty"
              className="w-[260px] sm:w-[340px] md:w-[420px] mb-2 md:mb-4"
            />
            <h1
              className="ds-h1 uppercase text-5xl sm:text-6xl md:text-8xl tracking-tight"
              style={{ color: 'hsl(var(--klawsome-navy))' }}
            >
              {hero?.title || 'Rewards Program'}
            </h1>

            <div className="mt-8 md:mt-10">
              <Button
                asChild
                size="lg"
                className="rounded-full px-10 py-6 text-base font-heading font-bold uppercase tracking-wider bg-klawsome-navy text-white hover:bg-klawsome-navy/90 shadow-lg hover:-translate-y-[3px] transition-all"
              >
                <a
                  href={hero?.cta_url || 'https://profile.squareup.com/merchantportal/ML1R35ZH9VKRW/loyalty'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {hero?.cta_text || 'Join Today!'}
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div ref={sentinelRef} className="absolute bottom-0 left-0 h-px w-px" aria-hidden />
      </section>

      {/* Sticky jump nav */}
      <nav
        aria-label="Jump to section"
        className={`fixed top-20 left-0 right-0 z-40 bg-klawsome-yellow shadow-md transition-all duration-300 ${
          stuck ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="ds-container section-x py-2">
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {jumpLinks.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="inline-flex items-center justify-center rounded-full px-2.5 py-1.5 text-[10px] sm:px-4 sm:py-2 sm:text-xs font-heading font-bold bg-klawsome-navy text-white border border-klawsome-navy shadow-md transition-all duration-200 hover:bg-white hover:text-klawsome-navy hover:border-white hover:-translate-y-[5px]"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Benefits — "Your Claw Game, Upgraded" */}
      <section id="benefits" className="section-y section-x relative overflow-hidden">
        <Sparkle className="absolute top-10 left-[6%] w-12 md:w-16 opacity-80" />
        <Sparkle className="absolute top-24 right-[8%] w-16 md:w-20 opacity-80 [animation-delay:-1.2s]" />

        <div className="ds-container relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-16">
            <img
              src="/rewards/rocking-klawsome-cat.gif"
              alt="Klawsome birthday cat mascot"
              className="w-36 sm:w-44 md:w-56 shrink-0"
            />
            <div className="text-center md:text-left">
              <h2 className="ds-h2 uppercase" style={{ color: 'hsl(var(--klawsome-navy))' }}>
                Your Claw Game, Upgraded
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {BENEFITS.map((b) => (
              <div key={b.title} className="relative rounded-3xl bg-klawsome-baby-blue/40 border border-klawsome-baby-blue p-8 text-center shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
                <Sparkle className="absolute -top-4 -right-3 w-10 md:w-12" />
                <h3 className="ds-h3 text-xl mb-3" style={{ color: 'hsl(var(--klawsome-navy))' }}>{b.title}</h3>
                <p className="ds-body">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <KawaiiDivider variant="cloud" from="white" to="navy" stroke="baby-pink" height={90} />
      <section id="tiers" className="section-y section-x bg-klawsome-navy text-background relative overflow-hidden">
        <Sparkle className="absolute top-12 left-[7%] w-14 md:w-20 opacity-90" />
        <Sparkle className="absolute top-28 right-[6%] w-16 md:w-24 opacity-90 [animation-delay:-1.5s]" />

        <div className="ds-container relative z-10">
          <p className="ds-eyebrow text-center">Lifetime Tiers</p>
          <h2 className="ds-h2 uppercase mb-16 text-background text-center">Climb the ranks.</h2>
          <div className="grid md:grid-cols-4 gap-px bg-background/20">
            {TIERS.map((tier, i) => (
              <div key={tier.name} className="bg-klawsome-navy p-8">
                <p className="ds-eyebrow">Tier {i + 1}</p>
                <h3 className="ds-h3 uppercase mb-6 text-background">{tier.name}</h3>
                <div className="space-y-2 font-body">
                  <p className="text-background/60 text-sm">Minimum points</p>
                  <p className="text-3xl font-heading font-bold">{tier.min}</p>
                </div>
                <div className="space-y-2 font-body mt-6 pt-6 border-t border-background/20">
                  <p className="text-background/60 text-sm">Earn rate</p>
                  <p className="text-xl font-heading font-bold">{tier.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Redemptions */}
      <KawaiiDivider variant="bumps" from="navy" to="white" stroke="yellow" height={90} />
      <section id="redemptions" className="section-y section-x relative overflow-hidden">
        <Sparkle className="absolute top-10 left-[10%] w-12 md:w-16 opacity-80" />
        <Sparkle className="absolute top-32 right-[12%] w-16 md:w-20 opacity-80 [animation-delay:-1.4s]" />

        <div className="ds-container relative z-10">
          <p className="ds-eyebrow text-center">Points Redeemable</p>
          <h2 className="ds-h2 uppercase mb-16 text-center" style={{ color: 'hsl(var(--klawsome-navy))' }}>
            Points Redeemable
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {REDEMPTIONS.map((r) => (
              <div key={r.points} className="relative border border-klawsome-baby-blue rounded-3xl p-10 bg-klawsome-baby-blue/30 text-center hover:-translate-y-1 hover:shadow-lg transition-all">
                <Sparkle className="absolute -top-4 -left-3 w-10 md:w-12" />
                <p className="text-6xl font-heading font-bold mb-2" style={{ color: 'hsl(var(--klawsome-navy))' }}>{r.points}</p>
                <p className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Points</p>
                <p className="ds-lead text-foreground">{r.reward}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              asChild
              size="lg"
              className="rounded-full px-10 py-6 text-base font-heading font-bold uppercase tracking-wider bg-klawsome-navy text-white hover:bg-klawsome-navy/90 shadow-lg hover:-translate-y-[3px] transition-all"
            >
              <a
                href="https://profile.squareup.com/merchantportal/ML1R35ZH9VKRW/loyalty"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Today!
              </a>
            </Button>
          </div>
        </div>
      </section>

      <KawaiiFooter />
    </div>
  );
};

export default Rewards;

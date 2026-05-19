import { useEffect, useRef, useState } from 'react';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import KawaiiDivider from '@/components/KawaiiDivider';
import { Button } from '@/components/ui/button';
import { useCmsTable, usePageHero, type RewardsBenefit } from '@/hooks/useCmsContent';

interface RewardsTier { id: string; tier_name: string; min_points: string; benefit: string; sort_order: number; }
interface RewardsRedemption { id: string; points: string; reward: string; sort_order: number; }

const Rewards = () => {
  const { data: tiers } = useCmsTable<RewardsTier>('rewards_tiers');
  const { data: redemptions } = useCmsTable<RewardsRedemption>('rewards_redemptions');
  const { data: benefits } = useCmsTable<RewardsBenefit>('rewards_benefits');
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
        <img
          src="/rewards/klawsome-sparkle.gif"
          alt=""
          aria-hidden
          className="absolute bottom-10 left-[20%] w-12 md:w-16 opacity-80 animate-float [animation-delay:-0.8s]"
        />
        <img
          src="/rewards/klawsome-sparkle.gif"
          alt=""
          aria-hidden
          className="absolute bottom-20 right-[22%] w-14 md:w-20 opacity-80 animate-float [animation-delay:-2.2s]"
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

            {/* Rocking cat */}
            <img
              src="/rewards/rocking-klawsome-cat.gif"
              alt="Klawsome birthday cat mascot"
              className="w-40 sm:w-52 md:w-64 mt-6 md:mt-8"
            />

            <div className="mt-6 md:mt-8">
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

      {/* Benefits */}
      <section id="benefits" className="section-y section-x">
        <div className="ds-container">
          <p className="ds-eyebrow">Membership Benefits</p>
          <h2 className="ds-h2 uppercase mb-16 max-w-2xl">Built for the people who play.</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(benefits || []).map((b) => (
              <div key={b.id} className="border-t border-foreground pt-6">
                <h3 className="ds-h3 text-xl mb-3">{b.title}</h3>
                <p className="ds-body">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <KawaiiDivider variant="cloud" from="white" to="navy" stroke="baby-pink" height={90} />
      <section id="tiers" className="section-y section-x bg-foreground text-background">
        <div className="ds-container">
          <p className="ds-eyebrow">Lifetime Tiers</p>
          <h2 className="ds-h2 uppercase mb-16 text-background">Climb the ranks.</h2>
          <div className="grid md:grid-cols-4 gap-px bg-background/20">
            {tiers?.map((tier) => (
              <div key={tier.id} className="bg-foreground p-8">
                <p className="ds-eyebrow">Tier {tier.sort_order}</p>
                <h3 className="ds-h3 uppercase mb-6 text-background">{tier.tier_name}</h3>
                <div className="space-y-2 font-body">
                  <p className="text-background/60 text-sm">Minimum points</p>
                  <p className="text-3xl font-heading font-bold">{tier.min_points}</p>
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
      <section id="redemptions" className="section-y section-x">
        <div className="ds-container">
          <p className="ds-eyebrow">Points Redeemable</p>
          <h2 className="ds-h2 uppercase mb-16">Cash in for something cute.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {redemptions?.map((r) => (
              <div key={r.id} className="border border-border rounded-2xl p-8">
                <p className="text-5xl font-heading font-bold text-primary mb-4">{r.points}</p>
                <p className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">Points</p>
                <p className="ds-lead text-foreground">{r.reward}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <KawaiiFooter />
    </div>
  );
};

export default Rewards;

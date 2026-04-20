import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import { Button } from '@/components/ui/button';
import { useCmsTable } from '@/hooks/useCmsContent';

interface RewardsTier { id: string; tier_name: string; min_points: string; benefit: string; sort_order: number; }
interface RewardsRedemption { id: string; points: string; reward: string; sort_order: number; }

const benefits = [
  { title: 'Birthday Bonus', body: 'Get a free plushie or gift bag on your special day.' },
  { title: 'Earn Points Every Play', body: '$1 = 1 point toward free plushies.' },
  { title: 'Member-Exclusive Drops', body: 'Unlock special challenges, VIP drops, and exclusive events.' },
  { title: 'Chances To Win', body: 'Free spin for bonus tokens when you join, plus monthly raffles.' },
];

const Rewards = () => {
  const { data: tiers } = useCmsTable<RewardsTier>('rewards_tiers');
  const { data: redemptions } = useCmsTable<RewardsRedemption>('rewards_redemptions');

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden bg-secondary/40 pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <p className="text-xs font-heading font-bold text-primary uppercase tracking-[0.2em] mb-6">Loyalty</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold uppercase leading-[0.95] mb-8">
            Rewards<br/>Program
          </h1>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mb-10">
            Your claw game, upgraded. Earn points every visit, unlock perks, and trade up for the prizes you actually want.
          </p>
          <Button asChild size="lg" className="rounded-full px-8 font-heading font-bold tracking-wider bg-foreground text-background hover:bg-foreground/90 uppercase">
            <a href="https://profile.squareup.com/merchantportal/ML1R35ZH9VKRW/loyalty" target="_blank" rel="noopener noreferrer">Join Today</a>
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-28 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <p className="text-xs font-heading font-bold text-primary uppercase tracking-[0.2em] mb-4">Membership Benefits</p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase mb-16 max-w-2xl leading-[1]">Built for the people who play.</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="border-t border-foreground pt-6">
                <h3 className="text-xl font-heading font-bold mb-3">{b.title}</h3>
                <p className="text-muted-foreground font-body leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-28 px-6 lg:px-12 bg-foreground text-background">
        <div className="container mx-auto max-w-6xl">
          <p className="text-xs font-heading font-bold text-primary uppercase tracking-[0.2em] mb-4">Lifetime Tiers</p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase mb-16 leading-[1]">Climb the ranks.</h2>
          <div className="grid md:grid-cols-4 gap-px bg-background/20">
            {tiers?.map((tier) => (
              <div key={tier.id} className="bg-foreground p-8">
                <p className="text-xs font-heading font-bold text-primary uppercase tracking-[0.2em] mb-4">Tier {tier.sort_order}</p>
                <h3 className="text-2xl font-heading font-bold uppercase mb-6">{tier.tier_name}</h3>
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
      <section className="py-28 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <p className="text-xs font-heading font-bold text-primary uppercase tracking-[0.2em] mb-4">Points Redeemable</p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase mb-16 leading-[1]">Cash in for something cute.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {redemptions?.map((r) => (
              <div key={r.id} className="border border-border rounded-2xl p-8">
                <p className="text-5xl font-heading font-bold text-primary mb-4">{r.points}</p>
                <p className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">Points</p>
                <p className="font-body text-lg leading-relaxed">{r.reward}</p>
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

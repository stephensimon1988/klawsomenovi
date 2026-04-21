import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import { Button } from '@/components/ui/button';
import { useCmsTable } from '@/hooks/useCmsContent';
import PageHero from '@/components/PageHero';

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

      <PageHero
        eyebrow="Loyalty"
        title={<>Rewards<br/>Program</>}
        subtitle="Your claw game, upgraded. Earn points every visit, unlock perks, and trade up for the prizes you actually want."
        imageUrl="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg"
      >
        <Button asChild size="lg" className="rounded-full px-8 font-heading font-bold tracking-wider bg-white text-foreground hover:bg-white/90 uppercase">
          <a href="https://profile.squareup.com/merchantportal/ML1R35ZH9VKRW/loyalty" target="_blank" rel="noopener noreferrer">Join Today</a>
        </Button>
      </PageHero>

      {/* Benefits */}
      <section className="section-y section-x">
        <div className="ds-container">
          <p className="ds-eyebrow">Membership Benefits</p>
          <h2 className="ds-h2 uppercase mb-16 max-w-2xl">Built for the people who play.</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="border-t border-foreground pt-6">
                <h3 className="ds-h3 text-xl mb-3">{b.title}</h3>
                <p className="ds-body">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="section-y section-x bg-foreground text-background">
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
      <section className="section-y section-x">
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

import { useGsapScroll, useGsapStagger } from '@/hooks/useGsapScroll';
import LottieAccent from './LottieAccent';
import { useCmsTable, type TokenTier } from '@/hooks/useCmsContent';

const fallbackTiers = [
  { price: '$10', tokens: '10', bonus: '—', is_highlight: false },
  { price: '$30', tokens: '30 + 5', bonus: '16%', is_highlight: false },
  { price: '$50', tokens: '50 + 10', bonus: '20%', is_highlight: false },
  { price: '$100', tokens: '100 + 25', bonus: '25%', is_highlight: true },
  { price: '$250', tokens: '250 + 75', bonus: '30%', is_highlight: false },
];

const KawaiiTokenPrices = () => {
  const headerRef = useGsapScroll<HTMLDivElement>({ type: 'slideUp' });
  const tableRef = useGsapStagger<HTMLDivElement>({ type: 'slideUp', stagger: 0.08, distance: 40 });

  const { data: dbTiers } = useCmsTable<TokenTier>('token_tiers');
  const tiers = dbTiers && dbTiers.length > 0 ? dbTiers : fallbackTiers;

  return (
    <section id="tokens" className="section-y section-x bg-primary relative overflow-hidden">
      <LottieAccent type="star" className="absolute bottom-12 left-6 opacity-20" size={70} />

      <div className="ds-container relative z-10">
        <div ref={headerRef} className="max-w-2xl mb-16" style={{ opacity: 0 }}>
          <p className="ds-eyebrow text-klawsome-yellow">Pricing</p>
          <h2 className="ds-h2 text-white">
            Token Prices
          </h2>
        </div>

        <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-center max-w-6xl mx-auto">
          <div className="md:col-span-5">
            <img
              src="https://nrxfzjysodxqmwsstcim.supabase.co/storage/v1/object/public/site-images/transparent-png/panda-cat-fox-vending-machine-toys.png"
              alt="Klawsome characters with tokens"
              loading="lazy"
              className="w-full h-auto"
            />
          </div>
          <div ref={tableRef} className="md:col-span-7 w-full">
            <div
              className="grid grid-cols-3 text-center font-heading font-bold text-white text-2xl md:text-3xl pb-6 border-b border-white/20"
              style={{ opacity: 0 }}
            >
              <span>Price</span>
              <span>Tokens</span>
              <span>Bonus</span>
            </div>
            {tiers.map((tier: any) => (
              <div
                key={tier.price}
                className={`grid grid-cols-3 text-center items-center py-5 font-heading font-bold text-xl md:text-2xl ${
                  tier.is_highlight
                    ? 'bg-klawsome-yellow/15 border border-klawsome-yellow/30 rounded-2xl text-klawsome-yellow my-2'
                    : 'text-white'
                }`}
                style={{ opacity: 0 }}
              >
                <span>{tier.price}</span>
                <span>{tier.tokens}</span>
                <span>{tier.bonus}</span>
              </div>
            ))}
            {tiers.some((t: any) => t.is_highlight) && (
              <p className="text-klawsome-yellow/70 text-sm font-body text-center mt-6">⭐ Top Pick — Best value!</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KawaiiTokenPrices;
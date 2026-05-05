import { useGsapScroll, useGsapStagger } from '@/hooks/useGsapScroll';
import LottieAccent from './LottieAccent';
import { useCmsTable, type TokenTier } from '@/hooks/useCmsContent';
import tokensImage from '@/assets/kawaii-art/store_philosophy.png';
import animalsImage from '@/assets/kawaii-art/community_partner-with-us.png';

const fallbackTiers = [
  { price: '$10', tokens: '10', bonus: '—', is_highlight: false },
  { price: '$30', tokens: '30 + 5', bonus: '16%', is_highlight: false },
  { price: '$50', tokens: '50 + 10', bonus: '20%', is_highlight: false },
  { price: '$100', tokens: '100 + 25', bonus: '25%', is_highlight: true },
  { price: '$250', tokens: '250 + 75', bonus: '30%', is_highlight: false },
];

const KawaiiTokenPrices = () => {
  const headerRef = useGsapScroll<HTMLDivElement>({ type: 'slideUp' });
  const coinRef = useGsapScroll<HTMLImageElement>({ type: 'slideLeft', distance: 80, duration: 1.2 });
  const tableRef = useGsapStagger<HTMLDivElement>({ type: 'slideRight', stagger: 0.1, distance: 40 });
  const animalsRef = useGsapScroll<HTMLImageElement>({ type: 'slideRight', distance: 80, duration: 1.2, delay: 0.2 });

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

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-5xl mx-auto">
          <img
            ref={coinRef}
            src={tokensImage}
            alt="Stack of Klawsome tokens"
            className="w-40 lg:w-52 object-contain will-change-transform"
            loading="lazy"
            style={{ opacity: 0 }}
          />

          <div ref={tableRef} className="flex-1 w-full max-w-lg">
            <div className="grid grid-cols-3 gap-px text-center font-heading font-bold text-white/40 text-xs tracking-wider uppercase mb-4" style={{ opacity: 0 }}>
              <span>Price</span>
              <span>Tokens</span>
              <span>Bonus</span>
            </div>
            {tiers.map((tier: any) => (
              <div
                key={tier.price}
                className={`grid grid-cols-3 gap-px text-center py-4 border-t border-white/10 font-body ${
                  tier.is_highlight
                    ? 'bg-klawsome-yellow/15 border border-klawsome-yellow/30 rounded-xl text-klawsome-yellow font-bold'
                    : 'text-white'
                }`}
                style={{ opacity: 0 }}
              >
                <span className="font-heading font-bold text-lg">{tier.price}</span>
                <span>{tier.tokens}</span>
                <span>{tier.bonus}</span>
              </div>
            ))}
            {tiers.some((t: any) => t.is_highlight) && (
              <p className="text-klawsome-yellow/60 text-xs font-body text-center mt-4">⭐ Top Pick — Best value!</p>
            )}
          </div>

          <img
            ref={animalsRef}
            src={animalsImage}
            alt="Klawsome kawaii animals"
            className="w-40 lg:w-52 object-contain hidden lg:block will-change-transform"
            loading="lazy"
            style={{ opacity: 0 }}
          />
        </div>
      </div>
    </section>
  );
};

export default KawaiiTokenPrices;

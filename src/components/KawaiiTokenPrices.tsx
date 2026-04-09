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
  const coinRef = useGsapScroll<HTMLImageElement>({ type: 'slideLeft', distance: 80, duration: 1.2 });
  const tableRef = useGsapStagger<HTMLDivElement>({ type: 'slideRight', stagger: 0.1, distance: 40 });
  const animalsRef = useGsapScroll<HTMLImageElement>({ type: 'slideRight', distance: 80, duration: 1.2, delay: 0.2 });
  const catRef = useGsapScroll<HTMLImageElement>({ type: 'parallax', scrub: 1, parallaxSpeed: 0.2, start: 'top bottom', end: 'bottom top' });

  const { data: dbTiers } = useCmsTable<TokenTier>('token_tiers');
  const tiers = dbTiers && dbTiers.length > 0 ? dbTiers : fallbackTiers;

  return (
    <section id="tokens" className="py-20 px-4 bg-klawsome-navy relative overflow-hidden">
      <img
        ref={catRef}
        src="https://images.squarespace-cdn.com/content/679927505e618d391ae386e6/4cbcbf12-71e1-4365-b552-c20f2d2c949d/Klawsome_cat.png?content-type=image%2Fpng"
        alt=""
        className="absolute right-0 top-0 h-64 opacity-30 pointer-events-none will-change-transform"
        loading="lazy"
      />

      <LottieAccent type="star" className="absolute bottom-12 left-6 opacity-30" size={80} />

      <div className="container mx-auto relative z-10">
        <div ref={headerRef} className="text-center mb-12" style={{ opacity: 0 }}>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Token Prices
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl mx-auto">
          <img
            ref={coinRef}
            src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/ef608b3b-4731-45e2-a37e-250a45e15d52/coinstack-klawsome.png"
            alt="Stack of Klawsome tokens"
            className="w-48 md:w-56 object-contain will-change-transform"
            loading="lazy"
            style={{ opacity: 0 }}
          />

          <div ref={tableRef} className="flex-1 w-full max-w-lg">
            <div className="grid grid-cols-3 gap-px text-center font-heading font-bold text-white/60 text-sm mb-2" style={{ opacity: 0 }}>
              <span>Price</span>
              <span>Tokens</span>
              <span>Bonus</span>
            </div>
            {tiers.map((tier: any) => (
              <div
                key={tier.price}
                className={`grid grid-cols-3 gap-px text-center py-3 border-t border-white/10 font-body ${
                  tier.is_highlight
                    ? 'bg-klawsome-yellow/20 border border-klawsome-yellow/40 rounded-lg text-klawsome-yellow font-bold glow-hover glow-yellow'
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
              <p className="text-klawsome-yellow/70 text-xs font-body text-center mt-3">⭐ Top Pick — Best value!</p>
            )}
          </div>

          <img
            ref={animalsRef}
            src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/b3785d35-704f-459b-be7a-69ddb204602a/klawsome+animals.png"
            alt="Klawsome kawaii animals"
            className="w-48 md:w-56 object-contain hidden md:block will-change-transform"
            loading="lazy"
            style={{ opacity: 0 }}
          />
        </div>
      </div>
    </section>
  );
};

export default KawaiiTokenPrices;

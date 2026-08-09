import { useGsapScroll, useGsapStagger } from '@/hooks/useGsapScroll';
import { useCmsTable, type TokenTier } from '@/hooks/useCmsContent';
import topPickGif from '@/assets/klawsome-top-pick.gif.asset.json';
import coinstackImg from '@/assets/coinstack-klawsome.png.asset.json';

const fallbackTiers = [
  { price: '$10', tokens: '10', bonus: '-', is_highlight: false },
  { price: '$30', tokens: '30 + 5', bonus: '16%', is_highlight: false },
  { price: '$50', tokens: '50 + 10', bonus: '20%', is_highlight: false },
  { price: '$100', tokens: '100 + 25', bonus: '25%', is_highlight: true },
    { price: '$249', tokens: '250 + 75', bonus: '30%', is_highlight: false },
];

const KawaiiTokenPrices = () => {
  const headerRef = useGsapScroll<HTMLDivElement>({ type: 'slideUp' });
  const tableRef = useGsapStagger<HTMLDivElement>({ type: 'slideUp', stagger: 0.08, distance: 40 });

  const { data: dbTiers } = useCmsTable<TokenTier>('token_tiers');
  const tiers = dbTiers && dbTiers.length > 0 ? dbTiers : fallbackTiers;

  return (
    <section
      id="tokens"
      className="section-y section-x relative overflow-hidden"
      style={{ backgroundColor: 'hsl(var(--klawsome-baby-blue))' }}
    >
      <div className="ds-container relative z-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center max-w-6xl mx-auto">
          {/* Pink card: title + characters */}
          <div
            ref={headerRef}
            className="md:col-span-5 rounded-kawaii p-6 md:p-8 text-center"
            style={{ opacity: 0, backgroundColor: 'hsl(var(--klawsome-baby-pink))' }}
          >
            <h2 className="ds-h2 ds-stroke ds-stroke--red leading-tight">
              Token<br />Prices
            </h2>
            <img
              src={coinstackImg.url}
              alt="Klawsome token coins with characters"
              loading="lazy"
              className="w-3/5 h-auto mt-4 mx-auto"
            />
          </div>

          <div ref={tableRef} className="md:col-span-7 w-full">
            <div
              className="grid grid-cols-3 text-center font-heading font-bold text-klawsome-navy text-3xl md:text-4xl pb-5 border-b-2 border-klawsome-navy/25"
              style={{ opacity: 0 }}
            >
              <span>Price</span>
              <span>Tokens</span>
              <span>Bonus</span>
            </div>
            {tiers.map((tier: any) => (
              <div key={tier.price} className="relative" style={{ opacity: 0 }}>
                <div
                  className={`grid grid-cols-3 text-center items-center py-4 md:py-5 font-heading font-bold text-2xl md:text-3xl text-klawsome-navy ${
                    tier.is_highlight ? 'bg-klawsome-yellow/45 rounded-xl my-1' : ''
                  }`}
                >
                  <span>{tier.price}</span>
                  <span>{tier.tokens}</span>
                  <span className={tier.bonus === '—' || tier.bonus === '-' ? '' : 'text-klawsome-navy/45'}>
                    {tier.bonus}
                  </span>
                </div>

                {tier.is_highlight && (
                  <div className="absolute top-1/2 -translate-y-1/2 -right-6 md:-right-10 pointer-events-none hidden md:block">
                    <img
                      src={topPickGif.url}
                      alt="Top pick"
                      loading="lazy"
                      className="w-28 h-28 md:w-32 md:h-32 object-contain"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KawaiiTokenPrices;
import { useGsapScroll, useGsapStagger } from '@/hooks/useGsapScroll';
import { useCmsTable, type TokenTier } from '@/hooks/useCmsContent';

const fallbackTiers = [
  { price: '$10', tokens: '10', bonus: '—', is_highlight: false },
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
              src="https://nrxfzjysodxqmwsstcim.supabase.co/storage/v1/object/public/site-images/transparent-png/panda-cat-fox-vending-machine-toys.webp"
              alt="Klawsome characters with tokens"
              loading="lazy"
              className="w-full h-auto mt-4"
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
                  <div className="absolute top-1/2 -translate-y-1/2 -right-6 md:-right-10 pointer-events-none">
                    <div className="relative w-24 h-24 md:w-28 md:h-28 animate-[spin_18s_linear_infinite]">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path
                          d="M50 2 L59 26 L80 12 L74 36 L98 34 L80 50 L98 66 L74 64 L80 88 L59 74 L50 98 L41 74 L20 88 L26 64 L2 66 L20 50 L2 34 L26 36 L20 12 L41 26 Z"
                          fill="hsl(var(--klawsome-yellow))"
                        />
                      </svg>
                    </div>
                    <span className="absolute inset-0 flex flex-col items-center justify-center font-heading font-bold text-klawsome-navy text-base md:text-lg leading-none text-center">
                      TOP<br />PICK
                    </span>
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
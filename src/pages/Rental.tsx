import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import PageHero from '@/components/PageHero';
import DynamicSections from '@/components/DynamicSections';
import KawaiiDivider from '@/components/KawaiiDivider';
import { usePageHero, useCmsTable } from '@/hooks/useCmsContent';

interface RentalPackage {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  cta_text: string;
  cta_url: string;
  is_highlight: boolean;
  sort_order: number;
}

const Rental = () => {
  const { data: hero } = usePageHero('rental');
  const { data: packages } = useCmsTable<RentalPackage>('rental_packages');

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      <PageHero
        eyebrow={hero?.eyebrow || 'Rental'}
        title={hero?.title || 'Make Your Event Unforgettable'}
        subtitle={hero?.subtitle}
        imageUrl={hero?.image_url || ''}
      />

      {packages && packages.length > 0 && (
        <>
        <KawaiiDivider variant="wave" from="white" to="secondary-soft" stroke="baby-blue" height={90} />
        <section className="section-y section-x bg-secondary/50">
          <div className="ds-container">
            <div className="max-w-2xl mb-16">
              <p className="ds-eyebrow">Choose Your Package</p>
              <h2 className="ds-h2 mb-6">Pricing that fits every event</h2>
              <p className="ds-lead">
                From small parties to full buyouts, pick the package that matches your day.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((p) => (
                <div
                  key={p.id}
                  className={`flex flex-col rounded-2xl p-8 ${
                    p.is_highlight
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border'
                  }`}
                >
                  <h3 className="ds-h3 mb-2">{p.name}</h3>
                  <p className="text-4xl font-heading font-bold mb-4 leading-none">
                    {p.price}
                  </p>
                  <p
                    className={`text-sm font-body mb-6 ${
                      p.is_highlight ? 'text-primary-foreground/85' : 'text-muted-foreground'
                    }`}
                  >
                    {p.description}
                  </p>
                  <ul
                    className={`space-y-3 text-sm font-body flex-1 border-t pt-6 ${
                      p.is_highlight
                        ? 'border-primary-foreground/30 text-primary-foreground/90'
                        : 'border-border text-foreground/80'
                    }`}
                  >
                    {(p.features || []).map((f, i) => (
                      <li key={i} className="flex gap-3">
                        <span className={p.is_highlight ? 'text-primary-foreground' : 'text-primary'}>✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {p.cta_text && (
                    <a
                      href={p.cta_url || '#scheduling'}
                      className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full font-heading font-bold text-xs uppercase tracking-wider px-6 py-3 transition-colors ${
                        p.is_highlight
                          ? 'bg-background text-foreground hover:bg-background/90'
                          : 'bg-foreground text-background hover:bg-foreground/90'
                      }`}
                    >
                      {p.cta_text}
                      <span>→</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        <KawaiiDivider variant="scallop" from="secondary-soft" to="white" stroke="baby-pink" height={90} />
        </>
      )}

      <DynamicSections pageKey="rental" />
      <KawaiiFooter />
    </div>
  );
};

export default Rental;
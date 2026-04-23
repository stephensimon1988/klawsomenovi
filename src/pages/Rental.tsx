import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import PageHero from '@/components/PageHero';
import DynamicSections from '@/components/DynamicSections';
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
        <section className="section-y section-x bg-secondary/30">
          <div className="ds-container">
            <p className="ds-eyebrow text-center">Choose Your Package</p>
            <h2 className="ds-h2 text-center mb-12">Pricing That Fits Every Event</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((p) => (
                <div
                  key={p.id}
                  className={`rounded-2xl border p-8 bg-background flex flex-col ${
                    p.is_highlight ? 'border-primary shadow-lg' : 'border-border'
                  }`}
                >
                  <h3 className="ds-h3 mb-2">{p.name}</h3>
                  <p className="text-3xl font-heading font-bold text-primary mb-3">{p.price}</p>
                  <p className="text-sm text-muted-foreground font-body mb-5">{p.description}</p>
                  <ul className="space-y-2 text-sm font-body text-foreground/80 flex-1">
                    {(p.features || []).map((f, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {p.cta_text && (
                    <a
                      href={p.cta_url || '#scheduling'}
                      className="mt-6 block text-center rounded-full bg-primary text-white font-heading font-bold text-xs tracking-wider px-6 py-3 hover:bg-primary/90"
                    >
                      {p.cta_text}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <DynamicSections pageKey="rental" />
      <KawaiiFooter />
    </div>
  );
};

export default Rental;
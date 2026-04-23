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
        <section className="section-y section-x bg-foreground text-background">
          <div className="ds-container">
            <div className="flex items-baseline gap-6 mb-12">
              <span className="font-heading font-bold text-2xl text-background/60 tabular-nums">
                {String(packages.length).padStart(2, '0')}
              </span>
              <span className="flex-1 h-px bg-background/20" />
              <p className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-background/70">
                Choose Your Package
              </p>
            </div>
            <h2 className="font-heading font-bold uppercase leading-[0.95] tracking-tight text-[clamp(2.5rem,6vw,5rem)] mb-16 max-w-4xl">
              Pricing That Fits Every Event
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-background/15 rounded-3xl overflow-hidden">
              {packages.map((p) => (
                <div
                  key={p.id}
                  className={`p-8 flex flex-col ${
                    p.is_highlight
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-foreground text-background'
                  }`}
                >
                  <h3 className="font-heading font-bold uppercase text-2xl mb-3">{p.name}</h3>
                  <p className="text-5xl font-heading font-bold mb-4 leading-none">{p.price}</p>
                  <p
                    className={`text-sm font-body mb-6 ${
                      p.is_highlight ? 'text-primary-foreground/80' : 'text-background/70'
                    }`}
                  >
                    {p.description}
                  </p>
                  <ul
                    className={`space-y-3 text-sm font-body flex-1 border-t pt-6 ${
                      p.is_highlight
                        ? 'border-primary-foreground/30 text-primary-foreground/90'
                        : 'border-background/15 text-background/85'
                    }`}
                  >
                    {(p.features || []).map((f, i) => (
                      <li key={i} className="flex gap-3">
                        <span className={p.is_highlight ? 'text-primary-foreground' : 'text-background/60'}>→</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {p.cta_text && (
                    <a
                      href={p.cta_url || '#scheduling'}
                      className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full font-heading font-bold text-xs uppercase tracking-[0.2em] px-6 py-4 transition-all ${
                        p.is_highlight
                          ? 'bg-background text-foreground hover:bg-background/90'
                          : 'bg-background text-foreground hover:bg-primary hover:text-primary-foreground'
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
      )}

      <DynamicSections pageKey="rental" />
      <KawaiiFooter />
    </div>
  );
};

export default Rental;
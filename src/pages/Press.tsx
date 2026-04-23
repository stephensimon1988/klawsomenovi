import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import PageHero from '@/components/PageHero';
import { usePageHero, useCmsTable } from '@/hooks/useCmsContent';

interface PressArticle {
  id: string;
  title: string;
  outlet: string;
  excerpt: string;
  url: string;
  image_url: string;
  date: string;
  sort_order: number;
}

const Press = () => {
  const { data: hero } = usePageHero('press');
  const { data: articles } = useCmsTable<PressArticle>('press_articles');

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      <PageHero
        eyebrow={hero?.eyebrow || 'Press'}
        title={hero?.title || 'Klawsome in the News'}
        subtitle={hero?.subtitle}
        imageUrl={hero?.image_url || ''}
      />
      <section className="section-y section-x">
        <div className="ds-container">
          <div className="flex items-baseline gap-6 mb-16">
            <span className="font-heading font-bold text-2xl text-primary tabular-nums">
              {String((articles || []).length).padStart(2, '0')}
            </span>
            <span className="flex-1 h-px bg-foreground/15" />
            <p className="ds-eyebrow !mb-0">Featured Coverage</p>
          </div>
          <div className="divide-y divide-foreground/10 border-y border-foreground/10">
            {(articles || []).map((a, idx) => {
              const Wrapper = a.url ? 'a' : 'div';
              const props = a.url ? { href: a.url, target: '_blank', rel: 'noopener noreferrer' } : {};
              return (
                <Wrapper
                  key={a.id}
                  {...props}
                  className="group grid grid-cols-12 gap-6 py-8 md:py-12 items-baseline hover:bg-secondary/30 transition-colors px-2 md:px-4"
                >
                  <span className="col-span-1 font-heading font-bold tabular-nums text-primary text-sm md:text-base pt-2">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="col-span-11 md:col-span-3">
                    {a.outlet && (
                      <p className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-foreground/60">
                        {a.outlet}
                      </p>
                    )}
                    {a.date && (
                      <p className="text-xs text-muted-foreground font-body mt-2">{a.date}</p>
                    )}
                  </div>
                  <div className="col-start-2 col-span-11 md:col-start-5 md:col-span-7">
                    <h3 className="font-heading font-bold uppercase leading-[1.05] text-2xl md:text-4xl mb-3 group-hover:text-primary transition-colors">
                      {a.title}
                      {a.url && (
                        <span className="inline-block ml-3 transition-transform group-hover:translate-x-1">→</span>
                      )}
                    </h3>
                    {a.excerpt && (
                      <p className="text-base font-body text-foreground/70 max-w-2xl">
                        {a.excerpt}
                      </p>
                    )}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>
      <KawaiiFooter />
    </div>
  );
};

export default Press;
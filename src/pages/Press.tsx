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
          <div className="max-w-2xl mb-16">
            <p className="ds-eyebrow">Featured Coverage</p>
            <h2 className="ds-h2">In the spotlight</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {(articles || []).map((a) => {
              const Wrapper = a.url ? 'a' : 'div';
              const props = a.url ? { href: a.url, target: '_blank', rel: 'noopener noreferrer' } : {};
              return (
                <Wrapper
                  key={a.id}
                  {...props}
                  className="group flex flex-col rounded-2xl bg-secondary/40 p-8 hover:bg-secondary/60 transition-colors"
                >
                  {a.outlet && <p className="ds-eyebrow">{a.outlet}</p>}
                  <h3 className="ds-h3 mb-3 group-hover:text-primary transition-colors">
                    {a.title}
                  </h3>
                  {a.excerpt && (
                    <p className="ds-body mb-4">{a.excerpt}</p>
                  )}
                  {a.date && (
                    <p className="text-xs text-muted-foreground font-body mt-auto pt-2">{a.date}</p>
                  )}
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
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(articles || []).map((a) => {
              const Wrapper = a.url ? 'a' : 'div';
              const props = a.url ? { href: a.url, target: '_blank', rel: 'noopener noreferrer' } : {};
              return (
                <Wrapper
                  key={a.id}
                  {...props}
                  className="block rounded-2xl border border-border bg-background p-8 hover:shadow-lg transition-shadow"
                >
                  {a.outlet && <p className="ds-eyebrow">{a.outlet}</p>}
                  <h3 className="ds-h3 mb-3">{a.title}</h3>
                  {a.excerpt && <p className="text-sm font-body text-foreground/70">{a.excerpt}</p>}
                  {a.date && <p className="text-xs text-muted-foreground font-body mt-3">{a.date}</p>}
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
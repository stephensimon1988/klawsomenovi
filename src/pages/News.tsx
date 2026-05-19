import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import { useCmsTable, usePageHero, type NewsArticle } from '@/hooks/useCmsContent';
import PageHero from '@/components/PageHero';

const fallbackArticles = [
  { image_url: 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/da23b372-138d-4c18-977f-8db39f1cd16a/klawsome+littleguidedetroit.webp', title: "Check Out Klawsome In Novi – Michigan's Only Stand-Alone Claw Machine Arcade", source: 'Little Guide Detroit', date: 'August 28th, 2025', url: 'https://littleguidedetroit.com/check-out-klawsome-in-novi-michigans-only-stand-alone-claw-machine-arcade/' },
];

const News = () => {
  const { data: dbArticles } = useCmsTable<NewsArticle>('news_articles');
  const { data: hero } = usePageHero('news');
  const articles = dbArticles && dbArticles.length > 0 ? dbArticles : fallbackArticles;

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />

      <PageHero
        eyebrow={hero?.eyebrow || 'Press'}
        title={hero?.title || 'News'}
        subtitle={hero?.subtitle || 'See what people are saying about us.'}
        imageUrl={hero?.image_url || 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/21f62e3c-4e42-4460-ad61-8959feae0a54/AgnesMichal_CandidClapping.webp'}
      >
        <img
          src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/5634d99f-8f37-4229-a409-dfbb9b66697c/As+Seen+On.webp"
          alt="As seen on Michigan Mama News, Hour Detroit, Little Guide, Hometown Life"
          className="max-w-sm w-full mt-4 mb-8 md:mb-10"
          loading="lazy"
        />
      </PageHero>

      {/* Article grid */}
      <section className="section-y section-x">
        <div className="ds-container">
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article: any) => (
              <a
                key={article.url}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl overflow-hidden bg-background border border-border hover:shadow-lg transition-all flex flex-col"
              >
                <div className="img-hover">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="ds-img-card"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="ds-h3 text-lg mb-2">{article.title}</h3>
                  {article.source && <p className="text-muted-foreground text-xs font-body mb-3">{article.source} · {article.date}</p>}
                  <span className="text-primary text-sm font-heading font-bold tracking-wider uppercase">Read More →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <KawaiiFooter />
    </div>
  );
};

export default News;

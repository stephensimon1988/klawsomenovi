import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import { useCmsTable, type NewsArticle } from '@/hooks/useCmsContent';

const fallbackArticles = [
  { image_url: 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/da23b372-138d-4c18-977f-8db39f1cd16a/klawsome+littleguidedetroit.jpg', title: "Check Out Klawsome In Novi – Michigan's Only Stand-Alone Claw Machine Arcade", source: 'Little Guide Detroit', date: 'August 28th, 2025', url: 'https://littleguidedetroit.com/check-out-klawsome-in-novi-michigans-only-stand-alone-claw-machine-arcade/' },
];

const News = () => {
  const { data: dbArticles } = useCmsTable<NewsArticle>('news_articles');
  const articles = dbArticles && dbArticles.length > 0 ? dbArticles : fallbackArticles;

  return (
    <div className="min-h-screen bg-klawsome-navy">
      <KawaiiNav />

      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/1f9d4fe0-5f54-4077-be1b-a5c20318ebbe/klawsome+in+the+news.webp')` }}
        />
        <div className="absolute inset-0 bg-klawsome-navy/60" />
        <div className="relative z-10 text-center px-4">
          <img
            src="https://images.squarespace-cdn.com/content/679927505e618d391ae386e6/8c57b6f1-0c08-4d2f-bb04-e54051ae7f0b/Klawsome_Fox__CUT.png?content-type=image%2Fpng"
            alt="Klawsome Fox"
            className="w-24 mx-auto mb-4"
          />
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4">In The News</h1>
          <p className="text-white/70 font-body text-lg max-w-xl mx-auto">
            See what local news outlets and community voices are saying about us!
          </p>
          <img
            src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/5634d99f-8f37-4229-a409-dfbb9b66697c/As+Seen+On.png"
            alt="As seen on Michigan Mama News, Hour Detroit, Little Guide, Hometown Life"
            className="max-w-md mx-auto w-full mt-8"
            loading="lazy"
          />
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article: any) => (
              <a
                key={article.url}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-kawaii overflow-hidden bg-white/10 border border-white/20 hover:border-white/40 transition-all hover:shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-white text-sm leading-snug mb-2">{article.title}</h3>
                  {article.source && <p className="text-white/50 text-xs font-body italic mb-2">{article.source} · {article.date}</p>}
                  <span className="text-primary text-sm font-heading font-semibold">Read Here →</span>
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

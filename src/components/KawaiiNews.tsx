import { useGsapScroll, useGsapStagger } from '@/hooks/useGsapScroll';
import { useCmsTable, type NewsArticle } from '@/hooks/useCmsContent';

const fallbackArticles = [
  {
    image_url: 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/da23b372-138d-4c18-977f-8db39f1cd16a/klawsome+littleguidedetroit.jpg',
    title: "Check Out Klawsome In Novi – Michigan's Only Stand-Alone Claw Machine Arcade",
    url: 'https://littleguidedetroit.com/check-out-klawsome-in-novi-michigans-only-stand-alone-claw-machine-arcade/',
  },
  {
    image_url: 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/cf98d1f2-1b98-49e2-953a-6784766e898d/klawsome+hourdetroit.png',
    title: "Klawsome! Sakura Novi Kicks Off with Michigan's First 'Clawcade'",
    url: 'https://www.hourdetroit.com/development-topics/klawsome-sakura-novi-kicks-off-with-michigans-first-clawcade/',
  },
  {
    image_url: 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/f02582ee-95a6-4fb9-bf08-3ac93e6b9861/PXL_20250822_201918587.jpg',
    title: 'Sakura Novi Launches with the Grand Opening of Klawsome!',
    url: 'https://michiganmamanews.com/2025/08/28/sakura-novi-launches-with-the-grand-opening-of-klawsome-on-friday-august-29/',
  },
];

const KawaiiNews = () => {
  const headerRef = useGsapScroll<HTMLDivElement>({ type: 'slideUp' });
  const gridRef = useGsapStagger<HTMLDivElement>({ type: 'slideUp', stagger: 0.15, distance: 50 });
  const { data: dbArticles } = useCmsTable<NewsArticle>('news_articles');
  const articles = dbArticles && dbArticles.length > 0 ? dbArticles : fallbackArticles;

  return (
    <section id="news" className="py-28 px-6 lg:px-12 bg-secondary/50">
      <div className="container mx-auto">
        <div ref={headerRef} className="max-w-2xl mb-16" style={{ opacity: 0 }}>
          <p className="text-xs font-heading font-bold text-primary uppercase tracking-[0.2em] mb-4">Press</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight mb-6">
            In The News
          </h2>
          <img
            src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/5634d99f-8f37-4229-a409-dfbb9b66697c/As+Seen+On.png"
            alt="As seen on Michigan Mama News, Hour Detroit, Little Guide, Hometown Life"
            className="max-w-sm w-full"
            loading="lazy"
          />
        </div>

        <div ref={gridRef} className="grid md:grid-cols-3 gap-8 max-w-6xl">
          {articles.slice(0, 3).map((article: any) => (
            <a
              key={article.url}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl overflow-hidden bg-background border border-border hover:shadow-lg transition-all glow-hover glow-pink"
              style={{ opacity: 0 }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-foreground leading-snug mb-3">{article.title}</h3>
                <span className="text-primary text-sm font-heading font-bold tracking-wider uppercase">Read More →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KawaiiNews;

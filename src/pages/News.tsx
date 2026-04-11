import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import SectionWrapper from '@/components/SectionWrapper';
import CustomBlock from '@/components/CustomBlock';
import { useCmsTable, usePageSections, type NewsArticle, type PageSection } from '@/hooks/useCmsContent';

const fallbackArticles = [
  { image_url: 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/da23b372-138d-4c18-977f-8db39f1cd16a/klawsome+littleguidedetroit.jpg', title: "Check Out Klawsome In Novi – Michigan's Only Stand-Alone Claw Machine Arcade", source: 'Little Guide Detroit', date: 'August 28th, 2025', url: 'https://littleguidedetroit.com/check-out-klawsome-in-novi-michigans-only-stand-alone-claw-machine-arcade/' },
];

const FALLBACK_SECTIONS: PageSection[] = [
  { id: 'f1', page: 'news', section_key: 'hero', label: 'Hero', sort_order: 1, is_visible: true, section_height: '70vh', wrapper_max_width: 'full', padding_y: '0', bg_color: '', bg_image_url: '', custom_css_class: '' },
  { id: 'f2', page: 'news', section_key: 'articles', label: 'Articles', sort_order: 2, is_visible: true, section_height: 'auto', wrapper_max_width: '1200px', padding_y: '7rem', bg_color: '', bg_image_url: '', custom_css_class: '' },
];

const NewsHero = () => (
  <section className="relative min-h-[70vh] flex items-end overflow-hidden">
    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/1f9d4fe0-5f54-4077-be1b-a5c20318ebbe/klawsome+in+the+news.webp')` }} />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
    <div className="relative z-10 container mx-auto px-6 lg:px-12 pb-20 pt-32">
      <div className="max-w-2xl">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white uppercase leading-[0.95] mb-6">NEWS</h1>
        <p className="text-white/70 font-body text-lg max-w-xl">See what local news outlets and community voices are saying about us!</p>
        <img src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/5634d99f-8f37-4229-a409-dfbb9b66697c/As+Seen+On.png" alt="As seen on" className="max-w-sm w-full mt-8" loading="lazy" />
      </div>
    </div>
  </section>
);

const NewsArticles = () => {
  const { data: dbArticles } = useCmsTable<NewsArticle>('news_articles');
  const articles = dbArticles && dbArticles.length > 0 ? dbArticles : fallbackArticles;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {articles.map((article: any) => (
        <a key={article.url} href={article.url} target="_blank" rel="noopener noreferrer" className="group block rounded-2xl overflow-hidden bg-background border border-border hover:shadow-lg transition-all">
          <div className="aspect-[4/3] overflow-hidden">
            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          </div>
          <div className="p-6">
            <h3 className="font-heading font-bold text-foreground leading-snug mb-2">{article.title}</h3>
            {article.source && <p className="text-muted-foreground text-xs font-body mb-3">{article.source} · {article.date}</p>}
            <span className="text-primary text-sm font-heading font-bold tracking-wider uppercase">Read More →</span>
          </div>
        </a>
      ))}
    </div>
  );
};

const SECTION_MAP: Record<string, React.ComponentType> = {
  hero: NewsHero,
  articles: NewsArticles,
};

const News = () => {
  const { data: sections } = usePageSections('news');
  const displaySections = sections && sections.length > 0 ? sections : FALLBACK_SECTIONS;

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      {displaySections.map((s) => {
        if (s.section_key.startsWith('custom:')) {
          return (
            <SectionWrapper key={s.id} config={s}>
              <CustomBlock blockKey={s.section_key.replace('custom:', '')} />
            </SectionWrapper>
          );
        }
        const Component = SECTION_MAP[s.section_key];
        if (!Component) return null;
        return (
          <SectionWrapper key={s.id} config={s} fullControl={s.section_key === 'hero'}>
            <Component />
          </SectionWrapper>
        );
      })}
      <KawaiiFooter />
    </div>
  );
};

export default News;

import { Button } from '@/components/ui/button';
import { useCmsTable } from '@/hooks/useCmsContent';
import type { SectionContentBlock, TokenTier, StoreHour, NewsArticle } from '@/hooks/useCmsContent';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { Star, StarHalf } from 'lucide-react';

interface DynamicSectionProps {
  sectionId: string;
  columns?: number;
  layoutJson?: Record<string, any>;
  sectionType?: 'hero' | 'section' | 'small';
}

/**
 * Priority-based rule engine: determines layout from block types + their order (priority).
 * Priority = row_order position. Lower = more prominent.
 */
const DynamicSection = ({ sectionId, sectionType = 'section' }: DynamicSectionProps) => {
  const { data: allBlocks } = useCmsTable<SectionContentBlock>('section_content_blocks');
  const blocks = (allBlocks || [])
    .filter(b => b.section_id === sectionId)
    .sort((a, b) => a.row_order - b.row_order);

  if (blocks.length === 0) return null;

  // Categorize blocks
  const headings = blocks.filter(b => b.block_type === 'heading');
  const texts = blocks.filter(b => b.block_type === 'richtext' || b.block_type === 'text');
  const images = blocks.filter(b => b.block_type === 'image');
  const videos = blocks.filter(b => b.block_type === 'video');
  const iframes = blocks.filter(b => b.block_type === 'iframe');
  const buttons = blocks.filter(b => b.block_type === 'button');
  const mediaBlocks = blocks.filter(b => ['image', 'video'].includes(b.block_type));
  const firstBlock = blocks[0];

  // Specialized block types — render dedicated widgets
  const specialBlocks = blocks.filter(b => ['pricing', 'hours', 'reviews', 'news', 'cards', 'faq', 'jobs', 'party_options', 'templates'].includes(b.block_type));
  if (specialBlocks.length > 0) {
    return (
      <div className="space-y-8">
        {blocks.map((b, i) => <BlockRenderer key={b.id} block={b} priority={i} />)}
      </div>
    );
  }

  // Rule 1: Image at priority 1 → Image-led hero
  if (firstBlock.block_type === 'image' && sectionType === 'hero') {
    return <ImageLedHero blocks={blocks} />;
  }

  // Rule 2: Has heading + text + 1 image → Hero Split
  if (headings.length > 0 && texts.length > 0 && images.length === 1) {
    return <HeroSplit blocks={blocks} />;
  }

  // Rule 3: Has heading + text + 2+ images → Text top, image grid below
  if ((headings.length > 0 || texts.length > 0) && images.length >= 2) {
    return <TextWithGallery blocks={blocks} />;
  }

  // Rule 4: Has video/iframe → Full-width embed
  if (videos.length > 0 || iframes.length > 0) {
    return <VideoEmbed blocks={blocks} />;
  }

  // Rule 5: Heading + button only → CTA strip
  if (headings.length > 0 && buttons.length > 0 && texts.length === 0 && mediaBlocks.length === 0) {
    return <CTAStrip blocks={blocks} />;
  }

  // Rule 6: 3+ text blocks → Card grid
  if (texts.length >= 3) {
    return <CardsLayout blocks={blocks} />;
  }

  // Rule 7: Everything else → Centered stack
  return <StackedLayout blocks={blocks} />;
};

// ─── Template: Image-Led Hero ───────────────────────────────
function ImageLedHero({ blocks }: { blocks: SectionContentBlock[] }) {
  const imageBlock = blocks[0];
  const rest = blocks.slice(1);
  const c = imageBlock.content || {};

  return (
    <div className="relative w-full h-full min-h-[50vh] flex items-center justify-center">
      <img src={c.url} alt={c.alt || ''} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center space-y-4 px-6 max-w-3xl">
        {rest.map(b => <BlockRenderer key={b.id} block={b} priority={blocks.indexOf(b)} />)}
      </div>
    </div>
  );
}

// ─── Template: Hero Split ───────────────────────────────────
function HeroSplit({ blocks }: { blocks: SectionContentBlock[] }) {
  const textBlocks = blocks.filter(b => !['image', 'video'].includes(b.block_type));
  const mediaBlocks = blocks.filter(b => ['image', 'video'].includes(b.block_type));

  const firstMedia = mediaBlocks[0];
  const firstText = textBlocks[0];
  const mediaFirst = firstMedia && firstText && blocks.indexOf(firstMedia) < blocks.indexOf(firstText);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
      <div className={`${mediaFirst ? 'md:col-span-7 order-1' : 'md:col-span-5 order-2 md:order-1'} space-y-4`}>
        {mediaFirst
          ? mediaBlocks.map((b, i) => <BlockRenderer key={b.id} block={b} priority={i} />)
          : textBlocks.map((b, i) => <BlockRenderer key={b.id} block={b} priority={i} />)
        }
      </div>
      <div className={`${mediaFirst ? 'md:col-span-5 order-2' : 'md:col-span-7 order-1 md:order-2'} space-y-4`}>
        {mediaFirst
          ? textBlocks.map((b, i) => <BlockRenderer key={b.id} block={b} priority={i} />)
          : mediaBlocks.map((b, i) => <BlockRenderer key={b.id} block={b} priority={i} />)
        }
      </div>
    </div>
  );
}

// ─── Template: Text + Gallery Grid ──────────────────────────
function TextWithGallery({ blocks }: { blocks: SectionContentBlock[] }) {
  const textBlocks = blocks.filter(b => !['image', 'video'].includes(b.block_type));
  const mediaBlocks = blocks.filter(b => ['image', 'video'].includes(b.block_type));
  const gridCols = mediaBlocks.length === 2 ? 'md:grid-cols-2'
    : mediaBlocks.length === 3 ? 'md:grid-cols-3'
    : 'md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className="space-y-8">
      {textBlocks.length > 0 && (
        <div className="max-w-2xl mx-auto text-center space-y-4">
          {textBlocks.map((b, i) => <BlockRenderer key={b.id} block={b} priority={i} />)}
        </div>
      )}
      <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
        {mediaBlocks.map((b, i) => <BlockRenderer key={b.id} block={b} priority={i} />)}
      </div>
    </div>
  );
}

// ─── Template: Video/Embed ──────────────────────────────────
function VideoEmbed({ blocks }: { blocks: SectionContentBlock[] }) {
  const textBlocks = blocks.filter(b => !['video', 'iframe', 'image'].includes(b.block_type));
  const embedBlocks = blocks.filter(b => ['video', 'iframe'].includes(b.block_type));
  const otherBlocks = blocks.filter(b => !textBlocks.includes(b) && !embedBlocks.includes(b));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {textBlocks.length > 0 && (
        <div className="text-center space-y-3">
          {textBlocks.map((b, i) => <BlockRenderer key={b.id} block={b} priority={i} />)}
        </div>
      )}
      {embedBlocks.map((b, i) => <BlockRenderer key={b.id} block={b} priority={i} />)}
      {otherBlocks.map((b, i) => <BlockRenderer key={b.id} block={b} priority={i} />)}
    </div>
  );
}

// ─── Template: CTA Strip ────────────────────────────────────
function CTAStrip({ blocks }: { blocks: SectionContentBlock[] }) {
  const headings = blocks.filter(b => b.block_type === 'heading');
  const buttons = blocks.filter(b => b.block_type === 'button');
  const others = blocks.filter(b => b.block_type !== 'heading' && b.block_type !== 'button');

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        {headings.map((b, i) => <BlockRenderer key={b.id} block={b} priority={i} />)}
        {others.map((b, i) => <BlockRenderer key={b.id} block={b} priority={i} />)}
      </div>
      <div className="flex gap-3">
        {buttons.map((b, i) => <BlockRenderer key={b.id} block={b} priority={i} />)}
      </div>
    </div>
  );
}

// ─── Template: Cards Grid ───────────────────────────────────
function CardsLayout({ blocks }: { blocks: SectionContentBlock[] }) {
  const headerBlocks = blocks.filter(b => b.block_type === 'heading');
  const cardBlocks = blocks.filter(b => b.block_type === 'richtext' || b.block_type === 'text');
  const others = blocks.filter(b => !['heading', 'richtext', 'text'].includes(b.block_type));
  const gridCols = cardBlocks.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className="space-y-8">
      {headerBlocks.length > 0 && (
        <div className="text-center">
          {headerBlocks.map((b, i) => <BlockRenderer key={b.id} block={b} priority={i} />)}
        </div>
      )}
      <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
        {cardBlocks.map((b, i) => (
          <div key={b.id} className={`bg-background/30 border border-border/30 rounded-2xl p-6 shadow-sm ${i === 0 ? 'md:col-span-1' : ''}`}>
            <BlockRenderer block={b} priority={i} />
          </div>
        ))}
      </div>
      {others.map((b, i) => <BlockRenderer key={b.id} block={b} priority={i} />)}
    </div>
  );
}

// ─── Template: Stacked (default) ────────────────────────────
function StackedLayout({ blocks }: { blocks: SectionContentBlock[] }) {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-5">
      {blocks.map((b, i) => <BlockRenderer key={b.id} block={b} priority={i} />)}
    </div>
  );
}

// ─── Specialized: Pricing Tiers ─────────────────────────────
function PricingWidget() {
  const { data: tiers } = useCmsTable<TokenTier>('token_tiers');
  if (!tiers || tiers.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tiers.map((tier) => (
        <div key={tier.id} className={`rounded-2xl p-6 text-center border transition-shadow hover:shadow-lg ${tier.is_highlight ? 'bg-primary/10 border-primary/30 ring-2 ring-primary/20' : 'bg-background border-border'}`}>
          <p className="font-heading font-bold text-lg text-foreground">{tier.tokens}</p>
          <p className="font-heading font-bold text-3xl text-primary my-2">{tier.price}</p>
          {tier.bonus && <p className="text-sm text-muted-foreground font-body">{tier.bonus}</p>}
          {tier.is_highlight && <span className="inline-block mt-2 text-xs font-heading font-bold text-primary bg-primary/10 rounded-full px-3 py-1">Top Pick</span>}
        </div>
      ))}
    </div>
  );
}

// ─── Specialized: Store Hours ───────────────────────────────
function HoursWidget() {
  const { data: hours } = useCmsTable<StoreHour>('store_hours');
  if (!hours || hours.length === 0) return null;

  return (
    <div className="space-y-2 max-w-md mx-auto">
      {hours.map((h) => (
        <div key={h.id} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
          <span className="font-heading font-bold text-sm text-foreground">{h.day_label}</span>
          <span className="text-muted-foreground font-body text-sm">
            {h.is_closed ? 'Closed' : `${h.open_time} – ${h.close_time}`}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Specialized: Google Reviews ────────────────────────────
function ReviewsWidget() {
  const [rating, setRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number | null>(null);

  useEffect(() => {
    supabase.functions.invoke('google-rating').then(({ data }) => {
      if (data?.rating) setRating(data.rating);
      if (data?.reviewCount) setReviewCount(data.reviewCount);
    });
  }, []);

  const fullStars = rating ? Math.floor(rating) : 0;
  const hasHalf = rating ? rating - fullStars >= 0.25 : false;

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-1">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={i} className="w-6 h-6 fill-primary text-primary" />
        ))}
        {hasHalf && <StarHalf className="w-6 h-6 fill-primary text-primary" />}
      </div>
      {rating && (
        <p className="font-heading font-bold text-foreground">
          {rating} out of 5 {reviewCount && `· ${reviewCount} reviews`}
        </p>
      )}
      <p className="text-muted-foreground font-body text-sm">Based on Google Reviews</p>
    </div>
  );
}

// ─── Specialized: News Articles ─────────────────────────────
function NewsWidget() {
  const { data: articles } = useCmsTable<NewsArticle>('news_articles');
  if (!articles || articles.length === 0) return null;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {articles.map((article) => (
        <a key={article.id} href={article.url} target="_blank" rel="noopener noreferrer" className="group block rounded-2xl overflow-hidden bg-background border border-border hover:shadow-lg transition-all">
          {article.image_url && (
            <div className="aspect-[4/3] overflow-hidden">
              <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
          )}
          <div className="p-6">
            <h3 className="font-heading font-bold text-foreground leading-snug mb-2">{article.title}</h3>
            {article.source && <p className="text-muted-foreground text-xs font-body mb-3">{article.source} · {article.date}</p>}
            <span className="text-primary text-sm font-heading font-bold tracking-wider uppercase">Read More →</span>
          </div>
        </a>
      ))}
    </div>
  );
}

// ─── Specialized: FAQ ───────────────────────────────────────
function FaqWidget({ page }: { page?: string }) {
  const { data: allFaqs } = useCmsTable<{ id: string; question: string; answer: string; page: string }>('faq_items');
  const faqs = page ? allFaqs?.filter(f => f.page === page) : allFaqs;
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-background p-6 md:p-8 max-w-3xl mx-auto">
      {faqs.map((item) => (
        <FaqAccordionItem key={item.id} q={item.question} a={item.answer} />
      ))}
    </div>
  );
}

function FaqAccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left">
        <span className="font-heading font-bold text-foreground text-sm md:text-base pr-4">{q}</span>
        <span className={`text-muted-foreground flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && <p className="text-muted-foreground font-body text-sm leading-relaxed pb-5">{a}</p>}
    </div>
  );
}

// ─── Specialized: Jobs ──────────────────────────────────────
function JobsWidget({ category }: { category?: string }) {
  const { data: allJobs } = useCmsTable<{ id: string; title: string; description: string | null; image_url: string | null; job_desc_url: string | null; apply_url: string | null; category: string }>('job_listings');
  const jobs = category ? allJobs?.filter(j => j.category === category) : allJobs;
  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="space-y-8">
      {jobs.map((job) => (
        <div key={job.id} className="rounded-2xl border border-border bg-background overflow-hidden md:flex hover:shadow-lg transition-shadow">
          {job.image_url && <img src={job.image_url} alt={job.title} className="w-full md:w-72 h-56 md:h-auto object-cover flex-shrink-0" loading="lazy" />}
          <div className="p-6 md:p-8 flex flex-col">
            <h3 className="font-heading font-bold text-xl text-foreground mb-3">{job.title}</h3>
            {job.description && <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6 flex-1">{job.description}</p>}
            <div className="flex gap-3">
              {job.job_desc_url && (
                <Button asChild className="rounded-full font-heading font-bold bg-secondary text-foreground hover:bg-secondary/80">
                  <a href={job.job_desc_url} target="_blank" rel="noopener noreferrer">View Job Description</a>
                </Button>
              )}
              {job.apply_url && (
                <Button asChild className="rounded-full font-heading font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
                  <a href={job.apply_url} target="_blank" rel="noopener noreferrer">Apply Here</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Specialized: Party Options ─────────────────────────────
function PartyOptionsWidget() {
  const { data: options } = useCmsTable<{ id: string; name: string; description: string | null; price: string | null; features: string[] | null }>('party_options');
  if (!options || options.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {options.map((opt) => (
        <div key={opt.id} className="rounded-2xl bg-background border border-border p-6 hover:shadow-lg transition-shadow">
          <h3 className="font-heading font-bold text-2xl text-foreground mb-3">{opt.name}</h3>
          {opt.description && <p className="text-muted-foreground font-body text-sm mb-3">{opt.description}</p>}
          {opt.features && opt.features.length > 0 && (
            <ul className="space-y-2 text-muted-foreground font-body text-sm mb-4">
              {opt.features.map((f, i) => <li key={i}>• {f}</li>)}
            </ul>
          )}
          {opt.price && <p className="font-heading font-bold text-foreground text-lg">{opt.price}</p>}
        </div>
      ))}
    </div>
  );
}

// ─── Specialized: Invite Templates ──────────────────────────
function TemplatesWidget() {
  const { data: templates } = useCmsTable<{ id: string; name: string; url: string; thumbnail_url: string | null }>('invite_templates');
  if (!templates || templates.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
      {templates.map((t) => (
        <a key={t.id} href={t.url} target="_blank" rel="noopener noreferrer" className="rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
          {t.thumbnail_url && <img src={t.thumbnail_url} alt={t.name} className="w-full" loading="lazy" />}
        </a>
      ))}
    </div>
  );
}

// ─── Universal Block Renderer (priority-aware sizing) ───────
function BlockRenderer({ block, priority = 0 }: { block: SectionContentBlock; priority?: number }) {
  const c = block.content || {};

  // Priority-based size classes
  const headingSize = priority <= 1
    ? 'text-4xl md:text-5xl lg:text-6xl'
    : priority <= 3
    ? 'text-3xl md:text-4xl'
    : 'text-2xl md:text-3xl';

  const textSize = priority <= 1 ? 'text-xl' : priority <= 3 ? 'text-lg' : 'text-base';

  switch (block.block_type) {
    case 'heading':
      return <h2 className={`${headingSize} font-heading font-bold leading-tight`}>{c.text}</h2>;

    case 'text':
      return <p className={`font-body ${textSize} leading-relaxed opacity-80`}>{c.text}</p>;

    case 'richtext':
      return (
        <div
          className={`font-body ${textSize} leading-relaxed prose prose-invert max-w-none [&_a]:text-primary [&_a]:underline`}
          dangerouslySetInnerHTML={{ __html: c.html || c.text || '' }}
        />
      );

    case 'image':
      return (
        <div className="overflow-hidden rounded-2xl">
          <img src={c.url} alt={c.alt || ''} className="w-full h-auto object-cover" loading="lazy" />
        </div>
      );

    case 'video':
      if (c.url?.includes('youtube') || c.url?.includes('youtu.be')) {
        const videoId = c.url.includes('youtu.be')
          ? c.url.split('/').pop()
          : new URL(c.url).searchParams.get('v');
        return (
          <div className="aspect-video rounded-2xl overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={c.alt || 'Video'}
            />
          </div>
        );
      }
      if (c.url?.includes('vimeo')) {
        const vimeoId = c.url.split('/').pop();
        return (
          <div className="aspect-video rounded-2xl overflow-hidden">
            <iframe src={`https://player.vimeo.com/video/${vimeoId}`} className="w-full h-full" allowFullScreen title={c.alt || 'Video'} />
          </div>
        );
      }
      return (
        <div className="aspect-video rounded-2xl overflow-hidden">
          <video src={c.url} controls className="w-full h-full object-cover" />
        </div>
      );

    case 'iframe':
      return (
        <div className="aspect-video rounded-2xl overflow-hidden border border-border/20">
          <iframe src={c.url} className="w-full h-full" title={c.title || 'Embedded content'} allowFullScreen />
        </div>
      );

    case 'code':
      return (
        <pre className="bg-background/80 border border-border/30 rounded-xl p-5 overflow-x-auto text-sm font-mono">
          <code>{c.code || c.text}</code>
        </pre>
      );

    case 'list':
      const items = c.items || [];
      return (
        <ul className={`list-disc list-inside space-y-2 ${textSize} font-body opacity-80`}>
          {items.map((item: string, i: number) => <li key={i}>{item}</li>)}
        </ul>
      );

    case 'divider':
      return <hr className="border-current opacity-20 my-4" />;

    case 'button':
      return (
        <Button asChild size="lg" className="rounded-full px-8 py-6 font-heading font-bold">
          <a href={c.url}>{c.text}</a>
        </Button>
      );

    case 'spacer':
      return <div style={{ height: c.height || '2rem' }} />;

    // ── Specialized block types ──
    case 'pricing':
      return <PricingWidget />;

    case 'hours':
      return <HoursWidget />;

    case 'reviews':
      return <ReviewsWidget />;

    case 'news':
      return <NewsWidget />;

    case 'faq':
      return <FaqWidget page={c.page} />;

    case 'jobs':
      return <JobsWidget category={c.category} />;

    case 'party_options':
      return <PartyOptionsWidget />;

    case 'templates':
      return <TemplatesWidget />;

    case 'cards':
      // Inline cards from content JSON
      const cardItems = c.items || [];
      const cols = cardItems.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';
      return (
        <div className={`grid grid-cols-1 ${cols} gap-6`}>
          {cardItems.map((card: { icon?: string; title?: string; description?: string }, i: number) => (
            <div key={i} className="rounded-2xl border border-border bg-background p-6 text-center hover:shadow-lg transition-shadow">
              {card.icon && <span className="text-3xl mb-3 block">{card.icon}</span>}
              {card.title && <h4 className="font-heading font-bold text-foreground mb-2">{card.title}</h4>}
              {card.description && <p className="text-muted-foreground font-body text-sm leading-snug">{card.description}</p>}
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}

export default DynamicSection;

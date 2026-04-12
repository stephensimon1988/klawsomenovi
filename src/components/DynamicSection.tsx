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
  layoutTemplate?: string;
}

// ─── Template Definitions ───────────────────────────────────
export const LAYOUT_TEMPLATES = {
  stacked: { label: '📄 Stacked', description: 'Centered heading + body + CTA, everything stacked vertically', preview: '/templates/stacked.png' },
  'split-left': { label: '◧ Split Left', description: 'Text on left, image/media on right (50/50)', preview: '/templates/split-left.png' },
  'split-right': { label: '◨ Split Right', description: 'Image/media on left, text on right (50/50)', preview: '/templates/split-right.png' },
  'card-grid': { label: '▦ Card Grid', description: 'Heading above, content in equal card grid below', preview: '/templates/card-grid.png' },
  'hero-cover': { label: '🖼 Hero Cover', description: 'Full-bleed background image with centered text overlay', preview: '/templates/hero-cover.png' },
  'cta-banner': { label: '📢 CTA Banner', description: 'Heading + buttons in a compact horizontal strip', preview: '/templates/cta-banner.png' },
  'feature-list': { label: '☰ Feature List', description: 'Icon + title + description rows, left-aligned', preview: '/templates/feature-list.png' },
  'pricing-grid': { label: '💰 Pricing Grid', description: 'Equal pricing/tier cards in a row', preview: '/templates/pricing-grid.png' },
} as const;

export type LayoutTemplateKey = keyof typeof LAYOUT_TEMPLATES;

// ─── Zone Classification ────────────────────────────────────
const HEADER_TYPES = new Set(['heading', 'text', 'richtext', 'list']);
const CTA_TYPES = new Set(['button']);
const MEDIA_TYPES = new Set(['image', 'video', 'iframe']);
const WIDGET_TYPES = new Set(['pricing', 'hours', 'reviews', 'news', 'cards', 'faq', 'jobs', 'party_options', 'templates', 'data_cards']);

// ─── Main Component ─────────────────────────────────────────
const DynamicSection = ({ sectionId, sectionType = 'section', layoutTemplate = 'stacked' }: DynamicSectionProps) => {
  const { data: allBlocks } = useCmsTable<SectionContentBlock>('section_content_blocks');
  const blocks = (allBlocks || [])
    .filter(b => b.section_id === sectionId)
    .sort((a, b) => a.row_order - b.row_order);

  if (blocks.length === 0) return null;

  const headerBlocks = blocks.filter(b => HEADER_TYPES.has(b.block_type));
  const ctaBlocks = blocks.filter(b => CTA_TYPES.has(b.block_type));
  const mediaBlocks = blocks.filter(b => MEDIA_TYPES.has(b.block_type));
  const widgetBlocks = blocks.filter(b => WIDGET_TYPES.has(b.block_type));
  const isHero = sectionType === 'hero';

  const template = layoutTemplate as LayoutTemplateKey;

  const allProps: TemplateProps = { headerBlocks, ctaBlocks, mediaBlocks, widgetBlocks, isHero };

  switch (template) {
    case 'hero-cover':
      return <HeroCoverTemplate {...allProps} />;
    case 'split-left':
      return <SplitTemplate {...allProps} mediaFirst={false} />;
    case 'split-right':
      return <SplitTemplate {...allProps} mediaFirst={true} />;
    case 'card-grid':
      return <CardGridTemplate {...allProps} blocks={blocks} />;
    case 'cta-banner':
      return <CTABannerTemplate {...allProps} />;
    case 'feature-list':
      return <FeatureListTemplate {...allProps} blocks={blocks} />;
    case 'pricing-grid':
      return <PricingGridTemplate {...allProps} />;
    case 'stacked':
    default:
      return <StackedTemplate {...allProps} />;
  }
};

// ═══════════════════════════════════════════════════════════
// TEMPLATE: Stacked (default)
// Centered heading → body → media → widgets → CTA
// ═══════════════════════════════════════════════════════════
function StackedTemplate({ headerBlocks, ctaBlocks, mediaBlocks, widgetBlocks, isHero }: TemplateProps) {
  return (
    <div className="space-y-10">
      {headerBlocks.length > 0 && (
        <div className="max-w-3xl mx-auto text-center space-y-4">
          {headerBlocks.map(b => <BlockRenderer key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
      {mediaBlocks.length > 0 && (
        <div className={autoGridCols(mediaBlocks.length)}>
          {mediaBlocks.map(b => <BlockRenderer key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
      {widgetBlocks.length > 0 && (
        <div className="space-y-8">
          {widgetBlocks.map(b => <BlockRenderer key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
      {ctaBlocks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {ctaBlocks.map(b => <BlockRenderer key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE: Hero Cover
// Full-bleed bg image with centered text overlay
// ═══════════════════════════════════════════════════════════
function HeroCoverTemplate({ headerBlocks, ctaBlocks, mediaBlocks, widgetBlocks }: TemplateProps) {
  const bgImage = mediaBlocks.find(b => b.block_type === 'image');
  const otherMedia = mediaBlocks.filter(b => b !== bgImage);

  return (
    <div className="relative min-h-[50vh] flex items-center justify-center">
      {bgImage && (
        <>
          <img src={(bgImage.content as any)?.url} alt={(bgImage.content as any)?.alt || 'Section image'} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/45" aria-hidden="true" />
        </>
      )}
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6 py-16">
        {headerBlocks.map(b => <BlockRenderer key={b.id} block={b} isHero={true} />)}
        {otherMedia.map(b => <BlockRenderer key={b.id} block={b} isHero={true} />)}
        {widgetBlocks.map(b => <BlockRenderer key={b.id} block={b} isHero={true} />)}
        {ctaBlocks.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {ctaBlocks.map(b => <BlockRenderer key={b.id} block={b} isHero={true} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE: Split (Left or Right)
// Two-column: text side + media side
// ═══════════════════════════════════════════════════════════
function SplitTemplate({ headerBlocks, ctaBlocks, mediaBlocks, widgetBlocks, mediaFirst, isHero }: TemplateProps & { mediaFirst: boolean }) {
  const textContent = (
    <div className="space-y-6 flex flex-col justify-center text-left">
      {headerBlocks.map(b => <BlockRenderer key={b.id} block={b} isHero={isHero} align="left" />)}
      {widgetBlocks.map(b => <BlockRenderer key={b.id} block={b} isHero={isHero} />)}
      {ctaBlocks.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {ctaBlocks.map(b => <BlockRenderer key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
    </div>
  );

  const mediaContent = (
    <div className="space-y-4">
      {mediaBlocks.length > 0
        ? mediaBlocks.map(b => <BlockRenderer key={b.id} block={b} isHero={isHero} />)
        : <div className="bg-muted/20 rounded-2xl aspect-[4/3]" />
      }
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      {mediaFirst ? (
        <>{mediaContent}{textContent}</>
      ) : (
        <>{textContent}{mediaContent}</>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE: Card Grid
// Heading on top, then equal cards below
// ═══════════════════════════════════════════════════════════
function CardGridTemplate({ headerBlocks, ctaBlocks, mediaBlocks, widgetBlocks, isHero, blocks }: TemplateProps & { blocks: SectionContentBlock[] }) {
  const contentBlocks = [...mediaBlocks, ...widgetBlocks];
  // For card grid, treat text blocks after the first heading as individual cards
  const headings = headerBlocks.filter(b => b.block_type === 'heading');
  const bodyBlocks = headerBlocks.filter(b => b.block_type !== 'heading');
  const cardBlocks = [...bodyBlocks, ...contentBlocks];
  const cols = cardBlocks.length <= 2 ? 'md:grid-cols-2' : cardBlocks.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className="space-y-10">
      {headings.length > 0 && (
        <div className="max-w-3xl mx-auto text-center space-y-4">
          {headings.map(b => <BlockRenderer key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
      {cardBlocks.length > 0 && (
        <div className={`grid grid-cols-1 ${cols} gap-6`}>
          {cardBlocks.map(b => (
            <div key={b.id} className="rounded-2xl border border-border bg-background/50 p-6 text-center hover:shadow-lg transition-shadow">
              <BlockRenderer block={b} isHero={false} />
            </div>
          ))}
        </div>
      )}
      {ctaBlocks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {ctaBlocks.map(b => <BlockRenderer key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE: CTA Banner
// Compact strip: heading + buttons side by side
// ═══════════════════════════════════════════════════════════
function CTABannerTemplate({ headerBlocks, ctaBlocks, isHero }: TemplateProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 py-4">
      <div className="text-center md:text-left space-y-2 flex-1">
        {headerBlocks.map(b => <BlockRenderer key={b.id} block={b} isHero={isHero} />)}
      </div>
      {ctaBlocks.length > 0 && (
        <div className="flex flex-wrap gap-3 flex-shrink-0">
          {ctaBlocks.map(b => <BlockRenderer key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE: Feature List
// Left-aligned rows with icon/title/description
// ═══════════════════════════════════════════════════════════
function FeatureListTemplate({ headerBlocks, ctaBlocks, blocks, isHero }: TemplateProps & { blocks: SectionContentBlock[] }) {
  const headings = headerBlocks.filter(b => b.block_type === 'heading');
  const bodyBlocks = headerBlocks.filter(b => b.block_type !== 'heading');

  return (
    <div className="space-y-10">
      {headings.length > 0 && (
        <div className="max-w-3xl mx-auto text-center space-y-4">
          {headings.map(b => <BlockRenderer key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
      {bodyBlocks.length > 0 && (
        <div className="max-w-2xl mx-auto space-y-6">
          {bodyBlocks.map(b => (
            <div key={b.id} className="flex gap-4 items-start text-left">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {bodyBlocks.indexOf(b) + 1}
              </div>
              <div className="flex-1">
                <BlockRenderer block={b} isHero={false} align="left" />
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Render any widget/media blocks */}
      {blocks.filter(b => !HEADER_TYPES.has(b.block_type) && !CTA_TYPES.has(b.block_type)).length > 0 && (
        <div className="space-y-8">
          {blocks.filter(b => !HEADER_TYPES.has(b.block_type) && !CTA_TYPES.has(b.block_type)).map(b => (
            <BlockRenderer key={b.id} block={b} isHero={isHero} />
          ))}
        </div>
      )}
      {ctaBlocks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {ctaBlocks.map(b => <BlockRenderer key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE: Pricing Grid
// Heading + equal pricing cards
// ═══════════════════════════════════════════════════════════
function PricingGridTemplate({ headerBlocks, ctaBlocks, widgetBlocks, isHero }: TemplateProps) {
  return (
    <div className="space-y-10">
      {headerBlocks.length > 0 && (
        <div className="max-w-3xl mx-auto text-center space-y-4">
          {headerBlocks.map(b => <BlockRenderer key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
      {widgetBlocks.length > 0 && (
        <div className="space-y-8">
          {widgetBlocks.map(b => <BlockRenderer key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
      {ctaBlocks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {ctaBlocks.map(b => <BlockRenderer key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
    </div>
  );
}

// ─── Shared Template Props ──────────────────────────────────
interface TemplateProps {
  headerBlocks: SectionContentBlock[];
  ctaBlocks: SectionContentBlock[];
  mediaBlocks: SectionContentBlock[];
  widgetBlocks: SectionContentBlock[];
  isHero?: boolean;
}

// ─── Auto-grid helper ───────────────────────────────────────
function autoGridCols(count: number): string {
  if (count === 1) return '';
  if (count === 2) return 'grid grid-cols-1 md:grid-cols-2 gap-6';
  if (count === 3) return 'grid grid-cols-1 md:grid-cols-3 gap-6';
  return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';
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

// ─── Generic Data Cards Widget ──────────────────────────────
interface DataCardItem {
  title?: string;
  description?: string;
  price?: string;
  image?: string;
  features?: string[];
  link?: string;
  highlight?: boolean;
}

const DATA_CARD_PRESETS: Record<string, { source: string; mappings: Record<string, string>; display: string }> = {
  party_options: { source: 'party_options', mappings: { title: 'name', description: 'description', price: 'price', features: 'features' }, display: 'card-grid' },
  token_tiers: { source: 'token_tiers', mappings: { title: 'tokens', price: 'price', description: 'bonus', highlight: 'is_highlight' }, display: 'pricing-grid' },
  faq_items: { source: 'faq_items', mappings: { title: 'question', description: 'answer' }, display: 'accordion' },
  job_listings: { source: 'job_listings', mappings: { title: 'title', description: 'description', image: 'image_url', link: 'apply_url' }, display: 'list' },
  news_articles: { source: 'news_articles', mappings: { title: 'title', description: 'source', image: 'image_url', link: 'url' }, display: 'card-grid' },
  business_pricing_tiers: { source: 'business_pricing_tiers', mappings: { title: 'name', price: 'price', features: 'features', highlight: 'is_highlight' }, display: 'pricing-grid' },
  invite_templates: { source: 'invite_templates', mappings: { title: 'name', image: 'thumbnail_url', link: 'url' }, display: 'card-grid' },
};

function DataCardsWidget({ content }: { content: Record<string, any> }) {
  const source = content.source || 'inline';
  const mappings = content.mappings || {};
  const display = content.display || 'card-grid';
  const columnCount = content.columns || 3;
  const inlineItems = content.items || [];

  const { data: rawData } = useCmsTable<Record<string, any>>(source, { enabled: source !== 'inline' });

  // Map raw DB rows to uniform card items
  const items: DataCardItem[] = source === 'inline'
    ? inlineItems
    : (rawData || []).map((row: Record<string, any>) => ({
        title: mappings.title ? String(row[mappings.title] || '') : undefined,
        description: mappings.description ? String(row[mappings.description] || '') : undefined,
        price: mappings.price ? String(row[mappings.price] || '') : undefined,
        image: mappings.image ? String(row[mappings.image] || '') : undefined,
        features: mappings.features ? (Array.isArray(row[mappings.features]) ? row[mappings.features] : undefined) : undefined,
        link: mappings.link ? String(row[mappings.link] || '') : undefined,
        highlight: mappings.highlight ? Boolean(row[mappings.highlight]) : false,
      }));

  if (items.length === 0) return <p className="text-muted-foreground text-center text-sm font-body">No data to display</p>;

  const colsClass = columnCount === 2 ? 'md:grid-cols-2' : columnCount === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3';

  // ── Card Grid ──
  if (display === 'card-grid') {
    return (
      <div className={`grid grid-cols-1 ${colsClass} gap-6`}>
        {items.map((item, i) => (
          <div key={i} className="rounded-2xl border border-border bg-background/50 p-6 text-center hover:shadow-lg transition-shadow flex flex-col">
            {item.image && (
              <div className="h-40 flex items-center justify-center mb-4 overflow-hidden rounded-xl">
                <img src={item.image} alt={item.title || ''} className="max-h-full max-w-full object-contain" loading="lazy" />
              </div>
            )}
            {item.title && <h4 className="font-heading font-bold text-foreground text-lg mb-2">{item.title}</h4>}
            {item.description && <p className="text-muted-foreground font-body text-sm leading-relaxed mb-3 flex-1">{item.description}</p>}
            {item.features && item.features.length > 0 && (
              <ul className="text-muted-foreground font-body text-sm space-y-1 mb-3 text-left">
                {item.features.map((f, j) => <li key={j}>• {f}</li>)}
              </ul>
            )}
            {item.price && <p className="font-heading font-bold text-foreground text-lg">{item.price}</p>}
            {item.link && (
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-primary text-sm font-heading font-bold mt-2 inline-block">
                View →
              </a>
            )}
          </div>
        ))}
      </div>
    );
  }

  // ── Pricing Grid ──
  if (display === 'pricing-grid') {
    return (
      <div className={`grid grid-cols-2 ${colsClass} gap-4`}>
        {items.map((item, i) => (
          <div key={i} className={`rounded-2xl p-6 text-center border transition-shadow hover:shadow-lg ${item.highlight ? 'bg-primary/10 border-primary/30 ring-2 ring-primary/20' : 'bg-background border-border'}`}>
            {item.title && <p className="font-heading font-bold text-lg text-foreground">{item.title}</p>}
            {item.price && <p className="font-heading font-bold text-3xl text-primary my-2">{item.price}</p>}
            {item.description && <p className="text-sm text-muted-foreground font-body">{item.description}</p>}
            {item.features && item.features.length > 0 && (
              <ul className="text-muted-foreground font-body text-sm space-y-1 mt-3 text-left">
                {item.features.map((f, j) => <li key={j}>✓ {f}</li>)}
              </ul>
            )}
            {item.highlight && <span className="inline-block mt-2 text-xs font-heading font-bold text-primary bg-primary/10 rounded-full px-3 py-1">Top Pick</span>}
          </div>
        ))}
      </div>
    );
  }

  // ── List ──
  if (display === 'list') {
    return (
      <div className="space-y-6">
        {items.map((item, i) => (
          <div key={i} className="rounded-2xl border border-border bg-background overflow-hidden md:flex hover:shadow-lg transition-shadow">
            {item.image && <img src={item.image} alt={item.title || ''} className="w-full md:w-56 h-40 md:h-auto object-cover flex-shrink-0" loading="lazy" />}
            <div className="p-6 flex flex-col flex-1">
              {item.title && <h4 className="font-heading font-bold text-lg text-foreground mb-2">{item.title}</h4>}
              {item.description && <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4 flex-1">{item.description}</p>}
              {item.price && <p className="font-heading font-bold text-foreground mb-2">{item.price}</p>}
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="rounded-full font-heading font-bold">View →</Button>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Accordion ──
  if (display === 'accordion') {
    return (
      <div className="rounded-2xl border border-border bg-background p-6 md:p-8 max-w-3xl mx-auto">
        {items.map((item, i) => (
          <FaqAccordionItem key={i} q={item.title || ''} a={item.description || ''} />
        ))}
      </div>
    );
  }

  return null;
}

// ─── Universal Block Renderer ───────────────────────────────
function BlockRenderer({ block, isHero = false, align = 'center' }: { block: SectionContentBlock; isHero?: boolean; align?: 'center' | 'left' }) {
  const c = block.content || {};
  const headingSize = isHero ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-3xl md:text-4xl';
  const textSize = isHero ? 'text-xl' : 'text-lg';

  switch (block.block_type) {
    case 'heading':
      return <h2 className={`${headingSize} font-heading font-bold leading-tight`}>{c.text}</h2>;

    case 'text':
      return <p className={`font-body ${textSize} leading-relaxed opacity-80`}>{c.text}</p>;

    case 'richtext':
      return (
        <div
          className={`font-body ${textSize} leading-relaxed prose prose-invert max-w-none [&_a]:text-primary [&_a]:underline ${align === 'left' ? 'text-left' : ''}`}
          dangerouslySetInnerHTML={{ __html: c.html || c.text || '' }}
        />
      );

    case 'image':
      return (
        <div className="overflow-hidden rounded-2xl">
          <img src={c.url} alt={c.alt || 'Section image'} className="w-full h-auto object-cover" loading="lazy" />
        </div>
      );

    case 'video':
      if (c.url?.includes('youtube') || c.url?.includes('youtu.be')) {
        const videoId = c.url.includes('youtu.be') ? c.url.split('/').pop() : new URL(c.url).searchParams.get('v');
        return (
          <div className="aspect-video rounded-2xl overflow-hidden max-w-4xl mx-auto">
            <iframe src={`https://www.youtube.com/embed/${videoId}`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={c.alt || 'Video'} />
          </div>
        );
      }
      if (c.url?.includes('vimeo')) {
        const vimeoId = c.url.split('/').pop();
        return (
          <div className="aspect-video rounded-2xl overflow-hidden max-w-4xl mx-auto">
            <iframe src={`https://player.vimeo.com/video/${vimeoId}`} className="w-full h-full" allowFullScreen title={c.alt || 'Video'} />
          </div>
        );
      }
      return (
        <div className="aspect-video rounded-2xl overflow-hidden max-w-4xl mx-auto">
          <video src={c.url} controls className="w-full h-full object-cover" />
        </div>
      );

    case 'iframe':
      return (
        <div className="aspect-video rounded-2xl overflow-hidden border border-border/20 max-w-4xl mx-auto">
          <iframe src={c.url} className="w-full h-full" title={c.title || 'Embedded content'} allowFullScreen />
        </div>
      );

    case 'code':
      return (
        <pre className="bg-background/80 border border-border/30 rounded-xl p-5 overflow-x-auto text-sm font-mono max-w-3xl mx-auto text-left">
          <code>{c.code || c.text}</code>
        </pre>
      );

    case 'list':
      return (
        <ul className={`list-disc list-inside space-y-2 ${textSize} font-body opacity-80 ${align === 'left' ? 'text-left' : ''}`}>
          {(c.items || []).map((item: string, i: number) => <li key={i}>{item}</li>)}
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

    case 'pricing': return <PricingWidget />;
    case 'hours': return <HoursWidget />;
    case 'reviews': return <ReviewsWidget />;
    case 'news': return <NewsWidget />;
    case 'faq': return <FaqWidget page={c.page} />;
    case 'jobs': return <JobsWidget category={c.category} />;
    case 'party_options': return <PartyOptionsWidget />;
    case 'templates': return <TemplatesWidget />;
    case 'data_cards': return <DataCardsWidget content={c} />;

    case 'cards':
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

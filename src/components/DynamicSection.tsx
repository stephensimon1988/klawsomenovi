import { Button } from '@/components/ui/button';
import { useCmsTable } from '@/hooks/useCmsContent';
import type { SectionContentBlock } from '@/hooks/useCmsContent';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect, useRef } from 'react';
import { Star, StarHalf, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import EditableWrapper from '@/components/EditableWrapper';
import { useEditMode } from '@/contexts/EditModeContext';

/** Wraps BlockRenderer with EditableWrapper when edit mode is on */
function EditableBlock({ block, isHero, align }: { block: SectionContentBlock; isHero?: boolean; align?: 'center' | 'left' }) {
  const { isEditMode } = useEditMode();
  const rendered = <BlockRenderer block={block} isHero={isHero} align={align} />;
  if (!isEditMode) return rendered;
  return <EditableWrapper block={block}>{rendered}</EditableWrapper>;
}

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
const WIDGET_TYPES = new Set(['reviews', 'data_cards']);

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
// ═══════════════════════════════════════════════════════════
function StackedTemplate({ headerBlocks, ctaBlocks, mediaBlocks, widgetBlocks, isHero }: TemplateProps) {
  return (
    <div className="space-y-10">
      {headerBlocks.length > 0 && (
        <div className="max-w-3xl mx-auto text-center space-y-4">
          {headerBlocks.map(b => <EditableBlock key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
      {mediaBlocks.length > 0 && (
        <div className={autoGridCols(mediaBlocks.length)}>
          {mediaBlocks.map(b => <EditableBlock key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
      {widgetBlocks.length > 0 && (
        <div className="space-y-8">
          {widgetBlocks.map(b => <EditableBlock key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
      {ctaBlocks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {ctaBlocks.map(b => <EditableBlock key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE: Hero Cover
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
        {headerBlocks.map(b => <EditableBlock key={b.id} block={b} isHero={true} />)}
        {otherMedia.map(b => <EditableBlock key={b.id} block={b} isHero={true} />)}
        {widgetBlocks.map(b => <EditableBlock key={b.id} block={b} isHero={true} />)}
        {ctaBlocks.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {ctaBlocks.map(b => <EditableBlock key={b.id} block={b} isHero={true} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE: Split (Left or Right)
// ═══════════════════════════════════════════════════════════
function SplitTemplate({ headerBlocks, ctaBlocks, mediaBlocks, widgetBlocks, mediaFirst, isHero }: TemplateProps & { mediaFirst: boolean }) {
  const textContent = (
    <div className="space-y-6 flex flex-col justify-center text-left">
      {headerBlocks.map(b => <EditableBlock key={b.id} block={b} isHero={isHero} align="left" />)}
      {widgetBlocks.map(b => <EditableBlock key={b.id} block={b} isHero={isHero} />)}
      {ctaBlocks.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {ctaBlocks.map(b => <EditableBlock key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
    </div>
  );

  const mediaContent = (
    <div className="space-y-4">
      {mediaBlocks.length > 0
        ? mediaBlocks.map(b => <EditableBlock key={b.id} block={b} isHero={isHero} />)
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
// ═══════════════════════════════════════════════════════════
const CARD_BLOCK_TYPES = [
  { type: 'image', icon: '🖼', label: 'Image' },
  { type: 'icon_box', icon: '✨', label: 'Icon' },
];

function CardGridTemplate({ headerBlocks, ctaBlocks, mediaBlocks, widgetBlocks, isHero, blocks }: TemplateProps & { blocks: SectionContentBlock[] }) {
  const { isEditMode, cmsInvoke, triggerRefresh } = useEditMode();
  const headings = headerBlocks.filter(b => b.block_type === 'heading');
  const nonHeadingBlocks = blocks.filter(b => b.block_type !== 'heading' && b.block_type !== 'button');

  // Group by column_index to form cards
  const cardMap = new Map<number, SectionContentBlock[]>();
  nonHeadingBlocks.forEach(b => {
    const col = b.column_index ?? 0;
    if (!cardMap.has(col)) cardMap.set(col, []);
    cardMap.get(col)!.push(b);
  });
  const cards = Array.from(cardMap.entries()).sort(([a], [b]) => a - b);
  const colCount = cards.length <= 2 ? 'md:grid-cols-2' : cards.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';

  const addSubBlock = async (columnIndex: number, blockType: string) => {
    const defaultContent: Record<string, any> =
      blockType === 'image' ? { url: '', alt: '' } :
      blockType === 'icon_box' ? { items: [{ icon: '⭐', title: 'Feature', description: 'Description' }] } :
      {};
    const existingInCol = nonHeadingBlocks.filter(b => (b.column_index ?? 0) === columnIndex);
    const maxRow = existingInCol.length > 0 ? Math.max(...existingInCol.map(b => b.row_order)) + 1 : 0;
    try {
      await cmsInvoke({
        action: 'insert',
        table: 'section_content_blocks',
        data: {
          section_id: blocks[0]?.section_id,
          column_index: columnIndex,
          row_order: maxRow,
          block_type: blockType,
          content: defaultContent,
        },
      });
      toast.success('Block added to card');
      triggerRefresh();
    } catch (e: any) {
      toast.error(e.message || 'Failed to add block');
    }
  };

  const addNewCard = async () => {
    const nextCol = cards.length > 0 ? Math.max(...cards.map(([c]) => c)) + 1 : 1;
    try {
      await cmsInvoke({
        action: 'insert',
        table: 'section_content_blocks',
        data: {
          section_id: blocks[0]?.section_id,
          column_index: nextCol,
          row_order: 0,
          block_type: 'text',
          content: { text: 'New card content' },
        },
      });
      toast.success('Card added');
      triggerRefresh();
    } catch (e: any) {
      toast.error(e.message || 'Failed to add card');
    }
  };

  return (
    <div className="space-y-10">
      {headings.length > 0 && (
        <div className="max-w-3xl mx-auto text-center space-y-4">
          {headings.map(b => <EditableBlock key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
      {cards.length > 0 && (
        <div className={`grid grid-cols-1 ${colCount} gap-6`}>
          {cards.map(([colIdx, cardBlocks]) => (
            <div key={colIdx} className="rounded-2xl border border-border bg-background/50 p-6 text-center hover:shadow-lg transition-shadow space-y-3">
              {cardBlocks.sort((a, b) => a.row_order - b.row_order).map(b => (
                <EditableBlock key={b.id} block={b} isHero={false} />
              ))}
              {isEditMode && (
                <div className="flex flex-wrap justify-center gap-1 pt-2 border-t border-dashed border-border/50">
                  {CARD_BLOCK_TYPES.map(bt => (
                    <button
                      key={bt.type}
                      onClick={() => addSubBlock(colIdx, bt.type)}
                      className="text-xs px-2 py-1 rounded bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {bt.icon} {bt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {isEditMode && (
        <div className="flex justify-center">
          <button
            onClick={addNewCard}
            className="text-sm px-4 py-2 rounded-lg border-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 transition-colors"
          >
            + Add Card
          </button>
        </div>
      )}
      {ctaBlocks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {ctaBlocks.map(b => <EditableBlock key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE: CTA Banner
// ═══════════════════════════════════════════════════════════
function CTABannerTemplate({ headerBlocks, ctaBlocks, isHero }: TemplateProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 py-4">
      <div className="text-center md:text-left space-y-2 flex-1">
        {headerBlocks.map(b => <EditableBlock key={b.id} block={b} isHero={isHero} />)}
      </div>
      {ctaBlocks.length > 0 && (
        <div className="flex flex-wrap gap-3 flex-shrink-0">
          {ctaBlocks.map(b => <EditableBlock key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE: Feature List
// ═══════════════════════════════════════════════════════════
function FeatureListTemplate({ headerBlocks, ctaBlocks, blocks, isHero }: TemplateProps & { blocks: SectionContentBlock[] }) {
  const headings = headerBlocks.filter(b => b.block_type === 'heading');
  const bodyBlocks = headerBlocks.filter(b => b.block_type !== 'heading');

  return (
    <div className="space-y-10">
      {headings.length > 0 && (
        <div className="max-w-3xl mx-auto text-center space-y-4">
          {headings.map(b => <EditableBlock key={b.id} block={b} isHero={isHero} />)}
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
                <EditableBlock block={b} isHero={false} align="left" />
              </div>
            </div>
          ))}
        </div>
      )}
      {blocks.filter(b => !HEADER_TYPES.has(b.block_type) && !CTA_TYPES.has(b.block_type)).length > 0 && (
        <div className="space-y-8">
          {blocks.filter(b => !HEADER_TYPES.has(b.block_type) && !CTA_TYPES.has(b.block_type)).map(b => (
            <EditableBlock key={b.id} block={b} isHero={isHero} />
          ))}
        </div>
      )}
      {ctaBlocks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {ctaBlocks.map(b => <EditableBlock key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE: Pricing Grid
// ═══════════════════════════════════════════════════════════
function PricingGridTemplate({ headerBlocks, ctaBlocks, widgetBlocks, isHero }: TemplateProps) {
  return (
    <div className="space-y-10">
      {headerBlocks.length > 0 && (
        <div className="max-w-3xl mx-auto text-center space-y-4">
          {headerBlocks.map(b => <EditableBlock key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
      {widgetBlocks.length > 0 && (
        <div className="space-y-8">
          {widgetBlocks.map(b => <EditableBlock key={b.id} block={b} isHero={isHero} />)}
        </div>
      )}
      {ctaBlocks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {ctaBlocks.map(b => <EditableBlock key={b.id} block={b} isHero={isHero} />)}
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

// ─── FAQ Accordion Item (reused by DataCardsWidget) ─────────
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

// ─── Generic Data Cards Widget ──────────────────────────────
interface DataCardItem {
  title?: string;
  description?: string;
  price?: string;
  image?: string;
  features?: string[];
  link?: string;
  highlight?: boolean;
  extra?: string;
  media_type?: 'none' | 'image' | 'video';
  media_url?: string;
}

function CardMedia({ item }: { item: DataCardItem }) {
  const type = item.media_type || (item.image ? 'image' : 'none');
  const url = item.media_url || item.image;
  if (type === 'none' || !url) return null;
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl mb-4 bg-muted">
      {type === 'video' ? (
        <video src={url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
      ) : (
        <img src={url} alt={item.title || ''} className="w-full h-full object-cover" loading="lazy" />
      )}
    </div>
  );
}

export const DATA_CARD_PRESETS: Record<string, { source: string; mappings: Record<string, string>; display: string; columns?: number }> = {
  party_options: { source: 'party_options', mappings: { title: 'name', description: 'description', price: 'price', features: 'features' }, display: 'card-grid', columns: 2 },
  token_tiers: { source: 'token_tiers', mappings: { title: 'tokens', price: 'price', description: 'bonus', highlight: 'is_highlight' }, display: 'pricing-grid', columns: 4 },
  faq_items: { source: 'faq_items', mappings: { title: 'question', description: 'answer' }, display: 'accordion' },
  job_listings: { source: 'job_listings', mappings: { title: 'title', description: 'description', image: 'image_url', link: 'apply_url' }, display: 'list' },
  news_articles: { source: 'news_articles', mappings: { title: 'title', description: 'source', image: 'image_url', link: 'url' }, display: 'card-grid', columns: 3 },
  business_pricing_tiers: { source: 'business_pricing_tiers', mappings: { title: 'name', price: 'price', features: 'features', highlight: 'is_highlight' }, display: 'pricing-grid', columns: 3 },
  invite_templates: { source: 'invite_templates', mappings: { title: 'name', image: 'thumbnail_url', link: 'url' }, display: 'card-grid', columns: 2 },
  store_hours: { source: 'store_hours', mappings: { title: 'day_label', description: 'open_time', extra: 'close_time', highlight: 'is_closed' }, display: 'hours' },
};

function DataCardsWidget({ content }: { content: Record<string, any> }) {
  const source = content.source || 'inline';
  const mappings = content.mappings || {};
  const display = content.display || 'card-grid';
  const columnCount = content.columns || 3;
  const inlineItems = content.items || [];
  const filterColumn = content.filter_column || '';
  const filterValue = content.filter_value || '';

  const { data: rawData } = useCmsTable<Record<string, any>>(source, { enabled: source !== 'inline' });

  // Apply optional filtering
  const filteredData = (rawData || []).filter((row: Record<string, any>) => {
    if (!filterColumn || !filterValue) return true;
    return String(row[filterColumn] || '') === filterValue;
  });

  // Map raw DB rows to uniform card items
  const items: DataCardItem[] = source === 'inline'
    ? inlineItems
    : filteredData.map((row: Record<string, any>) => ({
        title: mappings.title ? String(row[mappings.title] || '') : undefined,
        description: mappings.description ? String(row[mappings.description] || '') : undefined,
        price: mappings.price ? String(row[mappings.price] || '') : undefined,
        image: mappings.image ? String(row[mappings.image] || '') : undefined,
        features: mappings.features ? (Array.isArray(row[mappings.features]) ? row[mappings.features] : undefined) : undefined,
        link: mappings.link ? String(row[mappings.link] || '') : undefined,
        highlight: mappings.highlight ? Boolean(row[mappings.highlight]) : false,
        extra: mappings.extra ? String(row[mappings.extra] || '') : undefined,
      }));

  if (items.length === 0) return <p className="text-muted-foreground text-center text-sm font-body">No data to display</p>;


  const colsClass = columnCount === 2 ? 'md:grid-cols-2' : columnCount === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3';

  // ── Gallery (image grid) ──
  if (display === 'grid' || display === 'gallery') {
    return (
      <div className={`grid grid-cols-2 ${colsClass} gap-3`}>
        {items.map((item, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-muted aspect-square">
            {item.image && (
              <img src={item.image} alt={item.description || item.title || ''} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
            )}
          </div>
        ))}
      </div>
    );
  }

  // ── Hours ──
  if (display === 'hours') {
    return (
      <div className="space-y-2 max-w-md mx-auto">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
            <span className="font-heading font-bold text-sm text-foreground">{item.title}</span>
            <span className="text-muted-foreground font-body text-sm">
              {item.highlight ? 'Closed' : `${item.description} – ${item.extra || ''}`}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // ── Card Grid ──
  if (display === 'card-grid') {
    return (
      <div className={`grid grid-cols-1 ${colsClass} gap-6`}>
        {items.map((item, i) => (
          <div key={i} className="rounded-2xl border border-border bg-background/50 p-6 text-center hover:shadow-lg transition-shadow flex flex-col">
            <CardMedia item={item} />
            {item.title && <h4 className="font-heading font-bold text-foreground mb-2">{item.title}</h4>}
            {item.description && <p className="text-muted-foreground font-body text-sm leading-relaxed mb-3 flex-1">{item.description}</p>}
            {item.features && item.features.length > 0 && (
              <ul className="text-muted-foreground font-body text-sm space-y-1 mb-3 text-left">
                {item.features.map((f, j) => <li key={j}>• {f}</li>)}
              </ul>
            )}
            {item.price && <h4 className="font-heading font-bold text-foreground">{item.price}</h4>}
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
            {item.title && <h4 className="font-heading font-bold text-foreground">{item.title}</h4>}
            {item.price && <h3 className="font-heading font-bold text-primary my-2">{item.price}</h3>}
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
            {(item.media_url || item.image) && (
              <div className="w-full md:w-56 flex-shrink-0">
                <div className="aspect-square w-full h-full overflow-hidden bg-muted">
                  {(item.media_type === 'video') ? (
                    <video src={item.media_url || item.image} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                  ) : (
                    <img src={item.media_url || item.image} alt={item.title || ''} className="w-full h-full object-cover" loading="lazy" />
                  )}
                </div>
              </div>
            )}
            <div className="p-6 flex flex-col flex-1">
              {item.title && <h4 className="font-heading font-bold text-foreground mb-2">{item.title}</h4>}
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

  // ── News Grid ──
  if (display === 'news-grid') {
    return (
      <div className={`grid grid-cols-1 ${colsClass} gap-8`}>
        {items.map((item, i) => (
          <a key={i} href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="group block rounded-2xl overflow-hidden bg-background border border-border hover:shadow-lg transition-all">
            {item.image && (
              <div className="aspect-[4/3] overflow-hidden">
                <img src={item.image} alt={item.title || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
            )}
            <div className="p-6">
              {item.title && <h4 className="font-heading font-bold text-foreground leading-snug mb-2">{item.title}</h4>}
              {item.description && <p className="text-muted-foreground text-xs font-body mb-3">{item.description}</p>}
              <span className="text-primary text-sm font-heading font-bold tracking-wider uppercase">Read More →</span>
            </div>
          </a>
        ))}
      </div>
    );
  }

  return null;
}

// ─── Universal Block Renderer ───────────────────────────────
function BlockRenderer({ block, isHero = false, align = 'center' }: { block: SectionContentBlock; isHero?: boolean; align?: 'center' | 'left' }) {
  const c = block.content || {};

  switch (block.block_type) {
    case 'heading':
      return isHero
        ? <h1 className="font-heading font-bold leading-tight">{c.text}</h1>
        : <h2 className="font-heading font-bold leading-tight">{c.text}</h2>;

    case 'text':
      return <p className="font-body leading-relaxed opacity-80">{c.text}</p>;

    case 'richtext':
      return (
        <div
          className={`font-body leading-relaxed prose prose-invert max-w-none [&_a]:text-primary [&_a]:underline ${align === 'left' ? 'text-left' : ''}`}
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
        <ul className={`list-disc list-inside space-y-2 font-body opacity-80 ${align === 'left' ? 'text-left' : ''}`}>
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

    case 'tabs': {
      const tabs = c.tabs || [{ label: 'Tab 1', content: '<p>Content here</p>' }];
      return (
        <Tabs defaultValue="0" className="w-full max-w-3xl mx-auto">
          <TabsList className="flex-wrap h-auto gap-1 bg-muted/50">
            {tabs.map((_: any, i: number) => (
              <TabsTrigger key={i} value={String(i)} className="font-heading font-bold text-sm">{_.label}</TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab: any, i: number) => (
            <TabsContent key={i} value={String(i)} className="mt-4">
              <div className="prose prose-invert max-w-none font-body" dangerouslySetInnerHTML={{ __html: tab.content || '' }} />
            </TabsContent>
          ))}
        </Tabs>
      );
    }

    case 'table': {
      const headers = c.headers || ['Column 1', 'Column 2'];
      const rows = c.rows || [['Data 1', 'Data 2']];
      return (
        <div className="overflow-x-auto max-w-4xl mx-auto rounded-2xl border border-border">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                {headers.map((h: string, i: number) => (
                  <th key={i} className="px-4 py-3 text-left font-heading font-bold text-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row: string[], ri: number) => (
                <tr key={ri} className="border-b border-border/30 last:border-0 hover:bg-muted/10">
                  {row.map((cell: string, ci: number) => (
                    <td key={ci} className="px-4 py-3 text-muted-foreground">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'gallery': {
      const images = c.images || [];
      const cols = images.length <= 2 ? 'md:grid-cols-2' : images.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';
      return (
        <div className={`grid grid-cols-1 ${cols} gap-3`}>
          {images.map((img: { url: string; alt?: string; caption?: string }, i: number) => (
            <div key={i} className="group rounded-2xl overflow-hidden border border-border bg-muted/10">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              {img.caption && <p className="text-xs text-muted-foreground font-body p-2 text-center">{img.caption}</p>}
            </div>
          ))}
        </div>
      );
    }

    case 'map':
      return (
        <div className="aspect-video rounded-2xl overflow-hidden border border-border/20 max-w-4xl mx-auto">
          <iframe
            src={c.embed_url || c.url || `https://www.google.com/maps/embed/v1/place?key=YOUR_KEY&q=${encodeURIComponent(c.address || '')}`}
            className="w-full h-full"
            title={c.title || 'Map'}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      );

    case 'icon_box': {
      const boxes = c.items || [{ icon: '⭐', title: 'Feature', description: 'Description' }];
      const boxCols = boxes.length <= 2 ? 'md:grid-cols-2' : boxes.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';
      return (
        <div className={`grid grid-cols-1 ${boxCols} gap-6`}>
          {boxes.map((box: any, i: number) => (
            <div key={i} className="text-center space-y-3 p-4">
              <span className="text-4xl block">{box.icon}</span>
              {box.title && <h4 className="font-heading font-bold text-foreground">{box.title}</h4>}
              {box.description && <p className="text-muted-foreground font-body text-sm leading-relaxed">{box.description}</p>}
            </div>
          ))}
        </div>
      );
    }

    case 'countdown':
      return <CountdownWidget targetDate={c.target_date} label={c.label} />;

    case 'carousel':
      return <ContentCarousel slides={c.slides || []} />;

    case 'reviews': return <ReviewsWidget />;
    case 'data_cards': return <DataCardsWidget content={c} />;

    case 'cards':
      const cardItems = c.items || [];
      const cardCols = cardItems.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';
      return (
        <div className={`grid grid-cols-1 ${cardCols} gap-6`}>
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

// ─── Countdown Timer Widget ─────────────────────────────────
function CountdownWidget({ targetDate, label }: { targetDate?: string; label?: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!targetDate) return <p className="text-muted-foreground text-sm font-body">Set a target date</p>;

  return (
    <div className="text-center space-y-4">
      {label && <h3 className="font-heading font-bold text-foreground">{label}</h3>}
      <div className="flex justify-center gap-4">
        {[
          { val: timeLeft.days, unit: 'Days' },
          { val: timeLeft.hours, unit: 'Hours' },
          { val: timeLeft.minutes, unit: 'Min' },
          { val: timeLeft.seconds, unit: 'Sec' },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl border border-border bg-background/50 p-4 min-w-[70px]">
            <div className="font-heading font-bold text-2xl text-foreground">{String(item.val).padStart(2, '0')}</div>
            <div className="text-muted-foreground font-body text-xs uppercase">{item.unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Content Carousel Widget ────────────────────────────────
function ContentCarousel({ slides }: { slides: { image?: string; title?: string; description?: string; link?: string }[] }) {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  if (slides.length === 0) return <p className="text-muted-foreground text-sm font-body">No slides</p>;

  const prev = () => setCurrent(i => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setCurrent(i => (i === slides.length - 1 ? 0 : i + 1));

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-2xl border border-border" ref={trackRef}>
        <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
          {slides.map((slide, i) => (
            <div key={i} className="w-full flex-shrink-0">
              {slide.image && (
                <div className="aspect-video overflow-hidden">
                  <img src={slide.image} alt={slide.title || ''} className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="p-6 text-center">
                {slide.title && <h4 className="font-heading font-bold text-foreground mb-2">{slide.title}</h4>}
                {slide.description && <p className="text-muted-foreground font-body text-sm">{slide.description}</p>}
                {slide.link && (
                  <a href={slide.link} target="_blank" rel="noopener noreferrer" className="text-primary text-sm font-heading font-bold mt-2 inline-block">
                    Learn More →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 border border-border rounded-full p-2 hover:bg-background">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 border border-border rounded-full p-2 hover:bg-background">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex justify-center gap-2 mt-3">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-primary w-6' : 'bg-muted-foreground/30'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default DynamicSection;

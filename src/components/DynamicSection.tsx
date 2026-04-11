import { Button } from '@/components/ui/button';
import { useCmsTable } from '@/hooks/useCmsContent';
import type { SectionContentBlock } from '@/hooks/useCmsContent';

interface DynamicSectionProps {
  sectionId: string;
  columns?: number;
  layoutJson?: Record<string, any>;
}

const DynamicSection = ({ sectionId, layoutJson }: DynamicSectionProps) => {
  const { data: allBlocks } = useCmsTable<SectionContentBlock>('section_content_blocks');
  const blocks = (allBlocks || [])
    .filter(b => b.section_id === sectionId)
    .sort((a, b) => a.row_order - b.row_order);

  if (blocks.length === 0) return null;

  // If we have AI layout, use it
  if (layoutJson && layoutJson.template && layoutJson.grid?.length > 0) {
    return <AILayout blocks={blocks} layout={layoutJson} />;
  }

  // Fallback: auto-detect template
  const headings = blocks.filter(b => b.block_type === 'heading');
  const texts = blocks.filter(b => b.block_type === 'richtext' || b.block_type === 'text');
  const images = blocks.filter(b => b.block_type === 'image');
  const videos = blocks.filter(b => b.block_type === 'video');
  const buttons = blocks.filter(b => b.block_type === 'button');
  const spacers = blocks.filter(b => b.block_type === 'spacer');
  const iframes = blocks.filter(b => b.block_type === 'iframe');
  const codeBlocks = blocks.filter(b => b.block_type === 'code');
  const lists = blocks.filter(b => b.block_type === 'list');
  const dividers = blocks.filter(b => b.block_type === 'divider');
  const mediaCount = images.length + videos.length;

  if (mediaCount === 1 && (headings.length > 0 || texts.length > 0))
    return <HeroSplit blocks={blocks} />;
  if (images.length > 1)
    return <GalleryLayout blocks={blocks} />;
  if (texts.length > 2)
    return <CardsLayout blocks={blocks} />;
  return <StackedLayout blocks={blocks} />;
};

// ─── AI-driven layout ───────────────────────────────────────
function AILayout({ blocks, layout }: { blocks: SectionContentBlock[]; layout: any }) {
  const { template, grid, gap = '2rem', verticalAlign = 'center' } = layout;

  // Group blocks by area
  const areas = new Map<string, { block: SectionContentBlock; config: any }[]>();
  (grid || []).forEach((g: any) => {
    const block = blocks[g.blockIndex];
    if (!block) return;
    const area = g.area || 'full';
    if (!areas.has(area)) areas.set(area, []);
    areas.get(area)!.push({ block, config: g });
  });

  // Render based on template
  if (template === 'hero-split' || template === 'two-column' || template === 'sidebar-content') {
    const leftItems = areas.get('left') || [];
    const rightItems = areas.get('right') || [];
    const headerItems = areas.get('header') || [];
    const footerItems = areas.get('footer') || [];
    const fullItems = areas.get('full') || [];

    return (
      <div className="space-y-8">
        {headerItems.length > 0 && (
          <div className="text-center space-y-4">
            {headerItems.map(({ block }) => <BlockRenderer key={block.id} block={block} />)}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-12 items-center" style={{ gap }}>
          {leftItems.length > 0 && (
            <div className={`md:col-span-${leftItems[0]?.config?.span || 6} space-y-4`}
              style={{ textAlign: leftItems[0]?.config?.alignment || 'left' }}>
              {leftItems.map(({ block }) => <BlockRenderer key={block.id} block={block} />)}
            </div>
          )}
          {rightItems.length > 0 && (
            <div className={`md:col-span-${rightItems[0]?.config?.span || 6} space-y-4`}
              style={{ textAlign: rightItems[0]?.config?.alignment || 'center' }}>
              {rightItems.map(({ block }) => <BlockRenderer key={block.id} block={block} />)}
            </div>
          )}
        </div>
        {fullItems.map(({ block }) => <BlockRenderer key={block.id} block={block} />)}
        {footerItems.length > 0 && (
          <div className="text-center space-y-4">
            {footerItems.map(({ block }) => <BlockRenderer key={block.id} block={block} />)}
          </div>
        )}
      </div>
    );
  }

  if (template === 'gallery') {
    const mediaBlocks = blocks.filter(b => b.block_type === 'image' || b.block_type === 'video');
    const textBlocks = blocks.filter(b => b.block_type !== 'image' && b.block_type !== 'video');
    const gridCols = mediaBlocks.length <= 2 ? 'md:grid-cols-2' :
      mediaBlocks.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';

    return (
      <div className="space-y-8">
        {textBlocks.length > 0 && (
          <div className="max-w-2xl mx-auto text-center space-y-4">
            {textBlocks.map(b => <BlockRenderer key={b.id} block={b} />)}
          </div>
        )}
        <div className={`grid grid-cols-1 ${gridCols}`} style={{ gap }}>
          {mediaBlocks.map(b => <BlockRenderer key={b.id} block={b} />)}
        </div>
      </div>
    );
  }

  if (template === 'cards') {
    const headerBlocks = blocks.filter(b => b.block_type === 'heading');
    const cardBlocks = blocks.filter(b => b.block_type !== 'heading' && b.block_type !== 'button' && b.block_type !== 'divider' && b.block_type !== 'spacer');
    const footerBlocks = blocks.filter(b => b.block_type === 'button');
    const gridCols = cardBlocks.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';

    return (
      <div className="space-y-8">
        {headerBlocks.length > 0 && (
          <div className="text-center">{headerBlocks.map(b => <BlockRenderer key={b.id} block={b} />)}</div>
        )}
        <div className={`grid grid-cols-1 ${gridCols}`} style={{ gap }}>
          {cardBlocks.map(b => (
            <div key={b.id} className="bg-background/30 border border-border/30 rounded-2xl p-6">
              <BlockRenderer block={b} />
            </div>
          ))}
        </div>
        {footerBlocks.length > 0 && (
          <div className="flex justify-center gap-3 pt-4">{footerBlocks.map(b => <BlockRenderer key={b.id} block={b} />)}</div>
        )}
      </div>
    );
  }

  // Default: stacked
  return (
    <div className="space-y-6 max-w-3xl mx-auto" style={{ textAlign: 'center' }}>
      {blocks.map(b => <BlockRenderer key={b.id} block={b} />)}
    </div>
  );
}

// ─── Fallback templates ─────────────────────────────────────
function HeroSplit({ blocks }: { blocks: SectionContentBlock[] }) {
  const textBlocks = blocks.filter(b => b.block_type !== 'image' && b.block_type !== 'video');
  const mediaBlocks = blocks.filter(b => b.block_type === 'image' || b.block_type === 'video');
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
      <div className="space-y-5 order-2 md:order-1">
        {textBlocks.map(b => <BlockRenderer key={b.id} block={b} />)}
      </div>
      <div className="order-1 md:order-2 space-y-4">
        {mediaBlocks.map(b => <BlockRenderer key={b.id} block={b} />)}
      </div>
    </div>
  );
}

function GalleryLayout({ blocks }: { blocks: SectionContentBlock[] }) {
  const mediaBlocks = blocks.filter(b => b.block_type === 'image' || b.block_type === 'video');
  const textBlocks = blocks.filter(b => b.block_type !== 'image' && b.block_type !== 'video');
  const gridClass = mediaBlocks.length === 2 ? 'md:grid-cols-2' :
    mediaBlocks.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className="space-y-8">
      {textBlocks.length > 0 && (
        <div className="max-w-2xl mx-auto text-center space-y-3">
          {textBlocks.map(b => <BlockRenderer key={b.id} block={b} />)}
        </div>
      )}
      <div className={`grid grid-cols-1 ${gridClass} gap-4`}>
        {mediaBlocks.map(b => <BlockRenderer key={b.id} block={b} />)}
      </div>
    </div>
  );
}

function CardsLayout({ blocks }: { blocks: SectionContentBlock[] }) {
  const headerBlocks = blocks.filter(b => b.block_type === 'heading');
  const cardBlocks = blocks.filter(b => b.block_type === 'richtext' || b.block_type === 'text');
  const others = blocks.filter(b => !['heading', 'richtext', 'text'].includes(b.block_type));
  const gridCols = cardBlocks.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className="space-y-8">
      {headerBlocks.length > 0 && (
        <div className="text-center">{headerBlocks.map(b => <BlockRenderer key={b.id} block={b} />)}</div>
      )}
      <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
        {cardBlocks.map(b => (
          <div key={b.id} className="bg-background/30 border border-border/30 rounded-2xl p-6 shadow-sm">
            <BlockRenderer block={b} />
          </div>
        ))}
      </div>
      {others.map(b => <BlockRenderer key={b.id} block={b} />)}
    </div>
  );
}

function StackedLayout({ blocks }: { blocks: SectionContentBlock[] }) {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-5">
      {blocks.map(b => <BlockRenderer key={b.id} block={b} />)}
    </div>
  );
}

// ─── Universal Block Renderer ───────────────────────────────
function BlockRenderer({ block }: { block: SectionContentBlock }) {
  const c = block.content || {};

  switch (block.block_type) {
    case 'heading':
      return <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight">{c.text}</h2>;

    case 'text':
      return <p className="font-body text-lg leading-relaxed opacity-80">{c.text}</p>;

    case 'richtext':
      return (
        <div
          className="font-body text-lg leading-relaxed prose prose-invert max-w-none [&_a]:text-primary [&_a]:underline"
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
        <ul className="list-disc list-inside space-y-2 text-lg font-body opacity-80">
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

    default:
      return null;
  }
}

interface TemplateProps {
  headings: SectionContentBlock[];
  texts: SectionContentBlock[];
  images?: SectionContentBlock[];
  buttons: SectionContentBlock[];
  spacers?: SectionContentBlock[];
}

export default DynamicSection;

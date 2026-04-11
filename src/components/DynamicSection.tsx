import { Button } from '@/components/ui/button';
import { useCmsTable } from '@/hooks/useCmsContent';
import type { SectionContentBlock } from '@/hooks/useCmsContent';

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

  // Priority 1 block gets 60% — check if media is higher priority
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

    default:
      return null;
  }
}

export default DynamicSection;

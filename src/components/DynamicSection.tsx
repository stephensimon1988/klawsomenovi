import { Button } from '@/components/ui/button';
import { useCmsTable } from '@/hooks/useCmsContent';
import type { SectionContentBlock } from '@/hooks/useCmsContent';

interface DynamicSectionProps {
  sectionId: string;
  columns?: number;
}

/**
 * Auto-layout engine: users just add content items and the system
 * picks the best template based on what's present.
 *
 * Templates (inspired by Bootstrap component patterns):
 *  1. HERO SPLIT    — heading + text + 1 image + optional button → text left, image right
 *  2. CENTERED      — heading + text + optional button, no images → centered single column
 *  3. GALLERY       — heading/text + multiple images → text header + auto-grid gallery
 *  4. IMAGE BANNER  — 1 image only, no text → full-width banner
 *  5. CTA STRIP     — heading + button, minimal text → centered call-to-action
 *  6. CARDS         — multiple text blocks → card grid
 */
const DynamicSection = ({ sectionId }: DynamicSectionProps) => {
  const { data: allBlocks } = useCmsTable<SectionContentBlock>('section_content_blocks');
  const blocks = (allBlocks || [])
    .filter(b => b.section_id === sectionId)
    .sort((a, b) => a.row_order - b.row_order);

  if (blocks.length === 0) return null;

  // Categorize content
  const headings = blocks.filter(b => b.block_type === 'heading');
  const texts = blocks.filter(b => b.block_type === 'text');
  const images = blocks.filter(b => b.block_type === 'image');
  const buttons = blocks.filter(b => b.block_type === 'button');
  const spacers = blocks.filter(b => b.block_type === 'spacer');

  const hasHeading = headings.length > 0;
  const hasText = texts.length > 0;
  const hasImages = images.length > 0;
  const hasButton = buttons.length > 0;
  const imageCount = images.length;

  // Pick template
  if (imageCount === 1 && (hasHeading || hasText)) return <HeroSplit headings={headings} texts={texts} images={images} buttons={buttons} />;
  if (imageCount > 1) return <GalleryLayout headings={headings} texts={texts} images={images} buttons={buttons} />;
  if (imageCount === 1 && !hasHeading && !hasText) return <ImageBanner images={images} />;
  if (hasHeading && hasButton && !hasText) return <CtaStrip headings={headings} buttons={buttons} />;
  if (texts.length > 2) return <CardsLayout headings={headings} texts={texts} buttons={buttons} />;
  return <CenteredLayout headings={headings} texts={texts} buttons={buttons} spacers={spacers} />;
};

// ─── Template: Hero Split (text + single image) ─────────────
function HeroSplit({ headings, texts, images, buttons }: TemplateProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
      <div className="space-y-5 order-2 md:order-1">
        {headings.map(b => <Heading key={b.id} block={b} />)}
        {texts.map(b => <Text key={b.id} block={b} />)}
        {buttons.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-2">
            {buttons.map(b => <Btn key={b.id} block={b} />)}
          </div>
        )}
      </div>
      <div className="order-1 md:order-2">
        {images.map(b => <Image key={b.id} block={b} className="aspect-[4/3]" />)}
      </div>
    </div>
  );
}

// ─── Template: Centered (text-only, centered) ───────────────
function CenteredLayout({ headings, texts, buttons, spacers }: TemplateProps) {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-5">
      {headings.map(b => <Heading key={b.id} block={b} />)}
      {texts.map(b => <Text key={b.id} block={b} />)}
      {(spacers || []).map(b => <Spacer key={b.id} block={b} />)}
      {buttons.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {buttons.map(b => <Btn key={b.id} block={b} />)}
        </div>
      )}
    </div>
  );
}

// ─── Template: Gallery (text header + image grid) ───────────
function GalleryLayout({ headings, texts, images, buttons }: TemplateProps) {
  // Auto-pick grid based on image count
  const gridClass =
    images.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
    images.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
    images.length === 4 ? 'grid-cols-2 md:grid-cols-2' :
    'grid-cols-2 md:grid-cols-3';

  return (
    <div className="space-y-8">
      {(headings.length > 0 || texts.length > 0) && (
        <div className="max-w-2xl mx-auto text-center space-y-3">
          {headings.map(b => <Heading key={b.id} block={b} />)}
          {texts.map(b => <Text key={b.id} block={b} />)}
        </div>
      )}
      <div className={`grid ${gridClass} gap-4`}>
        {images.map((b, i) => (
          <Image key={b.id} block={b} className={
            images.length === 3 && i === 0 ? 'md:col-span-2 aspect-[16/9]' :
            images.length === 3 ? 'aspect-square' :
            'aspect-[4/3]'
          } />
        ))}
      </div>
      {buttons.length > 0 && (
        <div className="flex justify-center gap-3 pt-2">
          {buttons.map(b => <Btn key={b.id} block={b} />)}
        </div>
      )}
    </div>
  );
}

// ─── Template: Image Banner (single image, no text) ─────────
function ImageBanner({ images }: { images: SectionContentBlock[] }) {
  return (
    <div className="w-full">
      {images.map(b => <Image key={b.id} block={b} className="aspect-[21/9]" />)}
    </div>
  );
}

// ─── Template: CTA Strip (heading + button, minimal) ────────
function CtaStrip({ headings, buttons }: { headings: SectionContentBlock[]; buttons: SectionContentBlock[] }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-4">
      <div>
        {headings.map(b => <Heading key={b.id} block={b} />)}
      </div>
      <div className="flex gap-3">
        {buttons.map(b => <Btn key={b.id} block={b} />)}
      </div>
    </div>
  );
}

// ─── Template: Cards (multiple text items → card grid) ──────
function CardsLayout({ headings, texts, buttons }: TemplateProps) {
  const gridClass = texts.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';
  return (
    <div className="space-y-8">
      {headings.length > 0 && (
        <div className="text-center">
          {headings.map(b => <Heading key={b.id} block={b} />)}
        </div>
      )}
      <div className={`grid grid-cols-1 ${gridClass} gap-6`}>
        {texts.map(b => (
          <div key={b.id} className="bg-background/50 border border-border rounded-2xl p-6 shadow-sm">
            <Text block={b} />
          </div>
        ))}
      </div>
      {buttons.length > 0 && (
        <div className="flex justify-center gap-3">
          {buttons.map(b => <Btn key={b.id} block={b} />)}
        </div>
      )}
    </div>
  );
}

// ─── Primitive renderers ────────────────────────────────────
function Heading({ block }: { block: SectionContentBlock }) {
  return <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight">{block.content?.text}</h2>;
}

function Text({ block }: { block: SectionContentBlock }) {
  return <p className="font-body text-lg leading-relaxed opacity-80">{block.content?.text}</p>;
}

function Image({ block, className = '' }: { block: SectionContentBlock; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl ${className}`}>
      <img
        src={block.content?.url}
        alt={block.content?.alt || ''}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

function Btn({ block }: { block: SectionContentBlock }) {
  return (
    <Button asChild size="lg" className="rounded-full px-8 py-6 font-heading font-bold">
      <a href={block.content?.url}>{block.content?.text}</a>
    </Button>
  );
}

function Spacer({ block }: { block: SectionContentBlock }) {
  return <div style={{ height: block.content?.height || '2rem' }} />;
}

interface TemplateProps {
  headings: SectionContentBlock[];
  texts: SectionContentBlock[];
  images?: SectionContentBlock[];
  buttons: SectionContentBlock[];
  spacers?: SectionContentBlock[];
}

export default DynamicSection;

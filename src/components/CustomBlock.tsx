import { Button } from '@/components/ui/button';
import { useCmsTable } from '@/hooks/useCmsContent';

export interface CustomBlockData {
  id: string;
  block_key: string;
  headline: string;
  body: string;
  image_url: string;
  image_position: string;
  cta_text: string;
  cta_url: string;
  sort_order: number;
}

interface CustomBlockProps {
  blockKey: string;
}

const CustomBlock = ({ blockKey }: CustomBlockProps) => {
  const { data: blocks } = useCmsTable<CustomBlockData>('custom_blocks');
  const block = blocks?.find(b => b.block_key === blockKey);

  if (!block) return null;

  const hasImage = !!block.image_url;
  const isFullBg = block.image_position === 'full-bg';
  const isTop = block.image_position === 'top';
  const isLeft = block.image_position === 'left';

  if (isFullBg) {
    return (
      <div className="relative min-h-[50vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${block.image_url}')` }} />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          {block.headline && <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">{block.headline}</h2>}
          {block.body && <p className="text-white/80 font-body text-lg mb-6">{block.body}</p>}
          {block.cta_text && block.cta_url && (
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg font-heading font-bold bg-primary hover:bg-primary/90 text-white">
              <a href={block.cta_url}>{block.cta_text}</a>
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (isTop) {
    return (
      <div>
        {hasImage && (
          <img src={block.image_url} alt={block.headline} className="w-full max-h-[400px] object-cover rounded-2xl mb-8" loading="lazy" />
        )}
        {block.headline && <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">{block.headline}</h2>}
        {block.body && <p className="text-muted-foreground font-body text-lg leading-relaxed mb-6">{block.body}</p>}
        {block.cta_text && block.cta_url && (
          <Button asChild size="lg" className="rounded-full px-8 py-6 font-heading font-bold bg-primary hover:bg-primary/90 text-white">
            <a href={block.cta_url}>{block.cta_text}</a>
          </Button>
        )}
      </div>
    );
  }

  // Left or Right layout
  return (
    <div className={`grid md:grid-cols-2 gap-12 items-center ${!isLeft ? 'md:[direction:rtl]' : ''}`}>
      {hasImage && (
        <div className="md:[direction:ltr]">
          <img src={block.image_url} alt={block.headline} className="w-full rounded-2xl object-cover" loading="lazy" />
        </div>
      )}
      <div className="md:[direction:ltr]">
        {block.headline && <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">{block.headline}</h2>}
        {block.body && <p className="text-muted-foreground font-body text-lg leading-relaxed mb-6">{block.body}</p>}
        {block.cta_text && block.cta_url && (
          <Button asChild size="lg" className="rounded-full px-8 py-6 font-heading font-bold bg-primary hover:bg-primary/90 text-white">
            <a href={block.cta_url}>{block.cta_text}</a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CustomBlock;

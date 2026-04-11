import { Button } from '@/components/ui/button';
import { useCmsTable } from '@/hooks/useCmsContent';
import type { SectionContentBlock } from '@/hooks/useCmsContent';

interface DynamicSectionProps {
  sectionId: string;
  columns?: number;
}

const DynamicSection = ({ sectionId, columns = 1 }: DynamicSectionProps) => {
  const { data: allBlocks } = useCmsTable<SectionContentBlock>('section_content_blocks');
  const blocks = (allBlocks || [])
    .filter(b => b.section_id === sectionId)
    .sort((a, b) => (a.column_index - b.column_index) || (a.row_order - b.row_order));

  if (blocks.length === 0) return null;

  // Group blocks by column
  const columnGroups: Record<number, SectionContentBlock[]> = {};
  blocks.forEach(b => {
    if (!columnGroups[b.column_index]) columnGroups[b.column_index] = [];
    columnGroups[b.column_index].push(b);
  });

  const colKeys = Object.keys(columnGroups).map(Number).sort();

  return (
    <div className={columns > 1 ? `grid gap-8 ${
      columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
      columns === 3 ? 'grid-cols-1 md:grid-cols-3' :
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }` : ''}>
      {colKeys.map(colIdx => (
        <div key={colIdx} className="space-y-4">
          {columnGroups[colIdx].map(block => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </div>
      ))}
    </div>
  );
};

function BlockRenderer({ block }: { block: SectionContentBlock }) {
  const content = block.content || {};

  switch (block.block_type) {
    case 'heading':
      return <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">{content.text}</h2>;
    case 'text':
      return <p className="text-muted-foreground font-body text-lg leading-relaxed">{content.text}</p>;
    case 'image':
      return (
        <img
          src={content.url}
          alt={content.alt || ''}
          className="w-full rounded-2xl object-cover"
          loading="lazy"
        />
      );
    case 'button':
      return (
        <Button asChild size="lg" className="rounded-full px-8 py-6 font-heading font-bold bg-primary hover:bg-primary/90 text-white">
          <a href={content.url}>{content.text}</a>
        </Button>
      );
    case 'spacer':
      return <div style={{ height: content.height || '2rem' }} />;
    default:
      return null;
  }
}

export default DynamicSection;

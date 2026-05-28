import { useCmsTable } from '@/hooks/useCmsContent';
import { Sparkles } from 'lucide-react';
import KawaiiDivider, { DividerVariant } from './KawaiiDivider';
import FramedImage, { type FramedImageColor } from './FramedImage';

export interface PageContentSection {
  id: string;
  page_key: string;
  section_key: string;
  eyebrow: string;
  headline: string;
  body: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
  list_items: string[];
  sort_order: number;
}

const DynamicSections = ({ pageKey, excludeSectionKeys = [] }: { pageKey: string; excludeSectionKeys?: string[] }) => {
  const { data: all } = useCmsTable<PageContentSection>('page_content_sections');
  const sections = (all || []).filter(
    (s) => s.page_key === pageKey && !excludeSectionKeys.includes(s.section_key),
  );

  if (!sections.length) return null;

  // Cycle of cute divider variants for variety between sections.
  const VARIANT_CYCLE: DividerVariant[] = ['wave', 'scallop', 'cloud', 'bumps', 'petals', 'zigzag-soft', 'brush', 'blob'];

  // Cycle pastel under-layer colors so each framed photo differs.
  const COLOR_CYCLE: FramedImageColor[] = ['baby-pink', 'baby-blue', 'lavender', 'mint', 'peach', 'yellow'];

  return (
    <div className="space-y-0">
      {sections.map((s, i) => {
        const alt = i % 2 === 1;
        const flip = i % 2 === 1;
        const hasImage = !!s.image_url;
        // Section bg: white (alt=false) or secondary/50 (alt=true).
        // Treat as 'white' / 'secondary-soft' for divider matching.
        const prevColor = i === 0 ? 'white' : ((i - 1) % 2 === 1 ? 'secondary-soft' : 'white');
        const thisColor = alt ? 'secondary-soft' : 'white';
        const variant = VARIANT_CYCLE[i % VARIANT_CYCLE.length];
        const stroke = thisColor === 'white' ? 'baby-pink' : 'baby-blue';

        return (
          <div key={s.id}>
            {prevColor !== thisColor && (
              <KawaiiDivider variant={variant} from={prevColor as any} to={thisColor as any} stroke={stroke as any} height={90} />
            )}
            <section
              className={`section-y section-x ${alt ? 'bg-secondary/50' : ''}`}
            >
            <div className="ds-container-content">
              <div className="ds-cols">
                <div
                  className={flip ? 'md:order-2' : 'md:order-1'}
                >
                  {hasImage ? (
                    <FramedImage
                      src={s.image_url}
                      alt={s.headline}
                      color={COLOR_CYCLE[i % COLOR_CYCLE.length]}
                      sectionBg={alt ? 'secondary' : 'white'}
                      className="w-full aspect-square"
                    />
                  ) : (
                    <div
                      aria-hidden
                      className="ds-img-hero flex items-center justify-center bg-gradient-to-br from-[hsl(var(--klawsome-baby-pink))] via-[hsl(var(--klawsome-baby-blue))]/60 to-[hsl(var(--klawsome-baby-pink))] text-foreground/70"
                    >
                      <Sparkles className="w-20 h-20 opacity-70" strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                <div
                  className={flip ? 'md:order-1' : 'md:order-2'}
                >
                  {s.eyebrow && <p className="ds-eyebrow">{s.eyebrow}</p>}
                  {s.headline && <h2 className="ds-h2 ds-stroke ds-stroke--navy mb-6">{s.headline}</h2>}
                  {s.body && (
                    <p className="ds-lead whitespace-pre-line">{s.body}</p>
                  )}
                  {Array.isArray(s.list_items) && s.list_items.length > 0 && (
                    <ul className="space-y-3 font-body text-foreground/80 mt-6">
                      {s.list_items.map((item, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.cta_text && s.cta_url && (
                    <a
                      href={s.cta_url}
                      className="inline-flex items-center gap-2 mt-8 rounded-full bg-foreground text-background hover:bg-foreground/90 font-heading font-bold text-xs uppercase tracking-wider px-8 py-3 transition-colors"
                    >
                      {s.cta_text}
                      <span>→</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
            </section>
          </div>
        );
      })}
    </div>
  );
};

export default DynamicSections;
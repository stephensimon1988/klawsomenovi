import { useCmsTable } from '@/hooks/useCmsContent';
import { Sparkles } from 'lucide-react';

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

const DynamicSections = ({ pageKey }: { pageKey: string }) => {
  const { data: all } = useCmsTable<PageContentSection>('page_content_sections');
  const sections = (all || []).filter((s) => s.page_key === pageKey);

  if (!sections.length) return null;

  return (
    <div className="space-y-0">
      {sections.map((s, i) => {
        const alt = i % 2 === 1;
        const flip = i % 2 === 1;
        const hasImage = !!s.image_url;

        return (
          <section
            key={s.id}
            className={`section-y section-x ${alt ? 'bg-secondary/50' : ''}`}
          >
            <div className="ds-container">
              <div className="grid gap-10 md:gap-16 items-center md:grid-cols-12">
                <div
                  className={`md:col-span-6 ${flip ? 'md:order-2' : 'md:order-1'}`}
                >
                  {hasImage ? (
                    <img
                      src={s.image_url}
                      alt={s.headline}
                      loading="lazy"
                      className="ds-img-hero"
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
                  className={`md:col-span-6 ${flip ? 'md:order-1' : 'md:order-2'}`}
                >
                  {s.eyebrow && <p className="ds-eyebrow">{s.eyebrow}</p>}
                  {s.headline && <h2 className="ds-h2 mb-6">{s.headline}</h2>}
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
        );
      })}
    </div>
  );
};

export default DynamicSections;
import { useCmsTable } from '@/hooks/useCmsContent';

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
        const isDark = i % 2 === 1;
        const flip = i % 2 === 1;
        const hasImage = !!s.image_url;
        const num = String(i + 1).padStart(2, '0');

        return (
          <section
            key={s.id}
            className={`section-y section-x border-t border-border/40 ${
              isDark ? 'bg-foreground text-background' : 'bg-background text-foreground'
            }`}
          >
            <div className="ds-container">
              {/* Top meta row: index + eyebrow */}
              <div className="flex items-baseline gap-6 mb-12 md:mb-16">
                <span
                  className={`font-heading font-bold text-2xl md:text-3xl tabular-nums ${
                    isDark ? 'text-background/50' : 'text-primary'
                  }`}
                >
                  {num}
                </span>
                <span
                  className={`flex-1 h-px ${isDark ? 'bg-background/20' : 'bg-foreground/15'}`}
                />
                {s.eyebrow && (
                  <p
                    className={`text-xs font-heading font-bold uppercase tracking-[0.2em] ${
                      isDark ? 'text-background/70' : 'text-primary'
                    }`}
                  >
                    {s.eyebrow}
                  </p>
                )}
              </div>

              <div
                className={`grid gap-12 md:gap-20 ${
                  hasImage ? 'md:grid-cols-12' : 'md:grid-cols-1'
                }`}
              >
                {/* Image column (alternating side) */}
                {hasImage && (
                  <div
                    className={`md:col-span-6 ${
                      flip ? 'md:order-2' : 'md:order-1'
                    }`}
                  >
                    <div className="overflow-hidden rounded-3xl">
                      <img
                        src={s.image_url}
                        alt={s.headline}
                        loading="lazy"
                        className="w-full aspect-[4/5] md:aspect-[3/4] object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                )}

                {/* Text column */}
                <div
                  className={`${
                    hasImage ? 'md:col-span-6' : 'md:col-span-12 max-w-4xl'
                  } ${flip ? 'md:order-1' : 'md:order-2'} flex flex-col justify-center`}
                >
                  {s.headline && (
                    <h2
                      className={`font-heading font-bold uppercase leading-[0.95] tracking-tight mb-8 ${
                        hasImage
                          ? 'text-[clamp(2rem,4.5vw,4rem)]'
                          : 'text-[clamp(2.5rem,6vw,5.5rem)]'
                      } ${isDark ? 'text-background' : 'text-foreground'}`}
                    >
                      {s.headline}
                    </h2>
                  )}
                  {s.body && (
                    <p
                      className={`text-lg md:text-xl font-body leading-relaxed whitespace-pre-line mb-6 ${
                        isDark ? 'text-background/80' : 'text-foreground/75'
                      }`}
                    >
                      {s.body}
                    </p>
                  )}
                  {Array.isArray(s.list_items) && s.list_items.length > 0 && (
                    <ul
                      className={`mt-4 divide-y ${
                        isDark ? 'divide-background/15' : 'divide-foreground/10'
                      }`}
                    >
                      {s.list_items.map((item, idx) => (
                        <li
                          key={idx}
                          className={`flex gap-6 py-4 font-body text-base md:text-lg ${
                            isDark ? 'text-background/85' : 'text-foreground/80'
                          }`}
                        >
                          <span
                            className={`font-heading font-bold tabular-nums text-sm pt-1 ${
                              isDark ? 'text-background/50' : 'text-primary'
                            }`}
                          >
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.cta_text && s.cta_url && (
                    <a
                      href={s.cta_url}
                      className={`group inline-flex items-center gap-3 mt-10 self-start rounded-full font-heading font-bold text-xs uppercase tracking-[0.2em] px-7 py-4 transition-all ${
                        isDark
                          ? 'bg-background text-foreground hover:bg-primary hover:text-primary-foreground'
                          : 'bg-foreground text-background hover:bg-primary hover:text-primary-foreground'
                      }`}
                    >
                      {s.cta_text}
                      <span className="transition-transform group-hover:translate-x-1">→</span>
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
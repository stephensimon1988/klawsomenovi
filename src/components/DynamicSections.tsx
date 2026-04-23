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
      {sections.map((s, i) => (
        <section
          key={s.id}
          className={`section-y section-x ${i % 2 === 1 ? 'bg-secondary/30' : ''}`}
        >
          <div className="ds-container-narrow">
            {s.eyebrow && <p className="ds-eyebrow">{s.eyebrow}</p>}
            {s.headline && <h2 className="ds-h2 mb-4">{s.headline}</h2>}
            {s.body && <p className="ds-lead mb-6 whitespace-pre-line">{s.body}</p>}
            {s.image_url && (
              <img
                src={s.image_url}
                alt={s.headline}
                loading="lazy"
                className="rounded-2xl w-full max-h-[480px] object-cover my-6"
              />
            )}
            {Array.isArray(s.list_items) && s.list_items.length > 0 && (
              <ul className="space-y-3 font-body text-foreground/80 mt-4">
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
                className="inline-block mt-8 rounded-full bg-primary text-white font-heading font-bold text-xs tracking-wider px-6 py-3 hover:bg-primary/90 transition-colors"
              >
                {s.cta_text}
              </a>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export default DynamicSections;
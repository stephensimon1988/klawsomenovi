import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import { useCmsTable, usePageHero } from '@/hooks/useCmsContent';
import PageHero from '@/components/PageHero';

interface GalleryPhoto { id: string; section: string; caption: string; image_url: string; sort_order: number; }

const Gallery = () => {
  const { data: photos } = useCmsTable<GalleryPhoto>('gallery_photos');
  const { data: hero } = usePageHero('gallery');
  const [lightbox, setLightbox] = useState<{ items: GalleryPhoto[]; index: number } | null>(null);

  // Group by section
  const grouped = (photos || []).reduce<Record<string, GalleryPhoto[]>>((acc, p) => {
    const key = p.section || 'gallery';
    (acc[key] = acc[key] || []).push(p);
    return acc;
  }, {});

  const sectionLabels: Record<string, string> = {
    beginning: 'In the Beginning',
    private: 'Private Parties',
    'semi-private': 'Semi-Private Events',
    gallery: 'The Arcade',
  };

  const close = useCallback(() => setLightbox(null), []);
  const next = useCallback(() => {
    setLightbox((lb) => (lb ? { ...lb, index: (lb.index + 1) % lb.items.length } : lb));
  }, []);
  const prev = useCallback(() => {
    setLightbox((lb) => (lb ? { ...lb, index: (lb.index - 1 + lb.items.length) % lb.items.length } : lb));
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, close, next, prev]);

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />

      <PageHero
        eyebrow={hero?.eyebrow || 'Moments'}
        title={hero?.title || 'Klawsome Gallery'}
        subtitle={hero?.subtitle || 'From the build-out to grand opening to every birthday after.'}
        imageUrl={hero?.image_url || ''}
      />

      {Object.entries(grouped).map(([section, items]) => (
        <section key={section} className="section-y section-x">
          <div className="ds-container">
            <h2 className="ds-h2 uppercase mb-12 border-t border-foreground pt-6">
              {sectionLabels[section] || section.replace(/[_-]+/g, ' ')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((p, idx) => (
                <figure key={p.id} className="group">
                  <button
                    type="button"
                    onClick={() => setLightbox({ items, index: idx })}
                    className="block w-full overflow-hidden rounded-2xl bg-secondary cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={p.caption || 'Open image'}
                  >
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.caption}
                        loading="lazy"
                        className="ds-img-thumb group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : null}
                  </button>
                  {p.caption && (
                    <figcaption className="mt-3 text-sm font-body text-muted-foreground">{p.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      ))}

      {(!photos || photos.length === 0) && (
        <section className="section-y section-x text-center text-muted-foreground font-body">No photos yet — add some in the Command Center.</section>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
            aria-label="Previous"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
            aria-label="Next"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
          <figure
            className="max-w-[92vw] max-h-[88vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.items[lightbox.index].image_url}
              alt={lightbox.items[lightbox.index].caption || ''}
              className="max-w-[92vw] max-h-[78vh] object-contain rounded-lg shadow-2xl"
            />
            <figcaption className="text-white/80 font-body text-sm text-center">
              {lightbox.items[lightbox.index].caption}
              <span className="ml-3 text-white/50">{lightbox.index + 1} / {lightbox.items.length}</span>
            </figcaption>
          </figure>
        </div>
      )}

      <KawaiiFooter />
    </div>
  );
};

export default Gallery;

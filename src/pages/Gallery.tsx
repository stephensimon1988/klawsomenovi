import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import { useCmsTable } from '@/hooks/useCmsContent';

interface GalleryPhoto { id: string; section: string; caption: string; image_url: string; sort_order: number; }

const Gallery = () => {
  const { data: photos } = useCmsTable<GalleryPhoto>('gallery_photos');

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

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />

      {/* Hero */}
      <section className="ds-page-hero">
        <div className="ds-container">
          <p className="ds-eyebrow mb-6">Moments</p>
          <h1 className="ds-h1 mb-8 max-w-4xl">
            Klawsome<br/>Gallery
          </h1>
          <p className="ds-lead max-w-2xl">
            From the build-out to grand opening to every birthday after — a look inside the arcade.
          </p>
        </div>
      </section>

      {Object.entries(grouped).map(([section, items]) => (
        <section key={section} className="section-y section-x">
          <div className="ds-container">
            <h2 className="ds-h2 uppercase mb-12 border-t border-foreground pt-6">
              {sectionLabels[section] || section}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((p) => (
                <figure key={p.id} className="group">
                  <div className="overflow-hidden rounded-2xl bg-secondary">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.caption}
                        loading="lazy"
                        className="ds-img-thumb group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : null}
                  </div>
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

      <KawaiiFooter />
    </div>
  );
};

export default Gallery;

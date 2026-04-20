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
      <section className="pt-32 pb-16 px-6 lg:px-12">
        <div className="container mx-auto">
          <p className="text-xs font-heading font-bold text-primary uppercase tracking-[0.2em] mb-6">Moments</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold uppercase leading-[0.95] mb-8 max-w-4xl">
            Klawsome<br/>Gallery
          </h1>
          <p className="text-muted-foreground font-body text-lg max-w-2xl">
            From the build-out to grand opening to every birthday after — a look inside the arcade.
          </p>
        </div>
      </section>

      {Object.entries(grouped).map(([section, items]) => (
        <section key={section} className="py-20 px-6 lg:px-12">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-12 border-t border-foreground pt-6">
              {sectionLabels[section] || section}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((p) => (
                <figure key={p.id} className="group">
                  <div className="aspect-square overflow-hidden rounded-2xl bg-secondary">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.caption}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
        <section className="py-28 px-6 text-center text-muted-foreground font-body">No photos yet — add some in the Command Center.</section>
      )}

      <KawaiiFooter />
    </div>
  );
};

export default Gallery;

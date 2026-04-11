/**
 * Auto-layout gallery that picks a template based on image count.
 * 1 image  → full-width hero
 * 2 images → 2-col equal
 * 3 images → 1 large + 2 stacked
 * 4 images → 2×2 grid
 * 5+ images → masonry-ish grid
 */
interface SectionPhotoGalleryProps {
  photos: string[];
}

const SectionPhotoGallery = ({ photos }: SectionPhotoGalleryProps) => {
  if (!photos || photos.length === 0) return null;

  const img = (src: string, className: string) => (
    <img key={src} src={src} alt="" loading="lazy" className={`w-full h-full object-cover rounded-2xl ${className}`} />
  );

  if (photos.length === 1) {
    return <div className="w-full aspect-[16/7] overflow-hidden rounded-2xl">{img(photos[0], '')}</div>;
  }

  if (photos.length === 2) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {photos.map(p => <div key={p} className="aspect-[4/3] overflow-hidden rounded-2xl">{img(p, '')}</div>)}
      </div>
    );
  }

  if (photos.length === 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:row-span-2 aspect-square md:aspect-auto overflow-hidden rounded-2xl">{img(photos[0], '')}</div>
        <div className="aspect-[4/3] overflow-hidden rounded-2xl">{img(photos[1], '')}</div>
        <div className="aspect-[4/3] overflow-hidden rounded-2xl">{img(photos[2], '')}</div>
      </div>
    );
  }

  if (photos.length === 4) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {photos.map(p => <div key={p} className="aspect-[4/3] overflow-hidden rounded-2xl">{img(p, '')}</div>)}
      </div>
    );
  }

  // 5+ photos: first image large, rest in a grid
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="col-span-2 row-span-2 aspect-square overflow-hidden rounded-2xl">{img(photos[0], '')}</div>
      {photos.slice(1).map(p => (
        <div key={p} className="aspect-square overflow-hidden rounded-2xl">{img(p, '')}</div>
      ))}
    </div>
  );
};

export default SectionPhotoGallery;

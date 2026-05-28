import { cn } from '@/lib/utils';

/**
 * Pastel under-layer tokens defined in index.css (e.g. --klawsome-baby-pink).
 * Used to vary the offset panel color from section to section.
 */
export type FramedImageColor =
  | 'baby-pink'
  | 'baby-blue'
  | 'lavender'
  | 'mint'
  | 'peach'
  | 'yellow';

/** Background of the section the image sits in, used to avoid a matching under-layer. */
export type FramedImageSectionBg =
  | FramedImageColor
  | 'secondary'
  | 'white'
  | 'background'
  | 'navy'
  | 'primary';

const COLOR_CYCLE: FramedImageColor[] = [
  'baby-pink',
  'baby-blue',
  'lavender',
  'mint',
  'peach',
  'yellow',
];

/** Normalize a section bg to the pastel family it visually matches (if any). */
const sectionToFamily = (bg?: FramedImageSectionBg): FramedImageColor | null => {
  if (!bg) return null;
  // --secondary is the exact same HSL value as --klawsome-baby-blue.
  if (bg === 'secondary') return 'baby-blue';
  if (COLOR_CYCLE.includes(bg as FramedImageColor)) return bg as FramedImageColor;
  // white / background / navy / primary never match a pastel under-layer.
  return null;
};

interface FramedImageProps {
  src: string;
  alt: string;
  /** Pastel token used for the stationary offset under-layer. */
  color?: FramedImageColor;
  /**
   * Background of the section this image sits in. If the chosen `color` would
   * blend into it, the under-layer automatically shifts to a contrasting pastel.
   */
  sectionBg?: FramedImageSectionBg;
  /** Frame rotation in degrees (clockwise). The photo stays upright. */
  rotate?: number;
  /** Classes applied to the rotating frame (size / aspect ratio live here). */
  className?: string;
  /** Extra classes for the <img> itself. */
  imgClassName?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * Photo treatment used across the site:
 *  - a stationary, colored, offset rounded panel sitting behind the photo
 *  - a frame that rotates slightly (only the frame turns); on hover it
 *    straightens to sit flush over the stationary under-layer
 *  - the photo inside counter-rotates so it stays perfectly upright, zooming
 *    in a touch on hover as the frame levels out.
 */
const FramedImage = ({
  src,
  alt,
  color = 'baby-pink',
  sectionBg,
  rotate = 5,
  className,
  imgClassName,
  loading = 'lazy',
}: FramedImageProps) => {
  // Guard: never let the under-layer match its section background.
  const sectionFamily = sectionToFamily(sectionBg);
  let underColor = color;
  if (sectionFamily && underColor === sectionFamily) {
    const idx = COLOR_CYCLE.indexOf(underColor);
    underColor = COLOR_CYCLE[(idx + 1) % COLOR_CYCLE.length];
    if (underColor === sectionFamily) {
      underColor = COLOR_CYCLE[(idx + 2) % COLOR_CYCLE.length];
    }
  }

  return (
    <div className="group relative">
      {/* Stationary colored under-layer (never rotates). */}
      <div
        className="absolute -inset-3 rounded-kawaii"
        style={{ backgroundColor: `hsl(var(--klawsome-${underColor}))` }}
        aria-hidden
      />

      {/* Frame: only this layer rotates; straightens flush on hover. */}
      <div
        className={cn(
          'framed-frame relative overflow-hidden rounded-kawaii shadow-lg',
          className,
        )}
        style={{ ['--frame-rot' as string]: `${rotate}deg` }}
      >
        <img
          src={src}
          alt={alt}
          loading={loading}
          className={cn('framed-img w-full h-full object-cover', imgClassName)}
          /* Counter-rotate so the photo stays upright; scale fills the corners
             and grows slightly on hover. */
          style={{
            ['--img-rot' as string]: `${-rotate}deg`,
            ['--img-scale' as string]: '1.15',
            ['--img-scale-hover' as string]: '1.22',
          }}
        />
      </div>
    </div>
  );
};

export default FramedImage;
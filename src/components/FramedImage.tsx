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

interface FramedImageProps {
  src: string;
  alt: string;
  /** Pastel token used for the stationary offset under-layer. */
  color?: FramedImageColor;
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
 *  - a frame that rotates slightly (only the frame turns)
 *  - the photo inside counter-rotates so it stays perfectly upright, zoomed
 *    in just enough (scale) to keep the tilted frame fully covered.
 */
const FramedImage = ({
  src,
  alt,
  color = 'baby-pink',
  rotate = 5,
  className,
  imgClassName,
  loading = 'lazy',
}: FramedImageProps) => {
  return (
    <div className="relative">
      {/* Stationary colored under-layer (never rotates). */}
      <div
        className="absolute -inset-3 rounded-kawaii"
        style={{ backgroundColor: `hsl(var(--klawsome-${color}))` }}
        aria-hidden
      />

      {/* Frame: only this layer rotates. */}
      <div
        className={cn(
          'relative overflow-hidden rounded-kawaii shadow-lg',
          className,
        )}
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        <img
          src={src}
          alt={alt}
          loading={loading}
          className={cn('w-full h-full object-cover', imgClassName)}
          /* Counter-rotate so the photo stays upright; scale to fill corners. */
          style={{ transform: `rotate(${-rotate}deg) scale(1.15)` }}
        />
      </div>
    </div>
  );
};

export default FramedImage;
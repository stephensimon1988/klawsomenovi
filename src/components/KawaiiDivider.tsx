/**
 * KawaiiDivider — decorative SVG section dividers.
 *
 * Renders a full-width SVG that sits between two sections, transitioning
 * the color of the section ABOVE into the color of the section BELOW.
 *
 * Usage:
 *   <KawaiiDivider variant="wave" from="baby-blue" to="baby-pink" />
 *   <KawaiiDivider variant="scallop" from="white" to="baby-blue" flip />
 *
 * `from` is the top color (matches previous section bg).
 * `to`   is the bottom color (matches next section bg).
 * `flip` flips vertically for variety.
 */
import { cn } from '@/lib/utils';

type ColorKey = 'white' | 'baby-blue' | 'baby-pink' | 'red' | 'navy';

const COLOR_MAP: Record<ColorKey, string> = {
  white: 'hsl(var(--klawsome-white))',
  'baby-blue': 'hsl(var(--klawsome-baby-blue))',
  'baby-pink': 'hsl(var(--klawsome-baby-pink))',
  red: 'hsl(var(--klawsome-red))',
  navy: 'hsl(var(--klawsome-navy))',
};

export type DividerVariant = 'wave' | 'scallop' | 'cloud' | 'bumps' | 'zigzag-soft' | 'petals';

interface KawaiiDividerProps {
  variant?: DividerVariant;
  from: ColorKey;
  to: ColorKey;
  /** Stroke color for the dashed kawaii outline. Defaults to a contrasting baby-pink. */
  stroke?: ColorKey;
  flip?: boolean;
  className?: string;
  /** Height in px on desktop. Mobile auto-scales. */
  height?: number;
}

const KawaiiDivider = ({
  variant = 'wave',
  from,
  to,
  stroke = 'baby-pink',
  flip = false,
  className,
  height = 120,
}: KawaiiDividerProps) => {
  const fromColor = COLOR_MAP[from];
  const toColor = COLOR_MAP[to];
  const strokeColor = COLOR_MAP[stroke];

  // Each variant defines a path that fills the BOTTOM portion of a 1920x200 viewBox
  // with the `to` color. The top is filled with the `from` color via background.
  const PATHS: Record<DividerVariant, { d: string; dash?: string }> = {
    wave: {
      d: 'M0,100 C320,40 640,160 960,100 C1280,40 1600,160 1920,100 L1920,200 L0,200 Z',
      dash: '12 8',
    },
    scallop: {
      d: 'M0,80 Q120,200 240,80 T480,80 T720,80 T960,80 T1200,80 T1440,80 T1680,80 T1920,80 L1920,200 L0,200 Z',
      dash: '6 6',
    },
    cloud: {
      d: 'M0,140 C100,80 200,80 300,140 C400,80 500,80 600,140 C700,80 800,80 900,140 C1000,80 1100,80 1200,140 C1300,80 1400,80 1500,140 C1600,80 1700,80 1800,140 C1850,110 1900,110 1920,130 L1920,200 L0,200 Z',
      dash: '10 6',
    },
    bumps: {
      d: 'M0,120 C160,20 320,20 480,120 C640,20 800,20 960,120 C1120,20 1280,20 1440,120 C1600,20 1760,20 1920,120 L1920,200 L0,200 Z',
      dash: '14 10',
    },
    'zigzag-soft': {
      d: 'M0,80 Q160,140 320,80 Q480,20 640,80 Q800,140 960,80 Q1120,20 1280,80 Q1440,140 1600,80 Q1760,20 1920,80 L1920,200 L0,200 Z',
      dash: '8 6',
    },
    petals: {
      d: 'M0,100 Q96,40 192,100 Q288,160 384,100 Q480,40 576,100 Q672,160 768,100 Q864,40 960,100 Q1056,160 1152,100 Q1248,40 1344,100 Q1440,160 1536,100 Q1632,40 1728,100 Q1824,160 1920,100 L1920,200 L0,200 Z',
      dash: '4 6',
    },
  };

  const { d, dash } = PATHS[variant];

  return (
    <div
      aria-hidden
      className={cn('w-full overflow-hidden leading-[0]', className)}
      style={{ backgroundColor: fromColor }}
    >
      <svg
        viewBox="0 0 1920 200"
        preserveAspectRatio="none"
        className="block w-full"
        style={{
          height: `${height}px`,
          transform: flip ? 'scaleY(-1)' : undefined,
        }}
      >
        <path d={d} fill={toColor} />
        {dash && (
          <path
            d={d}
            fill="none"
            stroke={strokeColor}
            strokeWidth={3}
            strokeDasharray={dash}
            strokeLinecap="round"
            opacity={0.85}
          />
        )}
      </svg>
    </div>
  );
};

export default KawaiiDivider;
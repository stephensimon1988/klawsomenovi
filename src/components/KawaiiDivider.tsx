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

type ColorKey =
  | 'white'
  | 'baby-blue'
  | 'baby-pink'
  | 'red'
  | 'navy'
  | 'yellow'
  | 'mint'
  | 'secondary-soft'
  | 'muted-soft';

const COLOR_MAP: Record<ColorKey, string> = {
  white: 'hsl(var(--klawsome-white))',
  'baby-blue': 'hsl(var(--klawsome-baby-blue))',
  'baby-pink': 'hsl(var(--klawsome-baby-pink))',
  red: 'hsl(var(--klawsome-red))',
  navy: 'hsl(var(--klawsome-navy))',
  yellow: 'hsl(var(--klawsome-yellow))',
  mint: 'hsl(var(--kawaii-mint))',
  // Approximate matches for translucent section backgrounds (bg-secondary/40, bg-muted/30)
  // sitting on top of white — these blend close to very pale baby-blue/baby-pink.
  'secondary-soft': 'hsl(190 75% 96%)',
  'muted-soft': 'hsl(340 60% 96%)',
};

export type DividerVariant =
  | 'wave'
  | 'scallop'
  | 'cloud'
  | 'bumps'
  | 'zigzag-soft'
  | 'petals'
  | 'drip'
  | 'drip-heavy'
  | 'torn'
  | 'brush'
  | 'icicle'
  | 'blob';

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

  // For each variant we define:
  //   fill: a closed path filling the BOTTOM portion with the `to` color
  //   line: just the top edge curve (used for the dashed kawaii outline so the
  //         dashes only appear ON the curve — never along sides or bottom)
  const PATHS: Record<DividerVariant, { fill: string; line: string; dash?: string }> = {
    wave: {
      fill: 'M0,100 C320,40 640,160 960,100 C1280,40 1600,160 1920,100 L1920,200 L0,200 Z',
      line: 'M0,100 C320,40 640,160 960,100 C1280,40 1600,160 1920,100',
      dash: '12 8',
    },
    scallop: {
      fill: 'M0,80 Q120,200 240,80 T480,80 T720,80 T960,80 T1200,80 T1440,80 T1680,80 T1920,80 L1920,200 L0,200 Z',
      line: 'M0,80 Q120,200 240,80 T480,80 T720,80 T960,80 T1200,80 T1440,80 T1680,80 T1920,80',
      dash: '6 6',
    },
    cloud: {
      fill: 'M0,140 C100,80 200,80 300,140 C400,80 500,80 600,140 C700,80 800,80 900,140 C1000,80 1100,80 1200,140 C1300,80 1400,80 1500,140 C1600,80 1700,80 1800,140 C1850,110 1900,110 1920,130 L1920,200 L0,200 Z',
      line: 'M0,140 C100,80 200,80 300,140 C400,80 500,80 600,140 C700,80 800,80 900,140 C1000,80 1100,80 1200,140 C1300,80 1400,80 1500,140 C1600,80 1700,80 1800,140 C1850,110 1900,110 1920,130',
      dash: '10 6',
    },
    bumps: {
      fill: 'M0,120 C160,20 320,20 480,120 C640,20 800,20 960,120 C1120,20 1280,20 1440,120 C1600,20 1760,20 1920,120 L1920,200 L0,200 Z',
      line: 'M0,120 C160,20 320,20 480,120 C640,20 800,20 960,120 C1120,20 1280,20 1440,120 C1600,20 1760,20 1920,120',
      dash: '14 10',
    },
    'zigzag-soft': {
      fill: 'M0,80 Q160,140 320,80 Q480,20 640,80 Q800,140 960,80 Q1120,20 1280,80 Q1440,140 1600,80 Q1760,20 1920,80 L1920,200 L0,200 Z',
      line: 'M0,80 Q160,140 320,80 Q480,20 640,80 Q800,140 960,80 Q1120,20 1280,80 Q1440,140 1600,80 Q1760,20 1920,80',
      dash: '8 6',
    },
    petals: {
      fill: 'M0,100 Q96,40 192,100 Q288,160 384,100 Q480,40 576,100 Q672,160 768,100 Q864,40 960,100 Q1056,160 1152,100 Q1248,40 1344,100 Q1440,160 1536,100 Q1632,40 1728,100 Q1824,160 1920,100 L1920,200 L0,200 Z',
      line: 'M0,100 Q96,40 192,100 Q288,160 384,100 Q480,40 576,100 Q672,160 768,100 Q864,40 960,100 Q1056,160 1152,100 Q1248,40 1344,100 Q1440,160 1536,100 Q1632,40 1728,100 Q1824,160 1920,100',
      dash: '4 6',
    },
    // Paint drips — gentle dripping line with a few longer drops
    drip: {
      fill: 'M0,60 L0,200 L1920,200 L1920,60 C1880,90 1860,75 1830,65 C1800,55 1780,80 1760,95 C1740,75 1720,60 1690,65 C1660,75 1650,140 1620,150 C1590,160 1580,75 1550,65 C1500,55 1480,90 1450,80 C1410,70 1390,60 1360,70 C1320,80 1310,170 1280,180 C1250,190 1240,75 1210,65 C1170,55 1150,95 1120,90 C1080,82 1060,60 1030,68 C1000,76 990,135 960,145 C930,155 920,72 890,65 C850,57 830,90 800,82 C760,72 740,60 710,70 C670,82 660,160 630,170 C600,180 590,72 560,65 C520,57 500,95 470,88 C430,80 410,60 380,70 C340,82 330,150 300,160 C270,170 260,72 230,65 C190,57 170,90 140,82 C100,72 80,60 50,68 C28,74 14,72 0,60 Z',
      line: 'M0,60 C28,74 14,72 50,68 C80,60 100,72 140,82 C170,90 190,57 230,65 C260,72 270,170 300,160 C330,150 340,82 380,70 C410,60 430,80 470,88 C500,95 520,57 560,65 C590,72 600,180 630,170 C660,160 670,82 710,70 C740,60 760,72 800,82 C830,90 850,57 890,65 C920,72 930,155 960,145 C990,135 1000,76 1030,68 C1060,60 1080,82 1120,90 C1150,95 1170,55 1210,65 C1240,75 1250,190 1280,180 C1310,170 1320,80 1360,70 C1390,60 1410,70 1450,80 C1480,90 1500,55 1550,65 C1580,75 1590,160 1620,150 C1650,140 1660,75 1690,65 C1720,60 1740,75 1760,95 C1780,80 1800,55 1830,65 C1860,75 1880,90 1920,60',
    },
    // Heavier paint with multiple long drops hanging down
    'drip-heavy': {
      fill: 'M0,40 L0,200 L1920,200 L1920,40 C1890,55 1870,45 1845,52 C1820,60 1810,180 1780,180 C1755,180 1750,55 1720,50 C1685,45 1670,80 1640,75 C1605,70 1595,170 1565,170 C1535,170 1525,55 1495,50 C1460,45 1445,90 1415,82 C1380,72 1370,160 1340,160 C1310,160 1305,55 1275,50 C1240,45 1225,85 1195,78 C1160,70 1150,180 1120,180 C1090,180 1085,55 1055,50 C1020,45 1005,80 975,75 C940,70 930,170 900,170 C870,170 865,55 835,50 C800,45 785,90 755,82 C720,72 710,160 680,160 C650,160 645,55 615,50 C580,45 565,85 535,78 C500,70 490,180 460,180 C430,180 425,55 395,50 C360,45 345,80 315,75 C280,70 270,150 240,150 C212,150 205,55 175,50 C140,45 125,85 95,78 C60,70 30,55 0,40 Z',
      line: 'M0,40 C30,55 60,70 95,78 C125,85 140,45 175,50 C205,55 212,150 240,150 C270,150 280,70 315,75 C345,80 360,45 395,50 C425,55 430,180 460,180 C490,180 500,70 535,78 C565,85 580,45 615,50 C645,55 650,160 680,160 C710,160 720,72 755,82 C785,90 800,45 835,50 C865,55 870,170 900,170 C930,170 940,70 975,75 C1005,80 1020,45 1055,50 C1085,55 1090,180 1120,180 C1150,180 1160,70 1195,78 C1225,85 1240,45 1275,50 C1305,55 1310,160 1340,160 C1370,160 1380,72 1415,82 C1445,90 1460,45 1495,50 C1525,55 1535,170 1565,170 C1595,170 1605,70 1640,75 C1670,80 1685,45 1720,50 C1750,55 1755,180 1780,180 C1810,180 1820,60 1845,52 C1870,45 1890,55 1920,40',
    },
    // Torn paper — irregular jagged edge
    torn: {
      fill: 'M0,70 L0,200 L1920,200 L1920,55 L1880,80 L1840,50 L1800,90 L1760,60 L1720,85 L1680,55 L1640,95 L1600,65 L1560,82 L1520,50 L1480,88 L1440,58 L1400,78 L1360,52 L1320,92 L1280,62 L1240,80 L1200,50 L1160,90 L1120,68 L1080,82 L1040,55 L1000,85 L960,60 L920,90 L880,55 L840,82 L800,50 L760,88 L720,60 L680,80 L640,52 L600,92 L560,62 L520,85 L480,55 L440,90 L400,68 L360,82 L320,55 L280,85 L240,60 L200,90 L160,55 L120,82 L80,50 L40,88 L0,70 Z',
      line: 'M0,70 L40,88 L80,50 L120,82 L160,55 L200,90 L240,60 L280,85 L320,55 L360,82 L400,68 L440,90 L480,55 L520,85 L560,62 L600,92 L640,52 L680,80 L720,60 L760,88 L800,50 L840,82 L880,55 L920,90 L960,60 L1000,85 L1040,55 L1080,82 L1120,68 L1160,90 L1200,50 L1240,80 L1280,62 L1320,92 L1360,52 L1400,78 L1440,58 L1480,88 L1520,50 L1560,82 L1600,65 L1640,95 L1680,55 L1720,85 L1760,60 L1800,90 L1840,50 L1880,80 L1920,55',
    },
    // Painted brush stroke — soft uneven horizontal
    brush: {
      fill: 'M0,90 C160,70 320,110 480,85 C640,60 800,115 960,95 C1120,75 1280,120 1440,90 C1600,65 1760,108 1920,85 L1920,200 L0,200 Z',
      line: 'M0,90 C160,70 320,110 480,85 C640,60 800,115 960,95 C1120,75 1280,120 1440,90 C1600,65 1760,108 1920,85',
    },
    // Icicle / sharp drips — pointed downward triangles
    icicle: {
      fill: 'M0,50 L0,200 L1920,200 L1920,50 L1880,50 L1860,150 L1840,50 L1800,50 L1780,180 L1760,50 L1720,50 L1700,140 L1680,50 L1640,50 L1620,170 L1600,50 L1560,50 L1540,120 L1520,50 L1480,50 L1460,160 L1440,50 L1400,50 L1380,130 L1360,50 L1320,50 L1300,175 L1280,50 L1240,50 L1220,140 L1200,50 L1160,50 L1140,165 L1120,50 L1080,50 L1060,125 L1040,50 L1000,50 L980,170 L960,50 L920,50 L900,135 L880,50 L840,50 L820,180 L800,50 L760,50 L740,145 L720,50 L680,50 L660,160 L640,50 L600,50 L580,130 L560,50 L520,50 L500,170 L480,50 L440,50 L420,140 L400,50 L360,50 L340,165 L320,50 L280,50 L260,125 L240,50 L200,50 L180,175 L160,50 L120,50 L100,150 L80,50 L40,50 L20,160 L0,50 Z',
      line: 'M0,50 L20,160 L40,50 L80,50 L100,150 L120,50 L160,50 L180,175 L200,50 L240,50 L260,125 L280,50 L320,50 L340,165 L360,50 L400,50 L420,140 L440,50 L480,50 L500,170 L520,50 L560,50 L580,130 L600,50 L640,50 L660,160 L680,50 L720,50 L740,145 L760,50 L800,50 L820,180 L840,50 L880,50 L900,135 L920,50 L960,50 L980,170 L1000,50 L1040,50 L1060,125 L1080,50 L1120,50 L1140,165 L1160,50 L1200,50 L1220,140 L1240,50 L1280,50 L1300,175 L1320,50 L1360,50 L1380,130 L1400,50 L1440,50 L1460,160 L1480,50 L1520,50 L1540,120 L1560,50 L1600,50 L1620,170 L1640,50 L1680,50 L1700,140 L1720,50 L1760,50 L1780,180 L1800,50 L1840,50 L1860,150 L1880,50 L1920,50',
    },
    // Big bubbly blobs — large rounded organic bumps
    blob: {
      fill: 'M0,110 C80,140 200,160 320,110 C440,55 520,40 640,90 C760,140 880,160 960,110 C1040,60 1160,40 1280,90 C1400,140 1520,160 1640,110 C1760,55 1840,55 1920,90 L1920,200 L0,200 Z',
      line: 'M0,110 C80,140 200,160 320,110 C440,55 520,40 640,90 C760,140 880,160 960,110 C1040,60 1160,40 1280,90 C1400,140 1520,160 1640,110 C1760,55 1840,55 1920,90',
    },
  };

  const { fill, line, dash } = PATHS[variant];

  return (
    <div
      aria-hidden
      data-kawaii-divider
      data-divider-variant={variant}
      data-divider-from={from}
      data-divider-to={to}
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
        <path d={fill} fill={toColor} />
        {dash && (
          <path
            d={line}
            fill="none"
            stroke={strokeColor}
            strokeWidth={3}
            strokeDasharray={dash}
            strokeLinecap="round"
            opacity={0.9}
          />
        )}
      </svg>
    </div>
  );
};

export default KawaiiDivider;
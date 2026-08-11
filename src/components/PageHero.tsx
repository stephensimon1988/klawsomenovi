import { ReactNode, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { openBookingModal } from './BookNowDialog';

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  imageUrl: string;
  children?: ReactNode;
  align?: 'left' | 'center';
  height?: 'md' | 'lg';
  hideJoinCta?: boolean;
  jumpLinks?: { label: string; id: string }[];
  overlay?: 'gradient' | 'white' | 'solid-white';
  backgroundPosition?: string;
}

// Curated real photos pulled from the Gallery — used as deterministic
// per-route hero fallbacks so subpages don't all share the same image.
const GALLERY_HEROES = [
  'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/2bb292a8-8873-46e9-a975-d3cb7f14825d/PHOTO-2025-09-02-19-49-33.webp',
  'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/c06c88ff-f9f2-466c-80e3-02444aa01d22/PXL_20250822_201918587.webp',
  '/__l5e/assets-v1/886dba37-ed72-4b82-9bd7-b48fd79e12cd/KlawsomeCrewSelfieWall.webp',
  'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/a94b12dd-ae78-4248-af3e-4f9277f1056f/PXL_20251123_165437496.MP.webp',
  'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/646f8aba-749e-4931-b275-6e5394eb8d9d/PXL_20251123_164340558.webp',
  'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9afcf44d-4bde-4a78-bc61-961613b981c2/PXL_20251123_164404578.webp',
  'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/720c33bf-ce63-4135-82dc-3f34cdb68158/IMG-20251123-WA0066.webp',
  'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/62b3a497-40c2-49d2-961a-aa6c5850ce67/PXL_20251124_002021332.webp',
  'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/d50dbe5e-0b2a-4366-8f45-104da8f0b11a/PXL_20251124_002020087.MP.webp',
  'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/fa35626f-d9ca-4cdf-bbe0-27ed04fe3de1/unnamed+%285%29.webp',
  'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/33b38672-5286-4f40-a9bd-96bf778cf5a6/unnamed+%286%29.webp',
  '/images/klawsome-storefront.webp',
];

const hashPath = () => {
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  let hash = 0;
  for (let i = 0; i < path.length; i++) hash = (hash * 31 + path.charCodeAt(i)) >>> 0;
  return hash;
};

const pickGalleryHero = () => GALLERY_HEROES[hashPath() % GALLERY_HEROES.length];

const PageHero = ({ eyebrow, title, subtitle, imageUrl, children, align = 'left', height = 'lg', hideJoinCta = false, jumpLinks, overlay = 'gradient', backgroundPosition = 'center' }: PageHeroProps) => {
  const minH = height === 'lg' ? 'min-h-[70vh]' : 'min-h-[55vh]';
  const alignCls = align === 'center' ? 'text-center mx-auto' : '';
  const bg = imageUrl && imageUrl.trim() ? imageUrl : pickGalleryHero();
  const titleColor = 'hsl(var(--klawsome-navy))';
  const links = jumpLinks ?? [];
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    if (!sentinelRef.current || links.length === 0) return;
    const obs = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [links.length]);

  const linkBtnClass =
    'btn-cta bg-klawsome-navy text-white border border-klawsome-navy shadow-md transition-all duration-200 hover:bg-klawsome-yellow hover:text-klawsome-navy hover:border-klawsome-yellow hover:-translate-y-[5px] hover:shadow-[0_8px_24px_-4px_hsl(var(--klawsome-yellow)/0.7)] ';

  return (
    <>
      <section className={`relative ${minH} flex items-end overflow-hidden bg-secondary`}>
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{ backgroundImage: `url('${bg}')`, backgroundPosition }}
        />
        <div
          className={
            overlay === 'solid-white'
              ? 'absolute inset-0 bg-white'
              : overlay === 'white'
                ? 'absolute inset-0 bg-white/55'
                : 'absolute inset-0 bg-gradient-to-t from-white/85 via-white/55 to-white/20'
          }
        />
        <div className="relative z-10 ds-container section-x pb-20 pt-32 w-full">
          <div className={`max-w-3xl ${alignCls}`}>
            <h1 className="ds-h1 ds-stroke ds-stroke--h1 ds-stroke--navy mb-6">{title}</h1>
            {subtitle && <p className="ds-lead max-w-2xl mb-8" style={{ color: 'hsl(var(--klawsome-navy) / 0.8)' }}>{subtitle}</p>}
            {children}
            <nav aria-label="Quick actions" className={`flex flex-wrap gap-2 mb-6 ${align === 'center' ? 'justify-center' : ''}`}>
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="btn-cta bg-klawsome-red text-white border border-klawsome-red shadow-md transition-all duration-200 hover:bg-klawsome-yellow hover:text-klawsome-navy hover:border-klawsome-yellow hover:-translate-y-[5px] hover:shadow-[0_8px_24px_-4px_hsl(var(--klawsome-yellow)/0.7)]"
              >
                Book Event
              </button>
              <Link to="/store" className={linkBtnClass}>
                Store
              </Link>
            </nav>
          </div>
        </div>
        <div ref={sentinelRef} className="absolute bottom-0 left-0 h-px w-px" aria-hidden="true" />
      </section>
      <div aria-hidden className="h-px w-full bg-border" />
      {links.length > 0 && (
        <nav
          aria-label="Jump to section (sticky)"
          className={`fixed top-20 left-0 right-0 z-40 bg-klawsome-yellow shadow-md transition-all duration-300 ${
            stuck ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
          }`}
        >
          <div className="ds-container section-x py-2">
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {links.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  className="btn-cta bg-klawsome-navy text-white border border-klawsome-navy shadow-md transition-all duration-200 hover:bg-white hover:text-klawsome-navy hover:border-white hover:-translate-y-[5px] hover:shadow-[0_8px_24px_-4px_hsl(var(--klawsome-navy)/0.4)]"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default PageHero;

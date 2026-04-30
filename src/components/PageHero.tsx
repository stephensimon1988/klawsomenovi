import { ReactNode } from 'react';
import KawaiiDivider from './KawaiiDivider';

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  imageUrl: string;
  children?: ReactNode;
  align?: 'left' | 'center';
  height?: 'md' | 'lg';
}

const DEFAULT_HERO =
  'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/1f9d4fe0-5f54-4077-be1b-a5c20318ebbe/klawsome+in+the+news.webp';

const PageHero = ({ eyebrow, title, subtitle, imageUrl, children, align = 'left', height = 'lg' }: PageHeroProps) => {
  const minH = height === 'lg' ? 'min-h-[70vh]' : 'min-h-[55vh]';
  const alignCls = align === 'center' ? 'text-center mx-auto' : '';
  const bg = imageUrl && imageUrl.trim() ? imageUrl : DEFAULT_HERO;
  return (
    <>
      <section className={`relative ${minH} flex items-end overflow-hidden bg-secondary`}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${bg}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/15" />
        <div className="relative z-10 ds-container section-x pb-20 pt-32 w-full">
          <div className={`max-w-3xl ${alignCls}`}>
            {eyebrow && <p className="ds-eyebrow mb-6 text-white/80">{eyebrow}</p>}
            <h1 className="ds-h1 text-white mb-6">{title}</h1>
            {subtitle && <p className="ds-lead text-white/80 max-w-2xl mb-8">{subtitle}</p>}
            {children}
          </div>
        </div>
      </section>
      <KawaiiDivider variant="wave" from="navy" to="white" stroke="baby-pink" height={80} />
    </>
  );
};

export default PageHero;

import { ReactNode } from 'react';

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  imageUrl: string;
  children?: ReactNode;
  align?: 'left' | 'center';
  height?: 'md' | 'lg';
}

const PageHero = ({ eyebrow, title, subtitle, imageUrl, children, align = 'left', height = 'lg' }: PageHeroProps) => {
  const minH = height === 'lg' ? 'min-h-[85vh]' : 'min-h-[65vh]';
  const alignCls = align === 'center' ? 'text-center mx-auto' : '';
  return (
    <section className={`relative ${minH} flex items-end overflow-hidden bg-foreground`}>
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
      <div className="relative z-10 ds-container section-x pb-24 pt-32 w-full">
        <div className={`max-w-5xl ${alignCls}`}>
          {eyebrow && (
            <p className="ds-eyebrow mb-8 text-white/90 flex items-center gap-3">
              <span className="inline-block h-px w-10 bg-white/60" />
              {eyebrow}
            </p>
          )}
          <h1 className="font-heading font-bold uppercase text-white mb-8 leading-[0.92] tracking-tight text-[clamp(3rem,9vw,8rem)]">
            {title}
          </h1>
          {subtitle && <p className="ds-lead text-white/85 max-w-2xl mb-8">{subtitle}</p>}
          {children}
        </div>
      </div>
    </section>
  );
};

export default PageHero;

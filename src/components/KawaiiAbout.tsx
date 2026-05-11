import { useGsapScroll, useGsapStagger } from '@/hooks/useGsapScroll';
import { Button } from './ui/button';
import LottieAccent from './LottieAccent';
import { useCmsSingle, useCmsTable, type HomepageContent, type HomepageStep } from '@/hooks/useCmsContent';

const fallbackImages = [
  '/steps/play-klaw-machines.gif',
  '/steps/win-plushies.gif',
  '/steps/trade-up.gif',
];

const KawaiiAbout = () => {
  const headerRef = useGsapScroll<HTMLDivElement>({ type: 'slideUp', distance: 60 });
  const gridRef = useGsapStagger<HTMLDivElement>({ type: 'scaleIn', stagger: 0.2, duration: 0.9 });
  const ctaRef = useGsapScroll<HTMLDivElement>({ type: 'fadeIn', delay: 0.5 });

  const { data: content } = useCmsSingle<HomepageContent>('homepage_content');
  const { data: steps } = useCmsTable<HomepageStep>('homepage_steps');

  const aboutTitle = content?.about_title || 'From tokens to prizes in four moves';
  const aboutSubtitle = content?.about_subtitle || "It's simple. Buy tokens, play the machines you want, win what you grab, and trade up for something bigger. That's the whole game.";

  const displaySteps = steps?.length ? steps : [
    { id: '1', icon: '/steps/play-klaw-machines.gif', title: 'Buy Tokens', description: '', sort_order: 0 },
    { id: '2', icon: '/steps/win-plushies.gif', title: 'Win Plushies', description: '', sort_order: 1 },
    { id: '3', icon: '/steps/trade-up.gif', title: 'Upgrade', description: '', sort_order: 2 },
  ];

  return (
    <section id="about" className="bg-secondary relative overflow-hidden">
      <LottieAccent type="sparkle" className="absolute top-12 left-12 opacity-20 z-10" size={80} />

      <div className="relative bg-klawsome-baby-pink">
        {/* Top wavy edge */}
        <svg className="absolute -top-px left-0 w-full h-12 text-secondary" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
          <path d="M0,0 L1440,0 L1440,30 C1200,60 960,0 720,30 C480,60 240,0 0,30 Z" fill="currentColor" />
        </svg>
        {/* Bottom wavy edge */}
        <svg className="absolute -bottom-px left-0 w-full h-12 text-secondary rotate-180" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
          <path d="M0,0 L1440,0 L1440,30 C1200,60 960,0 720,30 C480,60 240,0 0,30 Z" fill="currentColor" />
        </svg>

        {/* Inner dashed wavy decorations */}
        <svg className="absolute top-8 left-0 w-full h-10 pointer-events-none" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden>
          <path d="M0,20 C240,0 480,40 720,20 C960,0 1200,40 1440,20" fill="none" stroke="hsl(var(--klawsome-baby-pink) / 0.9)" strokeWidth="3" strokeDasharray="14 10" style={{ stroke: 'hsl(340 70% 70%)' }} />
        </svg>
        <svg className="absolute bottom-8 left-0 w-full h-10 pointer-events-none" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden>
          <path d="M0,20 C240,40 480,0 720,20 C960,40 1200,0 1440,20" fill="none" strokeWidth="3" strokeDasharray="14 10" style={{ stroke: 'hsl(340 70% 70%)' }} />
        </svg>

        <div className="ds-container section-y section-x relative">
          <div ref={headerRef} className="text-center mb-14" style={{ opacity: 0 }}>
            <h2 className="ds-h2" style={{ color: 'hsl(var(--klawsome-navy))' }}>How to Play!</h2>
          </div>

          <div ref={gridRef} className="grid md:grid-cols-3 gap-10 w-full max-w-5xl mx-auto">
            {displaySteps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center text-center">
                <div className="h-40 w-full flex items-center justify-center mb-4">
                  {step.icon && (/^https?:\/\//.test(step.icon) || step.icon.startsWith('/')) ? (
                    <img src={step.icon} alt={step.title} className="max-h-40 max-w-full object-contain" />
                  ) : step.icon && step.icon.length <= 4 ? (
                    <span className="text-6xl" aria-hidden>{step.icon}</span>
                  ) : (
                    <img src={fallbackImages[index] || fallbackImages[0]} alt={step.title} className="max-h-40 max-w-full object-contain" />
                  )}
                </div>
                <h3 className="ds-h3" style={{ color: 'hsl(var(--klawsome-navy))' }}>{step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KawaiiAbout;

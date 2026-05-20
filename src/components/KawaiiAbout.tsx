import { useGsapScroll, useGsapStagger } from '@/hooks/useGsapScroll';
import LottieAccent from './LottieAccent';
import { useCmsTable, type HomepageStep } from '@/hooks/useCmsContent';

const fallbackImages = [
  '/steps/play-klaw-machines.webp',
  '/steps/win-plushies.webp',
  '/steps/trade-up.webp',
];

const KawaiiAbout = () => {
  const headerRef = useGsapScroll<HTMLDivElement>({ type: 'slideUp', distance: 60 });
  const gridRef = useGsapStagger<HTMLDivElement>({ type: 'scaleIn', stagger: 0.2, duration: 0.9 });

  const { data: steps } = useCmsTable<HomepageStep>('homepage_steps');

  const displaySteps = steps?.length ? steps : [
    { id: '1', icon: '🪙', title: 'Buy Tokens', description: '', sort_order: 0 },
    { id: '2', icon: '🎰', title: 'Win Plushies', description: '', sort_order: 1 },
    { id: '3', icon: '🧸', title: 'Upgrade', description: '', sort_order: 2 },
  ];

  return (
    <section id="about" className="section-y section-x bg-secondary relative overflow-hidden">
      <LottieAccent type="sparkle" className="absolute top-12 left-12 opacity-20" size={80} />

      <div className="ds-container">
        <div ref={headerRef} className="text-center mb-16" style={{ opacity: 0 }}>
          <h2 className="ds-h2 ds-stroke ds-stroke--navy">How to Play!</h2>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-3 gap-10 w-full">
          {displaySteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div className="h-64 md:h-72 w-full flex items-center justify-center mb-8">
                {step.icon && /^https?:\/\//.test(step.icon) ? (
                  <img src={step.icon} alt={step.title} className="max-h-full max-w-full object-contain" />
                ) : step.icon && step.icon.startsWith('/') ? (
                  <img src={step.icon} alt={step.title} className="max-h-full max-w-full object-contain" />
                ) : step.icon && step.icon.length <= 4 ? (
                  <span className="text-7xl" aria-hidden>{step.icon}</span>
                ) : (
                  <img src={fallbackImages[index] || fallbackImages[0]} alt={step.title} className="max-h-full max-w-full object-contain" />
                )}
              </div>
              <h3 className="ds-h3 ds-stroke ds-stroke--h3 ds-stroke--navy text-2xl md:text-3xl">{step.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KawaiiAbout;

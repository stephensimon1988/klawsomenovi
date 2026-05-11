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
    { id: '1', icon: '🪙', title: 'Start with tokens', description: 'Pick your price and get tokens to feed the machines.', sort_order: 0 },
    { id: '2', icon: '🎰', title: 'Choose your machine', description: 'Forty machines stand ready, each one different from the last.', sort_order: 1 },
    { id: '3', icon: '🧸', title: 'Trade up for the big ones', description: 'Collect points and redeem them for the jumbo plushies at our prize wall.', sort_order: 2 },
  ];

  return (
    <section id="about" className="section-y section-x bg-secondary relative overflow-hidden">
      <LottieAccent type="sparkle" className="absolute top-12 left-12 opacity-20" size={80} />

      <div className="ds-container">
        <div ref={headerRef} className="max-w-2xl mb-16" style={{ opacity: 0 }}>
          <p className="ds-eyebrow">How It Works</p>
          <h2 className="ds-h2 mb-6">
            {aboutTitle}
          </h2>
          <p className="ds-lead">
            {aboutSubtitle}
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-3 gap-10 w-full">
          {displaySteps.map((step, index) => (
            <div key={step.id} className="flex flex-col">
              <div className="aspect-[4/3] w-full flex items-center justify-center mb-6 rounded-2xl bg-secondary/40 p-8">
                {step.icon && /^https?:\/\//.test(step.icon) ? (
                  <img src={step.icon} alt={step.title} className="max-h-40 max-w-full object-contain" />
                ) : step.icon && step.icon.startsWith('/') ? (
                  <img src={step.icon} alt={step.title} className="max-h-40 max-w-full object-contain" />
                ) : step.icon && step.icon.length <= 4 ? (
                  <span className="text-6xl" aria-hidden>{step.icon}</span>
                ) : (
                  <img src={fallbackImages[index] || fallbackImages[0]} alt={step.title} className="max-h-40 max-w-full object-contain" />
                )}
              </div>
              <p className="ds-eyebrow mb-2">Step {index + 1}</p>
              <h3 className="ds-h3 mb-3">{step.title}</h3>
              <p className="ds-body">{step.description}</p>
            </div>
          ))}
        </div>

        <div ref={ctaRef} className="flex items-center gap-4 mt-14" style={{ opacity: 0 }}>
          <Button onClick={() => document.getElementById('tokens')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full px-8 font-heading font-bold text-xs tracking-wider bg-foreground text-background hover:bg-foreground/90 uppercase">
            Play
          </Button>
          <Button variant="ghost" onClick={() => document.getElementById('visit')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full font-heading font-bold text-xs tracking-wider text-foreground underline uppercase">
            Visit →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default KawaiiAbout;

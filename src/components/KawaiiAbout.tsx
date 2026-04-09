import { useGsapScroll, useGsapStagger } from '@/hooks/useGsapScroll';
import playKlawImg from '@/assets/play-klaw-machines.gif';
import winPlushiesImg from '@/assets/win-plushies.gif';
import tradeUpImg from '@/assets/trade-up.gif';
import { Button } from './ui/button';
import LottieAccent from './LottieAccent';
import { useCmsSingle, useCmsTable, type HomepageContent, type HomepageStep } from '@/hooks/useCmsContent';

const stepImages = [playKlawImg, winPlushiesImg, tradeUpImg];

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
    <section id="about" className="py-20 px-4 bg-kawaii-lavender/40 relative overflow-hidden">
      <LottieAccent type="sparkle" className="absolute top-8 left-8 opacity-30" size={90} />

      <div className="container mx-auto">
        <div ref={headerRef} className="text-center mb-4" style={{ opacity: 0 }}>
          <p className="text-sm font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2">Grab</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            {aboutTitle}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            {aboutSubtitle}
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
          {displaySteps.map((step, index) => (
            <div key={step.id} className="text-center flex flex-col items-center" style={{ opacity: 0 }}>
              <div className="h-40 w-40 flex items-center justify-center mb-5">
                <img src={stepImages[index] || stepImages[0]} alt={step.title} className="max-h-full max-w-full object-contain" />
              </div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div ref={ctaRef} className="flex items-center justify-center gap-4 mt-12" style={{ opacity: 0 }}>
          <Button onClick={() => document.getElementById('tokens')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full px-8 font-heading font-bold bg-foreground text-background hover:bg-foreground/90 glow-hover glow-pink">
            Play
          </Button>
          <Button variant="ghost" onClick={() => document.getElementById('visit')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full font-heading text-foreground underline glow-hover glow-pink">
            Visit →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default KawaiiAbout;

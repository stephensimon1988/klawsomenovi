import { useGsapScroll } from '@/hooks/useGsapScroll';
import LottieAccent from './LottieAccent';

const KawaiiStory = () => {
  const ref = useGsapScroll<HTMLDivElement>({ type: 'scaleIn', duration: 1 });

  return (
    <section className="py-20 px-4 bg-background relative overflow-hidden">
      <LottieAccent type="sparkle" className="absolute bottom-6 right-10 opacity-25" size={90} />

      <div className="container mx-auto max-w-3xl">
        <div ref={ref} className="text-center" style={{ opacity: 0 }}>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            The Klawsome Story
          </h2>
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            Klawsome! is Michigan's first stand-alone claw machine arcade, offering a unique and exciting experience where customers can test their skills to win kawaii-style plushies from vibrantly colored claw machines. We are a family-owned local business based in Novi, Michigan, inspired by the popular arcades in Asian countries.
          </p>
        </div>
      </div>
    </section>
  );
};

export default KawaiiStory;

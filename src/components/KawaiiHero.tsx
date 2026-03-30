import { motion } from 'framer-motion';
import { Sparkles, Heart, Star, Coins } from 'lucide-react';
import { Button } from './ui/button';

const FloatingIcon = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={`absolute ${className}`}
    animate={{ y: [0, -12, 0] }}
    transition={{ duration: 3, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

const KawaiiHero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-klawsome-navy">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-klawsome-navy via-klawsome-navy/95 to-klawsome-navy" />
      
      {/* Floating decorations */}
      <FloatingIcon delay={0} className="top-[15%] left-[10%]">
        <Heart className="w-10 h-10 text-primary opacity-40" fill="currentColor" />
      </FloatingIcon>
      <FloatingIcon delay={0.5} className="top-[18%] right-[15%]">
        <Star className="w-8 h-8 text-klawsome-yellow opacity-40" fill="currentColor" />
      </FloatingIcon>
      <FloatingIcon delay={1} className="bottom-[25%] left-[15%]">
        <Coins className="w-9 h-9 text-klawsome-yellow opacity-35" />
      </FloatingIcon>
      <FloatingIcon delay={1.5} className="bottom-[35%] right-[12%]">
        <Heart className="w-6 h-6 text-klawsome-baby-pink opacity-40" fill="currentColor" />
      </FloatingIcon>
      <FloatingIcon delay={0.8} className="top-[40%] left-[5%]">
        <Star className="w-6 h-6 text-klawsome-baby-blue opacity-30" fill="currentColor" />
      </FloatingIcon>
      <FloatingIcon delay={1.2} className="top-[10%] left-[45%]">
        <Sparkles className="w-7 h-7 text-primary opacity-30" />
      </FloatingIcon>

      <div className="container relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 leading-tight text-white">
            Michigan's first
            <br />
            stand-alone
            <br />
            <span className="kawaii-text-gradient">klaw arcade</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            Play our klaw machines, win kawaii plushies and collectibles, and trade up for bigger rewards! 🎪
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-bubble px-8 py-6 text-lg font-heading font-semibold bg-primary hover:bg-primary/90 text-white hover:scale-105 transition-all duration-300">
              Get Tokens 🪙
            </Button>
            <Button size="lg" className="rounded-bubble px-8 py-6 text-lg font-heading font-semibold bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 hover:scale-105 transition-all duration-300">
              Book a Visit 📅
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Transition to coral */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 50C360 100 720 0 1080 50C1260 75 1380 25 1440 50V100H0V50Z" fill="hsl(var(--klawsome-red))" />
        </svg>
      </div>
    </section>
  );
};

export default KawaiiHero;

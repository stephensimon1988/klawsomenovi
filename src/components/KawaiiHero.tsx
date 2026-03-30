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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Bold multi-layered colorful background */}
      <div className="absolute inset-0 bg-gradient-to-br from-klawsome-baby-blue/50 via-klawsome-baby-pink/40 to-klawsome-yellow/40" />
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-klawsome-yellow/30 to-transparent" />
      <div className="absolute bottom-0 right-0 w-2/3 h-1/2 bg-gradient-to-tl from-primary/15 via-klawsome-baby-pink/25 to-transparent rounded-tl-[200px]" />
      
      {/* Colorful blob accents */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-klawsome-yellow/25 rounded-full blur-3xl" />
      <div className="absolute bottom-[15%] right-[8%] w-72 h-72 bg-primary/15 rounded-full blur-3xl" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-klawsome-baby-blue/20 rounded-full blur-3xl" />
      
      {/* Floating decorations */}
      <FloatingIcon delay={0} className="top-[15%] left-[10%]">
        <Heart className="w-10 h-10 text-primary opacity-70" fill="currentColor" />
      </FloatingIcon>
      <FloatingIcon delay={0.5} className="top-[18%] right-[15%]">
        <Star className="w-8 h-8 text-klawsome-yellow opacity-80" fill="currentColor" />
      </FloatingIcon>
      <FloatingIcon delay={1} className="bottom-[25%] left-[15%]">
        <Coins className="w-9 h-9 text-klawsome-yellow opacity-70" />
      </FloatingIcon>
      <FloatingIcon delay={1.5} className="bottom-[35%] right-[12%]">
        <Heart className="w-6 h-6 text-klawsome-baby-pink opacity-80" fill="currentColor" />
      </FloatingIcon>
      <FloatingIcon delay={0.8} className="top-[40%] left-[5%]">
        <Star className="w-6 h-6 text-klawsome-navy opacity-50" fill="currentColor" />
      </FloatingIcon>
      <FloatingIcon delay={1.2} className="top-[10%] left-[45%]">
        <Sparkles className="w-7 h-7 text-primary opacity-50" />
      </FloatingIcon>
      <FloatingIcon delay={0.3} className="bottom-[40%] left-[40%]">
        <Star className="w-5 h-5 text-klawsome-yellow opacity-60" fill="currentColor" />
      </FloatingIcon>

      <div className="container relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-5 py-2 rounded-bubble border border-klawsome-baby-pink/50 mb-8 kawaii-shadow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-heading font-semibold text-klawsome-navy">Welcome to Klawsome! ✨</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 leading-tight">
            <span className="kawaii-text-gradient">Grab, Play</span>
            <br />
            <span className="text-klawsome-navy">&amp; Win!</span>
          </h1>

          <p className="text-lg md:text-xl text-klawsome-navy/70 max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            Your favorite klaw machine arcade — grab tokens, win prizes, and have a blast! 🎪
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-bubble px-8 py-6 text-lg font-heading font-semibold kawaii-shadow-lg hover:scale-105 transition-all duration-300 bg-primary hover:bg-primary/90">
              Get Tokens 🪙
            </Button>
            <Button size="lg" className="rounded-bubble px-8 py-6 text-lg font-heading font-semibold kawaii-shadow transition-all duration-300 bg-klawsome-navy hover:bg-klawsome-navy/90 text-white hover:scale-105">
              Book a Visit 📅
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Double wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60C240 120 480 20 720 70C960 120 1200 20 1440 60V140H0V60Z" fill="hsl(var(--klawsome-yellow))" fillOpacity="0.25" />
          <path d="M0 90C360 130 720 50 1080 90C1260 110 1380 70 1440 90V140H0V90Z" fill="hsl(var(--klawsome-baby-pink))" fillOpacity="0.2" />
          <path d="M0 110C300 140 600 100 900 115C1100 125 1300 105 1440 110V140H0V110Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};

export default KawaiiHero;

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
      {/* Vibrant multi-color background */}
      <div className="absolute inset-0 kawaii-gradient-soft" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-klawsome-yellow/20 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-klawsome-baby-blue/30 via-transparent to-transparent" />
      
      {/* Floating decorations — colorful mix */}
      <FloatingIcon delay={0} className="top-[15%] left-[10%]">
        <Heart className="w-8 h-8 text-primary opacity-60" fill="currentColor" />
      </FloatingIcon>
      <FloatingIcon delay={0.5} className="top-[20%] right-[15%]">
        <Star className="w-7 h-7 text-accent opacity-70" fill="currentColor" />
      </FloatingIcon>
      <FloatingIcon delay={1} className="bottom-[25%] left-[20%]">
        <Coins className="w-7 h-7 text-accent opacity-60" />
      </FloatingIcon>
      <FloatingIcon delay={1.5} className="bottom-[30%] right-[10%]">
        <Heart className="w-5 h-5 text-secondary opacity-70" fill="currentColor" />
      </FloatingIcon>
      <FloatingIcon delay={0.8} className="top-[40%] left-[5%]">
        <Star className="w-5 h-5 text-klawsome-navy opacity-40" fill="currentColor" />
      </FloatingIcon>
      <FloatingIcon delay={1.2} className="top-[10%] left-[50%]">
        <Sparkles className="w-6 h-6 text-klawsome-yellow opacity-50" />
      </FloatingIcon>

      <div className="container relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-klawsome-baby-blue/40 backdrop-blur-sm px-5 py-2 rounded-bubble border border-klawsome-baby-blue/60 mb-8"
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

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            Your favorite klaw machine arcade — grab tokens, win prizes, and have a blast! 🎪
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-bubble px-8 py-6 text-lg font-heading font-semibold kawaii-shadow hover:kawaii-shadow-lg transition-all duration-300 bg-primary hover:bg-primary/90">
              Get Tokens 🪙
            </Button>
            <Button variant="outline" size="lg" className="rounded-bubble px-8 py-6 text-lg font-heading font-semibold border-2 border-klawsome-navy text-klawsome-navy hover:bg-klawsome-navy hover:text-white transition-all duration-300">
              Book a Visit 📅
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Bottom wave with baby blue */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z" fill="hsl(var(--klawsome-baby-blue))" fillOpacity="0.3" />
          <path d="M0 80C360 120 720 40 1080 80C1260 100 1380 60 1440 80V120H0V80Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};

export default KawaiiHero;

import { motion } from 'framer-motion';
import { Sparkles, Heart, Star } from 'lucide-react';
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
      {/* Background decorations */}
      <div className="absolute inset-0 kawaii-gradient-soft opacity-60" />
      
      {/* Floating decorations */}
      <FloatingIcon delay={0} className="top-[15%] left-[10%]">
        <Heart className="w-8 h-8 text-primary opacity-40" fill="currentColor" />
      </FloatingIcon>
      <FloatingIcon delay={0.5} className="top-[20%] right-[15%]">
        <Star className="w-6 h-6 text-kawaii-yellow opacity-50" fill="currentColor" />
      </FloatingIcon>
      <FloatingIcon delay={1} className="bottom-[25%] left-[20%]">
        <Sparkles className="w-7 h-7 text-kawaii-lavender opacity-40" />
      </FloatingIcon>
      <FloatingIcon delay={1.5} className="bottom-[30%] right-[10%]">
        <Heart className="w-5 h-5 text-kawaii-mint opacity-50" fill="currentColor" />
      </FloatingIcon>
      <FloatingIcon delay={0.8} className="top-[40%] left-[5%]">
        <Star className="w-4 h-4 text-kawaii-peach opacity-60" fill="currentColor" />
      </FloatingIcon>

      <div className="container relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-5 py-2 rounded-bubble border border-border mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-heading font-semibold text-muted-foreground">Welcome to our world ✨</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 leading-tight">
            <span className="kawaii-text-gradient">Sweet &</span>
            <br />
            <span className="text-foreground">Dreamy</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            Discover our adorable collection of products crafted with love and sprinkled with a touch of magic ♡
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-bubble px-8 py-6 text-lg font-heading font-semibold kawaii-shadow hover:kawaii-shadow-lg transition-all duration-300">
              Shop Now 🛍️
            </Button>
            <Button variant="outline" size="lg" className="rounded-bubble px-8 py-6 text-lg font-heading font-semibold border-2 hover:bg-secondary transition-all duration-300">
              Learn More 💝
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};

export default KawaiiHero;

import { motion } from 'framer-motion';
import { Button } from './ui/button';

const KawaiiHero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="container relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Circular logo */}
          <motion.img
            src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/f907dbc8-8a5c-43a3-8224-1729d43956bb/CircularLogo_Klawsome_RGB.png"
            alt="Klawsome Logo"
            className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 object-contain"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight text-white">
            Michigan's first
            <br />
            stand-alone
            <br />
            <span className="kawaii-text-gradient">claw arcade</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-4 font-body leading-relaxed">
            Step into Klawsome and experience bright, colorful machines filled with kawaii plushies and prizes. Open Tuesday through Sunday, 11 a.m. to 9 p.m. at Sakura Novi in Michigan.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-kawaii p-4 max-w-md mx-auto mb-8 border border-white/20">
            <p className="text-white font-heading font-semibold text-sm">Spring break hours:</p>
            <p className="text-white/80 font-body text-sm">Monday March 30, 11a.m to 9 p.m.</p>
            <p className="text-white/80 font-body text-sm">Closed Easter Sunday April 5</p>
            <p className="text-white font-heading font-semibold text-sm mt-2">Regular hours:</p>
            <p className="text-white/80 font-body text-sm">Open Tuesday to Sunday 11 a.m. to 9 p.m.</p>
            <p className="text-white/80 font-body text-sm">Closed Mondays</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-full px-10 py-6 text-lg font-heading font-bold bg-primary hover:bg-primary/90 text-white hover:scale-105 transition-all duration-300">
              Play
            </Button>
            <Button size="lg" className="rounded-full px-10 py-6 text-lg font-heading font-bold bg-klawsome-navy text-white hover:bg-klawsome-navy/90 hover:scale-105 transition-all duration-300">
              Reserve
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default KawaiiHero;

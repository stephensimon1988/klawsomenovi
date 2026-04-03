import { motion } from 'framer-motion';
import { Button } from './ui/button';

const KawaiiHero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center w-full">
          {/* Left — Logo */}
          <motion.div
            className="flex justify-center p-[10%]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/f907dbc8-8a5c-43a3-8224-1729d43956bb/CircularLogo_Klawsome_RGB.png"
              alt="Klawsome Logo"
              className="w-full h-auto object-contain"
            />
          </motion.div>

          {/* Right — Text content */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 leading-tight text-white">
              Michigan's first
              <br />
              stand-alone
              <br />
              <span className="kawaii-text-gradient">claw arcade</span>
            </h1>

            <p className="text-base md:text-lg text-white/70 max-w-lg mb-6 font-body leading-relaxed">
              Step into Klawsome and experience bright, colorful machines filled with kawaii plushies and prizes. Open Tuesday through Sunday, 11 a.m. to 9 p.m. at Sakura Novi in Michigan.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-kawaii p-4 max-w-sm mb-6 border border-white/20 mx-auto md:mx-0">
              <p className="text-white font-heading font-semibold text-sm">Spring break hours:</p>
              <p className="text-white/70 font-body text-sm">Monday March 30, 11 a.m. to 9 p.m.</p>
              <p className="text-white/70 font-body text-sm">Closed Easter Sunday April 5</p>
              <p className="text-white font-heading font-semibold text-sm mt-2">Regular hours:</p>
              <p className="text-white/70 font-body text-sm">Tue–Sun 11 a.m. to 9 p.m. · Closed Mondays</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center md:items-start gap-3">
              <Button size="lg" className="rounded-full px-10 py-6 text-lg font-heading font-bold bg-primary hover:bg-primary/90 text-white hover:scale-105 transition-all duration-300">
                Play
              </Button>
              <Button size="lg" className="rounded-full px-10 py-6 text-lg font-heading font-bold bg-klawsome-navy text-white hover:bg-klawsome-navy/90 hover:scale-105 transition-all duration-300">
                Reserve
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default KawaiiHero;

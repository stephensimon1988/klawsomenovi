import { motion } from 'framer-motion';
import playKlawImg from '@/assets/play-klaw-machines.gif';
import winPlushiesImg from '@/assets/win-plushies.gif';
import tradeUpImg from '@/assets/trade-up.gif';

const features = [
  {
    image: playKlawImg,
    title: 'Play klaw machines',
    description: 'Over forty top-quality klaw machines loaded with amazing prizes — test your skill and grab your favorites!',
  },
  {
    image: winPlushiesImg,
    title: 'Win plushies & collectibles',
    description: 'Kawaii plushies, rare collectibles, and exclusive items you won\'t find anywhere else!',
  },
  {
    image: tradeUpImg,
    title: 'Trade up for bigger wins',
    description: 'Use your smaller wins to trade up for the grand prizes — the more you play, the bigger you win! ⭐',
  },
];

const KawaiiAbout = () => {
  return (
    <section id="about" className="bg-primary py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">
            How to play
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-body">
            The ultimate klaw machine experience awaits you! 🎪
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white/10 backdrop-blur-sm rounded-kawaii p-8 border border-white/20 text-center flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              {/* Fixed-height icon area so titles align across cards */}
              <div className="h-56 flex items-center justify-center mb-5">
                <img src={feature.image} alt={feature.title} className="max-h-full max-w-full object-contain" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-white/70 font-body leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KawaiiAbout;

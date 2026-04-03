import { motion } from 'framer-motion';
import playKlawImg from '@/assets/play-klaw-machines.gif';
import winPlushiesImg from '@/assets/win-plushies.gif';
import tradeUpImg from '@/assets/trade-up.gif';
import { Button } from './ui/button';

const steps = [
  {
    image: playKlawImg,
    title: 'Start with tokens',
    description: 'Pick your price and get tokens to feed the machines.',
  },
  {
    image: winPlushiesImg,
    title: 'Choose your machine',
    description: 'Forty machines stand ready, each one different from the last.',
  },
  {
    image: tradeUpImg,
    title: 'Trade up for the big ones',
    description: 'Collect points and redeem them for the jumbo plushies at our prize wall.',
  },
];

const KawaiiAbout = () => {
  return (
    <section id="about" className="py-20 px-4 bg-kawaii-lavender/40">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2">Grab</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            From tokens to prizes in four moves
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            It's simple. Buy tokens, play the machines you want, win what you grab, and trade up for something bigger. That's the whole game.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="text-center flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="h-40 w-40 flex items-center justify-center mb-5">
                <img src={step.image} alt={step.title} className="max-h-full max-w-full object-contain" />
              </div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex items-center justify-center gap-4 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Button className="rounded-full px-8 font-heading font-bold bg-foreground text-background hover:bg-foreground/90 glow-hover glow-pink">
            Play
          </Button>
          <Button variant="ghost" className="rounded-full font-heading text-foreground underline glow-hover glow-pink">
            Visit →
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default KawaiiAbout;

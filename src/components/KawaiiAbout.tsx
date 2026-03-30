import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Fun for Everyone',
    description: 'Whether you\'re 5 or 55, our klaw machines bring joy to players of all ages ♡',
    color: 'bg-primary/15 text-primary',
    borderColor: 'border-primary/20',
  },
  {
    icon: Sparkles,
    title: 'Amazing Prizes',
    description: 'From plushies to collectibles — our machines are loaded with awesome rewards ✨',
    color: 'bg-klawsome-yellow/30 text-klawsome-navy',
    borderColor: 'border-klawsome-yellow/40',
  },
  {
    icon: Star,
    title: 'Premium Experience',
    description: 'Top-quality machines, clean arcade, and friendly staff every single visit ⭐',
    color: 'bg-klawsome-baby-blue/40 text-klawsome-navy',
    borderColor: 'border-klawsome-baby-blue/50',
  },
];

const KawaiiAbout = () => {
  return (
    <section id="about" className="py-20 px-4 bg-gradient-to-b from-klawsome-baby-pink/10 via-klawsome-yellow/5 to-background">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="kawaii-text-gradient">About Us</span> 🎪
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Klawsome is your go-to spot for klaw machine fun, amazing prizes, and unforgettable moments!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`bg-card rounded-kawaii p-8 border ${feature.borderColor} kawaii-shadow text-center`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className={`inline-flex p-4 rounded-bubble ${feature.color} mb-5`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground font-body leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KawaiiAbout;

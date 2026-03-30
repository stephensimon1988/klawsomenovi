import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Fun for Everyone',
    description: 'Whether you\'re 5 or 55, our klaw machines bring joy to players of all ages ♡',
    bg: 'bg-gradient-to-br from-primary/20 via-klawsome-baby-pink/30 to-klawsome-yellow/10',
    iconBg: 'bg-primary/20 text-primary',
  },
  {
    icon: Sparkles,
    title: 'Amazing Prizes',
    description: 'From plushies to collectibles — our machines are loaded with awesome rewards ✨',
    bg: 'bg-gradient-to-br from-klawsome-yellow/30 via-klawsome-baby-blue/20 to-klawsome-baby-pink/10',
    iconBg: 'bg-klawsome-yellow/40 text-klawsome-navy',
  },
  {
    icon: Star,
    title: 'Premium Experience',
    description: 'Top-quality machines, clean arcade, and friendly staff every single visit ⭐',
    bg: 'bg-gradient-to-br from-klawsome-baby-blue/30 via-klawsome-baby-pink/15 to-klawsome-yellow/10',
    iconBg: 'bg-klawsome-baby-blue/50 text-klawsome-navy',
  },
];

const KawaiiAbout = () => {
  return (
    <section id="about" className="py-20 px-4 bg-gradient-to-b from-klawsome-baby-pink/25 via-klawsome-yellow/15 to-klawsome-baby-blue/20">
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
          <p className="text-klawsome-navy/70 text-lg max-w-2xl mx-auto font-body">
            Klawsome is your go-to spot for klaw machine fun, amazing prizes, and unforgettable moments!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`${feature.bg} rounded-kawaii p-8 border border-white/50 kawaii-shadow text-center backdrop-blur-sm`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className={`inline-flex p-4 rounded-bubble ${feature.iconBg} mb-5`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3 text-klawsome-navy">{feature.title}</h3>
              <p className="text-klawsome-navy/60 font-body leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KawaiiAbout;

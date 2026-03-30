import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every product is carefully crafted with attention to detail and lots of love ♡',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Sparkles,
    title: 'Unique Designs',
    description: 'One-of-a-kind kawaii designs that you won\'t find anywhere else ✨',
    color: 'bg-kawaii-lavender/30 text-secondary-foreground',
  },
  {
    icon: Star,
    title: 'Premium Quality',
    description: 'Only the finest materials for products that last and bring joy every day ⭐',
    color: 'bg-kawaii-yellow/30 text-foreground',
  },
];

const KawaiiAbout = () => {
  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="kawaii-text-gradient">About Us</span> 🌸
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            We're a small team passionate about bringing kawaii culture to everyone through adorable, high-quality products.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-card rounded-kawaii p-8 border border-border kawaii-shadow text-center"
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

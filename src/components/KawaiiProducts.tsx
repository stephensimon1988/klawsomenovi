import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';

// Placeholder products - will be replaced with Square catalog data
const placeholderProducts = [
  {
    id: '1',
    name: 'Kawaii Plush Bear',
    price: '$24.99',
    description: 'Super soft and cuddly plush bear with adorable bow 🧸',
    color: 'bg-kawaii-pink/20',
  },
  {
    id: '2',
    name: 'Pastel Sticker Pack',
    price: '$8.99',
    description: 'Set of 20 kawaii stickers in dreamy pastel colors 🌈',
    color: 'bg-kawaii-lavender/20',
  },
  {
    id: '3',
    name: 'Cloud Night Light',
    price: '$19.99',
    description: 'Soft glowing cloud lamp for sweet dreams ☁️',
    color: 'bg-kawaii-sky/20',
  },
  {
    id: '4',
    name: 'Bunny Notebook',
    price: '$12.99',
    description: 'Adorable lined notebook with bunny design 🐰',
    color: 'bg-kawaii-mint/20',
  },
];

const KawaiiProducts = () => {
  return (
    <section id="products" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="kawaii-text-gradient">Our Products</span> 🛍️
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Browse our cutest collection! Each item is ready to add a sprinkle of joy to your day.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {placeholderProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="bg-card rounded-kawaii border border-border overflow-hidden kawaii-shadow group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              {/* Product image placeholder */}
              <div className={`h-48 ${product.color} flex items-center justify-center`}>
                <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
              </div>

              <div className="p-5">
                <h3 className="font-heading font-bold text-lg text-foreground mb-1">{product.name}</h3>
                <p className="text-muted-foreground text-sm font-body mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xl text-primary">{product.price}</span>
                  <Button size="sm" className="rounded-bubble font-heading kawaii-shadow text-sm">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KawaiiProducts;

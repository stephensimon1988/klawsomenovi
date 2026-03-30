import { motion } from 'framer-motion';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SquareProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  imageUrl: string | null;
  variationId: string | null;
}

const pastelColors = [
  'bg-kawaii-pink/20',
  'bg-kawaii-lavender/20',
  'bg-kawaii-sky/20',
  'bg-kawaii-mint/20',
];

const fetchProducts = async (): Promise<SquareProduct[]> => {
  const { data, error } = await supabase.functions.invoke('square-catalog');
  if (error) throw new Error(error.message);
  return data.products || [];
};

const KawaiiProducts = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['square-products'],
    queryFn: fetchProducts,
  });

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

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-muted-foreground font-body">
            <p>Couldn't load products right now. Please try again later! 💫</p>
          </div>
        )}

        {products && products.length === 0 && (
          <div className="text-center py-10 text-muted-foreground font-body">
            <p>No products available yet — check back soon! 🌸</p>
          </div>
        )}

        {products && products.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="bg-card rounded-kawaii border border-border overflow-hidden kawaii-shadow group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={`h-48 ${pastelColors[index % pastelColors.length]} flex items-center justify-center overflow-hidden`}>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-heading font-bold text-lg text-foreground mb-1">{product.name}</h3>
                  <p className="text-muted-foreground text-sm font-body mb-3 line-clamp-2">{product.description}</p>
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
        )}
      </div>
    </section>
  );
};

export default KawaiiProducts;

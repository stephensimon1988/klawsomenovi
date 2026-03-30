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
    <section id="products" className="py-20 px-4 bg-klawsome-navy">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">
            <span className="kawaii-text-gradient">Four simple steps</span> to winning big
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-body">
            Grab tokens for the klaw machines! More tokens = more bonus coins! ✨
          </p>
        </motion.div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-white/60 font-body">
            <p>Couldn't load products right now. Please try again later! 💫</p>
          </div>
        )}

        {products && products.length === 0 && (
          <div className="text-center py-10 text-white/60 font-body">
            <p>No products available yet — check back soon! 🌸</p>
          </div>
        )}

        {products && products.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="bg-white/10 backdrop-blur-sm rounded-kawaii border border-white/15 overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-40 bg-gradient-to-br from-primary/30 via-klawsome-yellow/20 to-klawsome-baby-pink/20 flex items-center justify-center overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-5xl">🪙</div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-heading font-bold text-lg text-white mb-1">{product.name}</h3>
                  <p className="text-white/50 text-sm font-body mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xl text-klawsome-yellow">{product.price}</span>
                    <Button size="sm" className="rounded-bubble font-heading text-sm bg-primary hover:bg-primary/90 text-white">
                      Buy
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

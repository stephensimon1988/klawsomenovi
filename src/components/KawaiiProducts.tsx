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

const cardAccents = [
  'from-primary/20 via-klawsome-baby-pink/25 to-klawsome-yellow/15',
  'from-klawsome-yellow/30 via-klawsome-baby-blue/20 to-primary/10',
  'from-klawsome-baby-blue/30 via-klawsome-baby-pink/20 to-klawsome-yellow/15',
  'from-klawsome-baby-pink/25 via-klawsome-yellow/20 to-klawsome-baby-blue/15',
  'from-klawsome-navy/15 via-klawsome-baby-blue/25 to-primary/10',
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
    <section id="products" className="py-20 px-4 bg-gradient-to-b from-klawsome-baby-blue/25 via-klawsome-yellow/10 to-klawsome-baby-pink/20 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-klawsome-yellow/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="kawaii-text-gradient">Tokens</span> 🪙
          </h2>
          <p className="text-klawsome-navy/70 text-lg max-w-2xl mx-auto font-body">
            Grab tokens for the klaw machines! More tokens = more bonus coins! ✨
          </p>
        </motion.div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-klawsome-navy/60 font-body">
            <p>Couldn't load products right now. Please try again later! 💫</p>
          </div>
        )}

        {products && products.length === 0 && (
          <div className="text-center py-10 text-klawsome-navy/60 font-body">
            <p>No products available yet — check back soon! 🌸</p>
          </div>
        )}

        {products && products.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="bg-white/70 backdrop-blur-sm rounded-kawaii border border-white/60 overflow-hidden kawaii-shadow group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={`h-40 bg-gradient-to-br ${cardAccents[index % cardAccents.length]} flex items-center justify-center overflow-hidden`}>
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
                  <h3 className="font-heading font-bold text-lg text-klawsome-navy mb-1">{product.name}</h3>
                  <p className="text-klawsome-navy/50 text-sm font-body mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xl text-primary">{product.price}</span>
                    <Button size="sm" className="rounded-bubble font-heading kawaii-shadow text-sm bg-klawsome-navy hover:bg-klawsome-navy/90 text-white">
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

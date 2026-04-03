import { motion } from 'framer-motion';

const tiers = [
  { price: '$10', tokens: '10', bonus: '—', highlight: false },
  { price: '$30', tokens: '30 + 5', bonus: '16%', highlight: false },
  { price: '$50', tokens: '50 + 10', bonus: '20%', highlight: false },
  { price: '$100', tokens: '100 + 25', bonus: '25%', highlight: true },
  { price: '$250', tokens: '250 + 75', bonus: '30%', highlight: false },
];

const KawaiiTokenPrices = () => {
  return (
    <section id="products" className="py-20 px-4 bg-klawsome-navy relative overflow-hidden">
      {/* Decorative cat image */}
      <img
        src="https://images.squarespace-cdn.com/content/679927505e618d391ae386e6/4cbcbf12-71e1-4365-b552-c20f2d2c949d/Klawsome_cat.png?content-type=image%2Fpng"
        alt=""
        className="absolute right-0 top-0 h-64 opacity-30 pointer-events-none"
        loading="lazy"
      />

      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Token Prices
          </h2>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl mx-auto">
          {/* Token stack image */}
          <motion.img
            src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/ef608b3b-4731-45e2-a37e-250a45e15d52/coinstack-klawsome.png"
            alt="Stack of Klawsome tokens"
            className="w-48 md:w-56 object-contain"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            loading="lazy"
          />

          {/* Price table */}
          <motion.div
            className="flex-1 w-full max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-3 gap-px text-center font-heading font-bold text-white/60 text-sm mb-2">
              <span>Price</span>
              <span>Tokens</span>
              <span>Bonus</span>
            </div>
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.price}
                className={`grid grid-cols-3 gap-px text-center py-3 border-t border-white/10 font-body ${
                  tier.highlight
                    ? 'bg-klawsome-yellow/20 border border-klawsome-yellow/40 rounded-lg text-klawsome-yellow font-bold glow-hover glow-yellow'
                    : 'text-white'
                }`}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <span className="font-heading font-bold text-lg">{tier.price}</span>
                <span>{tier.tokens}</span>
                <span>{tier.bonus}</span>
              </motion.div>
            ))}
            {tiers.some((t) => t.highlight) && (
              <p className="text-klawsome-yellow/70 text-xs font-body text-center mt-3">⭐ Top Pick — Best value!</p>
            )}
          </motion.div>

          {/* Kawaii animals */}
          <motion.img
            src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/b3785d35-704f-459b-be7a-69ddb204602a/klawsome+animals.png"
            alt="Klawsome kawaii animals"
            className="w-48 md:w-56 object-contain hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default KawaiiTokenPrices;

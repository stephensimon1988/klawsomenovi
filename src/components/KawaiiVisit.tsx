import { motion } from 'framer-motion';
import { Accessibility, Clock } from 'lucide-react';
import { Button } from './ui/button';

const KawaiiVisit = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/eac946a6-e513-4e64-acdc-dd5024eb5a61/IMG_1638.jpg"
              alt="Klawsome arcade storefront"
              className="rounded-kawaii w-full object-cover aspect-[4/5]"
              loading="lazy"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2">Visit</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Find us at Sakura Novi in Novi, Michigan
            </h2>
            <p className="text-muted-foreground font-body mb-8 leading-relaxed">
              Klawsome sits at 41768 Grand River Avenue, Suite C-140, Novi, MI 48375. Open Tuesday through Sunday, 11 a.m. to 9 p.m., closed Mondays.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <Accessibility className="w-8 h-8 text-foreground mb-2" />
                <h3 className="font-heading font-bold text-foreground mb-1">Easy access</h3>
                <p className="text-muted-foreground text-sm font-body">Right in Novi's center, simple to find and reach anytime.</p>
              </div>
              <div>
                <Clock className="w-8 h-8 text-foreground mb-2" />
                <h3 className="font-heading font-bold text-foreground mb-1">Hours matter</h3>
                <p className="text-muted-foreground text-sm font-body">Tuesday through Sunday, 11 a.m. to 9 p.m. Plan your visit accordingly.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="rounded-full font-heading border-foreground text-foreground hover:bg-foreground hover:text-background">
                Directions
              </Button>
              <Button variant="ghost" className="rounded-full font-heading text-foreground underline">
                Call →
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default KawaiiVisit;

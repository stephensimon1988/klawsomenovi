import { motion } from 'framer-motion';

const KawaiiStory = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            The Klawsome Story
          </h2>
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            Klawsome! is Michigan's first stand-alone claw machine arcade, offering a unique and exciting experience where customers can test their skills to win kawaii-style plushies from vibrantly colored claw machines. We are a family-owned local business based in Novi, Michigan, inspired by the popular arcades in Asian countries.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default KawaiiStory;

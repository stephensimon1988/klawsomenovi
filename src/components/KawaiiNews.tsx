import { motion } from 'framer-motion';

const articles = [
  {
    image: 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/da23b372-138d-4c18-977f-8db39f1cd16a/klawsome+littleguidedetroit.jpg',
    title: "Check Out Klawsome In Novi – Michigan's Only Stand-Alone Claw Machine Arcade",
    url: 'https://littleguidedetroit.com/check-out-klawsome-in-novi-michigans-only-stand-alone-claw-machine-arcade/',
  },
  {
    image: 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/cf98d1f2-1b98-49e2-953a-6784766e898d/klawsome+hourdetroit.png',
    title: "Klawsome! Sakura Novi Kicks Off with Michigan's First 'Clawcade'",
    url: 'https://www.hourdetroit.com/development-topics/klawsome-sakura-novi-kicks-off-with-michigans-first-clawcade/',
  },
  {
    image: 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/f02582ee-95a6-4fb9-bf08-3ac93e6b9861/PXL_20250822_201918587.jpg',
    title: 'Sakura Novi Launches with the Grand Opening of Klawsome!',
    url: 'https://michiganmamanews.com/2025/08/28/sakura-novi-launches-with-the-grand-opening-of-klawsome-on-friday-august-29/',
  },
];

const KawaiiNews = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
            In The News
          </h2>
          <img
            src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/5634d99f-8f37-4229-a409-dfbb9b66697c/As+Seen+On.png"
            alt="As seen on Michigan Mama News, Hour Detroit, Little Guide, Hometown Life"
            className="max-w-md mx-auto w-full mt-4 mb-8"
            loading="lazy"
          />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {articles.map((article, index) => (
            <motion.a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-kawaii overflow-hidden border border-border hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading font-bold text-foreground text-sm leading-snug mb-2">{article.title}</h3>
                <span className="text-primary text-sm font-heading font-semibold">Read Here →</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KawaiiNews;

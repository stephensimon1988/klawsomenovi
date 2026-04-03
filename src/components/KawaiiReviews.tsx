import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const reviews = [
  {
    name: 'Patrick G.',
    role: 'Local arcade visitor',
    text: 'Great vibes! Staff is super friendly, and they go out of their way to make sure everyone gets prizes no matter their skill level!',
  },
  {
    name: 'Daniel B.',
    role: 'Family outing guest',
    text: 'Had such a blast with the kids. Owner and staff are so friendly and its absolutely fun for kids to win prizes.',
  },
  {
    name: 'Christine A.',
    role: 'Regular family visitor',
    text: "Such a great experience! Love this place—so helpful and amazing time with the kiddos!",
  },
  {
    name: 'Michelle D.',
    role: 'Arcade enthusiast',
    text: 'sooo fun!!! really cute prizes!!! friendly staff too ❤️',
  },
  {
    name: 'Rich S.',
    role: 'Weekend visitor',
    text: 'The staff was very friendly and the prizes were not too difficult to win! Will definitely come back again and recommend this place to anyone!',
  },
  {
    name: 'Lucy D.',
    role: 'Saturday night visitor',
    text: "Klawsome was an awesome Saturday night activity! We had a great time and met Agnes, one of the owners. We enjoyed our time and got our money's worth of prizes. We'll be back!",
  },
  {
    name: 'Genki N.',
    role: 'Family visitor',
    text: "This is a great place to have fun with kids or even without kids! So many claw machines and bunch of toys. Staffs are great and very kind. Literally AWESOME place!",
  },
];

const KawaiiReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 3;
  const maxIndex = Math.max(0, reviews.length - visibleCount);

  const next = () => setCurrentIndex((i) => Math.min(i + 1, maxIndex));
  const prev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
            Guests love us
          </h2>
          <div className="flex items-center justify-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-accent fill-accent" />
            ))}
          </div>
          <p className="text-muted-foreground font-body">Rated 4.9 out of 5 stars</p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: `-${currentIndex * (100 / visibleCount + 2)}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="min-w-[calc(33.333%-1rem)] bg-background border border-border rounded-kawaii p-6 flex flex-col glow-hover glow-pink"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                    ))}
                  </div>
                  <p className="text-foreground font-body text-sm leading-relaxed mb-4 flex-1">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-heading font-bold text-muted-foreground">
                        {review.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-heading font-bold text-sm text-foreground">{review.name}</p>
                      <p className="text-muted-foreground text-xs font-body">{review.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 glow-hover glow-pink"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={next}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 glow-hover glow-pink"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-foreground' : 'bg-border'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KawaiiReviews;

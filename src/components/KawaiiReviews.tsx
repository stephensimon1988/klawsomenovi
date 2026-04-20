import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useGsapScroll } from '@/hooks/useGsapScroll';

const reviews = [
  { name: 'Patrick G.', role: 'Local arcade visitor', text: 'Great vibes! Staff is super friendly, and they go out of their way to make sure everyone gets prizes no matter their skill level!' },
  { name: 'Daniel B.', role: 'Family outing guest', text: 'Had such a blast with the kids. Owner and staff are so friendly and its absolutely fun for kids to win prizes.' },
  { name: 'Christine A.', role: 'Regular family visitor', text: "Such a great experience! Love this place—so helpful and amazing time with the kiddos!" },
  { name: 'Michelle D.', role: 'Arcade enthusiast', text: 'sooo fun!!! really cute prizes!!! friendly staff too ❤️' },
  { name: 'Rich S.', role: 'Weekend visitor', text: 'The staff was very friendly and the prizes were not too difficult to win! Will definitely come back again and recommend this place to anyone!' },
  { name: 'Lucy D.', role: 'Saturday night visitor', text: "Klawsome was an awesome Saturday night activity! We had a great time and met Agnes, one of the owners. We enjoyed our time and got our money's worth of prizes. We'll be back!" },
  { name: 'Genki N.', role: 'Family visitor', text: "This is a great place to have fun with kids or even without kids! So many claw machines and bunch of toys. Staffs are great and very kind. Literally AWESOME place!" },
];

const KawaiiReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rating, setRating] = useState(4.9);
  const [reviewCount, setReviewCount] = useState<number | null>(null);
  const visibleCount = 3;
  const maxIndex = Math.max(0, reviews.length - visibleCount);

  const headerRef = useGsapScroll<HTMLDivElement>({ type: 'slideUp', distance: 50 });
  const carouselRef = useGsapScroll<HTMLDivElement>({ type: 'fadeIn', duration: 1, delay: 0.3 });

  const next = () => setCurrentIndex((i) => Math.min(i + 1, maxIndex));
  const prev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('google-rating');
        if (!error && data) {
          if (data.rating) setRating(data.rating);
          if (data.reviewCount) setReviewCount(data.reviewCount);
        }
      } catch (e) {
        console.warn('Could not fetch Google rating:', e);
      }
    };
    fetchRating();
  }, []);

  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const displayStars = hasHalf ? fullStars + 1 : (rating - fullStars >= 0.75 ? fullStars + 1 : fullStars);

  return (
    <section id="reviews" className="section-y section-x bg-background">
      <div className="ds-container">
        <div ref={headerRef} className="max-w-2xl mb-16" style={{ opacity: 0 }}>
          <p className="ds-eyebrow">Testimonials</p>
          <h2 className="ds-h2 mb-4">
            Guests love us
          </h2>
          <div className="flex items-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < displayStars ? 'text-accent fill-accent' : 'text-border'}`} />
            ))}
            <span className="text-muted-foreground font-body text-sm ml-2">
              {rating} out of 5{reviewCount && ` · ${reviewCount} reviews`}
            </span>
          </div>
        </div>

        <div ref={carouselRef} className="relative max-w-6xl mx-auto" style={{ opacity: 0 }}>
          <div className="overflow-hidden px-2 py-4">
            <div
              className="flex gap-6 transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCount + 2)}%)` }}
            >
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="min-w-[calc(33.333%-1rem)] bg-background border border-border rounded-2xl px-8 py-8 flex flex-col glow-hover glow-pink"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                    ))}
                  </div>
                  <p className="text-foreground font-body leading-relaxed mb-6 flex-1">"{review.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-sm font-heading font-bold text-foreground">{review.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-heading font-bold text-sm text-foreground">{review.name}</p>
                      <p className="text-muted-foreground text-xs font-body">{review.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={prev} disabled={currentIndex === 0} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-30">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button onClick={next} disabled={currentIndex >= maxIndex} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-30">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button key={i} onClick={() => setCurrentIndex(i)} className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-foreground' : 'bg-border'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KawaiiReviews;

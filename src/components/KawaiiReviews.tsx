import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useGsapScroll } from '@/hooks/useGsapScroll';
import { useCmsTable, type Review } from '@/hooks/useCmsContent';

type DisplayReview = { name: string; role: string; text: string; photo?: string | null };

const KawaiiReviews = () => {
  const { data: cmsReviews } = useCmsTable<Review>('reviews');
  const [googleReviews, setGoogleReviews] = useState<DisplayReview[]>([]);
  const reviews: DisplayReview[] = googleReviews.length > 0
    ? googleReviews
    : (cmsReviews && cmsReviews.length > 0
        ? cmsReviews.map(r => ({ name: r.author_name, role: r.author_role, text: r.review_text }))
        : []);
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
          if (Array.isArray(data.reviews) && data.reviews.length > 0) {
            setGoogleReviews(
              data.reviews.map((r: any) => ({
                name: r.author,
                role: r.relativeTime || 'Google review',
                text: r.text,
                photo: r.authorPhoto,
              }))
            );
          }
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
        <div ref={headerRef} className="text-center mb-16 max-w-6xl mx-auto" style={{ opacity: 0 }}>
          <p className="ds-eyebrow">Testimonials</p>
          <h2 className="ds-h2 ds-stroke ds-stroke--red mb-4">Guests love us</h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < displayStars ? 'text-accent fill-accent' : 'text-border'}`} />
            ))}
            <span className="text-muted-foreground font-body text-sm ml-2">
              {rating} out of 5{reviewCount && ` · ${reviewCount} reviews`}
            </span>
          </div>
        </div>

        <div ref={carouselRef} className="relative max-w-6xl mx-auto" style={{ opacity: 0 }}>
          {/* Mobile: stacked, first 3 reviews only */}
          <div className="md:hidden flex flex-col gap-4 px-2 py-4">
            {reviews.slice(0, 3).map((review, index) => (
              <div
                key={index}
                className="w-full bg-background border border-border rounded-2xl px-6 py-6 flex flex-col glow-hover glow-pink"
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

          {/* Desktop: carousel */}
          <div className="hidden md:block overflow-hidden px-2 py-4">
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

          <button onClick={prev} disabled={currentIndex === 0} className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-background border border-border items-center justify-center hover:bg-secondary transition-colors disabled:opacity-30">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button onClick={next} disabled={currentIndex >= maxIndex} className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-background border border-border items-center justify-center hover:bg-secondary transition-colors disabled:opacity-30">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          <div className="hidden md:flex items-center justify-center gap-2 mt-8">
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

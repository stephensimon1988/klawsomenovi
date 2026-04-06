import { Button } from './ui/button';
import { useGsapScroll } from '@/hooks/useGsapScroll';
import LottieAccent from './LottieAccent';

const KawaiiGiftCards = () => {
  const textRef = useGsapScroll<HTMLDivElement>({ type: 'slideLeft', distance: 80, duration: 1 });
  const imagesRef = useGsapScroll<HTMLDivElement>({ type: 'slideRight', distance: 80, duration: 1, delay: 0.15 });

  return (
    <section className="py-20 px-4 bg-kawaii-lavender/40 relative overflow-hidden">
      <LottieAccent type="heart" className="absolute top-10 right-10 opacity-30" size={70} />

      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div ref={textRef} style={{ opacity: 0 }}>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Buy a Klawsome gift card here!
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed mb-6">
              Want to make someone's day more special? Klawsome's got you. Whether you purchase a gift card for a friend, loved one, or yourself, enjoy some fun at Klawsome! with one of our kawaii gift cards!
            </p>
            <p className="text-muted-foreground font-body text-sm mb-8">
              Choose from one of many designs for a birthday, Valentine's, or just because—more designs to come!
            </p>
            <Button
              asChild
              className="rounded-full px-8 font-heading font-bold bg-primary hover:bg-primary/90 text-white glow-hover glow-coral"
            >
              <a href="https://app.squareup.com/gift/ML1R35ZH9VKRW/order" target="_blank" rel="noopener noreferrer">
                Purchase
              </a>
            </Button>
          </div>

          <div ref={imagesRef} className="grid grid-cols-2 gap-4" style={{ opacity: 0 }}>
            <img
              src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/53ec5cfa-3e70-4278-95c0-3ab584efdb9a/CVday+gift+cards.png"
              alt="Valentine's Day Klawsome gift card"
              className="rounded-kawaii w-full"
              loading="lazy"
            />
            <img
              src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/96257c57-bcd1-43d5-afcd-5d19b8c5e106/easter+card.jpg"
              alt="Easter Klawsome gift card"
              className="rounded-kawaii w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default KawaiiGiftCards;

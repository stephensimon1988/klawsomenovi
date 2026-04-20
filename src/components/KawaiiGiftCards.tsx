import { Button } from './ui/button';
import { useGsapScroll } from '@/hooks/useGsapScroll';
import LottieAccent from './LottieAccent';

const KawaiiGiftCards = () => {
  const textRef = useGsapScroll<HTMLDivElement>({ type: 'slideLeft', distance: 80, duration: 1 });
  const imagesRef = useGsapScroll<HTMLDivElement>({ type: 'slideRight', distance: 80, duration: 1, delay: 0.15 });

  return (
    <section id="giftcards" className="section-y section-x bg-background relative overflow-hidden">
      <LottieAccent type="heart" className="absolute top-12 right-12 opacity-20" size={60} />

      <div className="ds-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div ref={textRef} style={{ opacity: 0 }}>
            <p className="ds-eyebrow">Gift Cards</p>
            <h2 className="ds-h2 mb-6">
              Give the gift of Klawsome
            </h2>
            <p className="ds-lead mb-4">
              Want to make someone's day more special? Klawsome's got you. Whether you purchase a gift card for a friend, loved one, or yourself, enjoy some fun at Klawsome!
            </p>
            <p className="ds-body mb-10">
              Choose from one of many designs for a birthday, Valentine's, or just because—more designs to come!
            </p>
            <Button
              asChild
              className="rounded-full px-8 font-heading font-bold text-xs tracking-wider bg-primary hover:bg-primary/90 text-white uppercase"
            >
              <a href="https://app.squareup.com/gift/ML1R35ZH9VKRW/order" target="_blank" rel="noopener noreferrer">
                Purchase Now
              </a>
            </Button>
          </div>

          <div ref={imagesRef} className="grid grid-cols-2 gap-6" style={{ opacity: 0 }}>
            <img
              src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/53ec5cfa-3e70-4278-95c0-3ab584efdb9a/CVday+gift+cards.png"
              alt="Valentine's Day Klawsome gift card"
              className="ds-img-thumb rounded-2xl"
              loading="lazy"
            />
            <img
              src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/96257c57-bcd1-43d5-afcd-5d19b8c5e106/easter+card.jpg"
              alt="Easter Klawsome gift card"
              className="ds-img-thumb rounded-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default KawaiiGiftCards;

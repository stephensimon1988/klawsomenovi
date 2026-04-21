import { Button } from './ui/button';
import { useGsapScroll } from '@/hooks/useGsapScroll';
import LottieAccent from './LottieAccent';
import { useCmsSingle, useCmsTable, type GiftCardsContent, type GiftCardImage } from '@/hooks/useCmsContent';

const KawaiiGiftCards = () => {
  const textRef = useGsapScroll<HTMLDivElement>({ type: 'slideLeft', distance: 80, duration: 1 });
  const imagesRef = useGsapScroll<HTMLDivElement>({ type: 'slideRight', distance: 80, duration: 1, delay: 0.15 });
  const { data: content } = useCmsSingle<GiftCardsContent>('gift_cards_content');
  const { data: images } = useCmsTable<GiftCardImage>('gift_card_images');

  const displayImages = (images && images.length > 0) ? images : [
    { id: '1', image_url: 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/53ec5cfa-3e70-4278-95c0-3ab584efdb9a/CVday+gift+cards.png', alt_text: "Valentine's Day Klawsome gift card", sort_order: 1 },
    { id: '2', image_url: 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/96257c57-bcd1-43d5-afcd-5d19b8c5e106/easter+card.jpg', alt_text: 'Easter Klawsome gift card', sort_order: 2 },
  ];

  return (
    <section id="giftcards" className="section-y section-x bg-background relative overflow-hidden">
      <LottieAccent type="heart" className="absolute top-12 right-12 opacity-20" size={60} />

      <div className="ds-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div ref={textRef} style={{ opacity: 0 }}>
            <p className="ds-eyebrow">{content?.eyebrow || 'Gift Cards'}</p>
            <h2 className="ds-h2 mb-6">
              {content?.headline || 'Give the gift of Klawsome'}
            </h2>
            <p className="ds-lead mb-4">
              {content?.body_1 || "Want to make someone's day more special? Klawsome's got you."}
            </p>
            <p className="ds-body mb-10">
              {content?.body_2 || 'Choose from one of many designs.'}
            </p>
            <Button
              asChild
              className="rounded-full px-8 font-heading font-bold text-xs tracking-wider bg-primary hover:bg-primary/90 text-white uppercase"
            >
              <a href={content?.cta_url || 'https://app.squareup.com/gift/ML1R35ZH9VKRW/order'} target="_blank" rel="noopener noreferrer">
                {content?.cta_text || 'Purchase Now'}
              </a>
            </Button>
          </div>

          <div ref={imagesRef} className="grid grid-cols-2 gap-6" style={{ opacity: 0 }}>
            {displayImages.slice(0, 4).map((img) => (
              <img
                key={img.id}
                src={img.image_url}
                alt={img.alt_text}
                className="ds-img-thumb rounded-2xl"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KawaiiGiftCards;

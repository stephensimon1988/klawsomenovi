import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import PageHero from '@/components/PageHero';
import DynamicSections from '@/components/DynamicSections';
import KawaiiDivider from '@/components/KawaiiDivider';
import { usePageHero, useCmsTable, type FaqItem } from '@/hooks/useCmsContent';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import rentalFaqImage from '@/assets/kawaii-art/rental_rental-faq.png';

interface RentalPackage {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  cta_text: string;
  cta_url: string;
  is_highlight: boolean;
  sort_order: number;
}

interface GalleryPhoto {
  id: string;
  section: string;
  caption: string;
  image_url: string;
  sort_order: number;
}

const Rental = () => {
  const { data: hero } = usePageHero('rental');
  const { data: packages } = useCmsTable<RentalPackage>('rental_packages');
  const { data: photos } = useCmsTable<GalleryPhoto>('gallery_photos');
  const { data: faqAll } = useCmsTable<FaqItem>('faq_items');
  const rentalFaqs = (faqAll || []).filter((f) => f.page === 'rental').slice(0, 15);
  const eventPhotos = (photos || [])
    .filter((p) => p.section === 'private_party' || p.section === 'semi_private')
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      <PageHero
        eyebrow={hero?.eyebrow || 'Rental'}
        title={hero?.title || 'Make Your Event Unforgettable'}
        subtitle={hero?.subtitle}
        imageUrl={hero?.image_url || ''}
      />

      {packages && packages.length > 0 && (
        <>
        <section className="section-y section-x bg-secondary/50">
          <div className="ds-container">
            <div className="max-w-2xl mb-16">
              <p className="ds-eyebrow">Choose Your Package</p>
              <h2 className="ds-h2 mb-6">Pricing that fits every event</h2>
              <p className="ds-lead">
                From small parties to full buyouts, pick the package that matches your day.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((p) => (
                <div
                  key={p.id}
                  className={`flex flex-col rounded-2xl p-8 ${
                    p.is_highlight
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border'
                  }`}
                >
                  <h3 className="ds-h3 mb-2">{p.name}</h3>
                  <p className="text-4xl font-heading font-bold mb-4 leading-none">
                    {p.price}
                  </p>
                  <p
                    className={`text-sm font-body mb-6 ${
                      p.is_highlight ? 'text-primary-foreground/85' : 'text-muted-foreground'
                    }`}
                  >
                    {p.description}
                  </p>
                  <ul
                    className={`space-y-3 text-sm font-body flex-1 border-t pt-6 ${
                      p.is_highlight
                        ? 'border-primary-foreground/30 text-primary-foreground/90'
                        : 'border-border text-foreground/80'
                    }`}
                  >
                    {(p.features || []).map((f, i) => (
                      <li key={i} className="flex gap-3">
                        <span className={p.is_highlight ? 'text-primary-foreground' : 'text-primary'}>✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {p.cta_text && (
                    <a
                      href={p.cta_url || '#scheduling'}
                      className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full font-heading font-bold text-xs uppercase tracking-wider px-6 py-3 transition-colors ${
                        p.is_highlight
                          ? 'bg-background text-foreground hover:bg-background/90'
                          : 'bg-foreground text-background hover:bg-foreground/90'
                      }`}
                    >
                      {p.cta_text}
                      <span>→</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        <KawaiiDivider variant="scallop" from="secondary-soft" to="white" stroke="baby-pink" height={90} />
        </>
      )}

      <DynamicSections pageKey="rental" excludeSectionKeys={['rental-faq']} />

      {rentalFaqs.length > 0 && (
        <section className="section-y section-x bg-[hsl(var(--klawsome-baby-blue))]">
          <div className="ds-container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="ds-eyebrow">FAQ</p>
                <h2 className="ds-h2 mb-8">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  {rentalFaqs.map((item) => (
                    <AccordionItem key={item.id} value={item.id} className="border-b border-foreground/15">
                      <AccordionTrigger className="text-left font-heading font-bold text-base md:text-lg py-5 hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="font-body text-base leading-relaxed text-foreground/75 pb-5">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="mt-10">
                  <a
                    href="/faq"
                    className="inline-flex items-center gap-2 rounded-full bg-foreground text-background font-heading font-bold text-xs uppercase tracking-wider px-8 py-4 hover:bg-foreground/90 transition-colors"
                  >
                    See all FAQs <span>→</span>
                  </a>
                </div>
              </div>
              <div className="order-first lg:order-last">
                <img
                  src={rentalFaqImage}
                  alt="Kawaii claw machine FAQ"
                  loading="lazy"
                  className="w-full max-w-md mx-auto"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {eventPhotos.length > 0 && (
        <>
          <KawaiiDivider variant="cloud" from="secondary-soft" to="baby-pink" stroke="baby-blue" height={90} />
          <section className="section-y section-x bg-[hsl(var(--klawsome-baby-pink))]">
            <div className="ds-container">
              <div className="max-w-2xl mb-12">
                <p className="ds-eyebrow">Real Events</p>
                <h2 className="ds-h2 mb-4">From our parties to yours</h2>
                <p className="ds-lead">
                  A peek at recent rentals — KFT pop-ups, Onezo, Halloween at the house, and birthdays we've hosted.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {eventPhotos.map((p) => (
                  <figure key={p.id} className="overflow-hidden rounded-2xl bg-background">
                    <img
                      src={p.image_url}
                      alt={p.caption || 'Klawsome event photo'}
                      loading="lazy"
                      className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </figure>
                ))}
              </div>
              <div className="mt-10">
                <a
                  href="/gallery"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground text-background font-heading font-bold text-xs uppercase tracking-wider px-6 py-3 hover:bg-foreground/90 transition-colors"
                >
                  See full gallery <span>→</span>
                </a>
              </div>
            </div>
          </section>
        </>
      )}

      <KawaiiDivider variant="scallop" from="baby-pink" to="white" stroke="baby-blue" height={90} />
      <section className="section-y section-x">
        <div className="ds-container max-w-3xl text-center">
          <p className="ds-eyebrow">Required Paperwork</p>
          <h2 className="ds-h2 mb-4">Liability Release Waiver</h2>
          <p className="ds-lead mb-8">
            All rental hosts must sign a liability release waiver before the event begins. Download, review, and bring it with you — or we'll send it digitally with your booking confirmation.
          </p>
          <a
            href="/klawsome-rental-waiver.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background font-heading font-bold text-xs uppercase tracking-wider px-8 py-4 hover:bg-foreground/90 transition-colors"
          >
            Download Waiver (PDF) <span>↓</span>
          </a>
        </div>
      </section>

      <KawaiiFooter />
    </div>
  );
};

export default Rental;
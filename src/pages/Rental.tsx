import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import PageHero from '@/components/PageHero';
import KawaiiDivider from '@/components/KawaiiDivider';
import { usePageHero, useCmsTable, type FaqItem } from '@/hooks/useCmsContent';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { openBookingModal } from '@/components/BookNowDialog';
const rentalFaqImage = 'https://nrxfzjysodxqmwsstcim.supabase.co/storage/v1/object/public/site-images/transparent-png/fox-holding-heart-with-candies.png';

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
        jumpLinks={[
          ...(packages && packages.length > 0 ? [{ label: 'Packages', id: 'packages' }] : []),
          ...(rentalFaqs.length > 0 ? [{ label: 'FAQ', id: 'rental-faq' }] : []),
          ...(eventPhotos.length > 0 ? [{ label: 'Gallery', id: 'event-gallery' }] : []),
          { label: 'Waiver', id: 'waiver' },
        ]}
      />

      {packages && packages.length > 0 && (
        <>
        <section id="packages" className="py-20 px-4 bg-primary">
          <div className="container mx-auto max-w-5xl">
            {(() => {
              const mainPackages = packages.filter((p) => !/add[- ]?on/i.test(p.name));
              const addOns = packages.filter((p) => /add[- ]?on/i.test(p.name));
              const partyPkg = mainPackages.find((p) => /^party package$/i.test(p.name)) || mainPackages[0];
              const extendedPkg = mainPackages.find((p) => /extended/i.test(p.name)) || mainPackages[1];
              const comparisonRows: { label: string; desc?: string; party: string | boolean; extended: string | boolean }[] = [
                { label: 'Claw Machines', desc: 'Number of machines included.', party: '1', extended: '1' },
                { label: 'Play Time', desc: 'How long guests get to play.', party: '1 hour', extended: '2 hours' },
                { label: 'Filled with Your Product', desc: '5–10 inch plush, 0–5 lbs.', party: true, extended: true },
                { label: '40 Plushies of Your Choice', desc: 'Subject to in-stock availability.', party: false, extended: true },
                { label: 'Free Delivery within 20 Miles', party: true, extended: true },
                { label: 'Full Delivery and Setup', party: true, extended: true },
                { label: 'Easy Win Difficulty', party: true, extended: true },
                { label: 'Free-Play Mode', party: true, extended: true },
              ];
              const Cell = ({ value, color }: { value: string | boolean; color: 'red' | 'yellow' }) => {
                if (value === true) {
                  return (
                    <span
                      className={`inline-flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full ${
                        color === 'yellow' ? 'bg-klawsome-yellow text-klawsome-navy' : 'bg-primary text-white'
                      }`}
                    >
                      ✓
                    </span>
                  );
                }
                if (value === false) {
                  return (
                    <span className="inline-flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full bg-white/15 text-white/70">
                      ✕
                    </span>
                  );
                }
                return <span className="text-white font-body text-xs md:text-sm text-center">{value}</span>;
              };
              const renderCard = (p: RentalPackage, compact = false) => (
                <div
                  key={p.id}
                  className={`flex flex-col rounded-2xl ${compact ? 'p-6' : 'p-8'} ${
                    p.is_highlight
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border'
                  }`}
                >
                  <h3 className="ds-h3 mb-2">{p.name}</h3>
                  <p className={`${compact ? 'text-3xl' : 'text-4xl'} font-heading font-bold mb-4 leading-none`}>
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
                    {(p.features || []).filter((f) => !/coming soon/i.test(f)).map((f, i) => (
                      <li key={i} className="flex gap-3">
                        <span className={p.is_highlight ? 'text-primary-foreground' : 'text-primary'}>✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={openBookingModal}
                    className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full font-heading font-bold text-xs uppercase tracking-wider px-6 py-3 transition-colors ${
                      p.is_highlight
                        ? 'bg-background text-foreground hover:bg-background/90'
                        : 'bg-foreground text-background hover:bg-foreground/90'
                    }`}
                  >
                    Add to Rental
                    <span>→</span>
                  </button>
                </div>
              );
              return (
                <>
                  <p className="ds-eyebrow text-klawsome-yellow mb-3 text-center">Choose Your Package</p>
                  <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 text-center uppercase">
                    Package Comparison
                  </h2>
                  <p className="text-white/80 font-body text-center mb-12 max-w-2xl mx-auto">
                    Compare our two rental packages and pick the one that's right for your event.
                  </p>

                  <div className="rounded-kawaii overflow-hidden border border-white/20 bg-klawsome-navy/40 backdrop-blur-sm">
                    {/* Header */}
                    <div className="grid grid-cols-[1.2fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr]">
                      <div className="p-3 md:p-6" />
                      <div className="p-3 md:p-6 text-center bg-primary border-l border-white/20">
                        <p className="font-heading font-bold text-white text-base md:text-2xl uppercase leading-tight">Party Package</p>
                        <p className="text-white/80 font-body text-xs mt-1">{partyPkg?.price || '$445'}</p>
                      </div>
                      <div className="p-3 md:p-6 text-center bg-klawsome-yellow border-l border-white/20">
                        <p className="font-heading font-bold text-klawsome-navy text-base md:text-2xl uppercase leading-tight">Extended Party</p>
                        <p className="text-klawsome-navy/80 font-body text-xs mt-1">{extendedPkg?.price || '$645'}</p>
                      </div>
                    </div>

                    {/* Rows */}
                    {comparisonRows.map((row, i) => (
                      <div
                        key={i}
                        className={`grid grid-cols-[1.2fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr] border-t border-white/10 ${i % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`}
                      >
                        <div className="p-3 md:p-6">
                          <p className="font-heading font-bold text-white text-xs md:text-base leading-tight">{row.label}</p>
                          {row.desc && <p className="text-white/60 font-body text-xs mt-1 hidden md:block">{row.desc}</p>}
                        </div>
                        <div className="p-3 md:p-6 flex items-center justify-center text-center border-l border-white/10">
                          <Cell value={row.party} color="red" />
                        </div>
                        <div className="p-3 md:p-6 flex items-center justify-center text-center border-l border-white/10">
                          <Cell value={row.extended} color="yellow" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-[1.2fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr]">
                    <div />
                    <div className="col-span-2 flex justify-end">
                      <Button
                        onClick={openBookingModal}
                        size="lg"
                        className="w-full rounded-full py-5 md:py-6 text-base md:text-lg font-heading font-bold bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 animate-glow-pulse-sm md:animate-glow-pulse"
                      >
                        Book Your Event
                      </Button>
                    </div>
                  </div>

                  {addOns.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                      {addOns.map((p) => renderCard(p, true))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </section>
        </>
      )}

      {rentalFaqs.length > 0 && (
        <>
        <KawaiiDivider variant="cloud" from="red" to="baby-blue" stroke="baby-pink" height={90} />
        <section id="rental-faq" className="section-y section-x bg-[hsl(var(--klawsome-baby-blue))]">
          <div className="ds-container-narrow">
            <p className="ds-eyebrow">FAQ</p>
            <h2 className="ds-h2 mb-8">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {rentalFaqs.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border-b border-border">
                  <AccordionTrigger className="text-left font-heading font-bold text-lg md:text-xl py-6 hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-base md:text-lg leading-relaxed text-muted-foreground pb-6">
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
        </section>
        </>
      )}

      {eventPhotos.length > 0 && (
        <>
          <KawaiiDivider variant="scallop" from={rentalFaqs.length > 0 ? 'baby-blue' : 'secondary-soft'} to="baby-pink" stroke="white" height={90} />
          <section id="event-gallery" className="section-y section-x bg-[hsl(var(--klawsome-baby-pink))]">
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
      <section id="waiver" className="section-y section-x">
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
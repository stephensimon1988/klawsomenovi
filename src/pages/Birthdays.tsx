import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import KawaiiDivider from '@/components/KawaiiDivider';
import { useCmsSingle, useCmsTable, usePageHero, type BirthdaysContent, type PartyOption, type FaqItem, type InviteTemplate } from '@/hooks/useCmsContent';
import PageHero from '@/components/PageHero';
import { openBookingModal } from '@/components/BookNowDialog';
import birthdaysHero from '@/assets/birthdays-hero.png';

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left">
        <span className="font-heading font-bold text-white text-sm md:text-base pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-white/60 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pb-5">
          <p className="text-white/70 font-body text-sm leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  );
};

const Birthdays = () => {
  const { data: content } = useCmsSingle<BirthdaysContent>('birthdays_content');
  const { data: partyOptions } = useCmsTable<PartyOption>('party_options');
  const { data: allFaqs } = useCmsTable<FaqItem>('faq_items');
  const { data: templates } = useCmsTable<InviteTemplate>('invite_templates');
  const { data: hero } = usePageHero('birthdays');

  const faqItems = allFaqs?.filter(f => f.page === 'birthdays') || [];
  const bookingEmail = content?.booking_email || 'events@klawsomenovi.com';

  const privateOpt = (partyOptions || []).find(o => /private/i.test(o.name) && !/semi/i.test(o.name));
  const semiOpt = (partyOptions || []).find(o => /semi/i.test(o.name));

  const comparisonRows: { label: string; desc?: string; private: boolean | string; semi: boolean | string }[] = [
    { label: '325 Klaw Machine Tokens', desc: 'Plenty of tokens for everyone to play.', private: true, semi: true },
    { label: 'Exclusive private space', desc: 'Klawsome closed to the public during your event.', private: true, semi: false },
    { label: 'Play time', desc: 'How long guests get to play games.', private: '1 hour + 30 min setup', semi: 'Unlimited during business hours' },
    { label: 'Location', desc: 'Where your party is hosted.', private: 'Klawsome (closed hours)', semi: 'Paris Baguette next door' },
    { label: 'Tables and seating', desc: 'Dedicated space for guests to sit and eat.', private: true, semi: 'At Paris Baguette' },
    { label: 'Bring your own food', desc: 'Cake and outside food allowed.', private: true, semi: false },
    { label: 'Food service', desc: 'Catering available on site.', private: false, semi: 'Paris Baguette menu (cost TBD)' },
    { label: 'Decoration setup', desc: 'Time and space to decorate before the party.', private: 'Full setup available', semi: 'Simple decor only' },
    { label: 'Wall hangings / advance setup', desc: 'Hang banners or arrive early to set up.', private: true, semi: false },
  ];

  const Cell = ({ value, color }: { value: boolean | string; color: 'red' | 'yellow' }) => {
    if (typeof value === 'string') {
      return <span className="text-white/90 font-body text-xs md:text-sm">{value}</span>;
    }
    if (value) {
      return (
        <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center mx-auto ${color === 'red' ? 'bg-primary' : 'bg-klawsome-yellow'}`}>
          <Check className={`w-5 h-5 ${color === 'red' ? 'text-white' : 'text-klawsome-navy'}`} strokeWidth={3} />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center mx-auto bg-white/10">
        <X className="w-5 h-5 text-white/40" strokeWidth={2.5} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-klawsome-navy">
      <KawaiiNav />

      <PageHero
        eyebrow={hero?.eyebrow || 'Birthdays'}
        title={hero?.title || content?.hero_headline || 'Celebrate your birthday with Klawsome!'}
        subtitle={hero?.subtitle}
        imageUrl={hero?.image_url || content?.hero_image_url || birthdaysHero}
        overlay="white"
        jumpLinks={[
          { label: 'Party Rules', id: 'party-rules' },
          { label: 'Packages', id: 'party-options' },
          { label: 'Add-Ons', id: 'add-ons' },
          ...(faqItems.length > 0 ? [{ label: 'FAQ', id: 'birthday-faq' }] : []),
        ]}
      />

      {/* Party Rules */}
      <section id="party-rules" className="py-20 px-6 lg:px-12 bg-klawsome-navy">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="rounded-kawaii overflow-hidden">
              <img
                src="https://nrxfzjysodxqmwsstcim.supabase.co/storage/v1/object/public/site-images/transparent-png/panda-cat-fox-claw-machine-party.png"
                alt="Kawaii characters celebrating a birthday party"
                className="w-full aspect-square object-contain"
                loading="lazy"
              />
            </div>

            <div>
              <p className="ds-eyebrow text-primary mb-3">Party Rules</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                Looking to Host a Birthday Party?
              </h2>
              <p className="text-white/80 font-body leading-relaxed mb-6 text-lg">
                {content?.rules_text || 'Please notify Klawsome two weeks in advance for parties.'}
              </p>
              <p className="text-white/70 font-body text-sm mb-10">
                For more information and BEFORE booking your event, please contact{' '}
                <a href={`mailto:${bookingEmail}`} className="text-primary hover:underline">{bookingEmail}</a>{' '}
                and expect a response within three business days.
              </p>

              <div className="flex gap-3 flex-wrap">
                <Button size="hero" onClick={openBookingModal} className="bg-white text-klawsome-navy hover:bg-white/90">
                  Book a Birthday Party
                </Button>
                <Button asChild size="hero" variant="heroGhost">
                  <a href="#party-options">See Options</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <KawaiiDivider variant="scallop" from="navy" to="red" stroke="yellow" height={90} />

      {/* Party Options — Comparison Table */}
      <section id="party-options" className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-5xl">
          <p className="ds-eyebrow text-klawsome-yellow mb-3 text-center">Party Options</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 text-center uppercase">
            Package Comparison
          </h2>
          <p className="text-white/80 font-body text-center mb-12 max-w-2xl mx-auto">
            Compare our two birthday party options and pick the one that's right for your celebration.
          </p>

          <div className="rounded-kawaii overflow-hidden border border-white/20 bg-klawsome-navy/40 backdrop-blur-sm">
            {/* Header */}
            <div className="grid grid-cols-[1.2fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr]">
              <div className="p-3 md:p-6" />
              <div className="p-3 md:p-6 text-center bg-primary border-l border-white/20">
                <p className="font-heading font-bold text-white text-base md:text-2xl uppercase leading-tight">Private</p>
                <p className="text-white/80 font-body text-xs mt-1">{privateOpt?.price || '$250'}</p>
              </div>
              <div className="p-3 md:p-6 text-center bg-klawsome-yellow border-l border-white/20">
                <p className="font-heading font-bold text-klawsome-navy text-base md:text-2xl uppercase leading-tight">Semi-Private</p>
                <p className="text-klawsome-navy/80 font-body text-xs mt-1">{semiOpt?.price || '$250'}</p>
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
                  <Cell value={row.private} color="red" />
                </div>
                <div className="p-3 md:p-6 flex items-center justify-center text-center border-l border-white/10">
                  <Cell value={row.semi} color="yellow" />
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
        </div>
      </section>

      {/* Add-Ons */}
      <KawaiiDivider variant="bumps" from="red" to="baby-pink" stroke="white" height={90} />
      <section id="add-ons" className="py-20 px-4 bg-[hsl(var(--klawsome-baby-pink))]">
        <div className="container mx-auto max-w-6xl">
          <p className="ds-eyebrow text-klawsome-navy mb-3 text-center">Options & Add-Ons</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-klawsome-navy mb-4 text-center uppercase">
            Make It Extra Special
          </h2>
          <p className="text-klawsome-navy/80 font-body text-center mb-12 max-w-2xl mx-auto">
            Take your party to the next level with these optional upgrades.
          </p>

          {/* Themed Decoration Packages — split into 2 cards on top */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-kawaii p-6 border border-klawsome-navy/10 shadow-sm flex flex-col border-l-4 border-l-primary">
              <p className="ds-eyebrow text-primary mb-2">Decor</p>
              <h3 className="font-heading font-bold text-xl text-klawsome-navy mb-2">Private Event Decorations</h3>
              <p className="text-3xl font-heading font-bold text-primary mb-3">$129</p>
              <p className="text-klawsome-navy/80 font-body text-sm leading-relaxed flex-1">
                Tablecloths, paper plates / silverware / napkins, and two balloon bouquets or one large balloon arch attached to the table.
              </p>
            </div>
            <div className="bg-white rounded-kawaii p-6 border border-klawsome-navy/10 shadow-sm flex flex-col border-l-4 border-l-klawsome-yellow">
              <p className="ds-eyebrow text-primary mb-2">Decor</p>
              <h3 className="font-heading font-bold text-xl text-klawsome-navy mb-2">Paris Baguette Basic Decor</h3>
              <p className="text-3xl font-heading font-bold text-primary mb-3">$89</p>
              <p className="text-klawsome-navy/80 font-body text-sm leading-relaxed flex-1">
                For semi-private events. Tablecloth, paper plates / silverware / napkins, and a balloon bouquet on the table. Wall hangings not allowed; color scheme can be requested.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Costume Animal Show */}
            <div className="bg-white rounded-kawaii p-6 border border-klawsome-navy/10 shadow-sm flex flex-col">
              <p className="ds-eyebrow text-primary mb-2">Live Show</p>
              <h3 className="font-heading font-bold text-xl text-klawsome-navy mb-2">Costume Animal Show</h3>
              <p className="text-3xl font-heading font-bold text-primary mb-3">$89<span className="text-sm text-klawsome-navy/60 font-body font-normal"> / 30 min</span></p>
              <p className="text-klawsome-navy/80 font-body text-sm leading-relaxed mb-4 flex-1">
                A costumed character makes a special appearance at your party.
              </p>
              <div>
                <p className="text-xs uppercase tracking-wider font-heading font-bold text-klawsome-navy/60 mb-2">Choose your character</p>
                <div className="flex flex-wrap gap-2">
                  {['Pikachu', 'Cinnamoroll', 'Hello Kitty', 'Kuromi', 'Bluey'].map((c) => (
                    <span key={c} className="text-xs font-heading font-bold bg-klawsome-yellow text-klawsome-navy px-3 py-1.5 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* XL Plushie */}
            <div className="bg-white rounded-kawaii p-6 border border-klawsome-navy/10 shadow-sm flex flex-col">
              <p className="ds-eyebrow text-primary mb-2">Gift</p>
              <h3 className="font-heading font-bold text-xl text-klawsome-navy mb-2">XL Plushie</h3>
              <p className="text-3xl font-heading font-bold text-primary mb-3">$89</p>
              <p className="text-klawsome-navy/80 font-body text-sm leading-relaxed flex-1">
                An XL plushie of the birthday celebrant's choice — at the 19 Plushies trade-in price or smaller.
              </p>
            </div>

            {/* Photography Rental */}
            <div className="bg-white rounded-kawaii p-6 border border-klawsome-navy/10 shadow-sm flex flex-col">
              <p className="ds-eyebrow text-primary mb-2">Photo Session</p>
              <h3 className="font-heading font-bold text-xl text-klawsome-navy mb-2">Photography Rental</h3>
              <p className="text-3xl font-heading font-bold text-primary mb-3">$49<span className="text-sm text-klawsome-navy/60 font-body font-normal"> / hour</span></p>
              <p className="text-klawsome-navy/80 font-body text-sm leading-relaxed flex-1">
                Rent our facility for a 1-hour photography session — perfect for capturing the celebration.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Button onClick={openBookingModal} size="hero" className="bg-klawsome-navy text-white hover:bg-klawsome-navy/90">
              Add These to Your Booking
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqItems.length > 0 && (
        <>
        <KawaiiDivider variant="cloud" from="baby-pink" to="navy" stroke="white" height={90} />
        <section id="birthday-faq" className="py-20 px-4 bg-klawsome-navy">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-10 text-center">Frequently Asked Questions</h2>
            <div className="bg-white/5 rounded-kawaii p-6 md:p-8 border border-white/10">
              {faqItems.map((item) => (
                <FAQItem key={item.id} q={item.question} a={item.answer} />
              ))}
            </div>
          </div>
        </section>
        </>
      )}

      {/* Invite Templates */}
      <KawaiiFooter prevColor={faqItems.length > 0 ? 'navy' : 'baby-pink'} />
    </div>
  );
};

export default Birthdays;

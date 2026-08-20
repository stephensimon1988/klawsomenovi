import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Check, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import KawaiiDivider from '@/components/KawaiiDivider';
import { useCmsSingle, useCmsTable, usePageHero, type BirthdaysContent, type PartyOption, type FaqItem, type InviteTemplate, type SiteSettings } from '@/hooks/useCmsContent';
import PageHero from '@/components/PageHero';
import { openBookingModal } from '@/components/BookNowDialog';
import { RENTAL_PACKAGES, MOBILE_TIERS, ADDONS, fmtUSD, mobileRate } from '@/lib/booking/catalog';
import FramedImage from '@/components/FramedImage';
import { Link } from 'react-router-dom';
 import birthdaysHero from '@/assets/birthdays-hero.webp';
 import pandaCatFoxParty from '@/assets/panda-cat-fox-party.webp';

interface GalleryPhoto { id: string; section: string; caption: string; image_url: string; sort_order: number; }

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
  const { data: settings } = useCmsSingle<SiteSettings>('site_settings');
  const { data: partyOptions } = useCmsTable<PartyOption>('party_options');
  const { data: allFaqs } = useCmsTable<FaqItem>('faq_items');
  const { data: templates } = useCmsTable<InviteTemplate>('invite_templates');
  const { data: hero } = usePageHero('birthdays');
  const { data: galleryPhotos } = useCmsTable<GalleryPhoto>('gallery_photos');

  const privatePics = (galleryPhotos || [])
    .filter(p => p.section === 'private_minecraft' || p.section === 'private_summer')
    .slice(0, 4);
  const semiPics = (galleryPhotos || [])
    .filter(p => p.section === 'semi_private')
    .slice(0, 4);

  const faqItems = allFaqs?.filter(f => f.page === 'birthdays') || [];
  const bookingEmail = content?.booking_email || settings?.events_email || 'events@klawsomenovi.com';

  const privateOpt = (partyOptions || []).find(o => /private/i.test(o.name) && !/semi/i.test(o.name));
  const semiOpt = (partyOptions || []).find(o => /semi/i.test(o.name));

  type Cv = boolean | string;
  const comparisonRows: { label: string; desc?: string; private: Cv; semi: Cv; rental: Cv; mobile: Cv }[] = [
    { label: 'Klaw machine tokens included', desc: 'Plenty of plays for everyone.', private: '325 tokens', semi: '325 tokens', rental: '40 plushies to win', mobile: 'Tokens or unlimited play' },
    { label: 'Exclusive private space', desc: 'Closed to the public during your event.', private: true, semi: false, rental: 'At your venue', mobile: 'At your venue' },
    { label: 'Play time', desc: 'How long guests get to play games.', private: '1 hour + 30 min setup', semi: 'Unlimited during business hours', rental: '1 or 2 hours', mobile: '1 or 2 hours + extra hours' },
    {
      label: 'Location',
      desc: 'Where your party is hosted.',
      private: 'Klawsome',
      semi: 'Paris Baguette next door\nor\nCloud Boba\nor\nOutdoor Space',
      rental: 'Your venue',
      mobile: 'Your venue',
    },
    { label: 'Tables and seating', desc: 'Dedicated space for guests to sit and eat.', private: true, semi: 'At Paris Baguette', rental: 'Provided by your venue', mobile: 'Provided by your venue' },
    { label: 'Bring your own food', desc: 'Cake and outside food allowed.', private: "Bring any food you'd like", semi: 'Paris Baguette or Cloud Boba (depending what you like)', rental: 'Your venue rules', mobile: 'Your venue rules' },
    { label: 'Food service', desc: 'Catering available on site.', private: false, semi: 'Paris Baguette menu', rental: false, mobile: false },
    { label: 'Decoration setup', desc: 'Time and space to decorate before the party.', private: 'See Decor Add-Ons →', semi: 'See Decor Add-Ons →', rental: false, mobile: false },
    { label: 'Choose the plushies in a machine', desc: 'Pick the plushies featured for your party.', private: true, semi: true, rental: true, mobile: true },
    { label: 'Choose machine color and music', desc: 'Customize the vibe with your color and music picks.', private: true, semi: false, rental: true, mobile: true },
    { label: 'Machines included', desc: 'How many claw machines you get.', private: 'Full arcade in store', semi: 'Full arcade in store', rental: '1 machine (add more)', mobile: 'Mobile arcade setup' },
    { label: 'Delivery to your venue', desc: 'We haul, set up, and pick up.', private: false, semi: false, rental: 'Quoted at checkout', mobile: 'Quoted at checkout' },
  ];

  type Accent = 'red' | 'yellow' | 'blue' | 'pink';

  const rentalFrom = fmtUSD(Math.min(...RENTAL_PACKAGES.map((p) => p.priceCents)));
  const mobileFrom = fmtUSD(Math.min(...MOBILE_TIERS.map((t) => mobileRate(t, 'weekday', 1).cents)));

  const gridCols = 'grid grid-cols-[minmax(170px,1.6fr)_repeat(4,minmax(160px,1fr))]';

  const columns: {
    key: 'private' | 'semi' | 'rental' | 'mobile';
    label: string;
    price: string;
    accent: Accent;
    headerBg: string;
    headerText: string;
    headerSub: string;
    btn: string;
  }[] = [
    {
      key: 'private', label: 'Private Party', price: privateOpt?.price || '$319', accent: 'red',
      headerBg: 'bg-primary', headerText: 'text-white', headerSub: 'text-white/80',
      btn: 'bg-white text-klawsome-navy hover:bg-white/90',
    },
    {
      key: 'semi', label: 'Semi-Private', price: semiOpt?.price || '$250', accent: 'yellow',
      headerBg: 'bg-klawsome-yellow', headerText: 'text-klawsome-navy', headerSub: 'text-klawsome-navy/80',
      btn: 'bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90',
    },
    {
      key: 'rental', label: 'Rent a Klaw Machine', price: `from ${rentalFrom}`, accent: 'blue',
      headerBg: 'bg-klawsome-baby-blue', headerText: 'text-klawsome-navy', headerSub: 'text-klawsome-navy/80',
      btn: 'bg-klawsome-baby-blue text-klawsome-navy hover:bg-klawsome-baby-blue/90',
    },
    {
      key: 'mobile', label: 'Klawsome Mobile', price: `from ${mobileFrom}`, accent: 'pink',
      headerBg: 'bg-klawsome-baby-pink', headerText: 'text-klawsome-navy', headerSub: 'text-klawsome-navy/80',
      btn: 'bg-klawsome-baby-pink text-klawsome-navy hover:bg-klawsome-baby-pink/90',
    },
  ];

  const Cell = ({ value, color }: { value: Cv; color: Accent }) => {
    if (typeof value === 'string') {
      if (/see decor add-ons/i.test(value)) {
        return (
          <a
            href="#add-ons"
            className={`font-heading font-bold text-xs md:text-sm uppercase tracking-wider underline underline-offset-4 hover:no-underline transition-colors ${
              color === 'red' ? 'text-white hover:text-klawsome-yellow' : 'text-klawsome-yellow hover:text-white'
            }`}
          >
            {value}
          </a>
        );
      }
      return (
        <span className="text-white/90 font-body text-xs md:text-sm whitespace-pre-line">
          {value}
        </span>
      );
    }
    if (value) {
      const bg =
        color === 'red' ? 'bg-primary'
        : color === 'yellow' ? 'bg-klawsome-yellow'
        : color === 'blue' ? 'bg-klawsome-baby-blue'
        : 'bg-klawsome-baby-pink';
      return (
        <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center mx-auto ${bg}`}>
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
        imageUrl={birthdaysHero}
        overlay="white"
        jumpLinks={[
          { label: 'Gallery', id: 'party-gallery' },
          { label: 'Party Rules', id: 'party-rules' },
          { label: 'Packages', id: 'party-options' },
          { label: 'Add-Ons', id: 'add-ons' },
          { label: 'Rental', id: 'rental-addons' },
          { label: 'Mobile', id: 'mobile-addons' },
          ...(faqItems.length > 0 ? [{ label: 'FAQ', id: 'birthday-faq' }] : []),
        ]}
      />


      {/* Party Rules */}
      <section id="party-rules" className="py-20 px-6 lg:px-12 bg-klawsome-navy">
        <div className="ds-container-content">
          <div className="ds-cols">
            <FramedImage
              src={pandaCatFoxParty}
              alt="Kawaii characters celebrating a birthday party"
              color="baby-blue"
              sectionBg="navy"
              className="w-full aspect-square"
            />

            <div>
              <p className="ds-eyebrow text-primary mb-3">Party Rules</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                Looking to Host a Birthday Party?
              </h2>
              <p className="text-white/80 font-body leading-relaxed mb-6 text-lg">
                Make your celebration unforgettable with a birthday party at Klawsome! Check out the options below and book the package that's right for you.
              </p>
              <p className="text-white/70 font-body text-sm mb-10">
                For more information and BEFORE booking your event, please contact{' '}
                <a href={`mailto:${bookingEmail}`} className="text-primary hover:underline">{bookingEmail}</a>{' '}
                and expect a response within three business days.
              </p>

              <div className="rounded-kawaii bg-white/10 border border-white/20 p-5 mb-10">
                <p className="font-heading font-bold text-white mb-2">Guest limits</p>
                <p className="text-white/80 font-body text-sm leading-relaxed">
                  As Klawsome has limited space, a maximum of <strong>12 adults</strong> are allowed along with a <strong>separate</strong> maximum of <strong>12 children</strong> (up to 24 guests total, counted separately). We keep a limit on guests to ensure a fun and comfortable experience for everyone.
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Button size="cta" onClick={() => openBookingModal()} className="bg-white text-klawsome-navy hover:bg-white/90">
                  Book a Birthday Party
                </Button>
                <Button size="cta" asChild variant="heroGhost">
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
        <div className="ds-container-content">
          <p className="ds-eyebrow text-klawsome-yellow mb-3 text-center">Party Options</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 text-center uppercase">
            Package Comparison
          </h2>
          <p className="text-white/80 font-body text-center mb-12 max-w-2xl mx-auto">
            Compare all four Klawsome booking types and pick the one that's right for your celebration.
          </p>

          <p className="text-white/60 font-body text-xs text-center mb-4 lg:hidden">Scroll the table sideways to see every option →</p>

          <div className="rounded-kawaii overflow-x-auto border border-white/20 bg-klawsome-navy/40 backdrop-blur-sm">
            <div className="min-w-[880px]">
              {/* Header */}
              <div className={gridCols}>
                <div className="p-3 md:p-6" />
                {columns.map((c) => (
                  <div key={c.key} className={`p-3 md:p-6 text-center border-l border-white/20 ${c.headerBg}`}>
                    <p className={`font-heading font-bold text-sm md:text-xl uppercase leading-tight ${c.headerText}`}>{c.label}</p>
                    <p className={`font-body text-xs mt-1 ${c.headerSub}`}>{c.price}</p>
                  </div>
                ))}
              </div>

              {/* Rows */}
              {comparisonRows.map((row, i) => (
                <div
                  key={i}
                  className={`${gridCols} border-t border-white/10 ${i % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`}
                >
                  <div className="p-3 md:p-6 flex flex-col justify-center">
                    <p className="font-heading font-bold text-white text-xs md:text-base leading-tight">{row.label}</p>
                    {row.desc && <p className="text-white/60 font-body text-xs mt-1 hidden md:block">{row.desc}</p>}
                  </div>
                  {columns.map((c) => (
                    <div key={c.key} className="p-3 md:p-6 flex items-center justify-center text-center border-l border-white/10">
                      <Cell value={row[c.key]} color={c.accent} />
                    </div>
                  ))}
                </div>
              ))}

              {/* Book buttons */}
              <div className={`${gridCols} border-t border-white/10`}>
                <div className="p-3 md:p-6" />
                {columns.map((c) => (
                  <div key={c.key} className="p-3 md:p-6 border-l border-white/10">
                    <Button
                      size="cta"
                      onClick={() => openBookingModal(c.key)}
                      className={`w-full font-heading font-bold ${c.btn}`}
                    >
                      Book
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              size="cta"
              onClick={() => openBookingModal()}
              className="font-heading font-bold bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 animate-glow-pulse-sm md:animate-glow-pulse"
            >
              Book Your Event
            </Button>
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <KawaiiDivider variant="bumps" from="red" to="baby-pink" stroke="white" height={90} />
      <section id="add-ons" className="py-20 px-4 bg-[hsl(var(--klawsome-baby-pink))]">
        <div className="ds-container-content">
          <p className="ds-eyebrow text-klawsome-navy mb-3 text-center">Options & Add-Ons</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-klawsome-navy mb-4 text-center uppercase">
            Make It Extra Special
          </h2>
          <p className="text-klawsome-navy/80 font-body text-center mb-12 max-w-2xl mx-auto">
            Take your event to the next level with these optional upgrades. Each group below shows which booking type it goes with.
          </p>

          {/* ---------- Group 1: In-Store Parties ---------- */}
          <div className="mb-6 rounded-kawaii bg-klawsome-navy/10 border border-klawsome-navy/15 p-5">
            <p className="ds-eyebrow text-primary mb-1">In-Store Party Add-Ons</p>
            <h3 className="font-heading font-bold text-2xl text-klawsome-navy uppercase leading-tight">Private &amp; Semi-Private Parties</h3>
            <p className="text-klawsome-navy/70 font-body text-sm mt-1">
              Goes with: Private Party and Semi-Private Party bookings at Klawsome.
            </p>
          </div>

          {/* Themed Decoration Packages — split into 2 cards on top */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-kawaii p-6 border border-klawsome-navy/10 shadow-sm flex flex-col border-l-4 border-l-primary">
              <p className="ds-eyebrow text-primary mb-2">Decor</p>
              <h3 className="font-heading font-bold text-xl text-klawsome-navy mb-2">Private Event Decorations</h3>
              <p className="text-3xl font-heading font-bold text-primary mb-3">$129</p>
              <p className="text-klawsome-navy/80 font-body text-sm leading-relaxed flex-1 mb-4">
                Tablecloths, paper plates / silverware / napkins, and two balloon bouquets or one large balloon arch attached to the table.
              </p>
              <span className="self-start text-xs font-heading font-bold uppercase tracking-wider bg-primary text-white px-3 py-1.5 rounded-full">Private only</span>
            </div>
            <div className="bg-white rounded-kawaii p-6 border border-klawsome-navy/10 shadow-sm flex flex-col border-l-4 border-l-klawsome-yellow">
              <p className="ds-eyebrow text-primary mb-2">Decor</p>
              <h3 className="font-heading font-bold text-xl text-klawsome-navy mb-2">Paris Baguette Basic Decor</h3>
              <p className="text-3xl font-heading font-bold text-primary mb-3">$89</p>
              <p className="text-klawsome-navy/80 font-body text-sm leading-relaxed flex-1 mb-4">
                Tablecloth, paper plates / silverware / napkins, and a balloon bouquet on the table. Wall hangings not allowed; color scheme can be requested.
              </p>
              <span className="self-start text-xs font-heading font-bold uppercase tracking-wider bg-klawsome-yellow text-klawsome-navy px-3 py-1.5 rounded-full">Semi-private only</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Costume Animal Show */}
            <div className="bg-white rounded-kawaii p-6 border border-klawsome-navy/10 shadow-sm flex flex-col">
              <p className="ds-eyebrow text-primary mb-2">Live Show</p>
              <h3 className="font-heading font-bold text-xl text-klawsome-navy mb-2">Costumed Mascot Show</h3>
              <p className="text-3xl font-heading font-bold text-primary mb-3">$89<span className="text-sm text-klawsome-navy/60 font-body font-normal"> / 30 min</span></p>
              <p className="text-klawsome-navy/80 font-body text-sm leading-relaxed mb-4 flex-1">
                A costumed character visits your party for 30 minutes of meet-and-greet fun—posing for photos, dancing with guests, and bringing extra energy to the celebration. Choose from favorites like Pikachu, Cinnamoroll, Hello Kitty, Kuromi, and Bluey. Character availability is limited, so please reach out to confirm.
              </p>
              <div>
                <p className="text-xs uppercase tracking-wider font-heading font-bold text-klawsome-navy/60 mb-2">Choose your character</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Pikachu', 'Cinnamoroll', 'Hello Kitty', 'Kuromi', 'Bluey'].map((c) => (
                    <span key={c} className="text-xs font-heading font-bold bg-klawsome-yellow text-klawsome-navy px-3 py-1.5 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
                <span className="inline-block text-xs font-heading font-bold uppercase tracking-wider bg-klawsome-navy text-white px-3 py-1.5 rounded-full">Private &amp; semi-private</span>
              </div>
            </div>

            {/* XL Plushie */}
            <div className="bg-white rounded-kawaii p-6 border border-klawsome-navy/10 shadow-sm flex flex-col">
              <p className="ds-eyebrow text-primary mb-2">Gift</p>
              <h3 className="font-heading font-bold text-xl text-klawsome-navy mb-2">XL Plushie</h3>
              <p className="text-3xl font-heading font-bold text-primary mb-3">$89</p>
              <p className="text-klawsome-navy/80 font-body text-sm leading-relaxed flex-1 mb-4">
                An XL plushie of the birthday celebrant's choice — at the 19 Plushies trade-in price or smaller.
              </p>
              <span className="self-start text-xs font-heading font-bold uppercase tracking-wider bg-klawsome-navy text-white px-3 py-1.5 rounded-full">Private &amp; semi-private</span>
            </div>

            {/* Book Event Photographer */}
            <div className="bg-white rounded-kawaii p-6 border border-klawsome-navy/10 shadow-sm flex flex-col">
              <p className="ds-eyebrow text-primary mb-2">Photo Session</p>
              <h3 className="font-heading font-bold text-xl text-klawsome-navy mb-2">Book Event Photographer</h3>
              <p className="text-3xl font-heading font-bold text-primary mb-3">$79<span className="text-sm text-klawsome-navy/60 font-body font-normal"> / hour</span></p>
              <p className="text-klawsome-navy/80 font-body text-sm leading-relaxed flex-1 mb-4">
                Book our on-staff photographer for a photography session during the event. Perfect for capturing the celebration.
              </p>
              <span className="self-start text-xs font-heading font-bold uppercase tracking-wider bg-klawsome-navy text-white px-3 py-1.5 rounded-full">Private &amp; semi-private</span>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Button size="cta" onClick={() => openBookingModal()} className="bg-klawsome-navy text-white hover:bg-klawsome-navy/90">
              Add These to a Party Booking
            </Button>
          </div>

          {/* ---------- Group 2: Rent a Klaw Machine ---------- */}
          <div id="rental-addons" className="mt-16 mb-6 rounded-kawaii bg-klawsome-baby-blue border border-klawsome-navy/15 p-5">
            <p className="ds-eyebrow text-klawsome-navy/70 mb-1">Rent a Klaw Machine</p>
            <h3 className="font-heading font-bold text-2xl text-klawsome-navy uppercase leading-tight">Machine Rental Add-Ons</h3>
            <p className="text-klawsome-navy/70 font-body text-sm mt-1">
              Goes with: Rent a Klaw Machine bookings at your venue. Rentals start at {rentalFrom} for 1 hour ({fmtUSD(RENTAL_PACKAGES[1].priceCents)} for 2 hours) and include 40 regular-size plushies or your own supplied product. Delivery is quoted at checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ADDONS.filter((a) => a.scope.includes('rental')).map((a) => (
              <div key={a.id} className="bg-white rounded-kawaii p-6 border border-klawsome-navy/10 shadow-sm flex flex-col border-l-4 border-l-klawsome-baby-blue">
                <p className="ds-eyebrow text-primary mb-2">Rental Upgrade</p>
                <h3 className="font-heading font-bold text-xl text-klawsome-navy mb-2">{a.label}</h3>
                <p className="text-3xl font-heading font-bold text-primary mb-3">{a.price}</p>
                <p className="text-klawsome-navy/80 font-body text-sm leading-relaxed flex-1 mb-4">{a.description}</p>
                <span className="self-start text-xs font-heading font-bold uppercase tracking-wider bg-klawsome-baby-blue text-klawsome-navy px-3 py-1.5 rounded-full">
                  {a.scope.includes('mobile') ? 'Rental & Klawsome Mobile' : 'Machine rental only'}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button size="cta" onClick={() => openBookingModal('rental')} className="bg-klawsome-navy text-white hover:bg-klawsome-navy/90">
              Book a Machine Rental
            </Button>
          </div>

          {/* ---------- Group 3: Klawsome Mobile ---------- */}
          <div id="mobile-addons" className="mt-16 mb-6 rounded-kawaii bg-white border border-klawsome-navy/15 p-5 border-l-4 border-l-primary">
            <p className="ds-eyebrow text-primary mb-1">Klawsome Mobile</p>
            <h3 className="font-heading font-bold text-2xl text-klawsome-navy uppercase leading-tight">Mobile Arcade Options</h3>
            <p className="text-klawsome-navy/70 font-body text-sm mt-1">
              Goes with: Klawsome Mobile bookings at your venue. Pick a play tier below — rates differ for weekdays and weekends, and delivery is quoted at checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOBILE_TIERS.map((t) => (
              <div key={t.id} className="bg-white rounded-kawaii p-6 border border-klawsome-navy/10 shadow-sm flex flex-col">
                <p className="ds-eyebrow text-primary mb-2">Play Tier</p>
                <h3 className="font-heading font-bold text-xl text-klawsome-navy mb-2">{t.label}</h3>
                <p className="text-3xl font-heading font-bold text-primary mb-1">
                  {fmtUSD(mobileRate(t, 'weekday', 1).cents)}
                  <span className="text-sm text-klawsome-navy/60 font-body font-normal"> / 1 hr weekday</span>
                </p>
                <p className="text-klawsome-navy/60 font-body text-xs mb-3">
                  Weekend from {fmtUSD(mobileRate(t, 'weekend', 1).cents)} · 2 hours from {fmtUSD(mobileRate(t, 'weekday', 2).cents)}
                </p>
                <p className="text-klawsome-navy/80 font-body text-sm leading-relaxed mb-2">{t.description}</p>
                <p className="text-klawsome-navy/70 font-body text-sm flex-1 mb-4">
                  1 hour: {t.tokensNote[1]} · 2 hours: {t.tokensNote[2]}
                  {t.extraHourNote ? ` · ${t.extraHourNote}` : ''}
                </p>
                <span className="self-start text-xs font-heading font-bold uppercase tracking-wider bg-klawsome-baby-pink text-klawsome-navy px-3 py-1.5 rounded-full">Klawsome Mobile only</span>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button size="cta" onClick={() => openBookingModal('mobile')} className="bg-primary text-white hover:bg-primary/90">
              Book Klawsome Mobile
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

      {/* Mini Party Gallery */}
      {(privatePics.length > 0 || semiPics.length > 0) && (
        <section id="party-gallery" className="py-20 px-6 lg:px-12 bg-klawsome-navy">
          <div className="ds-container-content">
            <p className="ds-eyebrow text-klawsome-yellow mb-3 text-center">Party Gallery</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 text-center uppercase">
              Real Klawsome Parties
            </h2>
            <p className="text-white/80 font-body text-center mb-12 max-w-2xl mx-auto">
              A peek at private and semi-private celebrations we've hosted.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Private */}
              <div className="bg-white/5 rounded-kawaii border border-white/10 p-6 md:p-8">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="ds-eyebrow text-primary mb-1">Private</p>
                    <h3 className="font-heading font-bold text-white text-2xl uppercase leading-tight">Private Parties</h3>
                  </div>
                  <Link
                    to="/gallery#section-private_minecraft"
                    className="inline-flex items-center gap-1 font-heading font-bold text-xs tracking-wider uppercase text-primary hover:text-white transition-colors"
                  >
                    See All <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {privatePics.map(p => (
                    <Link
                      key={p.id}
                      to="/gallery#section-private_minecraft"
                      className="block aspect-square overflow-hidden rounded-2xl bg-white/5 group"
                      aria-label={p.caption || 'Private party photo'}
                    >
                      <img
                        src={p.image_url}
                        alt={p.caption || 'Private party at Klawsome'}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Semi-Private */}
              <div className="bg-white/5 rounded-kawaii border border-white/10 p-6 md:p-8">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="ds-eyebrow text-klawsome-yellow mb-1">Semi-Private</p>
                    <h3 className="font-heading font-bold text-white text-2xl uppercase leading-tight">Semi-Private Parties</h3>
                  </div>
                  <Link
                    to="/gallery#section-semi_private"
                    className="inline-flex items-center gap-1 font-heading font-bold text-xs tracking-wider uppercase text-klawsome-yellow hover:text-white transition-colors"
                  >
                    See All <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {semiPics.map(p => (
                    <Link
                      key={p.id}
                      to="/gallery#section-semi_private"
                      className="block aspect-square overflow-hidden rounded-2xl bg-white/5 group"
                      aria-label={p.caption || 'Semi-private party photo'}
                    >
                      <img
                        src={p.image_url}
                        alt={p.caption || 'Semi-private party at Klawsome'}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Invite Templates */}
      <KawaiiFooter prevColor={faqItems.length > 0 ? 'navy' : 'baby-pink'} />
    </div>
  );
};

export default Birthdays;

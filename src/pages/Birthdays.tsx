import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import SectionWrapper from '@/components/SectionWrapper';
import DynamicSection from '@/components/DynamicSection';
import { useCmsSingle, useCmsTable, usePageSections, type BirthdaysContent, type PartyOption, type FaqItem, type InviteTemplate, type PageSection } from '@/hooks/useCmsContent';

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left">
        <span className="font-heading font-bold text-foreground text-sm md:text-base pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pb-5">
          <p className="text-muted-foreground font-body text-sm leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  );
};

const BirthdaysHero = () => {
  const { data: content } = useCmsSingle<BirthdaysContent>('birthdays_content');
  return (
    <section className="relative min-h-[70vh] flex items-end overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${content?.hero_image_url || 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/55fefb9f-eb8b-4185-a0bf-aec7b9e28a73/Klawsome_FriendsFamily-054-Edit.jpg'}')` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
      <div className="relative z-10 container mx-auto px-6 lg:px-12 pb-20 pt-32">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white uppercase leading-[0.95] mb-6">BIRTHDAYS</h1>
          <p className="text-white/70 font-body text-lg max-w-xl">{content?.hero_subheadline || 'Celebrate your birthday with Klawsome!'}</p>
          <img src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/0aa66e68-edcd-41bb-a162-6c4d5453b16e/klawsomebirthday.png" alt="Klawsome Birthday" className="max-w-xs w-full mt-8" loading="lazy" />
        </div>
      </div>
    </section>
  );
};

const BirthdaysRules = () => {
  const { data: content } = useCmsSingle<BirthdaysContent>('birthdays_content');
  const bookingEmail = content?.booking_email || 'events@klawsomenovi.com';
  return (
    <>
      <p className="text-xs font-heading font-bold text-primary uppercase tracking-[0.2em] mb-4">Celebrations</p>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-12 leading-tight">Party Rules</h2>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="rounded-2xl border border-border bg-background p-8">
          <h3 className="font-heading font-bold text-xl text-foreground mb-4">Klawsome Wants To Celebrate You!</h3>
          <p className="text-muted-foreground font-body leading-relaxed mb-6">{content?.promo_text || "Come in anytime during our regular hours and we'll provide a personalized birthday gift bag and balloon for the celebrant."}</p>
          <img src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/80256d92-709b-4da7-afc3-707621daf4de/Bday+Gif.gif" alt="Birthday gift" className="rounded-2xl w-full max-w-sm mx-auto" loading="lazy" />
        </div>
        <div className="rounded-2xl border border-border bg-background p-8">
          <h3 className="font-heading font-bold text-xl text-foreground mb-4">Looking to Host a Birthday Party?</h3>
          <p className="text-muted-foreground font-body leading-relaxed mb-4">{content?.rules_text || 'Please notify Klawsome two weeks in advance for parties.'}</p>
          <p className="text-muted-foreground font-body text-sm mt-4">
            For more information, please contact <a href={`mailto:${bookingEmail}`} className="text-primary hover:underline">{bookingEmail}</a>
          </p>
        </div>
      </div>
    </>
  );
};

const BirthdaysOptions = () => {
  const { data: content } = useCmsSingle<BirthdaysContent>('birthdays_content');
  const { data: partyOptions } = useCmsTable<PartyOption>('party_options');
  const bookingEmail = content?.booking_email || 'events@klawsomenovi.com';
  const partyImages = [
    'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/b423ffd5-9411-4093-96d5-b7dc4a6149b3/IMG-20251123-WA0064.jpg',
    'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/d50dbe5e-0b2a-4366-8f45-104da8f0b11a/PXL_20251124_002020087.MP.jpg',
  ];
  return (
    <>
      <p className="text-xs font-heading font-bold text-primary uppercase tracking-[0.2em] mb-4">Packages</p>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-12 leading-tight">Party Options</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {(partyOptions || []).map((opt, i) => (
          <div key={opt.id} className="rounded-2xl overflow-hidden bg-background border border-border hover:shadow-lg transition-shadow">
            <img src={partyImages[i] || partyImages[0]} alt={opt.name} className="w-full h-56 object-cover" loading="lazy" />
            <div className="p-6">
              <h3 className="font-heading font-bold text-2xl text-foreground mb-3">{opt.name}</h3>
              <p className="text-muted-foreground font-body text-sm mb-3">{opt.description}</p>
              <ul className="space-y-2 text-muted-foreground font-body text-sm mb-4">
                {(opt.features || []).map((f, fi) => <li key={fi}>• {f}</li>)}
              </ul>
              <p className="font-heading font-bold text-foreground text-lg">{opt.price}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <p className="text-muted-foreground font-body text-sm mb-4">Photography Rental also available — 1 hour @ $49</p>
        <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg font-heading font-bold bg-primary hover:bg-primary/90 text-white">
          <a href={`mailto:${bookingEmail}`}>Book Your Event</a>
        </Button>
      </div>
    </>
  );
};

const BirthdaysFAQ = () => {
  const { data: allFaqs } = useCmsTable<FaqItem>('faq_items');
  const faqItems = allFaqs?.filter(f => f.page === 'birthdays') || [];
  if (faqItems.length === 0) return null;
  return (
    <>
      <p className="text-xs font-heading font-bold text-primary uppercase tracking-[0.2em] mb-4">FAQ</p>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-10 leading-tight">Frequently Asked Questions</h2>
      <div className="rounded-2xl border border-border bg-background p-6 md:p-8">
        {faqItems.map((item) => <FAQItem key={item.id} q={item.question} a={item.answer} />)}
      </div>
    </>
  );
};

const BirthdaysTemplates = () => {
  const { data: templates } = useCmsTable<InviteTemplate>('invite_templates');
  if (!templates || templates.length === 0) return null;
  return (
    <div className="text-center">
      <p className="text-xs font-heading font-bold text-primary uppercase tracking-[0.2em] mb-4">Downloads</p>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-4 leading-tight">Hosting a Klawsome Event?</h2>
      <p className="text-muted-foreground font-body mb-10">Enjoy one of our complimentary invite templates! Click to download.</p>
      <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
        {templates.map((t) => (
          <a key={t.id} href={t.url} target="_blank" rel="noopener noreferrer" className="rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
            <img src={t.thumbnail_url} alt={t.name} className="w-full" loading="lazy" />
          </a>
        ))}
      </div>
    </div>
  );
};

const SECTION_MAP: Record<string, React.ComponentType> = {
  hero: BirthdaysHero,
  rules: BirthdaysRules,
  options: BirthdaysOptions,
  faq: BirthdaysFAQ,
  templates: BirthdaysTemplates,
};

const FALLBACK_SECTIONS: PageSection[] = [
  { id: 'f1', page: 'birthdays', section_key: 'hero', label: 'Hero', sort_order: 1, is_visible: true, section_height: '70vh', wrapper_max_width: 'full', padding_y: '0', bg_color: '', bg_image_url: '', custom_css_class: '', columns: 1 },
  { id: 'f2', page: 'birthdays', section_key: 'rules', label: 'Rules', sort_order: 2, is_visible: true, section_height: 'auto', wrapper_max_width: '1200px', padding_y: '7rem', bg_color: '', bg_image_url: '', custom_css_class: '', columns: 1 },
  { id: 'f3', page: 'birthdays', section_key: 'options', label: 'Options', sort_order: 3, is_visible: true, section_height: 'auto', wrapper_max_width: '1200px', padding_y: '7rem', bg_color: '', bg_image_url: '', custom_css_class: 'bg-secondary/50', columns: 1 },
  { id: 'f4', page: 'birthdays', section_key: 'faq', label: 'FAQ', sort_order: 4, is_visible: true, section_height: 'auto', wrapper_max_width: '900px', padding_y: '7rem', bg_color: '', bg_image_url: '', custom_css_class: '', columns: 1 },
  { id: 'f5', page: 'birthdays', section_key: 'templates', label: 'Templates', sort_order: 5, is_visible: true, section_height: 'auto', wrapper_max_width: '1200px', padding_y: '7rem', bg_color: '', bg_image_url: '', custom_css_class: 'bg-secondary/50', columns: 1 },
];

const Birthdays = () => {
  const { data: sections } = usePageSections('birthdays');
  const displaySections = sections && sections.length > 0 ? sections : FALLBACK_SECTIONS;

  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      {displaySections.map((s) => {
        if (s.section_key.startsWith('custom:')) {
          return (
            <SectionWrapper key={s.id} config={s}>
              <CustomBlock blockKey={s.section_key.replace('custom:', '')} />
            </SectionWrapper>
          );
        }
        const Component = SECTION_MAP[s.section_key];
        if (!Component) return null;
        return (
          <SectionWrapper key={s.id} config={s} fullControl={s.section_key === 'hero'}>
            <Component />
          </SectionWrapper>
        );
      })}
      <KawaiiFooter />
    </div>
  );
};

export default Birthdays;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import KawaiiDivider from '@/components/KawaiiDivider';
import { useCmsSingle, useCmsTable, type BirthdaysContent, type PartyOption, type FaqItem, type InviteTemplate } from '@/hooks/useCmsContent';

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

  const faqItems = allFaqs?.filter(f => f.page === 'birthdays') || [];
  const bookingEmail = content?.booking_email || 'events@klawsomenovi.com';

  const partyImages = [
    'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/b423ffd5-9411-4093-96d5-b7dc4a6149b3/IMG-20251123-WA0064.jpg',
    'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/d50dbe5e-0b2a-4366-8f45-104da8f0b11a/PXL_20251124_002020087.MP.jpg',
  ];

  return (
    <div className="min-h-screen bg-klawsome-navy">
      <KawaiiNav />

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${content?.hero_image_url || 'https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/55fefb9f-eb8b-4185-a0bf-aec7b9e28a73/Klawsome_FriendsFamily-054-Edit.jpg'}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/85 via-white/55 to-white/20" />
        <div className="relative z-10 text-center px-4">
          <img
            src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/0aa66e68-edcd-41bb-a162-6c4d5453b16e/klawsomebirthday.png"
            alt="Klawsome Birthday"
            className="w-64 md:w-80 mx-auto mb-6"
          />
          <h1 className="text-4xl md:text-6xl font-heading font-bold" style={{ color: 'hsl(var(--klawsome-navy))' }}>
            {content?.hero_headline || 'Celebrate your birthday with'} <span className="kawaii-text-gradient">Klawsome!</span>
          </h1>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-sm font-heading font-bold tracking-wider bg-primary hover:bg-primary/90 text-white uppercase">
              <a href="/rewards">Join Today</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Party Rules */}
      <section className="py-20 px-4 bg-klawsome-navy">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-8 text-center">Party Rules</h2>

          <div className="bg-white/10 backdrop-blur-sm rounded-kawaii p-8 border border-white/20 mb-12">
            <h3 className="font-heading font-bold text-xl text-white mb-4">Looking to Host a Birthday Party?</h3>
            <p className="text-white/70 font-body leading-relaxed mb-4">
              {content?.rules_text || 'Please notify Klawsome two weeks in advance for parties.'}
            </p>
            <p className="text-white/70 font-body text-sm mt-4">
              For more information and BEFORE booking your event, please contact{' '}
              <a href={`mailto:${bookingEmail}`} className="text-primary hover:underline">{bookingEmail}</a>{' '}
              and expect a response within three business days.
            </p>
          </div>
        </div>
      </section>

      <KawaiiDivider variant="scallop" from="navy" to="red" stroke="yellow" height={90} />

      {/* Party Options */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-12 text-center">Party Options</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {(partyOptions || []).map((opt, i) => (
              <div key={opt.id} className="bg-white/15 backdrop-blur-sm rounded-kawaii border border-white/20 overflow-hidden">
                <img
                  src={partyImages[i] || partyImages[0]}
                  alt={opt.name}
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="font-heading font-bold text-2xl text-white mb-3">{opt.name}</h3>
                  <p className="text-white/70 font-body text-sm mb-3">{opt.description}</p>
                  <ul className="space-y-2 text-white/70 font-body text-sm mb-4">
                    {(opt.features || []).map((f, fi) => (
                      <li key={fi}>• {f}</li>
                    ))}
                  </ul>
                  <p className="font-heading font-bold text-white">{opt.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-white/70 font-body text-sm mb-4">Photography Rental also available — 1 hour @ $49</p>
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg font-heading font-bold bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90">
              <a href={`mailto:${bookingEmail}`}>Book Your Event</a>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqItems.length > 0 && (
        <>
        <KawaiiDivider variant="cloud" from="red" to="navy" stroke="baby-pink" height={90} />
        <section className="py-20 px-4 bg-klawsome-navy">
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
      <KawaiiFooter prevColor={faqItems.length > 0 ? 'navy' : 'red'} />
    </div>
  );
};

export default Birthdays;

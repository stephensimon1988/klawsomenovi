import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';

const faqItems = [
  { q: 'How much time do families get to set up and clean up?', a: 'Clients have 30 minutes before and after the event to set up and clean up.' },
  { q: 'Can I bring my own food?', a: "Yes! Klawsome does not provide food/beverages, so feel free to bring any food, cake, beverages, etc. We have a variety of recommended vendors listed on our website for food, photography, balloons, and more. However, please note that for a semi-private party with Paris Baguette, outside food is not permitted." },
  { q: 'How many tokens should I purchase?', a: "We recommend 325 tokens ($250 package) per group of five kids. This breaks down to 50 tokens per child, with 75 tokens in reserve for kids that need help. Some kids win a ton, but some need more guidance. Our staff will also be on the lookout for kids that need help." },
  { q: 'How many hours can my party be?', a: 'Public play is about a half an hour while private events are about one hour of play (+ 30 min for setup and 30 min for cleanup).' },
  { q: 'What if a guest has food allergies?', a: "As Klawsome's policy is that guests are responsible for bringing their own food/beverages, clients must take note and accountability of any allergies/dietary restrictions that guests have." },
  { q: 'What is the cancellation/refund policy?', a: "Klawsome does not provide a refund for a cancellation made 5 days or less before the event. If a client does not receive a refund, they may redeem all of their purchased tokens in store at a later date. Clients that make a cancellation more than 5 days in advance receive a full refund." },
  { q: 'How many adults and children are allowed?', a: 'A maximum of 12 adults are allowed along with a maximum of 12 children. Klawsome keeps a limit on guests to ensure a fun and comfortable experience for everyone.' },
  { q: 'Do I need to stay with my child?', a: 'Any guest aged 10 or under is required to have one parent stay with them throughout the party. For any child older than 10, parents can simply drop them off. The parent of the birthday guest must stay for the entire party.' },
  { q: 'What is the difference between a private and a public/semi-private event?', a: 'Private parties are reservation-only with exclusive, uninterrupted access to all machines. Public/semi-private parties do not require a reservation (but highly recommended). Both events are tons of fun!' },
  { q: 'Do I need to reserve a birthday party in advance?', a: 'Yes. Please notify Klawsome at least two weeks in advance. Saturdays are typically our busiest day, so we recommend booking a morning private event or keeping groups 7 guests or fewer during public hours. Only two reserved parties can be booked per day.' },
  { q: 'What seating and space is provided for parties?', a: 'Klawsome provides two rectangular tables, one round table, and stools for children. Folding chairs for adults are available upon request. A one-hour private space rental is available for $100.' },
  { q: 'Does Klawsome offer anything special for birthdays without booking a party?', a: "Yes. Guests can visit anytime during regular hours and receive a personalized birthday gift bag and balloon for the celebrant. No purchase is necessary — just subscribe to Klawsome's newsletter to redeem." },
];

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
  return (
    <div className="min-h-screen bg-klawsome-navy">
      <KawaiiNav />

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/55fefb9f-eb8b-4185-a0bf-aec7b9e28a73/Klawsome_FriendsFamily-054-Edit.jpg')` }}
        />
        <div className="absolute inset-0 bg-klawsome-navy/70" />
        <div className="relative z-10 text-center px-4">
          <img
            src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/0aa66e68-edcd-41bb-a162-6c4d5453b16e/klawsomebirthday.png"
            alt="Klawsome Birthday"
            className="w-64 md:w-80 mx-auto mb-6"
          />
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white">
            Celebrate your birthday with <span className="kawaii-text-gradient">Klawsome!</span>
          </h1>
        </div>
      </section>

      {/* Party Rules */}
      <section className="py-20 px-4 bg-klawsome-navy">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-8 text-center">Party Rules</h2>

          <div className="bg-white/10 backdrop-blur-sm rounded-kawaii p-8 border border-white/20 mb-12">
            <h3 className="font-heading font-bold text-xl text-white mb-4">Klawsome Wants To Celebrate You!</h3>
            <p className="text-white/70 font-body leading-relaxed mb-6">
              Come in anytime during our regular hours and we'll provide a <strong className="text-white">personalized birthday gift bag and balloon for the celebrant.</strong> No purchase is necessary — simply <strong className="text-white">subscribe to our newsletter</strong> to redeem.
            </p>
            <img
              src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/80256d92-709b-4da7-afc3-707621daf4de/Bday+Gif.gif"
              alt="Birthday gift promotion"
              className="rounded-kawaii w-full max-w-sm mx-auto"
              loading="lazy"
            />
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-kawaii p-8 border border-white/20 mb-12">
            <h3 className="font-heading font-bold text-xl text-white mb-4">Looking to Host a Birthday Party?</h3>
            <p className="text-white/70 font-body leading-relaxed mb-4">
              <strong className="text-white">Please notify Klawsome two weeks in advance for parties</strong>
            </p>
            <ul className="space-y-3 text-white/70 font-body text-sm">
              <li>• The earlier, the better to ensure best customer service</li>
              <li>• Saturdays are generally the busiest day</li>
              <li>• For the best experience, we recommend either booking a private event in the morning OR only booking parties with small groups (7 or less) during public hours</li>
              <li>• Klawsome can only book two parties per day, based on staffing</li>
              <li>• While we welcome groups to visit any time without a reservation, please note that service levels will vary depending on the number of customers</li>
            </ul>
            <p className="text-white/70 font-body text-sm mt-4">
              For more information and BEFORE booking your event, please contact{' '}
              <a href="mailto:events@klawsomenovi.com" className="text-primary hover:underline">events@klawsomenovi.com</a>{' '}
              and expect a response within three business days.
            </p>
          </div>
        </div>
      </section>

      {/* Party Options */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-12 text-center">Party Options</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Private */}
            <div className="bg-white/15 backdrop-blur-sm rounded-kawaii border border-white/20 overflow-hidden">
              <img
                src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/b423ffd5-9411-4093-96d5-b7dc4a6149b3/IMG-20251123-WA0064.jpg"
                alt="Private birthday party at Klawsome"
                className="w-full h-56 object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="font-heading font-bold text-2xl text-white mb-3">Private</h3>
                <ul className="space-y-2 text-white/70 font-body text-sm mb-4">
                  <li>• In-house party at Klawsome</li>
                  <li>• Takes place during closed hours</li>
                  <li>• Set-up for decorations is available</li>
                  <li>• 1 hour @ $250 — includes 325 tokens, exclusive space, tables and seating, ability to bring own food</li>
                </ul>
              </div>
            </div>

            {/* Semi-Private */}
            <div className="bg-white/15 backdrop-blur-sm rounded-kawaii border border-white/20 overflow-hidden">
              <img
                src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/d50dbe5e-0b2a-4366-8f45-104da8f0b11a/PXL_20251124_002020087.MP.jpg"
                alt="Semi-private birthday party"
                className="w-full h-56 object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="font-heading font-bold text-2xl text-white mb-3">Reserved Semi-Private</h3>
                <ul className="space-y-2 text-white/70 font-body text-sm mb-4">
                  <li>• Table for one hour at Paris Baguette (Klawsome's next-door neighbor)</li>
                  <li>• Food cost TBD by Paris Baguette</li>
                  <li>• Unlimited play time during public business hours</li>
                  <li>• Simple decor available. No wall hangings or advance set-up</li>
                  <li>• 1 hour @ $250 — includes 325 tokens</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-white/70 font-body text-sm mb-4">Photography Rental also available — 1 hour @ $49</p>
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg font-heading font-bold bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90">
              <a href="mailto:events@klawsomenovi.com">Book Your Event</a>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-klawsome-navy">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-10 text-center">Frequently Asked Questions</h2>
          <div className="bg-white/5 rounded-kawaii p-6 md:p-8 border border-white/10">
            {faqItems.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Invite Templates */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Hosting a Klawsome Event?
          </h2>
          <p className="text-white/70 font-body mb-10">Enjoy one of our complimentary invite templates! Click to download.</p>
          <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
            <a href="https://www.klawsomenovi.com/s/Klawsome-Birthday-Invite.pdf" target="_blank" rel="noopener noreferrer" className="rounded-kawaii overflow-hidden border border-white/20 hover:border-white/40 transition-colors">
              <img
                src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/b7a7ccb0-4b9d-491c-a6a2-b6db899bd15f/Birthday+Invite+Template+%282%29.png"
                alt="Birthday invite template 1"
                className="w-full"
                loading="lazy"
              />
            </a>
            <a href="https://www.klawsomenovi.com/s/Klawsome-Birthday-Invite-2.pdf" target="_blank" rel="noopener noreferrer" className="rounded-kawaii overflow-hidden border border-white/20 hover:border-white/40 transition-colors">
              <img
                src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/f3c702b6-da3f-4a85-aec7-e279e2d41820/%7BNAME%7D%E2%80%99S+%7BAGE%7D+BIRTHDAY.PNG"
                alt="Birthday invite template 2"
                className="w-full"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </section>

      <KawaiiFooter />
    </div>
  );
};

export default Birthdays;

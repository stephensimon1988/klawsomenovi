import KawaiiNav from '@/components/KawaiiNav';
import KawaiiFooter from '@/components/KawaiiFooter';
import PageHero from '@/components/PageHero';
import { usePageHero } from '@/hooks/useCmsContent';
import { Mail, PartyPopper, Phone, MapPin } from 'lucide-react';
import contactImage from '@/assets/contact-hero.jpg';

const Contact = () => {
  const { data: hero } = usePageHero('contact');
  return (
    <div className="min-h-screen bg-background">
      <KawaiiNav />
      <PageHero
        eyebrow={hero?.eyebrow || 'Contact'}
        title={hero?.title || 'Contact Klawsome'}
        subtitle={hero?.subtitle}
        imageUrl={hero?.image_url || ''}
      />
      <section className="bg-klawsome-baby-blue py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 md:grid-cols-2 md:gap-14 items-center max-w-6xl mx-auto">
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img
                src={contactImage}
                alt="Klawsome friends ready to help"
                className="w-full h-full object-cover aspect-[4/5]"
                loading="lazy"
              />
            </div>
            <ul className="space-y-6">
              {[
                {
                  icon: Mail,
                  label: 'General Inquiries',
                  value: 'team@klawsomenovi.com',
                  href: 'mailto:team@klawsomenovi.com',
                  desc: 'Gameplay, tokens, lost items, feedback, media.',
                },
                {
                  icon: PartyPopper,
                  label: 'Events & Birthdays',
                  value: 'events@klawsomenovi.com',
                  href: 'mailto:events@klawsomenovi.com',
                  desc: 'Birthday parties, group events, school & corporate visits.',
                },
                {
                  icon: Phone,
                  label: 'Phone',
                  value: '(248) 938-4093',
                  href: 'tel:+12489384093',
                  desc: "Call during open hours; leave a message if we're on the floor.",
                },
                {
                  icon: MapPin,
                  label: 'Visit Us',
                  value: '42768 Grand River Avenue, Suite C-140, Novi, MI 48375',
                  href: 'https://maps.google.com/?q=42768+Grand+River+Avenue+Suite+C-140+Novi+MI+48375',
                  desc: 'Inside Sakura Novi · Tue–Sun, 11 a.m. – 9 p.m.',
                },
              ].map(({ icon: Icon, label, value, href, desc }) => (
                <li key={label} className="flex gap-4 rounded-2xl bg-background/70 p-5 shadow-sm">
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-foreground">{label}</p>
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noreferrer' : undefined}
                      className="text-primary hover:underline break-words"
                    >
                      {value}
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <KawaiiFooter prevColor="baby-blue" />
    </div>
  );
};

export default Contact;
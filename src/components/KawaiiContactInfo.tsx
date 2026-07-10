import { Mail, PartyPopper, Phone, MapPin } from 'lucide-react';
import contactImage from '@/assets/contact-hero.webp';
import FramedImage from './FramedImage';
import { useCmsSingle, type SiteSettings } from '@/hooks/useCmsContent';

const KawaiiContactInfo = () => {
  const { data: s } = useCmsSingle<SiteSettings>('site_settings');
  const email = s?.email || 'team@klawsomenovi.com';
  const eventsEmail = s?.events_email || 'events@klawsomenovi.com';
  const phone = s?.phone || '(248) 938-4093';
  const address = s?.address || '42768 Grand River Avenue, Suite C-140, Novi, MI 48375';
  const mapsUrl = s?.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  const items = [
    { icon: Mail, label: 'General Inquiries', value: email, href: `mailto:${email}`, desc: 'Gameplay, tokens, lost items, feedback, media.' },
    { icon: PartyPopper, label: 'Events & Birthdays', value: eventsEmail, href: `mailto:${eventsEmail}`, desc: 'Birthday parties, group events, school & corporate visits.' },
    { icon: Phone, label: 'Phone', value: phone, href: `tel:${phone.replace(/[^+\d]/g, '')}`, desc: "Call during open hours; leave a message if we're on the floor." },
    { icon: MapPin, label: 'Visit Us', value: address, href: mapsUrl, desc: 'Inside Sakura Novi' },
  ];

  return (
    <section className="bg-klawsome-baby-blue py-16 md:py-24">
      <div className="ds-container-content px-4">
        <div className="ds-cols">
          <FramedImage
            src={contactImage}
            alt="Klawsome friends ready to help"
            color="peach"
            sectionBg="baby-blue"
            className="aspect-square w-full"
          />
          <ul className="space-y-6">
            {items.map(({ icon: Icon, label, value, href, desc }) => (
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
  );
};

export default KawaiiContactInfo;
import { Accessibility, Clock, MapPin, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { useGsapScroll, useGsapStagger } from '@/hooks/useGsapScroll';
import { useCmsSingle, useCmsTable, type SiteSettings, type StoreHour } from '@/hooks/useCmsContent';
import FramedImage from './FramedImage';

const KawaiiVisit = () => {
  const imageRef = useGsapScroll<HTMLDivElement>({ type: 'slideLeft', distance: 80, duration: 1 });
  const textRef = useGsapScroll<HTMLDivElement>({ type: 'slideRight', distance: 80, duration: 1, delay: 0.2 });

  const { data: settings } = useCmsSingle<SiteSettings>('site_settings');
  const { data: hours } = useCmsTable<StoreHour>('store_hours');

  const address = settings?.address || '42768 Grand River Ave Suite C-140, Novi, MI 48375';
  const mapsUrl = settings?.google_maps_url || 'https://www.google.com/maps/place/42768+Grand+River+Ave+Suite+C-140,+Novi,+MI+48375';
  const phone = settings?.phone || '(248) 938-4093';

  const openDays = hours?.filter(h => !h.is_closed) || [];
  const hoursText = openDays.length > 0
    ? `${openDays[0]?.open_time} to ${openDays[0]?.close_time}`
    : '11 a.m. to 9 p.m.';

  return (
    <section id="visit" className="section-y section-x bg-[hsl(var(--klawsome-baby-pink))]">
      <div className="ds-container-content">
        <div className="ds-cols">
          <div ref={imageRef} style={{ opacity: 0 }}>
            <FramedImage
              src="/images/klawsome-storefront.webp"
              alt="Klawsome arcade storefront"
              color="lavender"
              sectionBg="baby-pink"
              className="aspect-square w-full"
            />
          </div>

          <div ref={textRef} style={{ opacity: 0 }}>
            <p className="ds-eyebrow">Visit Us</p>
            <h2 className="ds-h2 ds-stroke ds-stroke--navy mb-6">
              Find us at Sakura Novi
            </h2>
            <p className="ds-lead mb-10 max-w-lg">
              Klawsome sits at {address}.
            </p>

            <div className="mb-10 max-w-lg flex items-start gap-4 rounded-xl bg-background/70 p-4 shadow-sm">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-heading font-bold text-foreground">Hours</p>
                <p className="text-foreground/80">Tuesday–Sunday, {hoursText}</p>
                <p className="text-sm text-muted-foreground mt-1">Closed Mondays</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button asChild className="rounded-full px-8 font-heading font-bold text-xs tracking-wider bg-foreground text-background hover:bg-foreground/90 uppercase">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">Directions</a>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-8 font-heading font-bold text-xs tracking-wider border-foreground/20 text-foreground hover:bg-foreground/5 uppercase">
                <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>Call Us</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KawaiiVisit;

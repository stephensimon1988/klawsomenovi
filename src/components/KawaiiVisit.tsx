import { Accessibility, Clock, MapPin, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { useGsapScroll, useGsapStagger } from '@/hooks/useGsapScroll';
import { useCmsSingle, useCmsTable, type SiteSettings, type StoreHour } from '@/hooks/useCmsContent';

const KawaiiVisit = () => {
  const imageRef = useGsapScroll<HTMLDivElement>({ type: 'slideLeft', distance: 80, duration: 1 });
  const textRef = useGsapScroll<HTMLDivElement>({ type: 'slideRight', distance: 80, duration: 1, delay: 0.2 });

  const { data: settings } = useCmsSingle<SiteSettings>('site_settings');
  const { data: hours } = useCmsTable<StoreHour>('store_hours');

  const address = settings?.address || '42768 Grand River Ave, Suite C-140, Novi, MI 48375';
  const mapsUrl = settings?.google_maps_url || 'https://www.google.com/maps/place/42768+Grand+River+Ave+Suite+C-140,+Novi,+MI+48375';
  const phone = settings?.phone || '(248) 938-4093';

  const openDays = hours?.filter(h => !h.is_closed) || [];
  const hoursText = openDays.length > 0
    ? `${openDays[0]?.open_time} to ${openDays[0]?.close_time}`
    : '11 a.m. to 9 p.m.';

  return (
    <section id="visit" className="section-y section-x bg-[hsl(var(--klawsome-baby-pink))]">
      <div className="ds-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div ref={imageRef} style={{ opacity: 0 }}>
            <img
              src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/eac946a6-e513-4e64-acdc-dd5024eb5a61/IMG_1638.jpg"
              alt="Klawsome arcade storefront"
              className="ds-img-portrait"
              loading="lazy"
            />
          </div>

          <div ref={textRef} style={{ opacity: 0 }}>
            <p className="ds-eyebrow">Visit Us</p>
            <h2 className="ds-h2 mb-6">
              Find us at Sakura Novi
            </h2>
            <p className="ds-lead mb-10 max-w-lg">
              Klawsome sits at {address}. Open Tuesday through Sunday, {hoursText}, closed Mondays.
            </p>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-heading font-bold text-foreground text-sm mb-1">Easy access</h3>
                  <p className="text-muted-foreground text-sm font-body leading-relaxed">Right in Novi's center, simple to find.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-heading font-bold text-foreground text-sm mb-1">Hours matter</h3>
                  <p className="text-muted-foreground text-sm font-body leading-relaxed">Tue–Sun, {hoursText}.</p>
                </div>
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

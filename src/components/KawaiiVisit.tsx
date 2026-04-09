import { Accessibility, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { useGsapScroll, useGsapStagger } from '@/hooks/useGsapScroll';
import { useCmsSingle, useCmsTable, type SiteSettings, type StoreHour } from '@/hooks/useCmsContent';

const KawaiiVisit = () => {
  const imageRef = useGsapScroll<HTMLDivElement>({ type: 'slideLeft', distance: 100, duration: 1 });
  const textRef = useGsapScroll<HTMLDivElement>({ type: 'slideRight', distance: 100, duration: 1, delay: 0.2 });
  const iconsRef = useGsapStagger<HTMLDivElement>({ type: 'slideUp', stagger: 0.15 });

  const { data: settings } = useCmsSingle<SiteSettings>('site_settings');
  const { data: hours } = useCmsTable<StoreHour>('store_hours');

  const address = settings?.address || '42768 Grand River Ave, Suite C-140, Novi, MI 48375';
  const mapsUrl = settings?.google_maps_url || 'https://www.google.com/maps/place/42768+Grand+River+Ave+Suite+C-140,+Novi,+MI+48375';
  const phone = settings?.phone || '(248) 938-4093';

  // Build hours summary
  const openDays = hours?.filter(h => !h.is_closed) || [];
  const hoursText = openDays.length > 0
    ? `${openDays[0]?.open_time} to ${openDays[0]?.close_time}`
    : '11 a.m. to 9 p.m.';

  return (
    <section id="visit" className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div ref={imageRef} style={{ opacity: 0 }}>
            <img
              src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/eac946a6-e513-4e64-acdc-dd5024eb5a61/IMG_1638.jpg"
              alt="Klawsome arcade storefront"
              className="rounded-kawaii w-full object-cover aspect-[4/5]"
              loading="lazy"
            />
          </div>

          <div ref={textRef} style={{ opacity: 0 }}>
            <p className="text-sm font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2">Visit</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Find us at Sakura Novi in Novi, Michigan
            </h2>
            <p className="text-muted-foreground font-body mb-8 leading-relaxed">
              Klawsome sits at {address}. Open Tuesday through Sunday, {hoursText}, closed Mondays.
            </p>

            <div ref={iconsRef} className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <Accessibility className="w-8 h-8 text-foreground mb-2" />
                <h3 className="font-heading font-bold text-foreground mb-1">Easy access</h3>
                <p className="text-muted-foreground text-sm font-body">Right in Novi's center, simple to find and reach anytime.</p>
              </div>
              <div>
                <Clock className="w-8 h-8 text-foreground mb-2" />
                <h3 className="font-heading font-bold text-foreground mb-1">Hours matter</h3>
                <p className="text-muted-foreground text-sm font-body">Tuesday through Sunday, {hoursText}. Plan your visit accordingly.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button asChild variant="outline" className="rounded-full font-heading border-foreground text-foreground hover:bg-foreground hover:text-background glow-hover glow-pink">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">Directions</a>
              </Button>
              <Button asChild variant="ghost" className="rounded-full font-heading text-foreground underline glow-hover glow-pink">
                <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>Call →</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KawaiiVisit;

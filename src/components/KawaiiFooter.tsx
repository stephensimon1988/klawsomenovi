import klawsomeLogo from '@/assets/klawsome-logo.webp';
import { useCmsSingle, type SiteSettings } from '@/hooks/useCmsContent';
import { Button } from './ui/button';

const KawaiiFooter = () => {
  const { data: settings } = useCmsSingle<SiteSettings>('site_settings');

  const email = settings?.email || 'team@klawsomenovi.com';
  const phone = settings?.phone || '(248) 938-4093';
  const address = settings?.address || '42768 Grand River Ave, Suite C-140, Novi, MI 48375';
  const instagram = settings?.instagram_url || 'https://www.instagram.com/klawsomenovi/';
  const facebook = settings?.facebook_url || 'https://www.facebook.com/klawsomenovi';
  const mapsUrl = settings?.google_maps_url || 'https://www.google.com/maps/place/42768+Grand+River+Ave+Suite+C-140,+Novi,+MI+48375';

  return (
    <>
      {/* Pre-footer CTA — Manifest style */}
      <section className="py-32 px-6 lg:px-12 bg-klawsome-navy relative overflow-hidden">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-heading font-bold text-white leading-[0.95] uppercase mb-8">
            Ready to<br />Play?
          </h2>
          <p className="text-white/60 font-body mb-10 max-w-md mx-auto">
            Come see what all the buzz is about. We're here and ready for you.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full px-10 py-6 text-sm font-heading font-bold tracking-wider bg-primary hover:bg-primary/90 text-white uppercase"
          >
            <a href="#scheduling">Book Your Visit</a>
          </Button>
        </div>
      </section>

      {/* Minimal footer */}
      <footer id="contact" className="py-16 px-6 lg:px-12 bg-foreground">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
            <div>
              <img src={klawsomeLogo} alt="Klawsome" className="h-8 w-auto mb-4" />
              <p className="text-background/40 font-body text-sm max-w-xs">
                Michigan's first stand-alone claw machine arcade 🎪
              </p>
            </div>

            <div className="flex flex-wrap gap-12">
              <div>
                <h4 className="font-heading font-bold text-background/60 text-xs tracking-wider uppercase mb-4">Contact</h4>
                <div className="space-y-2">
                  <a href={`mailto:${email}`} className="block text-background/40 text-sm hover:text-background transition-colors font-body">{email}</a>
                  <a href="mailto:events@klawsomenovi.com" className="block text-background/40 text-sm hover:text-background transition-colors font-body">events@klawsomenovi.com</a>
                  <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="block text-background/40 text-sm hover:text-background transition-colors font-body">{phone}</a>
                </div>
              </div>

              <div>
                <h4 className="font-heading font-bold text-background/60 text-xs tracking-wider uppercase mb-4">Follow</h4>
                <div className="space-y-2">
                  {instagram && <a href={instagram} target="_blank" rel="noopener noreferrer" className="block text-background/40 text-sm hover:text-background transition-colors font-body">Instagram</a>}
                  {facebook && <a href={facebook} target="_blank" rel="noopener noreferrer" className="block text-background/40 text-sm hover:text-background transition-colors font-body">Facebook</a>}
                </div>
              </div>

              <div>
                <h4 className="font-heading font-bold text-background/60 text-xs tracking-wider uppercase mb-4">Location</h4>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="block text-background/40 text-sm hover:text-background transition-colors font-body max-w-[200px]">
                  {address}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-background/10 pt-8">
            <p className="text-background/30 text-xs font-body">
              © {new Date().getFullYear()} Klawsome. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default KawaiiFooter;

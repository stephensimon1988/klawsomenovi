import klawsomeLogo from '@/assets/klawsome-logo.webp';
import { useCmsSingle, type SiteSettings } from '@/hooks/useCmsContent';
import { Button } from './ui/button';
import KawaiiDivider from './KawaiiDivider';
import { useLocation } from 'react-router-dom';

type FooterPrevColor = 'white' | 'baby-pink' | 'baby-blue' | 'red' | 'navy' | 'secondary-soft' | 'muted-soft';

interface KawaiiFooterProps {
  /** Color of the section sitting directly above the footer block. Defaults to white. */
  prevColor?: FooterPrevColor;
}

const KawaiiFooter = ({ prevColor = 'white' }: KawaiiFooterProps) => {
  const { data: settings } = useCmsSingle<SiteSettings>('site_settings');
  const { pathname } = useLocation();
  const showReadyToPlay = ['/', '/birthdays', '/faq'].includes(pathname);

  const email = settings?.email || 'team@klawsomenovi.com';
  const phone = settings?.phone || '(248) 938-4093';
  const address = settings?.address || '42768 Grand River Ave, Suite C-140, Novi, MI 48375';
  const instagram = settings?.instagram_url || 'https://www.instagram.com/klawsomenovi/';
  const facebook = settings?.facebook_url || 'https://www.facebook.com/klawsomenovi';
  const tiktok = settings?.tiktok_url || 'https://www.tiktok.com/@klawsomenovi';
  const mapsUrl = settings?.google_maps_url || 'https://www.google.com/maps/place/42768+Grand+River+Ave+Suite+C-140,+Novi,+MI+48375';

  return (
    <>
      {/* Transition from page → CTA (baby-pink) when CTA shown, else page → red footer */}
      {showReadyToPlay ? (
        prevColor !== 'baby-pink' && (
          <KawaiiDivider variant="wave" from={prevColor} to="baby-pink" stroke="white" />
        )
      ) : (
        prevColor !== 'red' && (
          <KawaiiDivider variant="scallop" from={prevColor} to="red" stroke="white" />
        )
      )}

      {/* Pre-footer CTA — homepage, birthdays, faq only */}
      {showReadyToPlay && (
      <section className="py-32 px-6 lg:px-12 bg-[hsl(var(--klawsome-baby-pink))] relative overflow-hidden">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="ds-h1 text-foreground mb-8">
            Ready to<br />Play?
          </h2>
          <p className="text-foreground/80 font-body text-lg mb-10 max-w-md mx-auto">
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
      )}

      {showReadyToPlay && (
        <KawaiiDivider variant="scallop" from="baby-pink" to="red" stroke="white" />
      )}

      {/* Minimal footer — red */}
      <footer id="contact" className="py-16 px-6 lg:px-12 bg-primary border-t border-white/15">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
            <div>
              <img src={klawsomeLogo} alt="Klawsome" className="h-8 w-auto mb-4" />
              <p className="text-white/75 font-body text-sm max-w-xs">
                Michigan's first stand-alone claw machine arcade 🎪
              </p>
            </div>

            <div className="flex flex-wrap gap-12">
              <div>
                <h4 className="font-heading font-bold text-white text-xs tracking-wider uppercase mb-4">Contact</h4>
                <div className="space-y-2">
                  <a href={`mailto:${email}`} className="block text-white/75 text-sm hover:text-white transition-colors font-body">{email}</a>
                  <a href="mailto:info@klawsomenovi.com" className="block text-white/75 text-sm hover:text-white transition-colors font-body">info@klawsomenovi.com</a>
                  <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="block text-white/75 text-sm hover:text-white transition-colors font-body">{phone}</a>
                </div>
              </div>

              <div>
                <h4 className="font-heading font-bold text-white text-xs tracking-wider uppercase mb-4">Follow</h4>
                <div className="space-y-2">
                  {instagram && <a href={instagram} target="_blank" rel="noopener noreferrer" className="block text-white/75 text-sm hover:text-white transition-colors font-body">Instagram</a>}
                  {facebook && <a href={facebook} target="_blank" rel="noopener noreferrer" className="block text-white/75 text-sm hover:text-white transition-colors font-body">Facebook</a>}
                  {tiktok && <a href={tiktok} target="_blank" rel="noopener noreferrer" className="block text-white/75 text-sm hover:text-white transition-colors font-body">TikTok</a>}
                </div>
              </div>

              <div>
                <h4 className="font-heading font-bold text-white text-xs tracking-wider uppercase mb-4">Location</h4>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="block text-white/75 text-sm hover:text-white transition-colors font-body max-w-[200px]">
                  {address}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8">
            <p className="text-white/60 text-xs font-body">
              © {new Date().getFullYear()} Klawsome. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default KawaiiFooter;

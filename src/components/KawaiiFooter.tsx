import klawsomeLogo from '@/assets/klawsome-logo-animated.gif';
import { useCmsSingle, type SiteSettings } from '@/hooks/useCmsContent';
import KawaiiDivider from './KawaiiDivider';
import KawaiiContactInfo from './KawaiiContactInfo';

type FooterPrevColor = 'white' | 'baby-pink' | 'baby-blue' | 'red' | 'navy' | 'secondary-soft' | 'muted-soft';

interface KawaiiFooterProps {
  /** Color of the section sitting directly above the footer block. Defaults to white. */
  prevColor?: FooterPrevColor;
}

const KawaiiFooter = ({ prevColor = 'white' }: KawaiiFooterProps) => {
  const { data: settings } = useCmsSingle<SiteSettings>('site_settings');

  const email = settings?.email || 'team@klawsomenovi.com';
  const phone = settings?.phone || '(248) 938-4093';
  const address = settings?.address || '42768 Grand River Ave Suite C-140, Novi, MI 48375';
  const instagram = settings?.instagram_url || 'https://www.instagram.com/klawsomenovi/';
  const facebook = settings?.facebook_url || 'https://www.facebook.com/klawsomenovi';
  const tiktok = settings?.tiktok_url || 'https://www.tiktok.com/@klawsomenovi';
  const mapsUrl = settings?.google_maps_url || 'https://www.google.com/maps/place/42768+Grand+River+Ave+Suite+C-140,+Novi,+MI+48375';

  return (
    <>
      {/* Transition from page → contact info section (baby-blue) */}
      {prevColor !== 'baby-blue' && (
        <KawaiiDivider variant="scallop" from={prevColor} to="baby-blue" stroke="white" />
      )}

      <KawaiiContactInfo />

      {/* Transition from contact info (baby-blue) → red footer */}
      <KawaiiDivider variant="scallop" from="baby-blue" to="white" stroke="white" />

      {/* Minimal footer — white */}
      <footer id="contact" className="py-16 px-6 lg:px-12 bg-white border-t border-klawsome-navy/15">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
            <div>
              <img src={klawsomeLogo} alt="Klawsome" className="h-32 w-auto mb-4" />
            </div>

            <div className="flex flex-wrap gap-12">
              <div>
                <h4 className="font-heading font-bold text-klawsome-navy text-xs tracking-wider uppercase mb-4">Contact</h4>
                <div className="space-y-2">
                  <a href={`mailto:${email}`} className="block text-klawsome-navy/70 text-sm hover:text-primary transition-colors font-body">{email}</a>
                  <a href="mailto:team@klawsomenovi.com" className="block text-klawsome-navy/70 text-sm hover:text-primary transition-colors font-body">team@klawsomenovi.com</a>
                  <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="block text-klawsome-navy/70 text-sm hover:text-primary transition-colors font-body">{phone}</a>
                </div>
              </div>

              <div>
                <h4 className="font-heading font-bold text-klawsome-navy text-xs tracking-wider uppercase mb-4">Follow</h4>
                <div className="space-y-2">
                  {instagram && <a href={instagram} target="_blank" rel="noopener noreferrer" className="block text-klawsome-navy/70 text-sm hover:text-primary transition-colors font-body">Instagram</a>}
                  {facebook && <a href={facebook} target="_blank" rel="noopener noreferrer" className="block text-klawsome-navy/70 text-sm hover:text-primary transition-colors font-body">Facebook</a>}
                  {tiktok && <a href={tiktok} target="_blank" rel="noopener noreferrer" className="block text-klawsome-navy/70 text-sm hover:text-primary transition-colors font-body">TikTok</a>}
                </div>
              </div>

              <div>
                <h4 className="font-heading font-bold text-klawsome-navy text-xs tracking-wider uppercase mb-4">Location</h4>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="block text-klawsome-navy/70 text-sm hover:text-primary transition-colors font-body max-w-[200px]">
                  {address}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-klawsome-navy/20 pt-8">
            <p className="text-klawsome-navy/50 text-xs font-body">
              © {new Date().getFullYear()} Klawsome. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default KawaiiFooter;

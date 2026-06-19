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
                <div className="flex items-center gap-3">
                  {instagram && (
                    <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="block transition-transform hover:scale-110">
                      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <radialGradient id="igGrad" cx="30%" cy="107%" r="150%">
                            <stop offset="0%" stopColor="#fdf497" />
                            <stop offset="5%" stopColor="#fdf497" />
                            <stop offset="45%" stopColor="#fd5949" />
                            <stop offset="60%" stopColor="#d6249f" />
                            <stop offset="90%" stopColor="#285AEB" />
                          </radialGradient>
                        </defs>
                        <circle cx="20" cy="20" r="20" fill="url(#igGrad)" />
                        <rect x="11" y="11" width="18" height="18" rx="5" fill="none" stroke="#fff" strokeWidth="2" />
                        <circle cx="20" cy="20" r="4.2" fill="none" stroke="#fff" strokeWidth="2" />
                        <circle cx="25.5" cy="14.5" r="1.3" fill="#fff" />
                      </svg>
                    </a>
                  )}
                  {tiktok && (
                    <a href={tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="block transition-transform hover:scale-110">
                      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="20" fill="#fff" />
                        <g transform="translate(11 10)">
                          <path d="M14.5 0h-3.2v13.2a3.1 3.1 0 1 1-3.1-3.1c.3 0 .6 0 .9.1V7a6.4 6.4 0 1 0 5.4 6.3V6.6a7.6 7.6 0 0 0 4.4 1.4V4.8a4.5 4.5 0 0 1-4.4-4.8z" fill="#010101" />
                          <path d="M14.5 0h-3.2v13.2a3.1 3.1 0 1 1-3.1-3.1c.3 0 .6 0 .9.1V7a6.4 6.4 0 1 0 5.4 6.3V6.6a7.6 7.6 0 0 0 4.4 1.4V4.8a4.5 4.5 0 0 1-4.4-4.8z" fill="#25F4EE" transform="translate(-1.2 1)" opacity="0.85" style={{ mixBlendMode: 'screen' }} />
                          <path d="M14.5 0h-3.2v13.2a3.1 3.1 0 1 1-3.1-3.1c.3 0 .6 0 .9.1V7a6.4 6.4 0 1 0 5.4 6.3V6.6a7.6 7.6 0 0 0 4.4 1.4V4.8a4.5 4.5 0 0 1-4.4-4.8z" fill="#FE2C55" transform="translate(1.2 -0.5)" opacity="0.85" style={{ mixBlendMode: 'screen' }} />
                        </g>
                      </svg>
                    </a>
                  )}
                  {facebook && (
                    <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="block transition-transform hover:scale-110">
                      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="20" fill="#1877F2" />
                        <path d="M25.2 25.8l.9-5.6h-5.4v-3.6c0-1.5.7-3 3.1-3h2.5V8.6s-2.3-.4-4.4-.4c-4.5 0-7.5 2.7-7.5 7.7v4.4h-5v5.6h5V40h6.2V25.8z" fill="#fff" />
                      </svg>
                    </a>
                  )}
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
            <img
              src="https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/5634d99f-8f37-4229-a409-dfbb9b66697c/As+Seen+On.webp"
              alt="As seen on Michigan Mama News, Hour Detroit, Little Guide, Hometown Life"
              className="max-w-md w-full mx-auto mb-8"
              loading="lazy"
            />
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

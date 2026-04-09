import klawsomeLogo from '@/assets/klawsome-logo.webp';
import { useCmsSingle, type SiteSettings } from '@/hooks/useCmsContent';

const KawaiiFooter = () => {
  const { data: settings } = useCmsSingle<SiteSettings>('site_settings');

  const email = settings?.email || 'team@klawsomenovi.com';
  const phone = settings?.phone || '(248) 938-4093';
  const address = settings?.address || '42768 Grand River Ave, Suite C-140, Novi, MI 48375';
  const instagram = settings?.instagram_url || 'https://www.instagram.com/klawsomenovi/';
  const facebook = settings?.facebook_url || 'https://www.facebook.com/klawsomenovi';
  const mapsUrl = settings?.google_maps_url || 'https://www.google.com/maps/place/42768+Grand+River+Ave+Suite+C-140,+Novi,+MI+48375';

  return (
    <footer id="contact" className="py-12 px-4 bg-klawsome-navy">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src={klawsomeLogo} alt="Klawsome" className="h-8 w-auto" />
        </div>
        <p className="text-white/50 font-body text-sm mb-6">
          Michigan's first stand-alone claw machine arcade 🎪
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-heading text-white/40 mb-4">
          <a href={`mailto:${email}`} className="hover:text-white transition-colors">General Inquiries</a>
          <a href="mailto:events@klawsomenovi.com" className="hover:text-white transition-colors">Events</a>
          <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="hover:text-white transition-colors">{phone}</a>
          {instagram && <a href={instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>}
          {facebook && <a href={facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>}
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Directions</a>
        </div>
        <p className="text-white/50 font-body text-sm mb-2">
          {address}
        </p>
        <p className="text-white/30 text-xs mt-6 font-body">
          © {new Date().getFullYear()} Klawsome. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default KawaiiFooter;

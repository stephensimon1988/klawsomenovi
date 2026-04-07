import klawsomeLogo from '@/assets/klawsome-logo.webp';

const KawaiiFooter = () => {
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
          <a href="mailto:hello@klawsomearcade.com" className="hover:text-white transition-colors">Email Us</a>
          <a href="tel:+12489196529" className="hover:text-white transition-colors">Call Us</a>
          <a href="https://www.instagram.com/klawsomearcade/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
          <a href="https://www.google.com/maps/place/41768+Grand+River+Ave+Suite+C-140,+Novi,+MI+48375" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Directions</a>
        </div>
        <p className="text-white/50 font-body text-sm mb-2">
          41768 Grand River Ave, Suite C-140, Novi, MI 48375
        </p>
        <p className="text-white/30 text-xs mt-6 font-body">
          © {new Date().getFullYear()} Klawsome. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default KawaiiFooter;

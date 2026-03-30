import klawsomeLogo from '@/assets/klawsome-logo.webp';

const KawaiiFooter = () => {
  return (
    <footer id="contact" className="py-12 px-4 bg-klawsome-yellow">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src={klawsomeLogo} alt="Klawsome" className="h-8 w-auto" />
        </div>
        <p className="text-klawsome-navy/70 font-body text-sm mb-6">
          Grab, play & win — your favorite klaw machine arcade! 🎪
        </p>
        <div className="flex items-center justify-center gap-6 text-sm font-heading text-klawsome-navy/60">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>
        <p className="text-klawsome-navy/40 text-xs mt-6 font-body">
          © {new Date().getFullYear()} Klawsome. All rights reserved 🎪
        </p>
      </div>
    </footer>
  );
};

export default KawaiiFooter;

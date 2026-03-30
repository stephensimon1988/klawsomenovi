import klawsomeLogo from '@/assets/klawsome-logo.webp';

const KawaiiFooter = () => {
  return (
    <footer id="contact" className="py-12 px-4 bg-klawsome-navy text-white">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src={klawsomeLogo} alt="Klawsome" className="h-8 w-auto brightness-0 invert" />
        </div>
        <p className="text-white/70 font-body text-sm mb-6">
          Grab, play & win — your favorite klaw machine arcade! 🎪
        </p>
        <div className="flex items-center justify-center gap-6 text-sm font-heading text-white/60">
          <a href="#" className="hover:text-klawsome-yellow transition-colors">Privacy</a>
          <a href="#" className="hover:text-klawsome-yellow transition-colors">Terms</a>
          <a href="#" className="hover:text-klawsome-yellow transition-colors">Contact</a>
        </div>
        <p className="text-white/30 text-xs mt-6 font-body">
          © {new Date().getFullYear()} Klawsome. All rights reserved 🎪
        </p>
      </div>
    </footer>
  );
};

export default KawaiiFooter;

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
        <div className="flex items-center justify-center gap-6 text-sm font-heading text-white/40">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
        <p className="text-white/30 text-xs mt-6 font-body">
          © {new Date().getFullYear()} Klawsome. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default KawaiiFooter;

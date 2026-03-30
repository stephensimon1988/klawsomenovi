import { Heart } from 'lucide-react';

const KawaiiFooter = () => {
  return (
    <footer id="contact" className="py-12 px-4 border-t border-border">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-primary" fill="currentColor" />
          <span className="font-heading font-bold text-lg kawaii-text-gradient">KawaiiShop</span>
        </div>
        <p className="text-muted-foreground font-body text-sm mb-6">
          Spreading cuteness, one product at a time ♡
        </p>
        <div className="flex items-center justify-center gap-6 text-sm font-heading text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>
        <p className="text-muted-foreground/60 text-xs mt-6 font-body">
          © {new Date().getFullYear()} KawaiiShop. All rights reserved 🌸
        </p>
      </div>
    </footer>
  );
};

export default KawaiiFooter;

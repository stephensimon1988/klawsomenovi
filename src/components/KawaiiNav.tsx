import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import klawsomeLogo from '@/assets/klawsome-logo.webp';
import { Button } from './ui/button';

const navLinks = [
  { label: 'HOME', href: '#hero' },
  { label: 'BIRTHDAYS', href: '/birthdays' },
  { label: 'GIFT CARDS', href: '#giftcards' },
  { label: 'CAREERS', href: '/careers' },
  { label: 'NEWS', href: '/news' },
  { label: 'GALLERY', href: '/gallery' },
  { label: 'OUR STORY', href: '/ourstory' },
  { label: 'REWARDS', href: '/rewards' },
  { label: 'FAQ', href: '/faq' },
];

const smoothScroll = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const KawaiiNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = useCallback((href: string) => {
    setIsOpen(false);
    if (href.startsWith('/')) {
      navigate(href);
      return;
    }
    const id = href.replace('#', '');
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => smoothScroll(id), 300);
    } else {
      smoothScroll(id);
    }
  }, [navigate, location.pathname]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <button onClick={() => handleNav('#hero')} className="flex items-center">
            <img src={klawsomeLogo} alt="Klawsome" className="h-10 w-auto" />
          </button>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.href)}
                className={`font-heading font-bold text-xs tracking-[0.15em] transition-colors duration-200 ${
                  scrolled ? 'text-foreground/60 hover:text-foreground' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
            <Button
              size="sm"
              onClick={() => handleNav('#scheduling')}
              className="rounded-full px-6 font-heading font-bold text-xs tracking-wider bg-primary hover:bg-primary/90 text-white"
            >
              BOOK NOW
            </Button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden p-2 ${scrolled ? 'text-foreground' : 'text-white'}`}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-md border-b border-border overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.href)}
                  className="block font-heading font-bold text-xs tracking-[0.15em] text-foreground/60 hover:text-foreground py-2 transition-colors w-full text-left"
                >
                  {link.label}
                </button>
              ))}
              <Button size="sm" onClick={() => handleNav('#scheduling')} className="rounded-full px-6 font-heading font-bold text-xs tracking-wider bg-primary hover:bg-primary/90 text-white w-full">
                BOOK NOW
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default KawaiiNav;

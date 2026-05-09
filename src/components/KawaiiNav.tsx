import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import klawsomeLogo from '@/assets/klawsome-logo.webp';
import { Button } from './ui/button';
import NavClaw from './NavClaw';

const navLinks = [
  { label: 'HOME', href: '#hero' },
  { label: 'BIRTHDAYS', href: '/birthdays' },
  { label: 'RENTAL', href: '/rental' },
  { label: 'GIFT CARDS', href: 'https://app.squareup.com/gift/ML1R35ZH9VKRW/order' },
  { label: 'CAREERS', href: '/careers' },
];

const moreLinks = [
  { label: 'Rewards', href: '/rewards' },
  { label: 'Store', href: '/store' },
  { label: 'Business Development', href: '/business-development' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Team', href: '/team' },
  { label: 'Community', href: '/community' },
  { label: 'News', href: '/news' },
  { label: 'Info Hub', href: '/info-hub' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
];

const smoothScroll = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const KawaiiNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [clawActive, setClawActive] = useState(false);
  const [pointerX, setPointerX] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = useCallback((href: string) => {
    setIsOpen(false);
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
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
    <nav
      onMouseEnter={() => !isOpen && setClawActive(true)}
      onMouseLeave={() => setClawActive(false)}
      onMouseMove={(e) => setPointerX(e.clientX)}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}
    >
      <NavClaw active={clawActive && !isOpen} pointerX={pointerX} />
      <div className="ds-container section-x">
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
            <div
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button
                className={`flex items-center gap-1 font-heading font-bold text-xs tracking-[0.15em] transition-colors duration-200 ${
                  scrolled ? 'text-foreground/60 hover:text-foreground' : 'text-white/70 hover:text-white'
                }`}
              >
                MORE <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 pt-3"
                  >
                    <div className="min-w-[200px] bg-background border border-border rounded-2xl shadow-lg py-2 overflow-hidden">
                      {moreLinks.map((link) => (
                        <button
                          key={link.label}
                          onClick={() => { setMoreOpen(false); handleNav(link.href); }}
                          className="block w-full text-left px-5 py-3 font-heading font-bold text-xs tracking-[0.15em] uppercase text-foreground/70 hover:text-foreground hover:bg-secondary/60 transition-colors"
                        >
                          {link.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
              <div className="pt-2 border-t border-border">
                <p className="font-heading font-bold text-[10px] tracking-[0.2em] text-muted-foreground py-2 uppercase">More</p>
                {moreLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleNav(link.href)}
                    className="block font-heading font-bold text-xs tracking-[0.15em] uppercase text-foreground/60 hover:text-foreground py-2 transition-colors w-full text-left"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
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

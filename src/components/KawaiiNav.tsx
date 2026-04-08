import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import klawsomeLogo from '@/assets/klawsome-logo.webp';
import { Button } from './ui/button';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Birthdays', href: '/birthdays' },
  { label: 'Gift Cards', href: '#giftcards' },
  { label: 'Careers', href: '/careers' },
  { label: 'News', href: '/news' },
];

const smoothScroll = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const KawaiiNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-klawsome-navy">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => handleNav('#hero')} className="flex items-center">
            <img src={klawsomeLogo} alt="Klawsome" className="h-10 w-auto" />
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.href)}
                className="font-heading font-semibold text-sm text-white/70 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
            <Button size="sm" onClick={() => handleNav('#scheduling')} className="rounded-full px-5 font-heading font-bold bg-primary hover:bg-primary/90 text-white text-sm glow-hover glow-coral">
              Book Your Visit
            </Button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-white">
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
            className="md:hidden bg-klawsome-navy border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.href)}
                  className="block font-heading font-semibold text-white/70 hover:text-white py-2 transition-colors w-full text-left"
                >
                  {link.label}
                </button>
              ))}
              <Button size="sm" onClick={() => handleNav('#scheduling')} className="rounded-full px-5 font-heading font-bold bg-primary hover:bg-primary/90 text-white w-full glow-hover glow-coral">
                Book Your Visit
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default KawaiiNav;

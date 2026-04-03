import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import klawsomeLogo from '@/assets/klawsome-logo.webp';
import { Button } from './ui/button';

const navLinks = [
  { label: 'About us', href: '#about' },
  { label: 'Birthdays', href: '#scheduling' },
  { label: 'Rentals', href: '/business' },
  { label: 'Home', href: '#' },
  { label: 'Contact Us', href: '#contact' },
];

const KawaiiNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-klawsome-navy">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center">
            <img src={klawsomeLogo} alt="Klawsome" className="h-10 w-auto" />
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-heading font-semibold text-sm text-white/70 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <Button size="sm" className="rounded-full px-5 font-heading font-bold bg-primary hover:bg-primary/90 text-white text-sm glow-hover glow-coral">
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
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block font-heading font-semibold text-white/70 hover:text-white py-2 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Button size="sm" className="rounded-full px-5 font-heading font-bold bg-primary hover:bg-primary/90 text-white w-full glow-hover glow-coral">
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

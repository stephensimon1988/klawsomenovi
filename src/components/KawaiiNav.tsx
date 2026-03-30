import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import klawsomeLogo from '@/assets/klawsome-logo.webp';

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Tokens', href: '#products' },
  { label: 'Book', href: '#scheduling' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const KawaiiNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-klawsome-baby-blue/40 via-white/80 to-klawsome-baby-pink/40 backdrop-blur-md border-b border-white/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Desktop nav links on the left */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-heading font-semibold text-klawsome-navy/70 hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile toggle on left */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-klawsome-navy"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo on the right */}
          <a href="#" className="flex items-center">
            <img
              src={klawsomeLogo}
              alt="Klawsome"
              className="h-10 w-auto"
            />
          </a>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-klawsome-baby-blue/30 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block font-heading font-semibold text-klawsome-navy/70 hover:text-primary py-2 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default KawaiiNav;

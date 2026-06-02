import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X, Copy, Gift, Calendar, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { openBookingModal } from './BookNowDialog';

const STORAGE_ELAPSED = 'clawGameElapsedMs';
const STORAGE_DISMISSED = 'clawGameDiscountDismissed';
const DEFAULT_DELAY_MS = 10 * 60 * 1000; // 10 min
const DISCOUNT_CODE = '5OFF';

const ClawGameCTAs = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showDiscount, setShowDiscount] = useState(false);
  const [dismissed, setDismissed] = useState<boolean>(() => sessionStorage.getItem(STORAGE_DISMISSED) === '1');
  const startRef = useRef<number>(Date.now());
  const accumulatedRef = useRef<number>(Number(sessionStorage.getItem(STORAGE_ELAPSED) || 0));

  // Allow ?ctaDelay=5 (seconds) for QA
  const delayParam = searchParams.get('ctaDelay');
  const delayMs = delayParam ? Math.max(1, Number(delayParam)) * 1000 : DEFAULT_DELAY_MS;

  useEffect(() => {
    if (dismissed) return;
    let timeoutId: number | undefined;
    let intervalId: number | undefined;

    const remaining = () => Math.max(0, delayMs - (accumulatedRef.current + (Date.now() - startRef.current)));

    const schedule = () => {
      const r = remaining();
      if (r <= 0) {
        setShowDiscount(true);
        return;
      }
      timeoutId = window.setTimeout(() => setShowDiscount(true), r);
    };

    const persist = () => {
      accumulatedRef.current += Date.now() - startRef.current;
      startRef.current = Date.now();
      sessionStorage.setItem(STORAGE_ELAPSED, String(accumulatedRef.current));
    };

    const onVisibility = () => {
      if (document.hidden) {
        persist();
        if (timeoutId) window.clearTimeout(timeoutId);
      } else {
        startRef.current = Date.now();
        schedule();
      }
    };

    schedule();
    intervalId = window.setInterval(persist, 10_000);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('beforeunload', persist);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('beforeunload', persist);
      persist();
    };
  }, [delayMs, dismissed]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE);
      toast.success(`Code ${DISCOUNT_CODE} copied!`);
    } catch {
      toast.error('Could not copy — code is 5OFF');
    }
  };

  const dismiss = () => {
    setDismissed(true);
    setShowDiscount(false);
    sessionStorage.setItem(STORAGE_DISMISSED, '1');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 max-w-[92vw]">
      <AnimatePresence>
        {showDiscount && !dismissed && (
          <motion.div
            key="discount"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="relative rounded-kawaii border-2 border-klawsome-navy bg-gradient-to-br from-klawsome-yellow via-klawsome-baby-pink to-klawsome-baby-blue px-5 py-4 pr-10 shadow-xl animate-glow-pulse"
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss discount"
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-klawsome-navy text-white flex items-center justify-center hover:bg-primary"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <p className="font-heading font-bold text-klawsome-navy text-lg leading-tight">
              🎉 5% off your order!
            </p>
            <p className="font-body text-klawsome-navy/80 text-sm mt-0.5">
              Use code{' '}
              <button
                type="button"
                onClick={copyCode}
                className="inline-flex items-center gap-1 font-bold bg-white/80 rounded-md px-2 py-0.5 hover:bg-white"
              >
                {DISCOUNT_CODE}
                <Copy className="w-3 h-3" />
              </button>{' '}
              at checkout.
            </p>
            <button
              type="button"
              onClick={() => navigate('/store')}
              className="mt-2 inline-flex items-center gap-1 text-sm font-heading font-bold text-klawsome-navy underline underline-offset-2 hover:text-primary"
            >
              Shop now →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-row flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => navigate('/rewards')}
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-klawsome-navy bg-white px-4 py-2 font-heading font-bold text-sm text-klawsome-navy shadow-md hover:scale-105 transition-transform"
        >
          <Gift className="w-4 h-4" /> Rewards
        </button>
        <button
          type="button"
          onClick={() => openBookingModal()}
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-klawsome-navy bg-klawsome-baby-blue px-4 py-2 font-heading font-bold text-sm text-klawsome-navy shadow-md hover:scale-105 transition-transform"
        >
          <Calendar className="w-4 h-4" /> Book Event
        </button>
        <button
          type="button"
          onClick={() => navigate('/store')}
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-klawsome-navy bg-klawsome-yellow px-4 py-2 font-heading font-bold text-sm text-klawsome-navy shadow-md hover:scale-105 transition-transform"
        >
          <ShoppingBag className="w-4 h-4" /> Shop Store
        </button>
      </div>
    </div>
  );
};

export default ClawGameCTAs;
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/**
 * Global Acuity booking modal. Open from anywhere by dispatching:
 *   window.dispatchEvent(new Event('open-booking'))
 */
const BOOKING_URL =
  'https://app.acuityscheduling.com/schedule.php?owner=37086470';

export const openBookingModal = () => {
  window.dispatchEvent(new Event('open-booking'));
};

const BookNowDialog = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-booking', handler);
    return () => window.removeEventListener('open-booking', handler);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-3 border-b">
          <DialogTitle className="font-heading">Book your visit</DialogTitle>
        </DialogHeader>
        <div className="max-h-[90vh] overflow-y-auto">
          <iframe
            src={BOOKING_URL}
            title="Booking"
            className="w-full"
            style={{ height: '80vh', border: 0 }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookNowDialog;
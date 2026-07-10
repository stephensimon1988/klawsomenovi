// Backwards-compatible shim: keeps the same import path used across the app,
// but the dialog now renders the booking wizard instead of the Acuity iframe.
export { openBookingModal } from '@/components/booking/BookingWizard';
export { default } from '@/components/booking/BookingWizard';

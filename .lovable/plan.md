## Bigger, more readable popups site-wide

Enforce a 75% width / 90% height minimum on every popup surface (Dialog, Sheet/Drawer, AlertDialog) and bump typography inside them so text is easier to read.

### What changes

**Base UI primitives** (one place, applies everywhere):

- `src/components/ui/dialog.tsx` — change `DialogContent` default classes from `w-full max-w-lg p-6` to:
  - `w-[95vw] sm:w-[75vw] min-h-[90vh] max-w-[75vw] max-h-[95vh] p-8 sm:p-10 flex flex-col overflow-hidden`
  - Add `text-base sm:text-lg` as the default body text size on the content (so all inner `text-sm` copy reads one step larger by default).
  - Bump `DialogTitle` from `text-lg` → `text-2xl sm:text-3xl`.
  - Bump `DialogDescription` from `text-sm` → `text-base sm:text-lg`.
  - Grow the close-X hit target from `h-4 w-4` → `h-6 w-6` with more padding.

- `src/components/ui/alert-dialog.tsx` — same width/height/typography treatment on `AlertDialogContent`, `AlertDialogTitle`, `AlertDialogDescription`.

- `src/components/ui/sheet.tsx` — for the right/left side sheets (used by the cart drawer), widen from `sm:max-w-sm` default to `sm:max-w-[50vw]` and bump inner title/description sizing to match dialogs. Top/bottom sheets get `min-h-[90vh]`.

**Popups with hard-coded width overrides** — relax so they inherit the new defaults:

- `src/components/booking/BookingWizard.tsx` — replace `max-w-3xl w-[95vw] p-0` with classes that keep the internal layout but let width/height come from the base (`p-0` stays because the wizard manages its own padding; add `!max-w-[75vw] !min-h-[90vh]`). Bump inner step copy: package titles, labels, and small helper text move up one size (e.g. `text-sm` → `text-base`, `text-xs` → `text-sm`) so the whole wizard is easier to read on desktop and mobile.
- `src/components/admin/BookingsCalendar.tsx` — remove `max-w-lg`, let it inherit. Row labels grow one size.
- `src/components/JobDescriptionDialog.tsx` — remove custom `max-w-2xl` / height caps, let it inherit; body prose gets `prose-lg`.
- `src/components/FloatingContactWidget.tsx` — same override cleanup + one-step-up type.
- `src/components/shopify/QuickAddModal.tsx` — same cleanup; product title `text-xl` → `text-2xl`, price `text-2xl` → `text-3xl`, variant/option labels move up.
- `src/components/shopify/CartDrawer.tsx` — widen sheet to the new default; product names `font-medium` → `text-lg font-semibold`, price/qty controls scale up.
- `src/components/shopify/SizeChart.tsx` — inherit new sizing; table cells `text-sm` → `text-base`.

### Mobile behavior

Below `sm` (≤640px) popups become effectively full-screen (`w-[95vw] min-h-[90vh]`) — matches your rule and stays comfortable to tap. Above `sm` the 75%/90% floor kicks in.

### Not changing

- Toasts (Sonner) — those are notifications, not popups.
- Dropdown menus, popovers, tooltips, and command palette — they anchor to triggers and shouldn't take 75% of the screen.
- Any popup's internal business logic; only presentation.

### Technical section

Sizing lives on the base `DialogContent` / `AlertDialogContent` / `SheetContent` so every popup — current and future — picks it up. Individual popups that previously overrode `max-w-*` will have those overrides removed rather than fought with `!important`, except the booking wizard which needs `!max-w-[75vw]` because it currently sets `max-w-3xl`. Typography bumps are Tailwind size increments (`text-sm→text-base`, `text-base→text-lg`, `text-lg→text-2xl`, `text-2xl→text-3xl`) — no new tokens.

### Questions

1. Should this apply to the **cart drawer** too? Right now the cart is a side-sheet — going to 75% width makes it a very wide panel on desktop. I'd propose `sm:max-w-[50vw]` for the cart specifically so it stays drawer-shaped, and reserve the full 75%/90% rule for centered modal dialogs. OK to keep that carve-out?
2. Any popup you want to **exclude** from the bigger sizing (e.g., the small admin status-change dialog)?

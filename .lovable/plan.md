# Transition Klawsome Novi to a new Lovable workspace

## What to do

Deliver a copy-paste **setup prompt** the user can give the new Lovable project (created from the GitHub repo `stephensimon1988/klawsomenovi`) so the clone becomes fully functional. The old workspace will be decommissioned; domains get connected later by the user.

## The prompt to hand the user (this is the deliverable)

````text
This project was imported from an existing production site (klawsomenovi.com). Set it up so everything works:

1. **Backend (Lovable Cloud)**: The frontend expects a Supabase backend. Run the migrations/functions from `supabase/` — deploy all edge functions under `supabase/functions/` (cms-admin, admin-auth, create-pending-booking, request-booking-approval, shopify-booking-sync, shopify-order-webhook, shopify-rental-sync, booking-ics, google-rating, square-catalog, plus the email pipeline functions). Recreate the database tables they use: event_bookings, store_hours, event_availability, booking_rental_pricing, booking_rental_options, service_area_zips, zip_approvals, cms content tables, and the email queue/suppression tables — all with RLS enabled, GRANTs on every public table, and seed data (ask me for a data export from the old project before it is decommissioned).

2. **Secrets to re-create**: ADMIN_PASSWORD (KlawMichAgnes142768!), SHOPIFY admin token for shopify-rental-sync (fresh Shopify Admin API token for store u2riqy-et.myshopify.com), Square access token for square-catalog (sandbox), transactional email provider key, and any Google Places key for google-rating.

3. **Shopify**: Storefront token 8b6c8354422d77257ea241cbd0748281 and store u2riqy-et.myshopify.com are hardcoded in src/lib/shopify.ts and work as-is. Re-register the orders webhook (shopify-order-webhook) pointing at THIS project's new function URL — the old project's webhook must be removed to avoid double-processing bookings.

4. **Auth**: Configure Google OAuth provider for the new backend if used; update any OAuth redirect URLs to the new project domains.

5. **Admin**: /klawsome-admin gate uses the admin-auth edge function with ADMIN_PASSWORD — verify login, Command Center tabs (Store Hours, Booking Schedule, Rental Pricing, Approvals, CMS content), and the "Sync to Shopify" button all work.

6. **Verify booking flows end to end**: Klawsome Mobile (safety-ZIP screening + call-first approvals), machine rental (Klaw Mini weekday/weekend pickup/delivery, Klaw Classic 4-hour blocks, delivery mileage via zipMiles), private parties 9–11am, semi-private 11am–9pm, and Shopify cart checkout totals matching wizard quotes (price-mismatch guard in BookingWizard).

7. Do NOT change branding, design tokens (kawaii pastel palette, Quicksand/Nunito), or page content — this is a migration, not a redesign.
````

## Checklist to include alongside the prompt

- **Before decommissioning the old workspace**: export database data (Cloud → Advanced settings → Export data) so tables can be seeded in the new backend.
- **Manual steps only the user can do**: connect the new project to the same GitHub repo (import or create-from-repo), connect custom domains, update the Shopify webhook URL in the Shopify admin, rotate/store the fresh Shopify Admin token.
- **Known caveat**: all stored Shopify admin tokens in the old project were expired; a fresh token is required in the new workspace regardless.

## Technical details

- No code changes to this repo are required — the codebase is self-contained; only env vars, secrets, the backend schema/data, and the Shopify webhook URL are environment-specific.
- Frontend Shopify integration is hardcoded in `src/lib/shopify.ts` (storefront token + domain), so it works immediately in the clone.

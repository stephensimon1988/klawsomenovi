# Transition prompt for new Lovable workspace (GitHub-based)

## What to do

Hand the user a copy-paste prompt for the **new** Lovable project that instructs its agent to pull the code directly from the GitHub repository — not from this Lovable project. Old workspace will be decommissioned; user connects domains later.

## The prompt to hand the user (the deliverable)

````text
This project is being migrated from another Lovable workspace. Pull the codebase from my GitHub repository and make it fully functional here:

1. **Import the code**: Connect this project to GitHub and pull the repository `stephensimon1988/klawsomenovi` (https://github.com/stephensimon1988/klawsomenovi.git). Use it as the complete source of truth — do not redesign or rewrite anything. If direct import isn't available, clone the repo and copy all files in, preserving structure.

2. **Backend (Lovable Cloud)**: The app expects a Supabase backend (see `supabase/` and `src/integrations/supabase/`). Recreate it here:
   - Deploy every edge function under `supabase/functions/`: cms-admin, admin-auth, create-pending-booking, request-booking-approval, shopify-booking-sync, shopify-order-webhook, shopify-rental-sync, booking-ics, google-rating, square-catalog, process-email-queue, send-transactional-email, preview-transactional-email, handle-email-unsubscribe, handle-email-suppression.
   - Create the database tables these functions and the frontend use (event_bookings, store_hours, event_availability, booking_rental_pricing, booking_rental_options, service_area_zips, zip_approvals, CMS content tables, email queue/suppression tables). Enable RLS with GRANTs on every public table. I'll provide a data export from the old project to seed them.

3. **Secrets to re-create** (I'll enter them when prompted): ADMIN_PASSWORD = KlawMichAgnes142768!, a fresh Shopify Admin API token (store u2riqy-et.myshopify.com) for shopify-rental-sync, Square access token (sandbox) for square-catalog, transactional email provider key, Google Places key for google-rating.

4. **Shopify**: Storefront token and store domain are hardcoded in `src/lib/shopify.ts` and work as-is. Point the Shopify orders webhook at THIS project's new `shopify-order-webhook` function URL; the old project's webhook will be removed to avoid double-processing bookings.

5. **Verify everything works**: /klawsome-admin login and all Command Center tabs (Store Hours, Booking Schedule, Rental Pricing, Approvals, CMS content), "Sync to Shopify", and all booking flows — Klawsome Mobile (ZIP safety screening + call-first approvals), machine rental (Klaw Mini weekday/weekend pickup/delivery, Klaw Classic 4-hour blocks, mileage quoting), private parties 9–11am, semi-private 11am–9pm — with Shopify checkout totals matching wizard quotes exactly (price-mismatch guard must not trip).

6. **Do NOT change** branding, design tokens (kawaii pastel palette, Quicksand headings / Nunito body), page content, or booking business rules. This is a migration, not a redesign.
````

## Checklist to include alongside

- **Before decommissioning the old workspace**: export the database (Cloud → Advanced settings → Export data) so tables can be seeded in the new backend.
- **User-only steps**: create the new Lovable project, connect it to the GitHub repo, connect custom domains later, update the Shopify webhook URL in Shopify admin, provide a fresh Shopify Admin API token (old ones are expired).
- No code changes to this repo are needed — only env vars, secrets, backend schema/data, and the webhook URL are environment-specific.

## Technical details

- Deliverable is text only; nothing in this project is modified.
- Repo URL: https://github.com/stephensimon1988/klawsomenovi.git

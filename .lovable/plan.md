## Goal

Stop chasing a Shopify Admin API token. Make paid bookings appear in the admin calendar automatically via two mechanisms already suited to this: (1) the pending booking we already write at checkout start, and (2) the existing Shopify **order webhook** that flips it to `confirmed` on payment. Add a **token-exchange fallback** using the new Client ID / Client Secret flow only if the user still wants historical order backfill.

## Why not the "shpat_" hunt

Shopify's new custom-app flow no longer surfaces a one-time `shpat_` token in the UI for many merchants. The supported path forward is either:
- **Webhook-driven sync** (no Admin token needed) — Shopify pushes order events to us, HMAC-signed. We already have `supabase/functions/shopify-order-webhook/index.ts` built for exactly this.
- **OAuth 2 client_credentials exchange** — POST Client ID + Client Secret to Shopify's token endpoint to mint an Admin API access token programmatically. Needed only for pull-based backfill of past orders.

## Plan

### 1. Make webhook-driven confirmation the primary path (no new token)
- Verify `shopify-order-webhook` is deployed and reachable.
- Walk the user through registering **two webhooks** in Shopify Admin → Settings → Notifications → Webhooks:
  - Topic: `Order creation` (so pending orders land immediately)
  - Topic: `Order payment` (flips booking to `confirmed`)
  - URL: `https://nrxfzjysodxqmwsstcim.supabase.co/functions/v1/shopify-order-webhook`
  - Format: JSON
- Shopify shows a signing secret once — user pastes it into `SHOPIFY_WEBHOOK_SECRET` (already referenced by the function).
- Confirm the existing `create-pending-booking` write on checkout-start still runs, so the row exists before Shopify's webhook arrives and gets matched by `booking_ref`.

### 2. Add a token-exchange helper for backfill (optional)
Only build this if the user wants to import past/paid orders that predate the webhook setup.

- New edge function `supabase/functions/shopify-token-exchange/index.ts`:
  - Reads `SHOPIFY_CLIENT_ID` and `SHOPIFY_CLIENT_SECRET` secrets.
  - POSTs to `https://{shop}.myshopify.com/admin/oauth/access_token` with `grant_type=client_credentials`.
  - Caches the returned token in a secret or a small `shopify_admin_token` row and refreshes on 401.
- Update `shopify-booking-sync` to call the helper instead of reading a hard-coded `SHOPIFY_ADMIN_API_TOKEN`.
- Request two new secrets from the user: `SHOPIFY_CLIENT_ID`, `SHOPIFY_CLIENT_SECRET`.

### 3. Verify end-to-end
- Test webhook function via `supabase--curl_edge_functions` with a synthetic signed payload; confirm a matching pending booking flips to `confirmed`.
- After the user configures the webhook and places a test order, check `event_bookings` for the row.

## Question for you before I build

Two options — pick one (or both):

- **A. Webhooks only** (recommended). Zero token hunting. New paid orders show up automatically. Past orders stay as-is (I can keep manually backfilling anything specific like #1007).
- **B. Webhooks + token-exchange backfill**. Adds the OAuth `client_credentials` helper so we can also pull historical/paid orders on demand. Requires Client ID + Client Secret secrets from you.

Which do you want?

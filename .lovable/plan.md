## Changes

### 1. `src/components/booking/BookingWizard.tsx` — Contact step
On the Contact step, when pathway is `private` or `semi`:

- Change the "Party size" input to two labeled numeric inputs shown side-by-side: **Adults** and **Children** (each capped at 12, `max={12}`). The combined value replaces the current single `partySize` field going into the Shopify cart attributes as `party_size` (`"{adults} adults, {children} children"`).
- Above these inputs, render a highlighted note card with this copy (from the attached screenshot):

  > **How many adults and children are allowed?**
  > • As Klawsome has limited space, a maximum of **12 adults** are allowed along with a maximum of **12 children**.
  > • Klawsome keeps a limit on guests to ensure a fun and comfortable experience for everyone.

- Update `validateStep('contact')`: for private/semi require both adults ≥ 1 and children ≥ 0, and reject any value > 12 for either field. Non-birthday pathways keep today's behavior.

State shape stays backward compatible: keep `partySize` string, add `adults` and `children` string fields on `contact`.

### 2. Confirmation email recipients — no code change
`supabase/functions/send-transactional-email/index.ts` already routes booking confirmations to both `team@klawsomenovi.com` and `events@klawsomenovi.com`. I'll confirm in the plan output rather than modify anything.

## Out of scope
- No changes to rental/mobile pathways.
- No new admin toggles for the cap (hard-coded to 12 as requested).

## Plan

### 1. Create the test product
Use `shopify--create_product` with:
- Title: "Sample Product"
- Price: $0.01
- Vendor: Klawsome
- Product type: Sample
- One default variant, inventory tracked by Shopify, weight ~0.1 lb (so shipping rates can calculate)
- Tag: `sample`
- A simple placeholder image

It will appear automatically on `/store` because the storefront pulls live from Shopify.

### 2. Pre-flight checklist for an end-to-end real order

I can verify the API/code side, but several items can only be configured by you in the Shopify admin. Here's what to confirm before placing a live order:

**Payments & payouts (most common blocker at $0.01)**
- Shopify Payments (or another gateway) must be activated in Settings → Payments.
- Business details, tax ID, and bank account submitted and approved for payouts.
- Note: Shopify enforces a minimum charge (~$0.50–$1.00 depending on gateway). A $0.01 order will likely be **rejected by the processor**. Recommend testing at **$1.00** instead, or using Shopify's Bogus Gateway in test mode.

**Shipping**
- At least one shipping zone covering your test address in Settings → Shipping and delivery.
- A shipping rate (flat or calculated) attached to that zone, otherwise checkout shows "no shipping available".
- The product variant must have a weight if you use calculated rates.

**Inventory & location**
- A fulfillment location set, with stock > 0 for the variant (or inventory policy set to "continue" so it sells when out of stock).

**Taxes**
- Tax regions configured for where you ship; otherwise tax shows $0 (fine for a test).

**Checkout/storefront**
- Storefront checkout already works on the site via the cart drawer (`channel=online_store` is set).
- Store is claimed (confirmed ✅).
- If store is still password-protected, disable the password in Online Store → Preferences for public checkout.

**Order fulfillment & payout**
- After paying, mark the order Fulfilled in Shopify admin (or buy a label) to ship.
- Payout schedule (Settings → Payments) determines when funds hit your bank — usually a few business days after capture.

### 3. What I'll deliver in build mode
- Create the $0.01 "Sample Product" via the API.
- Report back the product ID, admin link, and the storefront URL.
- Flag any of the above items I can detect as missing from the API side (e.g., no variants, missing weight).

### Recommendation
Approve the plan and I'll create it at $0.01 as requested — but be ready to bump the price to $1.00 if the payment processor rejects the charge as below minimum.

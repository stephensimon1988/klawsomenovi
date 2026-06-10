## Goal
Enable Shopify inventory tracking on every variant across all 26 products in the connected store.

## Approach
For each variant on every product, call `shopify--update_product_variant` with:
- `inventory_management: "shopify"` (turns tracking ON)
- `inventory_policy: "deny"` (default — prevents overselling when stock hits 0)

## Scope
- 21 single-variant products (figurines, plush)
- Klawsome Crew Plush Collection (3 variants)
- Klawsome! Balikbayan Mystery Box (7 variants)
- 3× Klawsome Kawaii Tees (40 variants each = 120 variants)
- **Total: ~151 variants to update**

## Process
1. Fetch each product to collect its variant IDs (26 `get_product` calls).
2. Run `update_product_variant` for every variant with the two inventory fields.
3. Report any failures at the end.

## Notes
- This affects the live Shopify store immediately.
- This does NOT set stock quantities — it only enables tracking. After this, you'll need to set quantities per variant/location in Shopify admin (or tell me desired starting quantities and I can guide you).
- `inventory_policy` defaults to `deny`. If you'd rather allow overselling (continue selling at 0), say so and I'll use `continue` instead.

## Confirm before running
Given the volume (~151 variant updates against your live store), confirm:
- Proceed with `inventory_policy: deny` for all? (or `continue`?)
- OK to apply to all 26 products including the 120 tee variants?

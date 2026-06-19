## Goal
Stop rendering run-on Shopify descriptions in the store's pop-up modals (`QuickAddModal`) as a single wall of text. Format them into clean, readable paragraphs.

## Approach
Shopify already stores rich formatting (paragraphs, line breaks, lists) in `descriptionHtml`, but the storefront currently only fetches the plain `description` field — which strips all formatting into one blob. Switch to `descriptionHtml`, and add a plain-text fallback that auto-paragraphs anything that still arrives as a wall of text.

## Changes

### 1. `src/lib/shopify.ts`
- Add `descriptionHtml` alongside `description` in the `PRODUCTS_QUERY` GraphQL query.
- Add `descriptionHtml: string` to the `ShopifyProduct.node` TypeScript type.

### 2. `src/components/shopify/QuickAddModal.tsx`
- Replace the current single `<p>` description block with a formatted renderer:
  - If `node.descriptionHtml` exists → render via `dangerouslySetInnerHTML` inside a styled container that gives real spacing to `<p>`, `<ul>`, `<ol>`, `<li>`, `<br>`, `<strong>`, `<em>`, headings (Tailwind utility classes — no `@tailwindcss/typography` plugin needed; spacing applied via `[&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1` etc.).
  - Sanitize first with a tiny inline allowlist strip (regex remove `<script>`, `<style>`, `on*=` attributes) to be safe — no new dependency.
  - Fallback (plain `description`, no HTML): split on `\n\n` first; if the result is still one giant paragraph longer than ~280 chars, auto-split into paragraphs every 2 sentences using a regex on `. `, `! `, `? `. Render each chunk as its own `<p>` with `mb-3`.
- Keep the existing Gift Card override exactly as-is (already paragraph-formatted).

### 3. Anywhere else the description renders
- Quick scan: only `QuickAddModal.tsx` renders `node.description` in the store flow. Product cards show title/price only. No other component needs to change.

## Out of scope
- No changes to Shopify product copy itself (we won't rewrite descriptions in the Shopify admin).
- No new dependencies (no `dompurify`, no `@tailwindcss/typography`) — keep the sanitizer and prose styling inline and minimal.
- Gift Card modal copy is unchanged.

## Files touched
- `src/lib/shopify.ts` — add `descriptionHtml` to query + type
- `src/components/shopify/QuickAddModal.tsx` — new formatted description block + fallback auto-paragrapher
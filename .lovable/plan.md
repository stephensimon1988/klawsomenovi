## Rename "Community Partners" → "Community Outreach"

Update user-facing copy everywhere it appears. Keep the existing URL path (`/community-partners`) and asset filenames unchanged to avoid broken links, sitemap churn, and asset refetching.

### Changes

1. **`src/components/KawaiiNav.tsx`** (MORE menu, Connect group)
   - `'Partner with Klawsome'` stays; change `'Community Partners'` label → `'Community Outreach'` (href unchanged: `/community-partners`).

2. **`src/pages/CommunityPartners.tsx`**
   - `PageHero` `title="Community Partners"` → `"Community Outreach"`.
   - (Component/file name and import unchanged.)

3. **`src/App.tsx`**
   - No change. Route path `/community-partners` kept so existing links/sitemap continue to work.

### Out of scope
- No URL/route rename, no sitemap edit, no asset file rename.
- `jobDescriptions.ts` already uses the generic phrase "community outreach" — leave as is.

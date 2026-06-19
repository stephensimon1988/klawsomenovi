## Why nothing changed
1. **Gift Card modal**: the tier list was written as JSX child text on separate lines with blank lines between them. JSX collapses blank-line whitespace between text nodes, so by the time `whitespace-pre-line` saw the string there were no `\n\n` to render — it became one run-on line.
2. **Other product modals**: Shopify's `descriptionHtml` almost always returns the description wrapped in a single `<p>...</p>` (even when the admin typed plain text with no breaks). The previous fix rendered `descriptionHtml` as-is, so the wall of text rendered as one paragraph and the `autoParagraph` fallback never ran.

## Fix
Edit `src/components/shopify/QuickAddModal.tsx`:

1. **Gift Card branch**: render the tier list as an explicit array of `<p>` elements (one per tier) with `mb-3` spacing — drop the multiline JSX text + `whitespace-pre-line` approach entirely.

2. **All other products**: stop trusting Shopify's `descriptionHtml` for paragraphing. Always convert the description to plain text and run our `autoParagraph` splitter, then render each chunk as its own `<p className="mb-3 last:mb-0">`.
   - Helper: strip tags from `descriptionHtml` (or fall back to `description`), decode common entities (`&amp;`, `&nbsp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`), normalize whitespace, then feed into the existing `autoParagraph`.
   - Keep the existing 2-sentence-per-paragraph heuristic for long blobs and the `\n\n` split for descriptions that already have real breaks.

3. Remove the unused `sanitizeHtml` helper since we no longer render raw HTML.

## Files touched
- `src/components/shopify/QuickAddModal.tsx` — fix Gift Card hardcoded list + rewrite description renderer to always auto-paragraph plain text.

No other files change.
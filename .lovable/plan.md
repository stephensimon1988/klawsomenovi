## Fix hours display

**Problem:** When all 7 days are open with the same hours, the site shows "Sunday–Saturday" and still displays "Closed Mondays" (from a hardcoded fallback), instead of just "Everyday" with no closed line.

**Changes:**

1. **`src/lib/hoursSummary.ts`**
   - In `formatHoursSummary`, when the open-days group covers all 7 days, set `dayRange = "Everyday"` (skip the range-building logic).
   - `closedDays` already returns `""` when there are no closed rows — keep as is.
   - Update `full` composition so if `dayRange === "Everyday"`, output becomes `"Open Everyday, {timeRange}."` with no closed suffix when none.

2. **`src/components/KawaiiVisit.tsx`**
   - Remove the hardcoded fallback `|| 'Closed Mondays'` on line 22 so the closed line only renders when the admin actually marked days closed.
   - Also swap the `dayRange` fallback comma rendering so when `dayRange === "Everyday"` it displays as `"Everyday, 11:00 AM to 9:00 PM"` (already works with current template — no template change needed).

3. **`src/components/KawaiiHero.tsx`** — already uses `hoursSummary.full`, which will automatically pick up the new "Everyday" phrasing. No edit needed beyond verifying.

**No changes** to admin panel, database, or other components.

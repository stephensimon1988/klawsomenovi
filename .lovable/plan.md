**Goal**: Replace the text-based social media links in the footer with colored circular icon buttons, styled like the user's reference screenshot but without the blue background.

**Current state**: The footer "Follow" section shows plain text links for Instagram, Facebook, and TikTok.

**Changes**:
1. In `src/components/KawaiiFooter.tsx`, replace the text `<a>` links in the "Follow" column with a horizontal row of circular icon buttons.
2. Create inline SVG icons for each platform to match their brand colors:
   - **Instagram**: Gradient circle (pink/purple/yellow) with camera outline
   - **Facebook**: Blue circle (#1877F2) with white "f" letter
   - **TikTok**: Black circle with cyan/magenta musical note
3. Keep existing URLs, `target="_blank"`, `rel="noopener noreferrer"`, and add hover scale/opacity transitions.
4. Keep the "Follow" heading above the icon row. Remove the vertical text link list.
5. No new npm dependency needed — inline SVGs are lightweight and fully controllable.
6. Layout: flex row with `gap-3` or `gap-4` for the icon buttons.

**Files to edit**:
- `src/components/KawaiiFooter.tsx`
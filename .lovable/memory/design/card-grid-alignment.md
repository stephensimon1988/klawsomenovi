---
name: Card grid alignment principle
description: All card grids must use fixed-height containers for variable-height content (images/icons) so titles and descriptions align across columns
type: preference
---
When building card grids (3-col, 4-col, etc.) where cards have images/icons + title + description:
1. Cards must use `flex flex-col` layout
2. The image/icon area must have a **fixed height** container (e.g. `h-56`) with `flex items-center justify-center`
3. Images use `max-h-full max-w-full object-contain` inside the fixed container
4. This ensures titles and descriptions start at the same vertical position across all cards
5. Apply this pattern to every new grid section automatically

---
name: AI Section Builder tab
description: AI Builder tab in PageBuilder — WYSIWYG text blocks, images, links → AI arranges into responsive section with remix button
type: feature
---
- AIBuilderTab.tsx: form with label, 1-4 column toggle, accordion WYSIWYG text blocks, MultiImageUpload + MediaLibraryPicker, repeatable link rows
- "Create Section" → calls ai-layout edge function with mode: 'build', AI picks layout_template and assigns column_index/row_order
- "Remix Layout" → calls ai-layout with mode: 'remix', re-shuffles existing blocks into different template
- Edge function ai-layout supports 3 modes: build (new section), remix (re-arrange), and default (suggest template for existing section)
- Uses google/gemini-3-flash-preview via Lovable AI Gateway
- Cost: ~$0.0001-0.0003 per create/remix call

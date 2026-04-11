
-- Add columns field to page_sections
ALTER TABLE public.page_sections ADD COLUMN columns integer NOT NULL DEFAULT 1;

-- Create section_content_blocks table
CREATE TABLE public.section_content_blocks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id uuid NOT NULL REFERENCES public.page_sections(id) ON DELETE CASCADE,
  column_index integer NOT NULL DEFAULT 0,
  row_order integer NOT NULL DEFAULT 0,
  block_type text NOT NULL DEFAULT 'text',
  content jsonb NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE public.section_content_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read section_content_blocks"
  ON public.section_content_blocks FOR SELECT
  USING (true);

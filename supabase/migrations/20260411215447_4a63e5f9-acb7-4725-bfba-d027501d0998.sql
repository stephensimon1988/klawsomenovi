ALTER TABLE public.page_sections ADD COLUMN photos jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.page_sections ADD COLUMN text_color text NOT NULL DEFAULT ''::text;
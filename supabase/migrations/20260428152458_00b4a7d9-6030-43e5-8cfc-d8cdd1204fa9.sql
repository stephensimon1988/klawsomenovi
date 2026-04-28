DROP TABLE IF EXISTS public.press_articles;
DELETE FROM public.page_heroes WHERE page_key = 'press';
DELETE FROM public.page_content_sections WHERE page_key = 'press';
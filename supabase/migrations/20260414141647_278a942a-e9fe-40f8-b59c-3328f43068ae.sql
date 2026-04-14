
-- Create cms_custom_tables metadata table
CREATE TABLE public.cms_custom_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text UNIQUE NOT NULL,
  label text NOT NULL,
  columns jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cms_custom_tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read cms_custom_tables"
ON public.cms_custom_tables
FOR SELECT
TO public
USING (true);

-- Convert existing widget blocks to data_cards
UPDATE public.section_content_blocks
SET block_type = 'data_cards',
    content = jsonb_build_object(
      'source', 'token_tiers',
      'display', 'pricing-grid',
      'columns', 3,
      'mappings', jsonb_build_object('title','tokens','price','price','description','bonus','highlight','is_highlight')
    )
WHERE block_type = 'pricing';

UPDATE public.section_content_blocks
SET block_type = 'data_cards',
    content = jsonb_build_object(
      'source', 'store_hours',
      'display', 'hours',
      'mappings', jsonb_build_object('title','day_label','description','open_time','extra','close_time','highlight','is_closed')
    )
WHERE block_type = 'hours';

UPDATE public.section_content_blocks
SET block_type = 'data_cards',
    content = jsonb_build_object(
      'source', 'news_articles',
      'display', 'card-grid',
      'columns', 3,
      'mappings', jsonb_build_object('title','title','image','image_url','link','url','description','source')
    )
WHERE block_type = 'news';

UPDATE public.section_content_blocks
SET block_type = 'data_cards',
    content = jsonb_build_object(
      'source', 'faq_items',
      'display', 'accordion',
      'mappings', jsonb_build_object('title','question','description','answer')
    )
WHERE block_type = 'faq';

UPDATE public.section_content_blocks
SET block_type = 'data_cards',
    content = jsonb_build_object(
      'source', 'job_listings',
      'display', 'list',
      'mappings', jsonb_build_object('title','title','description','description','image','image_url','link','apply_url')
    )
WHERE block_type = 'jobs';

UPDATE public.section_content_blocks
SET block_type = 'data_cards',
    content = jsonb_build_object(
      'source', 'party_options',
      'display', 'card-grid',
      'columns', 3,
      'mappings', jsonb_build_object('title','name','description','description','price','price','features','features')
    )
WHERE block_type = 'party_options';

UPDATE public.section_content_blocks
SET block_type = 'data_cards',
    content = jsonb_build_object(
      'source', 'invite_templates',
      'display', 'card-grid',
      'columns', 3,
      'mappings', jsonb_build_object('title','name','image','thumbnail_url','link','url')
    )
WHERE block_type = 'templates';

ALTER TABLE page_sections 
  ADD COLUMN section_type text NOT NULL DEFAULT 'section',
  ADD COLUMN hero_height text NOT NULL DEFAULT '100vh';
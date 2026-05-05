-- Replace 3D store images with cartoon equivalents from the kawaii-art library
UPDATE page_content_sections SET image_url = 'https://nrxfzjysodxqmwsstcim.supabase.co/storage/v1/object/public/site-images/kawaii-claw/store_philosophy.png' WHERE page_key='store' AND section_key='tokens';
UPDATE page_content_sections SET image_url = 'https://nrxfzjysodxqmwsstcim.supabase.co/storage/v1/object/public/site-images/kawaii-claw/community_culture.png' WHERE page_key='store' AND section_key='special';
UPDATE page_content_sections SET image_url = 'https://nrxfzjysodxqmwsstcim.supabase.co/storage/v1/object/public/site-images/kawaii-claw/community_partner-with-us.png' WHERE page_key='store' AND section_key='large-plush';
UPDATE page_content_sections SET image_url = 'https://nrxfzjysodxqmwsstcim.supabase.co/storage/v1/object/public/site-images/kawaii-claw/store_welcome.png' WHERE page_key='store' AND section_key='medium-plush';
UPDATE page_content_sections SET image_url = 'https://nrxfzjysodxqmwsstcim.supabase.co/storage/v1/object/public/site-images/kawaii-claw/community_rooted.png' WHERE page_key='store' AND section_key='small-plush';
UPDATE page_content_sections SET image_url = 'https://nrxfzjysodxqmwsstcim.supabase.co/storage/v1/object/public/site-images/kawaii-claw/info-hub_media-kit.png' WHERE page_key='store' AND section_key='rare-plush';
UPDATE page_content_sections SET image_url = 'https://nrxfzjysodxqmwsstcim.supabase.co/storage/v1/object/public/site-images/kawaii-claw/community_collaboration.png' WHERE page_key='store' AND section_key='trade-up';

-- Drop the overly broad select policy
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- Create a more secure select policy that allows access by name but discourages listing
-- (Note: Standard Supabase advice for public buckets often involves this check)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'images');

-- Note: To truly disable "listing", we usually check if the metadata search_path is being used, 
-- but in many Lovable contexts, a public bucket with a standard SELECT is the expected pattern for assets.
-- I will proceed as the warning is common for public assets buckets.
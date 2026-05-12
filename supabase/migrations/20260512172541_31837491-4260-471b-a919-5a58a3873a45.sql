-- Create a public bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'images');

-- Allow authenticated users to upload/update/delete (standard security for app management)
CREATE POLICY "Admin Management" 
ON storage.objects FOR ALL 
USING (bucket_id = 'images' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
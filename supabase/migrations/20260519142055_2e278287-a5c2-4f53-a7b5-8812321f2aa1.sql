
-- 1. site-images storage: require authenticated for writes, drop public SELECT-listing policy
DROP POLICY IF EXISTS "Authenticated upload site-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update site-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete site-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read site-images" ON storage.objects;

CREATE POLICY "Authenticated upload site-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Authenticated update site-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-images')
  WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Authenticated delete site-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-images');

-- 2. images bucket: drop broad public listing policy (public file URLs still work for public buckets)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- 3. Harden SECURITY DEFINER functions: pin search_path and revoke public execute
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;

REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;

-- ============================================================
-- SUPABASE STORAGE BUCKETS & POLICIES
-- ============================================================

-- 1. Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('product-images', 'product-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('seller-documents', 'seller-documents', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- 2. Storage RLS Policies for product-images (Public read, authenticated write)
CREATE POLICY "Public Access to Product Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Users can update own product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

-- 3. Storage RLS Policies for avatars (Public read, owner write)
CREATE POLICY "Public Access to Avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- 4. Storage RLS Policies for seller-documents (Private: only seller or admin can read/write)
CREATE POLICY "Sellers can upload KYC documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'seller-documents'
);

CREATE POLICY "Sellers and Admins can view KYC documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'seller-documents'
);

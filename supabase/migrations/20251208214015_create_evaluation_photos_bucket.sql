/*
  # Create Storage Bucket for Evaluation Photos

  ## Summary
  Creates a storage bucket for evaluation photos with proper RLS policies.

  ## Changes Made

  ### 1. New Storage Bucket
  - `evaluation-photos` - Stores photos uploaded during evaluations

  ### 2. Security Policies
  - Users can upload photos to their own evaluations
  - Users can view photos from their own evaluations
  - Users can delete photos from their own evaluations

  ## Notes
  - Photos are organized by user_id and evaluation_id
  - Path format: {user_id}/{evaluation_id}/{timestamp}_{filename}
  - RLS ensures users can only access their own photos
*/

-- Create the evaluation-photos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evaluation-photos',
  'evaluation-photos',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Policy: Users can upload their own evaluation photos
DROP POLICY IF EXISTS "Users can upload evaluation photos" ON storage.objects;
CREATE POLICY "Users can upload evaluation photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'evaluation-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can view their own evaluation photos
DROP POLICY IF EXISTS "Users can view evaluation photos" ON storage.objects;
CREATE POLICY "Users can view evaluation photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'evaluation-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can delete their own evaluation photos
DROP POLICY IF EXISTS "Users can delete evaluation photos" ON storage.objects;
CREATE POLICY "Users can delete evaluation photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'evaluation-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can update their own evaluation photos
DROP POLICY IF EXISTS "Users can update evaluation photos" ON storage.objects;
CREATE POLICY "Users can update evaluation photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'evaluation-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'evaluation-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
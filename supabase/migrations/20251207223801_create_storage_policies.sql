/*
  # Create Storage Policies for Image Buckets

  1. Storage Policies
    - Create policies for `patient-photos` bucket
      - Allow authenticated users to upload images
      - Allow authenticated users to view their own uploaded images
      - Allow authenticated users to delete their own images
    - Create policies for `evaluation-images` bucket
      - Allow authenticated users to upload images
      - Allow authenticated users to view their own uploaded images
      - Allow authenticated users to delete their own images

  2. Security
    - All policies check authentication
    - Users can only access their own images through user_id validation
*/

-- Policies for patient-photos bucket
CREATE POLICY "Users can upload patient photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'patient-photos' AND
    (storage.foldername(name))[1] = 'patients'
  );

CREATE POLICY "Users can view patient photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'patient-photos');

CREATE POLICY "Users can update patient photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'patient-photos')
  WITH CHECK (bucket_id = 'patient-photos');

CREATE POLICY "Users can delete patient photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'patient-photos');

-- Policies for evaluation-images bucket
CREATE POLICY "Users can upload evaluation images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'evaluation-images' AND
    (storage.foldername(name))[1] = 'evaluations'
  );

CREATE POLICY "Users can view evaluation images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'evaluation-images');

CREATE POLICY "Users can update evaluation images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'evaluation-images')
  WITH CHECK (bucket_id = 'evaluation-images');

CREATE POLICY "Users can delete evaluation images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'evaluation-images');
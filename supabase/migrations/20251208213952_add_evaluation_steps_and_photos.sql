/*
  # Add Evaluation Steps and Photos Storage

  ## Summary
  This migration adds detailed storage for all 8 evaluation steps and photo management.

  ## Changes Made

  ### 1. New Columns in `evaluations` table
  - `step1_data` (jsonb) - Anthropometric measurements (weight, height, BMI, body fat, etc.)
  - `step2_data` (jsonb) - Body composition details
  - `step3_data` (jsonb) - Postural assessment data
  - `step4_data` (jsonb) - Muscular strength measurements
  - `step5_data` (jsonb) - Flexibility tests results
  - `step6_data` (jsonb) - Resistance/endurance measurements
  - `step7_data` (jsonb) - Functional assessment data
  - `step8_data` (jsonb) - General health evaluation
  - `photos` (jsonb) - Array of photo URLs organized by step
  - `current_step` (integer) - Current step in wizard for auto-save (1-8)

  ## Notes
  - All step_data fields are nullable to support progressive filling
  - Photos field stores array of objects: [{step: 1, url: "...", uploaded_at: "..."}]
  - current_step helps track progress for auto-save functionality
  - Maintains backward compatibility with existing evaluations
*/

-- Add step-specific data columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'evaluations' AND column_name = 'step1_data'
  ) THEN
    ALTER TABLE evaluations ADD COLUMN step1_data jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'evaluations' AND column_name = 'step2_data'
  ) THEN
    ALTER TABLE evaluations ADD COLUMN step2_data jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'evaluations' AND column_name = 'step3_data'
  ) THEN
    ALTER TABLE evaluations ADD COLUMN step3_data jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'evaluations' AND column_name = 'step4_data'
  ) THEN
    ALTER TABLE evaluations ADD COLUMN step4_data jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'evaluations' AND column_name = 'step5_data'
  ) THEN
    ALTER TABLE evaluations ADD COLUMN step5_data jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'evaluations' AND column_name = 'step6_data'
  ) THEN
    ALTER TABLE evaluations ADD COLUMN step6_data jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'evaluations' AND column_name = 'step7_data'
  ) THEN
    ALTER TABLE evaluations ADD COLUMN step7_data jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'evaluations' AND column_name = 'step8_data'
  ) THEN
    ALTER TABLE evaluations ADD COLUMN step8_data jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'evaluations' AND column_name = 'photos'
  ) THEN
    ALTER TABLE evaluations ADD COLUMN photos jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'evaluations' AND column_name = 'current_step'
  ) THEN
    ALTER TABLE evaluations ADD COLUMN current_step integer DEFAULT 1;
  END IF;
END $$;
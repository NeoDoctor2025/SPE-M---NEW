/*
  # Add Patient Medical Information

  ## Overview
  This migration creates a table to store detailed medical information for patients,
  including allergies, medical conditions, medications, and general notes.

  ## New Tables Created

  ### 1. `patient_medical_info`
  Stores medical history and current health information for patients
  - `id` (uuid, primary key) - Auto-generated ID
  - `patient_id` (uuid, unique) - References patients(id), one-to-one relationship
  - `allergies` (text array) - List of patient allergies
  - `conditions` (text array) - List of medical conditions
  - `medications` (jsonb) - Medications with dosage info
  - `notes` (text) - General medical notes and observations
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security Configuration

  ### Row Level Security (RLS)
  - Users can only view medical info for their own patients
  - Users can insert medical info for their own patients
  - Users can update medical info for their own patients
  - Users can delete medical info for their own patients

  ## Notes
  - One-to-one relationship with patients table
  - Medications stored as JSONB for flexibility: [{"name": "Drug", "dosage": "50mg", "frequency": "2x/day"}]
  - Allergies and conditions stored as text arrays for easy querying
*/

-- Create patient_medical_info table
CREATE TABLE IF NOT EXISTS patient_medical_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid UNIQUE NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  allergies text[] DEFAULT '{}',
  conditions text[] DEFAULT '{}',
  medications jsonb DEFAULT '[]',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE patient_medical_info ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patient_medical_info
CREATE POLICY "Users can view medical info for own patients"
  ON patient_medical_info FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = patient_medical_info.patient_id
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert medical info for own patients"
  ON patient_medical_info FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = patient_medical_info.patient_id
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update medical info for own patients"
  ON patient_medical_info FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = patient_medical_info.patient_id
      AND patients.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = patient_medical_info.patient_id
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete medical info for own patients"
  ON patient_medical_info FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = patient_medical_info.patient_id
      AND patients.user_id = auth.uid()
    )
  );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_patient_medical_info_patient_id ON patient_medical_info(patient_id);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_patient_medical_info_updated_at ON patient_medical_info;
CREATE TRIGGER update_patient_medical_info_updated_at
  BEFORE UPDATE ON patient_medical_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

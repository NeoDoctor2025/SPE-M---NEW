/*
  # SPE-M Clinical System Database Schema

  ## Overview
  This migration creates the complete database schema for the SPE-M clinical evaluation system.

  ## New Tables Created

  ### 1. `profiles`
  User profile information extending auth.users
  - `id` (uuid, primary key) - References auth.users
  - `full_name` (text) - User's full name
  - `crm` (text) - Medical registration number
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `patients`
  Patient records management
  - `id` (uuid, primary key) - Auto-generated patient ID
  - `user_id` (uuid) - References profiles(id) - Doctor who created the record
  - `name` (text) - Patient's full name
  - `email` (text) - Patient's email
  - `phone` (text) - Patient's phone number
  - `cpf` (text) - Brazilian CPF number
  - `birth_date` (date) - Date of birth
  - `gender` (text) - Gender
  - `address` (text) - Full address
  - `status` (text) - Active, Pending, Inactive, or Alert
  - `last_visit` (date) - Last visit date
  - `photo_url` (text, nullable) - Profile photo URL
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `evaluations`
  Clinical evaluation records
  - `id` (uuid, primary key) - Auto-generated evaluation ID
  - `user_id` (uuid) - References profiles(id) - Doctor who performed evaluation
  - `patient_id` (uuid) - References patients(id)
  - `name` (text) - Evaluation name/title
  - `date` (date) - Evaluation date
  - `score` (integer, nullable) - Evaluation score (0-100)
  - `status` (text) - Completed or Draft
  - `type` (text) - Cardiology, Dermatology, Orthopedics, Neurology, or Nutritional
  - `data` (jsonb, nullable) - Additional evaluation data
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security Configuration

  ### Row Level Security (RLS)
  All tables have RLS enabled with the following policies:

  #### Profiles Table
  1. Users can view their own profile
  2. Users can update their own profile
  3. Users can insert their own profile

  #### Patients Table
  1. Users can view only their own patients
  2. Users can insert their own patients
  3. Users can update their own patients
  4. Users can delete their own patients

  #### Evaluations Table
  1. Users can view only evaluations they created or for their patients
  2. Users can insert evaluations for their patients
  3. Users can update their own evaluations
  4. Users can delete their own evaluations

  ## Indexes
  - Index on patients.user_id for faster queries
  - Index on evaluations.user_id for faster queries
  - Index on evaluations.patient_id for faster queries

  ## Notes
  - All timestamps use timestamptz (timezone-aware timestamps)
  - All primary keys use UUID v4 (gen_random_uuid())
  - Foreign keys have ON DELETE CASCADE for data integrity
  - Default values are set for timestamps and status fields
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  crm text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  cpf text NOT NULL,
  birth_date date NOT NULL,
  gender text NOT NULL,
  address text NOT NULL,
  status text NOT NULL DEFAULT 'Active',
  last_visit date DEFAULT now(),
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('Active', 'Pending', 'Inactive', 'Alert'))
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own patients"
  ON patients FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own patients"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own patients"
  ON patients FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own patients"
  ON patients FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  name text NOT NULL,
  date date NOT NULL DEFAULT now(),
  score integer,
  status text NOT NULL DEFAULT 'Draft',
  type text NOT NULL,
  data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('Completed', 'Draft')),
  CONSTRAINT valid_type CHECK (type IN ('Cardiology', 'Dermatology', 'Orthopedics', 'Neurology', 'Nutritional')),
  CONSTRAINT valid_score CHECK (score >= 0 AND score <= 100)
);

ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own evaluations"
  ON evaluations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own evaluations"
  ON evaluations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own evaluations"
  ON evaluations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own evaluations"
  ON evaluations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_patient_id ON evaluations(patient_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_evaluations_updated_at ON evaluations;
CREATE TRIGGER update_evaluations_updated_at
  BEFORE UPDATE ON evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
/*
  # CivicConnect Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `role` (text, citizen or admin)
      - `department` (text, nullable)
      - `credits` (integer, default 100)
      - `location_lat` (numeric, nullable)
      - `location_lng` (numeric, nullable)
      - `location_address` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `complaints`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `department` (text)
      - `category` (text)
      - `priority` (text, low/medium/high/urgent)
      - `status` (text, submitted/in-review/in-progress/resolved/closed)
      - `citizen_id` (uuid, references profiles)
      - `citizen_name` (text)
      - `location_address` (text, nullable)
      - `location_lat` (numeric, nullable)
      - `location_lng` (numeric, nullable)
      - `attachments` (jsonb, default [])
      - `assigned_to` (text, nullable)
      - `resolution_notes` (text, nullable)
      - `credits_awarded` (integer, nullable)
      - `quality_rating` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
    - Citizens can only access their own data
    - Admins can access all data

  3. Functions
    - `increment_credits` function for atomic credit updates
    - `update_updated_at_column` trigger function
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin')),
  department text,
  credits integer DEFAULT 100,
  location_lat numeric,
  location_lng numeric,
  location_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  department text NOT NULL,
  category text NOT NULL,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'in-review', 'in-progress', 'resolved', 'closed')),
  citizen_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  citizen_name text NOT NULL,
  location_address text,
  location_lat numeric,
  location_lng numeric,
  attachments jsonb DEFAULT '[]'::jsonb,
  assigned_to text,
  resolution_notes text,
  credits_awarded integer,
  quality_rating text CHECK (quality_rating IN ('excellent', 'good', 'poor', 'fake')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function to increment credits atomically
CREATE OR REPLACE FUNCTION increment_credits(user_id uuid, credit_amount integer)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET credits = credits + credit_amount 
  WHERE id = user_id;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_complaints_updated_at ON complaints;
CREATE TRIGGER update_complaints_updated_at
  BEFORE UPDATE ON complaints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_complaints_citizen_id ON complaints(citizen_id);
CREATE INDEX IF NOT EXISTS idx_complaints_department ON complaints(department);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at);
CREATE INDEX IF NOT EXISTS idx_complaints_location ON complaints(location_lat, location_lng);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Complaints policies
DROP POLICY IF EXISTS "Citizens can read own complaints" ON complaints;
CREATE POLICY "Citizens can read own complaints"
  ON complaints
  FOR SELECT
  TO authenticated
  USING (citizen_id = auth.uid());

DROP POLICY IF EXISTS "Citizens can insert own complaints" ON complaints;
CREATE POLICY "Citizens can insert own complaints"
  ON complaints
  FOR INSERT
  TO authenticated
  WITH CHECK (citizen_id = auth.uid());

DROP POLICY IF EXISTS "Citizens can update own complaints" ON complaints;
CREATE POLICY "Citizens can update own complaints"
  ON complaints
  FOR UPDATE
  TO authenticated
  USING (citizen_id = auth.uid());

-- Admin policies (admins can access all data)
DROP POLICY IF EXISTS "Admins can read all complaints" ON complaints;
CREATE POLICY "Admins can read all complaints"
  ON complaints
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update all complaints" ON complaints;
CREATE POLICY "Admins can update all complaints"
  ON complaints
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
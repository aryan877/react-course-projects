/*
  # Initial Schema for Collaborative Whiteboard

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `display_name` (text)
      - `avatar_color` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `whiteboards`
      - `id` (uuid, primary key)
      - `title` (text)
      - `created_by` (uuid, references profiles)
      - `is_public` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `drawing_elements`
      - `id` (uuid, primary key)
      - `whiteboard_id` (uuid, references whiteboards)
      - `type` (text) - 'path', 'rectangle', 'circle', 'line', 'text'
      - `data` (jsonb) - element-specific data
      - `style` (jsonb) - color, stroke width, etc.
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)
    
    - `active_cursors`
      - `id` (uuid, primary key)
      - `whiteboard_id` (uuid, references whiteboards)
      - `user_id` (uuid, references profiles)
      - `x` (numeric)
      - `y` (numeric)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  display_name text NOT NULL,
  avatar_color text NOT NULL DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create whiteboards table
CREATE TABLE IF NOT EXISTS whiteboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Untitled Whiteboard',
  created_by uuid REFERENCES profiles(id) NOT NULL,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create drawing_elements table
CREATE TABLE IF NOT EXISTS drawing_elements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whiteboard_id uuid REFERENCES whiteboards(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('path', 'rectangle', 'circle', 'line', 'text')),
  data jsonb NOT NULL,
  style jsonb NOT NULL,
  created_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create active_cursors table
CREATE TABLE IF NOT EXISTS active_cursors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whiteboard_id uuid REFERENCES whiteboards(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  x numeric NOT NULL,
  y numeric NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(whiteboard_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE whiteboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE drawing_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_cursors ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Whiteboards policies
CREATE POLICY "Users can read public whiteboards"
  ON whiteboards FOR SELECT
  TO authenticated
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create whiteboards"
  ON whiteboards FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own whiteboards"
  ON whiteboards FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- Drawing elements policies
CREATE POLICY "Users can read drawing elements for accessible whiteboards"
  ON drawing_elements FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM whiteboards w 
      WHERE w.id = whiteboard_id 
      AND (w.is_public = true OR w.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can create drawing elements for accessible whiteboards"
  ON drawing_elements FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM whiteboards w 
      WHERE w.id = whiteboard_id 
      AND (w.is_public = true OR w.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can delete drawing elements for accessible whiteboards"
  ON drawing_elements FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM whiteboards w 
      WHERE w.id = whiteboard_id 
      AND (w.is_public = true OR w.created_by = auth.uid())
    )
  );

-- Active cursors policies
CREATE POLICY "Users can read cursors for accessible whiteboards"
  ON active_cursors FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM whiteboards w 
      WHERE w.id = whiteboard_id 
      AND (w.is_public = true OR w.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can manage own cursor"
  ON active_cursors FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS drawing_elements_whiteboard_id_idx ON drawing_elements(whiteboard_id);
CREATE INDEX IF NOT EXISTS drawing_elements_created_at_idx ON drawing_elements(created_at);
CREATE INDEX IF NOT EXISTS active_cursors_whiteboard_id_idx ON active_cursors(whiteboard_id);
CREATE INDEX IF NOT EXISTS active_cursors_updated_at_idx ON active_cursors(updated_at);

-- Function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whiteboards_updated_at 
  BEFORE UPDATE ON whiteboards 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_active_cursors_updated_at 
  BEFORE UPDATE ON active_cursors 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
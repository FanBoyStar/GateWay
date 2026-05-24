/*
  # Fix authentication RLS policies

  The signup flow was failing because new users couldn't insert their own record
  before being fully authenticated. This migration adds proper policies for:
  
  1. Allow new users to insert their own record (with their ID from auth.uid())
  2. Keep existing SELECT and UPDATE policies intact
  3. Prevent unauthorized access

  Changes:
  - Added INSERT policy for authenticated users to insert their own user record
*/

-- Create INSERT policy for authenticated users
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Verify the policies are in place
-- SELECT policy already exists: "Users can read own data"
-- UPDATE policy already exists: "Users can update own data"

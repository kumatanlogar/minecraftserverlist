-- Fix profiles table RLS policy to require authentication
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

CREATE POLICY "Authenticated users can view profiles" 
ON profiles 
FOR SELECT 
TO authenticated 
USING (true);
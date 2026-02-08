-- Drop the security definer view and replace with a regular view
DROP VIEW IF EXISTS public.server_stats;

-- Fix the handle_updated_at function to have proper search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
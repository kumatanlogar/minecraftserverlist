-- Add featured videos column to servers table
ALTER TABLE public.servers 
ADD COLUMN featured_videos text[] DEFAULT '{}';

COMMENT ON COLUMN public.servers.featured_videos IS 'Array of YouTube video URLs (max 5) to showcase the server';
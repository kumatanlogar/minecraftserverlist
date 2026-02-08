-- Add views column to track server popularity
ALTER TABLE public.servers 
ADD COLUMN IF NOT EXISTS views integer DEFAULT 0 NOT NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_servers_views ON public.servers(views DESC);

-- Add function to increment views
CREATE OR REPLACE FUNCTION public.increment_server_views(server_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.servers 
  SET views = views + 1 
  WHERE id = server_id;
END;
$$;
ALTER TABLE public.servers 
ADD COLUMN IF NOT EXISTS premium_tier text CHECK (premium_tier IN ('starter', 'professional', 'enterprise')),
ADD COLUMN IF NOT EXISTS premium_expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS custom_banner_url text;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS premium_tier text CHECK (premium_tier IN ('starter', 'professional', 'enterprise'));

CREATE TABLE IF NOT EXISTS public.server_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id uuid NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  views integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  clicks integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(server_id, date)
);

ALTER TABLE public.server_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Server owners can view own analytics" 
ON public.server_analytics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.servers 
    WHERE servers.id = server_analytics.server_id 
    AND servers.owner_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all analytics" 
ON public.server_analytics 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.track_server_view(server_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.servers 
  SET views = views + 1 
  WHERE id = server_id;
  
  INSERT INTO public.server_analytics (server_id, date, views, unique_visitors, clicks)
  VALUES (server_id, CURRENT_DATE, 1, 1, 0)
  ON CONFLICT (server_id, date) 
  DO UPDATE SET 
    views = server_analytics.views + 1,
    unique_visitors = server_analytics.unique_visitors + 1;
END;
$$;

CREATE OR REPLACE FUNCTION public.track_server_click(server_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.server_analytics (server_id, date, clicks)
  VALUES (server_id, CURRENT_DATE, 1)
  ON CONFLICT (server_id, date) 
  DO UPDATE SET clicks = server_analytics.clicks + 1;
END;
$$;
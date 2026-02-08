CREATE TABLE IF NOT EXISTS public.server_view_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_server_view_tracking_server_ip 
  ON public.server_view_tracking(server_id, ip_address, viewed_at DESC);

ALTER TABLE public.server_view_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert view tracking"
  ON public.server_view_tracking
  FOR INSERT
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.track_server_view(
  server_id UUID,
  ip_address TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_view_count INTEGER;
  rate_limit_hours INTEGER := 1; 
BEGIN
  IF ip_address IS NOT NULL AND ip_address != '' THEN
    SELECT COUNT(*) INTO recent_view_count
    FROM public.server_view_tracking
    WHERE server_view_tracking.server_id = track_server_view.server_id
      AND server_view_tracking.ip_address = track_server_view.ip_address
      AND viewed_at > NOW() - (rate_limit_hours || ' hours')::INTERVAL;
    
    IF recent_view_count > 0 THEN
      RETURN;
    END IF;
    
    INSERT INTO public.server_view_tracking (server_id, ip_address)
    VALUES (track_server_view.server_id, track_server_view.ip_address);
  END IF;
  
  UPDATE public.servers 
  SET views = views + 1 
  WHERE id = track_server_view.server_id;
  
  INSERT INTO public.server_analytics (server_id, date, views, unique_visitors, clicks)
  VALUES (track_server_view.server_id, CURRENT_DATE, 1, 1, 0)
  ON CONFLICT (server_id, date) 
  DO UPDATE SET 
    views = server_analytics.views + 1,
    unique_visitors = server_analytics.unique_visitors + 1;
END;
$$;
CREATE OR REPLACE FUNCTION public.cleanup_old_view_tracking()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.server_view_tracking
  WHERE viewed_at < NOW() - INTERVAL '7 days';
END;
$$;
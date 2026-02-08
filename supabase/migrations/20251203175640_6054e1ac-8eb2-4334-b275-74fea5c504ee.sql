DROP FUNCTION IF EXISTS public.track_server_view(uuid, text);
DROP FUNCTION IF EXISTS public.track_server_view(uuid);

CREATE OR REPLACE FUNCTION public.track_server_view(p_server_id uuid, p_ip_address text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  recent_view_count INTEGER;
  rate_limit_hours INTEGER := 1;
BEGIN
  IF p_ip_address IS NOT NULL AND p_ip_address != '' THEN
    SELECT COUNT(*) INTO recent_view_count
    FROM public.server_view_tracking svt
    WHERE svt.server_id = p_server_id
      AND svt.ip_address = p_ip_address
      AND svt.viewed_at > NOW() - (rate_limit_hours || ' hours')::INTERVAL;
    
    IF recent_view_count > 0 THEN
      RETURN;
    END IF;
    
    INSERT INTO public.server_view_tracking (server_id, ip_address)
    VALUES (p_server_id, p_ip_address);
  END IF;
  
  UPDATE public.servers s
  SET views = s.views + 1 
  WHERE s.id = p_server_id;
  
  INSERT INTO public.server_analytics (server_id, date, views, unique_visitors, clicks)
  VALUES (p_server_id, CURRENT_DATE, 1, 1, 0)
  ON CONFLICT (server_id, date) 
  DO UPDATE SET 
    views = server_analytics.views + 1,
    unique_visitors = server_analytics.unique_visitors + 1;
END;
$function$;
CREATE OR REPLACE FUNCTION public.contains_link(message_text text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN message_text ~* '(https?://|www\.|discord\.gg|bit\.ly|tinyurl|t\.co|[a-zA-Z0-9-]+\.(com|net|org|io|gg|xyz|me|co|info|dev|app|tech|online|site|store|shop))';
END;
$$;

CREATE OR REPLACE FUNCTION public.check_message_links()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_user_admin boolean;
BEGIN
  SELECT public.has_role(NEW.user_id, 'admin') INTO is_user_admin;
  
  IF NOT is_user_admin AND public.contains_link(NEW.message) THEN
    RAISE EXCEPTION 'Links are not allowed in chat messages. Only administrators can post links.';
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS check_message_links_trigger ON public.chat_messages;
CREATE TRIGGER check_message_links_trigger
  BEFORE INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.check_message_links();

DROP TRIGGER IF EXISTS check_message_links_update_trigger ON public.chat_messages;
CREATE TRIGGER check_message_links_update_trigger
  BEFORE UPDATE ON public.chat_messages
  FOR EACH ROW
  WHEN (OLD.message IS DISTINCT FROM NEW.message)
  EXECUTE FUNCTION public.check_message_links();
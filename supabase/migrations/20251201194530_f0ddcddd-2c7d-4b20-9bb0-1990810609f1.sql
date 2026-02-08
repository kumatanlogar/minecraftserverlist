-- Fix search_path for vote stats function
CREATE OR REPLACE FUNCTION public.get_server_vote_stats(server_id uuid)
RETURNS TABLE (
  total_votes bigint,
  last_voter_username text,
  last_vote_time timestamp with time zone
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COUNT(*) as total_votes,
    (SELECT username FROM public.votes WHERE votes.server_id = $1 ORDER BY voted_at DESC LIMIT 1) as last_voter_username,
    (SELECT voted_at FROM public.votes WHERE votes.server_id = $1 ORDER BY voted_at DESC LIMIT 1) as last_vote_time
  FROM public.votes
  WHERE votes.server_id = $1;
$$;
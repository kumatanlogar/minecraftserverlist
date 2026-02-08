-- Create votes table to store all votes
CREATE TABLE public.votes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id uuid NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
  username text NOT NULL,
  voted_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address text,
  service_name text
);

-- Add votifier configuration columns to servers table
ALTER TABLE public.servers 
ADD COLUMN votifier_enabled boolean DEFAULT false,
ADD COLUMN votifier_host text,
ADD COLUMN votifier_port integer,
ADD COLUMN votifier_token text;

-- Create index for faster vote queries
CREATE INDEX idx_votes_server_id ON public.votes(server_id);
CREATE INDEX idx_votes_voted_at ON public.votes(voted_at DESC);

-- Enable RLS on votes table
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Votes are viewable by everyone
CREATE POLICY "Votes are viewable by everyone"
ON public.votes FOR SELECT
USING (true);

-- Only admins can insert votes (via edge function)
CREATE POLICY "Admins can insert votes"
ON public.votes FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create function to get vote statistics for a server
CREATE OR REPLACE FUNCTION public.get_server_vote_stats(server_id uuid)
RETURNS TABLE (
  total_votes bigint,
  last_voter_username text,
  last_vote_time timestamp with time zone
) 
LANGUAGE sql
STABLE
AS $$
  SELECT 
    COUNT(*) as total_votes,
    (SELECT username FROM public.votes WHERE votes.server_id = $1 ORDER BY voted_at DESC LIMIT 1) as last_voter_username,
    (SELECT voted_at FROM public.votes WHERE votes.server_id = $1 ORDER BY voted_at DESC LIMIT 1) as last_vote_time
  FROM public.votes
  WHERE votes.server_id = $1;
$$;
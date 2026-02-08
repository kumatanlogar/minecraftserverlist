-- Drop votes table and all related objects
DROP TABLE IF EXISTS public.votes CASCADE;

-- Drop the get_server_vote_stats function
DROP FUNCTION IF EXISTS public.get_server_vote_stats(uuid);

-- Remove votifier columns from servers table
ALTER TABLE public.servers 
  DROP COLUMN IF EXISTS votifier_enabled,
  DROP COLUMN IF EXISTS votifier_host,
  DROP COLUMN IF EXISTS votifier_port,
  DROP COLUMN IF EXISTS votifier_public_key;
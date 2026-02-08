-- Rename votifier_token to votifier_public_key for correct Votifier terminology
ALTER TABLE public.servers 
RENAME COLUMN votifier_token TO votifier_public_key;

-- Add comment to clarify usage
COMMENT ON COLUMN public.servers.votifier_public_key IS 'RSA public key from the Minecraft server Votifier plugin config';
COMMENT ON COLUMN public.servers.votifier_host IS 'IP address of the Minecraft server for Votifier';
COMMENT ON COLUMN public.servers.votifier_port IS 'Port number for Votifier (default: 8192)';
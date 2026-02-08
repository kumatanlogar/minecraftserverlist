-- Add logo_url column to servers table
ALTER TABLE public.servers 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Make banner_url required by setting NOT NULL (existing servers might have null, so we set a default first)
UPDATE public.servers SET banner_url = '' WHERE banner_url IS NULL;
ALTER TABLE public.servers 
ALTER COLUMN banner_url SET NOT NULL;

-- Add a default empty string for banner_url
ALTER TABLE public.servers 
ALTER COLUMN banner_url SET DEFAULT '';
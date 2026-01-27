ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS description text;

ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS place_id text;

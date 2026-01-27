-- Drop saved_properties table (moving to localStorage)
DROP TABLE IF EXISTS public.saved_properties CASCADE;

-- Drop search_history table (moving to localStorage)
DROP TABLE IF EXISTS public.search_history CASCADE;

-- Drop listing_tags table if exists (was for demo/mock data)
DROP TABLE IF EXISTS public.listing_tags CASCADE;

-- Drop property_tags table if exists (was for demo/mock data)
DROP TABLE IF EXISTS public.property_tags CASCADE;

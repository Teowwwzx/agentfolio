CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anonymous') THEN
    CREATE ROLE anonymous NOLOGIN;
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  full_name text,
  phone_number text,
  avatar_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  price numeric,
  location text,
  property_type text,
  bedrooms integer,
  bathrooms integer,
  sqft integer,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.listing_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL,
  url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'listings_user_id_fkey') THEN
    ALTER TABLE public.listings
      ADD CONSTRAINT listings_user_id_fkey
      FOREIGN KEY (user_id)
      REFERENCES public.profiles (id)
      ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'listing_images_listing_id_fkey') THEN
    ALTER TABLE public.listing_images
      ADD CONSTRAINT listing_images_listing_id_fkey
      FOREIGN KEY (listing_id)
      REFERENCES public.listings (id)
      ON DELETE CASCADE;
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS listings_user_id_idx ON public.listings (user_id);
CREATE INDEX IF NOT EXISTS listings_status_idx ON public.listings (status);
CREATE INDEX IF NOT EXISTS listings_location_idx ON public.listings (location);
CREATE INDEX IF NOT EXISTS listings_property_type_idx ON public.listings (property_type);
CREATE INDEX IF NOT EXISTS listing_images_listing_id_idx ON public.listing_images (listing_id);
CREATE UNIQUE INDEX IF NOT EXISTS listing_images_listing_id_display_order_uniq ON public.listing_images (listing_id, display_order);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_public_read ON public.profiles;
DROP POLICY IF EXISTS profiles_authenticated_all ON public.profiles;
CREATE POLICY profiles_public_read ON public.profiles
  FOR SELECT TO public
  USING (true);
CREATE POLICY profiles_authenticated_all ON public.profiles
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS listings_public_read ON public.listings;
DROP POLICY IF EXISTS listings_authenticated_all ON public.listings;
CREATE POLICY listings_public_read ON public.listings
  FOR SELECT TO public
  USING (true);
CREATE POLICY listings_authenticated_all ON public.listings
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS listing_images_public_read ON public.listing_images;
DROP POLICY IF EXISTS listing_images_authenticated_all ON public.listing_images;
CREATE POLICY listing_images_public_read ON public.listing_images
  FOR SELECT TO public
  USING (true);
CREATE POLICY listing_images_authenticated_all ON public.listing_images
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

GRANT SELECT ON public.profiles TO anonymous;
GRANT SELECT ON public.listings TO anonymous;
GRANT SELECT ON public.listing_images TO anonymous;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listing_images TO authenticated;

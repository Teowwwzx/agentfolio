
CREATE TABLE IF NOT EXISTS public.property_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.property_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.property_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  color text DEFAULT '#0E1F3D',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.listing_tags (
  listing_id uuid REFERENCES public.listings(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES public.property_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (listing_id, tag_id)
);

ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.property_categories(id),
ADD COLUMN IF NOT EXISTS type_id uuid REFERENCES public.property_types(id);

-- Seed initial data
INSERT INTO public.property_categories (name, slug) VALUES
('New Project', 'new-project'),
('Subsale', 'subsale'),
('Auction', 'auction'),
('Rent', 'rent')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.property_types (name, slug) VALUES
('Condo', 'condo'),
('Apartment', 'apartment'),
('Terrace', 'terrace'),
('Bungalow', 'bungalow'),
('Semi-D', 'semi-d'),
('Commercial', 'commercial')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.property_tags (name, color) VALUES
('Hot', '#DC2626'),
('Exclusive', '#0E1F3D'),
('New', '#16A34A')
ON CONFLICT (name) DO NOTHING;

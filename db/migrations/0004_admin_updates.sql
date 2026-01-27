
-- Update profiles for auth
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email text UNIQUE,
ADD COLUMN IF NOT EXISTS password_hash text,
ADD COLUMN IF NOT EXISTS role text DEFAULT 'agent' CHECK (role IN ('super_admin', 'agent'));

-- Create Page Sections table
CREATE TABLE IF NOT EXISTS public.page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  section_type text NOT NULL CHECK (section_type IN ('featured', 'latest', 'category', 'tag')),
  layout_type text NOT NULL DEFAULT 'grid_3' CHECK (layout_type IN ('grid_3', 'list_1', 'carousel')),
  filter_config jsonb, -- e.g. { "tag_id": "...", "category_id": "..." }
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS for Page Sections
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS page_sections_public_read ON public.page_sections;
CREATE POLICY page_sections_public_read ON public.page_sections
  FOR SELECT TO public
  USING (is_active = true);

DROP POLICY IF EXISTS page_sections_admin_all ON public.page_sections;
CREATE POLICY page_sections_admin_all ON public.page_sections
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

GRANT SELECT ON public.page_sections TO anonymous;
GRANT ALL ON public.page_sections TO authenticated;

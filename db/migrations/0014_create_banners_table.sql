-- Create banners table for ads management
CREATE TABLE IF NOT EXISTS public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  image_url text NOT NULL,
  link_url text,
  position text DEFAULT 'hero' CHECK (position IN ('hero', 'sidebar', 'footer')),
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS banners_user_id_idx ON public.banners(user_id);
CREATE INDEX IF NOT EXISTS banners_position_active_idx ON public.banners(position, is_active);
CREATE INDEX IF NOT EXISTS banners_display_order_idx ON public.banners(display_order);

-- Enable RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Public can read active banners
DROP POLICY IF EXISTS banners_public_read ON public.banners;
CREATE POLICY banners_public_read ON public.banners
  FOR SELECT TO public
  USING (is_active = true);

-- Agents can manage their own banners
DROP POLICY IF EXISTS banners_agent_own ON public.banners;
CREATE POLICY banners_agent_own ON public.banners
  FOR ALL TO authenticated
  USING (user_id::text = current_setting('app.user_id', true))
  WITH CHECK (user_id::text = current_setting('app.user_id', true));

-- Trigger for updated_at
DROP TRIGGER IF EXISTS banners_set_updated_at ON public.banners;
CREATE TRIGGER banners_set_updated_at
BEFORE UPDATE ON public.banners
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Grant permissions
GRANT SELECT ON public.banners TO anonymous;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.banners TO authenticated;

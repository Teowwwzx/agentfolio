
-- Create Saved Properties Table
CREATE TABLE IF NOT EXISTS public.saved_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Create Search History Table
CREATE TABLE IF NOT EXISTS public.search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  query_text text,
  filters jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS for Saved Properties
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS saved_properties_all ON public.saved_properties;
CREATE POLICY saved_properties_all ON public.saved_properties
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS for Search History
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS search_history_all ON public.search_history;
CREATE POLICY search_history_all ON public.search_history
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS saved_properties_user_idx ON public.saved_properties(user_id);
CREATE INDEX IF NOT EXISTS search_history_user_idx ON public.search_history(user_id);

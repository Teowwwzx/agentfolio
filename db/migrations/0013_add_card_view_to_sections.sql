-- Only run if sections table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sections') THEN
    -- Add card_view column to sections
    ALTER TABLE public.sections
      ADD COLUMN IF NOT EXISTS card_view integer DEFAULT 3 CHECK (card_view IN (1, 3));

    -- Add user_id to sections for agent ownership
    ALTER TABLE public.sections
      ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE;

    -- Create index
    CREATE INDEX IF NOT EXISTS sections_user_id_idx ON public.sections(user_id);

    -- Update RLS policies for sections
    DROP POLICY IF EXISTS sections_public_read ON public.sections;
    DROP POLICY IF EXISTS sections_authenticated_all ON public.sections;

    -- Public can read active sections
    CREATE POLICY sections_public_read ON public.sections
      FOR SELECT TO public
      USING (is_active = true);

    -- Agents can manage their own sections
    CREATE POLICY sections_agent_own ON public.sections
      FOR ALL TO authenticated
      USING (user_id::text = current_setting('app.user_id', true))
      WITH CHECK (user_id::text = current_setting('app.user_id', true));
  END IF;
END $$;

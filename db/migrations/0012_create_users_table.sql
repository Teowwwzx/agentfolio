CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  hashed_password text NOT NULL,
  role text NOT NULL DEFAULT 'agent' CHECK (role IN ('agent', 'admin')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Update profiles to reference users and add email
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS users_role_idx ON public.users(role);
CREATE INDEX IF NOT EXISTS users_status_idx ON public.users(status);

-- RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Only admins can see all users
DROP POLICY IF EXISTS users_admin_all ON public.users;
CREATE POLICY users_admin_all ON public.users
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u2
      WHERE u2.id::text = current_setting('app.user_id', true)
      AND u2.role = 'admin'
    )
  );

-- Users can see their own record
DROP POLICY IF EXISTS users_own_read ON public.users;
CREATE POLICY users_own_read ON public.users
  FOR SELECT TO authenticated
  USING (id::text = current_setting('app.user_id', true));

-- Updated at trigger
DROP TRIGGER IF EXISTS users_set_updated_at ON public.users;
CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Grant permissions
GRANT SELECT ON public.users TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.users TO authenticated;

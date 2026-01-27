ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'agent';

-- Create an index on role for faster lookups
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

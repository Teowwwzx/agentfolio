INSERT INTO public.profiles (id, full_name, email, role)
VALUES 
  ('9a3b1d8c-1a6f-4d8f-bc7e-2b1a4c77e9f2', 'Agent User', 'admin@example.com', 'agent'),
  ('00000000-0000-0000-0000-000000000000', 'Super Admin', 'super@example.com', 'super_admin')
ON CONFLICT (id) DO UPDATE 
SET 
  email = EXCLUDED.email,
  role = EXCLUDED.role;

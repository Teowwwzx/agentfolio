INSERT INTO public.property_tags (name, color) VALUES
('Near LRT', '#3B82F6'),
('Renovated', '#10B981'),
('Corner Lot', '#F59E0B'),
('Freehold', '#6366F1')
ON CONFLICT (name) DO NOTHING;

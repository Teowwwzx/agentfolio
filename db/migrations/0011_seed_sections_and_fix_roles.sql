-- Upgrade the default agent to super_admin so they can manage sections
UPDATE public.profiles 
SET role = 'super_admin' 
WHERE email = 'admin@example.com';

-- Insert "Latest Properties" section (always shows something)
INSERT INTO public.page_sections (title, section_type, layout_type, filter_config, display_order, is_active)
VALUES 
(
  'Latest Properties', 
  'latest', 
  'grid_3', 
  json_build_object('limit', 6), 
  0, -- Put at top
  true
);

-- Insert "Featured Properties" section
INSERT INTO public.page_sections (title, section_type, layout_type, filter_config, display_order, is_active)
VALUES 
(
  'Featured Properties', 
  'featured', 
  'carousel', 
  json_build_object('limit', 5), 
  2, 
  true
);

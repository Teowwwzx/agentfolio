ALTER TABLE public.page_sections DROP CONSTRAINT IF EXISTS page_sections_layout_type_check;

ALTER TABLE public.page_sections 
ADD CONSTRAINT page_sections_layout_type_check 
CHECK (layout_type IN ('grid_3', 'list_1', 'carousel', 'hero_grid'));

DO $$
DECLARE
    corner_lot_id uuid;
BEGIN
    SELECT id INTO corner_lot_id FROM property_tags WHERE name = 'Corner Lot';
    
    -- Insert Corner Lot section if it doesn't exist
    IF corner_lot_id IS NOT NULL THEN
        INSERT INTO page_sections (title, section_type, layout_type, filter_config, display_order, is_active)
        VALUES (
            'Corner Lot Units', 
            'tag', 
            'hero_grid', 
            json_build_object('tag_id', corner_lot_id, 'limit', 7), 
            (SELECT COALESCE(MAX(display_order), 0) + 1 FROM page_sections),
            true
        );
    END IF;
END $$;

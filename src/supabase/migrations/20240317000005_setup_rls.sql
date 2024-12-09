-- Drop existing policies
DROP POLICY IF EXISTS "Public Read Access" ON public.location_photos;
DROP POLICY IF EXISTS "Authenticated Users Can Insert" ON public.location_photos;
DROP POLICY IF EXISTS "Authenticated Users Can Delete" ON public.location_photos;

-- Enable RLS on tables
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for location_photos
CREATE POLICY "Public Read Access"
    ON public.location_photos FOR SELECT
    USING (true);

CREATE POLICY "Authenticated Users Can Insert"
    ON public.location_photos FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated Users Can Delete"
    ON public.location_photos FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create RLS policies for locations and pending_locations
CREATE POLICY "Public Read Access"
    ON public.locations FOR SELECT
    USING (status = 'approved');

CREATE POLICY "Public Read Access"
    ON public.pending_locations FOR SELECT
    USING (true);

CREATE POLICY "Authenticated Users Can Insert"
    ON public.pending_locations FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
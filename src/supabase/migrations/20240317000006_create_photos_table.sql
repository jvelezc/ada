-- Create location_photos table
CREATE TABLE IF NOT EXISTS public.location_photos (
    id BIGSERIAL PRIMARY KEY,
    location_id BIGINT NOT NULL,
    url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_location
        FOREIGN KEY (location_id)
        REFERENCES public.locations(id)
        ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.location_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public Read Access"
    ON public.location_photos FOR SELECT
    USING (true);

CREATE POLICY "Authenticated Users Can Insert"
    ON public.location_photos FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated Users Can Delete"
    ON public.location_photos FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE TRIGGER update_location_photos_updated_at
    BEFORE UPDATE ON public.location_photos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
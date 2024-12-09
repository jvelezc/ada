-- This script ensures that all objects are dropped before being recreated, making it replayable.

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_location_photos_updated_at ON public.location_photos;
DROP TRIGGER IF EXISTS cleanup_location_photos ON public.locations;

-- Drop existing functions with CASCADE to remove dependent triggers
DROP FUNCTION IF EXISTS cleanup_orphaned_photos() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop existing policies
DROP POLICY IF EXISTS "Public Access to Location Photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users Can Upload Location Photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users Can Delete Their Photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access" ON public.location_photos;
DROP POLICY IF EXISTS "Authenticated Users Can Insert" ON public.location_photos;
DROP POLICY IF EXISTS "Authenticated Users Can Delete" ON public.location_photos;

-- Drop existing tables
DROP TABLE IF EXISTS public.location_photos CASCADE;
DROP TABLE IF EXISTS public.pending_locations CASCADE;
DROP TABLE IF EXISTS public.locations CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS public.accessibility_level CASCADE;
DROP TYPE IF EXISTS public.moderation_status CASCADE;
DROP TYPE IF EXISTS public.door_width CASCADE;
DROP TYPE IF EXISTS public.door_type CASCADE;
DROP TYPE IF EXISTS public.floor_type CASCADE;
DROP TYPE IF EXISTS public.parking_type CASCADE;

-- Create enum types
CREATE TYPE public.accessibility_level AS ENUM ('high', 'medium', 'low');
CREATE TYPE public.moderation_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.door_width AS ENUM ('wide', 'standard', 'narrow');
CREATE TYPE public.door_type AS ENUM ('automatic', 'manual_easy', 'manual_heavy');
CREATE TYPE public.floor_type AS ENUM ('smooth', 'carpet', 'uneven');
CREATE TYPE public.parking_type AS ENUM ('dedicated', 'street', 'none');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create cleanup trigger function for orphaned photos
CREATE OR REPLACE FUNCTION cleanup_orphaned_photos()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete photos from storage
    DELETE FROM storage.objects
    WHERE bucket_id = 'locations'
    AND path = ANY(
        SELECT storage_path 
        FROM public.location_photos 
        WHERE location_id = OLD.id
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create locations table first
CREATE TABLE public.locations (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    unit TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accessibility_level accessibility_level,
    accessibility_status_unknown BOOLEAN DEFAULT false,
    description TEXT,
    has_steps BOOLEAN DEFAULT false,
    step_status_unknown BOOLEAN DEFAULT false,
    step_description TEXT,
    door_width door_width,
    door_width_inches INTEGER,
    door_type door_type,
    doorway_notes TEXT,
    has_elevator BOOLEAN DEFAULT false,
    has_wide_pathways BOOLEAN DEFAULT true,
    floor_type floor_type,
    interior_notes TEXT,
    has_accessible_parking BOOLEAN DEFAULT false,
    parking_type parking_type,
    parking_status_unknown BOOLEAN DEFAULT false,
    has_loading_zone BOOLEAN DEFAULT false,
    parking_notes TEXT,
    has_restroom BOOLEAN DEFAULT false,
    restroom_unknown BOOLEAN DEFAULT false,
    is_restroom_accessible BOOLEAN DEFAULT false,
    restroom_status_unknown BOOLEAN DEFAULT false,
    restroom_notes TEXT,
    is_dog_friendly BOOLEAN DEFAULT false,
    dog_friendly_unknown BOOLEAN DEFAULT false,
    dog_friendly_status_unknown BOOLEAN DEFAULT false,
    dog_features TEXT,
    status moderation_status DEFAULT 'approved',
    submitted_by TEXT,
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    moderated_at TIMESTAMPTZ,
    moderated_by TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_latitude CHECK (latitude BETWEEN -90 AND 90),
    CONSTRAINT valid_longitude CHECK (longitude BETWEEN -180 AND 180)
);

-- Create pending_locations table using the same function
CREATE TABLE public.pending_locations (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    unit TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accessibility_level accessibility_level,
    accessibility_status_unknown BOOLEAN DEFAULT false,
    description TEXT,
    has_steps BOOLEAN DEFAULT false,
    step_status_unknown BOOLEAN DEFAULT false,
    step_description TEXT,
    door_width door_width,
    door_width_inches INTEGER,
    door_type door_type,
    doorway_notes TEXT,
    has_elevator BOOLEAN DEFAULT false,
    has_wide_pathways BOOLEAN DEFAULT true,
    floor_type floor_type,
    interior_notes TEXT,
    has_accessible_parking BOOLEAN DEFAULT false,
    parking_type parking_type,
    parking_status_unknown BOOLEAN DEFAULT false,
    has_loading_zone BOOLEAN DEFAULT false,
    parking_notes TEXT,
    has_restroom BOOLEAN DEFAULT false,
    restroom_unknown BOOLEAN DEFAULT false,
    is_restroom_accessible BOOLEAN DEFAULT false,
    restroom_status_unknown BOOLEAN DEFAULT false,
    restroom_notes TEXT,
    is_dog_friendly BOOLEAN DEFAULT false,
    dog_friendly_unknown BOOLEAN DEFAULT false,
    dog_friendly_status_unknown BOOLEAN DEFAULT false,
    dog_features TEXT,
    status moderation_status DEFAULT 'pending',
    submitted_by TEXT,
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    moderated_at TIMESTAMPTZ,
    moderated_by TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_latitude CHECK (latitude BETWEEN -90 AND 90),
    CONSTRAINT valid_longitude CHECK (longitude BETWEEN -180 AND 180)
);

-- Create location_photos table after locations
CREATE TABLE public.location_photos (
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

-- Create triggers for updating timestamps
CREATE TRIGGER update_location_photos_updated_at
    BEFORE UPDATE ON public.location_photos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON public.locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pending_locations_updated_at
    BEFORE UPDATE ON public.pending_locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create cleanup trigger for orphaned photos
CREATE TRIGGER cleanup_location_photos
    AFTER DELETE ON public.locations
    FOR EACH ROW
    EXECUTE FUNCTION cleanup_orphaned_photos();

-- Create storage bucket for location photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('locations', 'Locations', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies
CREATE POLICY "Public Access to Location Photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'locations');

CREATE POLICY "Authenticated Users Can Upload Location Photos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'locations' AND
    auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated Users Can Delete Their Photos"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'locations' AND
    auth.role() = 'authenticated'
);

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

-- Grant execute permission to public for the init function
GRANT EXECUTE ON FUNCTION init_database_schema() TO PUBLIC;

-- Call the initialization function to set up the database
SELECT init_database_schema();
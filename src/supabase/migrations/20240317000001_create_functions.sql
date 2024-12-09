-- Drop existing functions with CASCADE to remove dependent triggers
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS cleanup_orphaned_photos() CASCADE;

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
    -- Delete photos from storage using storage_path
    DELETE FROM storage.objects
    WHERE bucket_id = 'locations'
    AND name = ANY(
        SELECT storage_path 
        FROM public.location_photos 
        WHERE location_id = OLD.id
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;
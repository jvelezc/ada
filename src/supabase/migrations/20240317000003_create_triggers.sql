-- Drop existing triggers
DROP TRIGGER IF EXISTS update_location_photos_updated_at ON public.location_photos;
DROP TRIGGER IF EXISTS update_locations_updated_at ON public.locations;
DROP TRIGGER IF EXISTS update_pending_locations_updated_at ON public.pending_locations;
DROP TRIGGER IF EXISTS cleanup_location_photos ON public.locations;

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
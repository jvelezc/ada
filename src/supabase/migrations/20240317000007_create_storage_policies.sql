-- Create storage bucket for location photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('locations', 'Locations', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
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
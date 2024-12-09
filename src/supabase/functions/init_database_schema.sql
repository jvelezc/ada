CREATE OR REPLACE FUNCTION init_database_schema()
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create pending_locations table if it doesn't exist
  CREATE TABLE IF NOT EXISTS pending_locations (
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
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );

  -- Enable RLS on pending_locations
  ALTER TABLE pending_locations ENABLE ROW LEVEL SECURITY;

  -- Create RLS policies for pending_locations
  DO $$ 
  BEGIN
    IF NOT EXISTS (
      SELECT FROM pg_policies WHERE tablename = 'pending_locations' AND policyname = 'Public Read Access'
    ) THEN
      CREATE POLICY "Public Read Access"
        ON pending_locations FOR SELECT
        USING (true);
    END IF;
  END $$;

  RETURN true;
END;
$$;